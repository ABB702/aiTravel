import { BUDGET_RANGE } from './budget.js'
import { TRAVELER_RANGE } from './traveler.js'

/** 表单校验与界面提示文案 */
export const MESSAGES = {
  /** 目的地为空或仅含空白字符 */
  DESTINATION_REQUIRED: '请填写旅程目的地',
  /** 预算未填写 */
  BUDGET_REQUIRED: '请填写预算',
  /** 预算超出范围 */
  BUDGET_OUT_OF_RANGE: `预算需在 ${BUDGET_RANGE.min} 至 ${BUDGET_RANGE.max} 元之间`,
  /** 人数未填写 */
  TRAVELER_REQUIRED: '请填写出行人数',
  /** 人数超出范围或不是整数 */
  TRAVELER_OUT_OF_RANGE: `出行人数需为 ${TRAVELER_RANGE.min} 至 ${TRAVELER_RANGE.max} 之间的整数`,
  /** 尚未填写任何旅程信息时的占位文案 */
  NO_TRIP_INFO: '暂无旅程信息',
  /** 字段为空时的占位文案 */
  NOT_FILLED: '未填写',
}
