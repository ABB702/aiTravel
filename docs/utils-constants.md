# 常量与工具函数

## 常量(`src/constants`)

### routes.js

| 导出 | 说明 |
| --- | --- |
| `ROUTE_NAMES` | 路由名称:`HOME`、`CHAT`、`PROFILE`、`NOT_FOUND` |
| `ROUTE_PATHS` | 路由路径:`ROOT`、`HOME`(`/home`)、`CHAT`(`/chat`)、`PROFILE`(`/profile`) |

### menu.js

| 导出 | 说明 |
| --- | --- |
| `MENU_ITEMS` | 导航菜单:首页(`House`)、对话(`ChatDotRound`)、我的(`User`),每项含 `key`、`label`、`routeName`、`path`、`icon` |

### destinations.js

| 导出 | 说明 |
| --- | --- |
| `RECOMMENDED_DESTINATIONS` | 6 个推荐目的地(杭州、成都、三亚、西安、丽江、厦门),每项含 `id`、`name`、`description`、`icon` |

### faq.js

| 导出 | 说明 |
| --- | --- |
| `FAQ_ITEMS` | 6 条常见问题,每项含 `id`、`text`。预设回答在 `api/mock/chatMock.js` 按 `id` 映射 |

### budget.js、traveler.js

| 导出 | 说明 |
| --- | --- |
| `BUDGET_RANGE` | `{ min: 500, max: 100000 }`,单位元 |
| `TRAVELER_RANGE` | `{ min: 1, max: 20 }`,单位人,仅限整数 |

### message.js

| 导出 | 说明 |
| --- | --- |
| `MESSAGE_ROLE` | `{ USER: 'user', ASSISTANT: 'assistant' }` |
| `MESSAGE_STATUS` | `{ SENDING, SENT, FAILED }` |
| `MESSAGE_STATUS_LABEL` | 状态展示文案:发送中、已发送、发送失败 |

### breakpoints.js

该文件会被 `vite.config.js` 在 Node 环境中直接导入,必须保持纯 ESM,不依赖 Vue 或浏览器 API。

| 导出 | 说明 |
| --- | --- |
| `BREAKPOINTS` | `{ TABLET: 768, DESKTOP: 1200 }` |
| `LAYOUT_MODE` | `{ MOBILE, TABLET, DESKTOP }` |
| `MEDIA_QUERIES` | `{ TABLET_UP, DESKTOP_UP }`,由 `BREAKPOINTS` 拼接 |

### chat.js

| 导出 | 说明 |
| --- | --- |
| `TIME_DIVIDER_GAP_MS` | 时间分隔阈值,5 分钟(严格大于才插入) |
| `MOCK_DELAY_RANGE` | Mock 回复延迟范围 `{ min: 500, max: 1500 }` |
| `ASSISTANT_NAME`、`ASSISTANT_INTRO` | 助手名称与介绍文案 |
| `ASSISTANT_AVATAR_ALT`、`USER_AVATAR_ALT` | 头像替代文本 |

### api.js

| 导出 | 说明 |
| --- | --- |
| `HTTP_TIMEOUT_MS` | 请求超时,15000 |
| `SUCCESS_CODE` | 业务成功码,0 |
| `MOCK_PROFILE_DELAY_RANGE` | Mock 用户资料延迟范围 `{ min: 300, max: 800 }` |

### storage.js

| 导出 | 说明 |
| --- | --- |
| `STORAGE_KEYS` | `{ CHAT_SESSION: 'ai-travel:chat-session' }` |
| `STORAGE_VERSION` | 存储格式版本,1 |

### messages.js

| 导出 | 说明 |
| --- | --- |
| `MESSAGES` | 校验与提示文案:`DESTINATION_REQUIRED`、`BUDGET_REQUIRED`、`BUDGET_OUT_OF_RANGE`、`TRAVELER_REQUIRED`、`TRAVELER_OUT_OF_RANGE`、`NO_TRIP_INFO`(暂无旅程信息)、`NOT_FILLED`(未填写) |

### app.js

| 导出 | 说明 |
| --- | --- |
| `APP_TITLE` | 应用名称,显示在导航栏品牌位 |

## 工具函数(`src/utils`)

除标注"副作用"的以外,均为无副作用的纯函数。

### datetime.js

输入可为毫秒时间戳、ISO 字符串或 `Date`,均使用本地时区;无效输入返回 `''`。

| 导出 | 说明 | 示例 |
| --- | --- | --- |
| `formatDate(value)` | `YYYY-MM-DD` | `formatDate('2024-03-05T08:00:00')` → `2024-03-05` |
| `formatDateTime(value)` | `YYYY-MM-DD HH:mm:ss` | `2024-03-05 08:09:10` |
| `formatChatTime(value, now?)` | 同一天 `HH:mm`;昨天 `昨天 HH:mm`;同年 `M月D日 HH:mm`;其他 `YYYY年M月D日 HH:mm` | `formatChatTime(new Date(2024, 2, 4, 9, 30), new Date(2024, 2, 5))` → `昨天 09:30` |

### validators.js

