import { MESSAGES } from '@/constants/messages.js'
import { formatDate } from './datetime.js'
import { isBlank } from './validators.js'

/** 个人资料字段定义:固定顺序与键集合 */
const PROFILE_FIELD_DEFS = [
  { key: 'avatar', label: '头像', wide: false },
  { key: 'nickname', label: '昵称', wide: false },
  { key: 'userId', label: '用户编号', wide: false },
  { key: 'gender', label: '性别', wide: false },
  { key: 'city', label: '所在城市', wide: false },
  { key: 'bio', label: '个人简介', wide: true },
  { key: 'registeredAt', label: '注册时间', wide: false },
]

/**
 * 构造个人资料展示字段。
 * 始终返回固定顺序、固定键集合的 7 项;空白、null、undefined 的字段显示"未填写";
 * 注册时间格式化为 `YYYY-MM-DD`,格式化结果为空(含无效日期)时同样显示"未填写";
 * 个人简介标记为 wide,在网格中跨两列。
 *
 * @param {Record<string, unknown> | null | undefined} profile 用户资料
 * @returns {Array<{ key: string, label: string, value: string, wide: boolean }>} 展示字段列表
 */
export function buildProfileFields(profile) {
  const source = profile ?? {}
  return PROFILE_FIELD_DEFS.map(({ key, label, wide }) => {
    const raw = source[key]
    let value = ''
    if (key === 'registeredAt') {
      // formatDate 对 null、undefined、空白字符串与无效日期均返回空字符串
      value = formatDate(raw)
    } else if (!isBlank(raw)) {
      value = raw
    }
    return { key, label, value: value === '' ? MESSAGES.NOT_FILLED : value, wide }
  })
}
