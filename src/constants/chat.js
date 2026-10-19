/** 相邻消息间隔超过该毫秒数时,插入时间分隔标签(5 分钟) */
export const TIME_DIVIDER_GAP_MS = 5 * 60 * 1000

/** Mock 回复延迟范围(毫秒,闭区间) */
export const MOCK_DELAY_RANGE = { min: 500, max: 1500 }

/** 助手名称 */
export const ASSISTANT_NAME = 'AI 旅游助手'

/** 助手介绍文案,显示在对话页空状态 */
export const ASSISTANT_INTRO =
  '我可以根据你的目的地、预算和出行人数,帮你规划行程、推荐景点与美食,也可以回答出行相关的问题。'

/** 头像的替代文本(无障碍) */
export const ASSISTANT_AVATAR_ALT = 'AI 助手头像'
export const USER_AVATAR_ALT = '我的头像'