| 导出 | 说明 |
| --- | --- |
| `isBlank(value)` | 非字符串或去除空白(含全角空格)后为空,返回 `true` |
| `isValidBudget(value, range?)` | 是有限数字且在预算范围内 |
| `isValidTravelerCount(value, range?)` | 是整数且在人数范围内 |
| `validatePlan(plan)` | 返回 `{ destination?, budget?, travelerCount? }`,键仅在对应字段无效时出现 |

```js
validatePlan({ destination: ' ', budget: null, travelerCount: 5 })
// { destination: '请填写旅程目的地', budget: '请填写预算' }
```

### storage.js(副作用)

| 导出 | 说明 |
| --- | --- |
| `safeGetItem(key)` | 读取 `localStorage`,失败返回 `null` |
| `safeSetItem(key, value)` | 写入,成功返回 `true`,失败告警并返回 `false` |
| `safeRemoveItem(key)` | 删除,返回布尔值 |

### id.js(副作用)

| 导出 | 说明 |
| --- | --- |
| `generateId()` | 优先 `crypto.randomUUID()`,不可用时回退为 `时间戳36进制-随机串` |

### env.js

| 导出 | 说明 |
| --- | --- |
| `isMockEnabled(raw)` | 仅当 `raw === 'false'` 时返回 `false` |

### clipboard.js(副作用)

| 导出 | 说明 |
| --- | --- |
| `copyText(text)` | 优先使用 Clipboard API,回退到 `execCommand('copy')`,返回 `Promise<boolean>` |

### plan.js

| 导出 | 说明 |
| --- | --- |
| `createEmptyPlan()` | `{ destination: '', budget: null, travelerCount: null }` |
| `hasTripInfo(plan)` | 目的地非空白,或预算、人数任一不为 `null` |
| `formatBudget(n)` | `3000` → `3000元`;`null` → `未填写` |
| `formatTripSummary(plan)` | 返回 `{ empty, destination, budget, travelerCount }` |
| `buildPlanRequestText(plan)` | 生成 `我想去{目的地}旅行,预算{预算}元,共{人数}人,请帮我规划行程。` |
| `parsePlanRequest(text)` | 上一项的逆操作,不匹配返回 `null` |

```js
const text = buildPlanRequestText({ destination: '杭州', budget: 3000, travelerCount: 2 })
parsePlanRequest(text) // { destination: '杭州', budget: 3000, travelerCount: 2 }
```

### layout.js

| 导出 | 说明 |
| --- | --- |
| `resolveLayoutMode(width)` | `>= 1200` 为 `desktop`,`>= 768` 为 `tablet`,其余为 `mobile` |
| `getLayoutFlags(mode)` | 返回布局标志,见 [架构设计](architecture.md) |
| `nextDrawerOpen(open, mode)` | 桌面模式返回 `false`,其余保持 `open` |

### chat.js

| 导出 | 说明 |
| --- | --- |
| `createMessage(init?)` | 创建消息,缺省的 `id`、`timestamp`、`status` 会填充默认值 |
| `createEmptySession()` | 创建空会话 `{ id, createdAt, messages: [] }` |
| `buildChatItems(messages, gapMs?)` | 在第一条消息前和间隔严格大于 `gapMs` 的相邻消息之间插入时间分隔项 |

### chatStorage.js

| 导出 | 说明 |
| --- | --- |
| `isValidMessage(m)`、`isValidSession(s)` | 结构校验 |
| `serializeSession(session)` | 序列化为 `{ version, session }` 的 JSON |
| `deserializeSession(raw)` | 无效数据告警并返回空会话;`sending` 的用户消息改为 `failed` |
| `loadSession()`(副作用) | 从本地存储读取并反序列化 |
| `saveSession(session)`(副作用) | 写入本地存储,失败返回 `false` |

### profile.js

| 导出 | 说明 |
| --- | --- |
| `buildProfileFields(profile)` | 返回固定顺序的 7 项 `[{ key, label, value, wide }]`;空字段的 `value` 为"未填写";注册时间格式化为 `YYYY-MM-DD` |

## 组合式函数(`src/composables`)

| 导出 | 说明 |
| --- | --- |
| `provideLayoutMode()` | 由 `MainLayout` 调用,监听 `matchMedia` 并 `provide` 布局模式;`matchMedia` 不可用时按 `innerWidth` 计算 |
| `useLayoutMode()` | 子组件读取 `{ mode, flags }`;未提供时默认桌面 |
| `useViewportHeight()` | 只在 `MainLayout` 调用一次,把 `visualViewport` 的高度与偏移写入 `--app-height`、`--app-offset-top` |
| `useViewportHeightState()` | 只读取当前可视视口高度,不注册监听 |
| `useAsideDrawer()` | 模块级单例:`visible`、`triggerEl`、`open(el)`、`close()`、`restoreFocus()` |
| `useChatScroll(containerRef, deps)` | 依赖变化后滚动容器到底部,返回 `{ scrollToBottom }` |

## API 与状态

接口与错误处理见 [接口文档](api.md),Store 见 [架构设计](architecture.md)。
