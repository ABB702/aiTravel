import { MESSAGES } from '@/constants/messages.js'
import { isBlank } from './validators.js'

/**
 * 创建空的旅程规划表单值。
 *
 * @returns {{ destination: string, budget: number | null, travelerCount: number | null }} 空表单
 */
export function createEmptyPlan() {
  return { destination: '', budget: null, travelerCount: null }
}

/**
 * 判断是否已填写任何旅程信息。
 * 目的地非空白,或预算、人数任一不为 null,即视为有旅程信息。
 *
 * @param {{ destination?: unknown, budget?: unknown, travelerCount?: unknown } | null | undefined} plan 表单值
 * @returns {boolean} 有旅程信息返回 true
 */
export function hasTripInfo(plan) {
  if (!plan) return false
  return !isBlank(plan.destination) || plan.budget != null || plan.travelerCount != null
}

/**
 * 格式化预算显示,例如 `3000元`。预算为空时返回"未填写"。
 *
 * @param {number | null | undefined} budget 预算(元)
 * @returns {string} 展示文本
 */
export function formatBudget(budget) {
  return budget == null ? MESSAGES.NOT_FILLED : `${budget}元`
}

/**
 * 生成旅程摘要,供 AsidePanel、SummaryBar、AsideDrawer 共用。
 * `empty` 为 true 时界面应显示"暂无旅程信息"占位文案;
 * 部分字段未填写时,对应字段显示"未填写"。
 *
 * @param {{ destination?: string, budget?: number | null, travelerCount?: number | null } | null | undefined} plan 表单值
 * @returns {{ empty: boolean, destination: string, budget: string, travelerCount: string }} 摘要
 */
export function formatTripSummary(plan) {
  const source = plan ?? createEmptyPlan()
  return {
    empty: !hasTripInfo(source),
    destination: isBlank(source.destination) ? MESSAGES.NOT_FILLED : source.destination.trim(),
    budget: formatBudget(source.budget),
    travelerCount: source.travelerCount == null ? MESSAGES.NOT_FILLED : `${source.travelerCount}人`,
  }
}

/**
 * 根据表单值构造发送给助手的规划请求文本。
 * 模板:`我想去{destination}旅行,预算{budget}元,共{count}人,请帮我规划行程。`
 * 目的地会去除首尾空白。
 *
 * @param {{ destination: string, budget: number, travelerCount: number }} plan 有效的表单值
 * @returns {string} 请求文本
 */
export function buildPlanRequestText(plan) {
  const destination = String(plan.destination).trim()
  return `我想去${destination}旅行,预算${plan.budget}元,共${plan.travelerCount}人,请帮我规划行程。`
}

const PLAN_REQUEST_PATTERN =
  /^我想去([\s\S]+)旅行,预算(\d+(?:\.\d+)?)元,共(\d+)人,请帮我规划行程。$/

/**
 * 解析规划请求文本,是 buildPlanRequestText 的逆操作。
 * 使用锚定正则,文本不符合模板时返回 null。
 *
 * @param {unknown} text 待解析的文本
 * @returns {{ destination: string, budget: number, travelerCount: number } | null} 解析结果;不匹配时为 null
 */
export function parsePlanRequest(text) {
  if (typeof text !== 'string') return null
  const match = PLAN_REQUEST_PATTERN.exec(text)
  if (!match) return null
  return {
    destination: match[1],
    budget: Number(match[2]),
    travelerCount: Number(match[3]),
  }
}
