import { FAQ_ITEMS } from '@/constants/faq.js'
import { MOCK_DELAY_RANGE } from '@/constants/chat.js'
import { MESSAGE_ROLE } from '@/constants/message.js'
import { parsePlanRequest } from '@/utils/plan.js'

/** 常见问题的预设回答,按 FAQ_ITEMS 的 id 映射 */
const FAQ_ANSWERS = {
  'weekend-trip':
    '周末两天建议选择交通方便的近郊城市。可以按"周五晚出发、周六主要景点、周日轻松收尾"安排,既不赶路也能体验当地特色。告诉我你的出发地和预算,我可以帮你细化。',
  'budget-plan':
    '人均 3000 元通常可以覆盖往返交通、2 至 3 晚住宿和餐饮门票。建议交通占约 30%,住宿占约 35%,餐饮与景点占约 35%,并预留一部分机动费用。需要的话我可以按目的地给出具体方案。',
  'family-trip':
    '带老人和孩子出行建议:行程节奏放慢,每天安排不超过两个主要景点;优先选择交通便利、有电梯或无障碍设施的住宿;随身携带常用药品、保暖衣物和零食;提前确认景点的老人票与儿童票政策。',
  'best-season':
    '海边旅行一般春末至秋初较合适:海水温暖、天气晴朗。夏季是旺季,价格偏高、人多;春季和初秋更舒适、性价比更高。出发前请关注台风和天气预报。',
  'local-food':
    '品尝地方特色美食可以优先选择本地人常去的老字号和小吃街,留意当地的招牌菜和时令食材。告诉我你的目的地,我可以推荐具体的菜品和用餐区域。',
  'packing-list':
    '出发前建议准备:身份证件与订单信息、手机与充电宝、常用药品、换洗衣物和雨具、防晒用品,以及舒适的鞋子。出国或跨省出行时还要确认证件有效期和当地天气。',
}

/** 无法匹配规划请求或常见问题时的通用回复 */
const GENERIC_REPLY =
  '感谢你的提问!我是你的 AI 旅游助手。你可以告诉我目的地、预算和出行人数,我会为你规划行程;也可以问我关于交通、住宿、美食和景点的问题。'

/**
 * 计算 Mock 回复延迟(毫秒)。
 * 在 MOCK_DELAY_RANGE 的闭区间内取整数:`500 + Math.floor(random() * 1001)`。
 *
 * @param {() => number} [random=Math.random] 返回 [0, 1) 内随机数的函数,便于测试注入
 * @returns {number} 延迟毫秒数
 */
export function getMockDelay(random = Math.random) {
  const { min, max } = MOCK_DELAY_RANGE
  return min + Math.floor(random() * (max - min + 1))
}

/**
 * 根据旅程规划信息生成规划建议文本。
 * 文本中包含目的地、预算数值与人数数值。
 *
 * @param {{ destination: string, budget: number, travelerCount: number }} plan 旅程规划信息
 * @returns {string} 规划建议
 */
export function buildPlanReply(plan) {
  const { destination, budget, travelerCount } = plan
  return [
    `好的,已为你整理「${destination}」${travelerCount} 人行程的初步建议(预算 ${budget} 元):`,
    '',
    '第 1 天:抵达并办理入住,先逛当地代表性街区,晚餐品尝特色美食。',
    '第 2 天:游览最具代表性的景点,下午安排轻松的休闲项目,傍晚欣赏夜景。',
    '第 3 天:根据返程时间,安排一个就近的小众景点或购买伴手礼。',
    '',
    `预算参考:${budget} 元由 ${travelerCount} 人分摊,建议交通约占三成、住宿约占三成半、餐饮与景点约占三成半,并预留少量机动费用。`,
    '如果你有偏好的出行时间或兴趣(例如美食、摄影、亲子),告诉我,我会继续细化。',
  ].join('\n')
}

/**
 * 根据对话上下文生成 Mock 回复文本。
 * 取最后一条用户消息:规划请求 -> 规划建议;与常见问题一致 -> 预设回答;其他 -> 通用回复。
 *
 * @param {Array<{ role: string, content: string }>} messages 对话上下文
 * @returns {string} 回复文本(非空)
 */
export function generateReply(messages) {
  const lastUserMessage = [...(messages ?? [])]
    .reverse()
    .find((message) => message.role === MESSAGE_ROLE.USER)
  if (!lastUserMessage) return GENERIC_REPLY

  const plan = parsePlanRequest(lastUserMessage.content)
  if (plan) return buildPlanReply(plan)

  const faq = FAQ_ITEMS.find((item) => item.text === lastUserMessage.content.trim())
  if (faq && FAQ_ANSWERS[faq.id]) return FAQ_ANSWERS[faq.id]

  return GENERIC_REPLY
}
