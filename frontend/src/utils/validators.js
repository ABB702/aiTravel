import { BUDGET_RANGE } from '@/constants/budget.js'
import { TRAVELER_RANGE } from '@/constants/traveler.js'
import { MESSAGES } from '@/constants/messages.js'

/**
 * 判断值是否为空白。
 * 非字符串一律视为空白;字符串去除首尾空白(含全角空格、制表符、换行)后为空也视为空白。
 *
 * @param {unknown} value 待判断的值
 * @returns {boolean} 空白返回 true
 * @example
 * isBlank('  \u3000 ') // true
 */
export function isBlank(value) {
  return typeof value !== 'string' || value.trim().length === 0
}

/**
 * 校验预算是否为范围内的有限数字(闭区间)。
 *
 * @param {unknown} value 待校验的值
 * @param {{ min: number, max: number }} [range=BUDGET_RANGE] 允许范围
 * @returns {boolean} 有效返回 true
 */
export function isValidBudget(value, range = BUDGET_RANGE) {
  return (
    typeof value === 'number' && Number.isFinite(value) && value >= range.min && value <= range.max
  )
}

/**
 * 校验出行人数是否为范围内的整数(闭区间)。
 *
 * @param {unknown} value 待校验的值
 * @param {{ min: number, max: number }} [range=TRAVELER_RANGE] 允许范围
 * @returns {boolean} 有效返回 true
 */
export function isValidTravelerCount(value, range = TRAVELER_RANGE) {
  return Number.isInteger(value) && value >= range.min && value <= range.max
}

/**
 * 校验旅程规划表单,聚合各字段的错误提示。
 * 返回对象中的键仅在对应字段无效时出现;全部有效时返回空对象。
 *
 * @param {{ destination?: unknown, budget?: unknown, travelerCount?: unknown } | null | undefined} plan 表单值
 * @returns {{ destination?: string, budget?: string, travelerCount?: string }} 字段错误提示
 */
export function validatePlan(plan) {
  const { destination, budget, travelerCount } = plan ?? {}
  const errors = {}

  if (isBlank(destination)) {
    errors.destination = MESSAGES.DESTINATION_REQUIRED
  }
  if (!isValidBudget(budget)) {
    errors.budget =
      budget === null || budget === undefined
        ? MESSAGES.BUDGET_REQUIRED
        : MESSAGES.BUDGET_OUT_OF_RANGE
  }
  if (!isValidTravelerCount(travelerCount)) {
    errors.travelerCount =
      travelerCount === null || travelerCount === undefined
        ? MESSAGES.TRAVELER_REQUIRED
        : MESSAGES.TRAVELER_OUT_OF_RANGE
  }
  return errors
}
