import { SUCCESS_CODE } from '@/constants/api.js'

/**
 * 统一的接口错误对象。
 * type 取值:'business'(业务码非成功)、'network'(网络异常)、'timeout'(请求超时)、'http'(HTTP 状态码异常)。
 */
export class ApiError extends Error {
  /**
   * @param {{ code?: number | string, message: string, type: 'business' | 'network' | 'timeout' | 'http', status?: number }} init 错误信息
   */
  constructor({ code, message, type, status }) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.type = type
    this.status = status
  }
}

/**
 * 解包业务响应。
 * 响应格式为 `{ code, data, message }`:code 等于成功码时返回 data,否则抛出业务类型的 ApiError。
 *
 * @param {{ code?: number, data?: unknown, message?: string } | unknown} body 响应体
 * @returns {unknown} 业务数据 data
 * @throws {ApiError} 业务码非成功码时抛出
 */
export function unwrapResponse(body) {
  if (body !== null && typeof body === 'object' && body.code === SUCCESS_CODE) {
    return body.data
  }
  const code = body !== null && typeof body === 'object' ? body.code : undefined
  const message =
    body !== null && typeof body === 'object' && typeof body.message === 'string' && body.message
      ? body.message
      : '请求失败'
  throw new ApiError({ code, message, type: 'business' })
}

/**
 * 判断错误是否由请求超时引起。
 *
 * @param {{ code?: string, message?: string }} error 原始错误
 * @returns {boolean} 超时返回 true
 */
function isTimeoutError(error) {
  return (
    error.code === 'ECONNABORTED' ||
    error.code === 'ETIMEDOUT' ||
    (typeof error.message === 'string' && error.message.toLowerCase().includes('timeout'))
  )
}

/**
 * 将任意错误(通常是 AxiosError)转换为统一的 ApiError。
 * - 已是 ApiError:原样返回。
 * - 无响应且为超时:`请求超时`;无响应的其他情况:`网络异常`。
 * - 有响应:优先使用响应体的 message,没有则为 `请求失败(状态码)`。
 *
 * @param {unknown} error 原始错误
 * @returns {ApiError} 统一错误对象
 */
export function toApiError(error) {
  if (error instanceof ApiError) return error

  const source = error !== null && typeof error === 'object' ? error : {}
  const response = source.response

  if (!response) {
    return isTimeoutError(source)
      ? new ApiError({ code: source.code, message: '请求超时', type: 'timeout' })
      : new ApiError({ code: source.code, message: '网络异常', type: 'network' })
  }

  const bodyMessage = response.data?.message
  const message =
    typeof bodyMessage === 'string' && bodyMessage ? bodyMessage : `请求失败(${response.status})`
  return new ApiError({
    code: response.data?.code ?? response.status,
    message,
    type: 'http',
    status: response.status,
  })
}
