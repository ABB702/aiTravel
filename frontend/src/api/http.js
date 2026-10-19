import axios from 'axios'
import { ElMessage } from 'element-plus'
import { HTTP_TIMEOUT_MS } from '@/constants/api.js'
import { toApiError, unwrapResponse } from './errors.js'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: HTTP_TIMEOUT_MS,
})

/**
 * 默认弹出错误提示;请求配置中 `silent: true` 时不提示,由调用方自行处理。
 *
 * @param {import('./errors.js').ApiError} apiError 统一错误
 * @param {{ silent?: boolean } | undefined} config 请求配置
 */
function notifyError(apiError, config) {
  if (config?.silent !== true) {
    ElMessage.error(apiError.message)
  }
}

instance.interceptors.response.use(
  (response) => {
    try {
      // 成功分支:按业务码解包,业务码非成功码时抛出 ApiError
      return unwrapResponse(response.data)
    } catch (error) {
      notifyError(error, response.config)
      throw error
    }
  },
  (error) => {
    // 失败分支:网络异常、超时与 HTTP 错误统一转换为 ApiError
    const apiError = toApiError(error)
    notifyError(apiError, error?.config)
    throw apiError
  },
)

/**
 * Http_Client:对 Axios 的统一封装,所有方法均返回业务响应中的 data。
 * 请求配置支持自定义字段 `silent: true`,用于关闭自动错误提示。
 */
export const http = {
  /**
   * GET 请求。
   *
   * @param {string} url 请求地址
   * @param {Record<string, unknown>} [params] 查询参数
   * @param {import('axios').AxiosRequestConfig & { silent?: boolean }} [config] 请求配置
   * @returns {Promise<any>} 业务数据 data
   */
  get: (url, params, config) => instance.get(url, { ...config, params }),

  /**
   * POST 请求。
   *
   * @param {string} url 请求地址
   * @param {unknown} [data] 请求体
   * @param {import('axios').AxiosRequestConfig & { silent?: boolean }} [config] 请求配置
   * @returns {Promise<any>} 业务数据 data
   */
  post: (url, data, config) => instance.post(url, data, config),

  /**
   * PUT 请求。
   *
   * @param {string} url 请求地址
   * @param {unknown} [data] 请求体
   * @param {import('axios').AxiosRequestConfig & { silent?: boolean }} [config] 请求配置
   * @returns {Promise<any>} 业务数据 data
   */
  put: (url, data, config) => instance.put(url, data, config),

  /**
   * DELETE 请求。
   *
   * @param {string} url 请求地址
   * @param {import('axios').AxiosRequestConfig & { silent?: boolean }} [config] 请求配置
   * @returns {Promise<any>} 业务数据 data
   */
  delete: (url, config) => instance.delete(url, config),
}
