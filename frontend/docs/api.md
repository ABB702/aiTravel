# 接口文档

## Http_Client

位于 `src/api/http.js`,对 Axios 的统一封装。

- 基础地址取自环境变量 `VITE_API_BASE_URL`(默认 `/api`),超时时间为 `HTTP_TIMEOUT_MS`(15000ms)。
- 业务响应格式为 `{ code: number, data: T, message: string }`,成功码 `SUCCESS_CODE = 0`。
- 所有方法返回响应体中的 `data` 字段,而不是完整的 Axios 响应。
- 业务码非成功码、网络异常、超时、HTTP 错误都会抛出统一的 `ApiError`。
- 默认会用 `ElMessage.error` 弹出错误提示;请求配置传 `silent: true` 可关闭,由调用方自行处理。

### 方法

| 方法 | 说明 |
| --- | --- |
| `http.get(url, params?, config?)` | GET 请求,`params` 作为查询参数 |
| `http.post(url, data?, config?)` | POST 请求 |
| `http.put(url, data?, config?)` | PUT 请求 |
| `http.delete(url, config?)` | DELETE 请求 |

### 示例

```js
import { http } from '@/api/http.js'

// 默认:失败时自动弹出错误提示
const list = await http.get('/trips', { page: 1 })

// 静默:失败时不弹提示,由调用方处理
try {
  await http.post('/chat/messages', payload, { silent: true })
} catch (error) {
  console.error(error.type, error.message)
}
```

新增接口时,在 `src/api` 下按业务域新建文件,只包含该域的接口函数;视图和组件不要直接使用 `http` 或 `axios`。

## 统一错误对象 ApiError

位于 `src/api/errors.js`。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | `number \| string \| undefined` | 业务码、HTTP 状态码或底层错误码 |
| `message` | `string` | 面向用户的错误文案 |
| `type` | `'business' \| 'network' \| 'timeout' \| 'http'` | 错误类型 |
| `status` | `number \| undefined` | HTTP 状态码,仅 `type` 为 `http` 时有值 |

转换规则(`toApiError`):

| 情况 | type | message |
| --- | --- | --- |
| 业务码不等于成功码 | `business` | 响应体 `message`,缺省为"请求失败" |
| 无响应,且错误码为 `ECONNABORTED`/`ETIMEDOUT` 或消息含 `timeout` | `timeout` | 请求超时 |
| 无响应的其他情况 | `network` | 网络异常 |
| 有响应 | `http` | 响应体 `message`,缺省为 `请求失败(状态码)` |

已经是 `ApiError` 的输入会原样返回。

## 业务接口

### `sendChatMessage(messages)`

位于 `src/api/chat.js`。发送对话上下文并获取助手回复。

- 参数:`messages: Array<{ role, content, timestamp }>`,为会话中直到最后一条用户消息的全部消息。
- 返回:`Promise<Message>`,即助手消息 `{ id, role: 'assistant', content, timestamp, status: 'sent' }`。
- 失败时抛出异常,由 `useChatStore` 将用户消息置为 `failed`。

| 模式 | 行为 |
| --- | --- |
| Mock | 本地生成回复,模拟 500 至 1500ms 延迟 |
| 真实后端 | `POST /chat/messages`,带 `silent: true` |

真实后端的请求与响应:

```json
// 请求体
{ "messages": [{ "role": "user", "content": "你好", "timestamp": 1700000000000 }] }

// 响应体
{ "code": 0, "data": { "content": "你好,有什么可以帮你?" }, "message": "ok" }
```

响应 `data.content` 不是字符串时抛出 `type: 'business'` 的 `ApiError`。

### `getUserProfile()`

位于 `src/api/user.js`。获取当前用户资料。

- 返回:`Promise<UserProfile>`。

```js
// UserProfile
{
  avatar: '',          // 头像 URL,可为空
  nickname: '旅行者小明',
  userId: 'U20240001',
  gender: '男',        // 可为空
  city: '上海',
  bio: '热爱旅行与摄影',
  registeredAt: '2024-03-15T08:30:00.000Z' // ISO 8601
}
```

| 模式 | 行为 |
| --- | --- |
| Mock | 延迟 300 至 800ms 后返回固定资料 |
| 真实后端 | `GET /user/profile` |

失败时会弹出默认错误提示,"我的"页面同时显示错误状态与"重新加载"按钮。

## Mock 模块

位于 `src/api/mock`。

| 导出 | 说明 |
| --- | --- |
| `getMockDelay(random?)` | 返回 500 至 1500 的整数毫秒,`random` 可注入以便测试 |
| `generateReply(messages)` | 取最后一条用户消息:规划请求 → 规划建议;与常见问题一致 → 预设回答;否则通用回复 |
| `buildPlanReply(plan)` | 生成规划建议文本,包含目的地、预算与人数 |
| `getMockProfileDelay(random?)` | 返回 300 至 800 的整数毫秒 |
| `getMockUserProfile()` | 返回固定用户资料的副本 |

常见问题的预设回答在 `chatMock.js` 中按 `FAQ_ITEMS` 的 `id` 映射。新增常见问题时,请同步补充对应的预设回答。

## Mock 与真实后端的切换

由环境变量 `VITE_USE_MOCK` 控制:

| 取值 | 行为 |
| --- | --- |
| `false` | 调用真实后端 |
| 其他取值(包括未设置) | 使用 Mock |

- `.env`(开发):`VITE_USE_MOCK=true`
- `.env.production`(生产构建):`VITE_USE_MOCK=false`

切换后重启开发服务器或重新构建。真实后端的地址通过 `VITE_API_BASE_URL` 配置。开发时如果后端与前端不同源,需要在 `vite.config.js` 中增加 `server.proxy`;生产环境的跨域与反向代理见 [部署文档](deployment.md)。
