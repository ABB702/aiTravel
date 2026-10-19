import { isMockEnabled } from '@/utils/env.js'
import { http } from './http.js'
import { getMockProfileDelay, getMockUserProfile } from './mock/userMock.js'

/**
 * 获取当前用户资料。
 * - Mock 模式:延迟 300 至 800ms 后返回固定资料。
 * - 真实模式:`GET /user/profile`。
 *
 * @returns {Promise<{
 *   avatar: string,
 *   nickname: string,
 *   userId: string,
 *   gender: string,
 *   city: string,
 *   bio: string,
 *   registeredAt: string
 * }>} 用户资料
 */
export async function getUserProfile() {
  if (isMockEnabled(import.meta.env.VITE_USE_MOCK)) {
    await new Promise((resolve) => setTimeout(resolve, getMockProfileDelay()))
    return getMockUserProfile()
  }
  return http.get('/user/profile')
}
