/** 消息角色 */
export const MESSAGE_ROLE = {
  USER: 'user',
  ASSISTANT: 'assistant',
}

/** 消息发送状态(助手消息的状态恒为 SENT) */
export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  FAILED: 'failed',
}

/** 用户消息发送状态的展示文案 */
export const MESSAGE_STATUS_LABEL = {
  [MESSAGE_STATUS.SENDING]: '发送中',
  [MESSAGE_STATUS.SENT]: '已发送',
  [MESSAGE_STATUS.FAILED]: '发送失败',
}
