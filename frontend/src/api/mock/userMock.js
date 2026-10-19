import { MOCK_PROFILE_DELAY_RANGE } from '@/constants/api.js'

/** Mock 模式下返回的固定用户资料 */
export const MOCK_USER_PROFILE = {
  avatar: '',
  nickname: '旅行者小明',
  userId: 'U20240001',
  gender: '男',
  city: '上海',
  bio: '热爱旅行与摄影,喜欢慢节奏的城市漫步,期待发现更多有趣的目的地。',
  registeredAt: '2024-03-15T08:30:00.000Z',
}

/**
 * 计算 Mock 获取用户资料的延迟(毫秒),范围见 MOCK_PROFILE_DELAY_RANGE。
 *
 * @param {() => number} [random=Math.random] 返回 [0, 1) 内随机数的函数
 * @returns {number} 延迟毫秒数
 */
export function getMockProfileDelay(random = Math.random) {
  const { min, max } = MOCK_PROFILE_DELAY_RANGE
  return min + Math.floor(random() * (max - min + 1))
}

/**
 * 获取 Mock 用户资料的副本,避免调用方修改共享数据。
 *
 * @returns {typeof MOCK_USER_PROFILE} 用户资料
 */
export function getMockUserProfile() {
  return { ...MOCK_USER_PROFILE }
}
