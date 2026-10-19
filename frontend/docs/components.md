# 组件文档

所有组件使用 `<script setup>`。路径以 `src` 为根。表中"必填"指没有默认值。

## 布局与通用组件

### MainLayout

`layouts/MainLayout.vue` 应用主布局,作为所有路由的父组件。

- 用途:调用 `provideLayoutMode()` 与 `useViewportHeight()`,按布局标志渲染导航、旅程摘要栏、底部标签栏、摘要抽屉和 `<RouterView>`;监听布局模式,进入桌面时关闭抽屉。
- Props / 事件:无。

```vue
<!-- 在路由中作为父路由使用 -->
{ path: '/', component: MainLayout, children: [...] }
```

### AppSidebar

`components/layout/AppSidebar.vue` 左侧导航栏。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `items` | `Array`(必填) | 菜单项,见 `MENU_ITEMS` |
| `collapsed` | `Boolean`,默认 `false` | 折叠时只显示图标,文字通过 `ElTooltip`(悬停或聚焦)显示 |

事件:无。每项带 `aria-label`,当前路由项高亮(`aria-current="page"`)。

```vue
<AppSidebar :items="MENU_ITEMS" :collapsed="true" />
```

### BottomTabBar

`components/layout/BottomTabBar.vue` 手机端底部导航栏。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `items` | `Array`(必填) | 菜单项,见 `MENU_ITEMS` |

事件:无。每项含图标与文字,当前路由高亮。

### AsidePanel

`components/layout/AsidePanel.vue` 桌面端右侧旅程摘要栏。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `trip` | `Object`(必填) | `{ destination, budget, travelerCount }` |

事件:无。

### AsideDrawer

`components/layout/AsideDrawer.vue` 平板与手机端的旅程摘要抽屉,包装 `ElDrawer`。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `modelValue` | `Boolean`,默认 `false` | 是否打开 |
| `trip` | `Object`(必填) | 旅程表单值 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Esc、遮罩、关闭按钮都会触发 |

关闭后(`closed`)用 `useAsideDrawer` 记录的触发元素兜底归还焦点。平板宽 360px,手机宽 85%。

```vue
<AsideDrawer v-model="visible" :trip="planStore.plan" />
```

### SummaryBar

`components/layout/SummaryBar.vue` 平板与手机端顶部的单行旅程摘要,渲染为 `<button>`。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `trip` | `Object`(必填) | 旅程表单值 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `open` | 触发元素 | 点击、Enter 或空格时触发 |

无旅程信息时显示"暂无旅程信息"。

```vue
<SummaryBar :trip="planStore.plan" @open="openDrawer" />
```

### TripSummary

`components/layout/TripSummary.vue` 旅程摘要内容,`AsidePanel` 与 `AsideDrawer` 共用。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `trip` | `Object`(必填) | 旅程表单值 |

事件:无。没有任何旅程信息时显示"暂无旅程信息";部分字段未填时对应字段显示"未填写"。

### PageHeader

`components/common/PageHeader.vue` 页面标题,三个页面共用。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `title` | `String`(必填) | 主标题 |
| `subtitle` | `String`,默认 `''` | 副标题 |

```vue
<PageHeader title="我的" subtitle="查看个人基本信息" />
```

### PageCard

`components/common/PageCard.vue` 共用卡片容器,默认插槽。无 props 和事件。

```vue
<PageCard><PlanForm /></PageCard>
```

## 首页

### HomePage

`views/home/HomePage.vue` 首页。连接 `usePlanStore`、`useChatStore`、`useAsideDrawer` 与 Router。点击推荐目的地会覆盖目的地并清除其错误;校验通过后调用 `chatStore.startPlan(plan)` 并跳转到 `/chat`。无 props 和事件。

### PlanForm

`views/home/components/PlanForm.vue` 旅程规划表单。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `modelValue` | `Object`(必填) | `{ destination, budget, travelerCount }` |
| `submitting` | `Boolean`,默认 `false` | 为真时按钮禁用并显示加载 |
| `errors` | `Object`,默认 `{}` | `{ destination?, budget?, travelerCount? }`,显示在对应输入项下方 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | 新表单值 | 任一字段变化 |
| `submit` | 表单值 | 校验通过,目的地已去除首尾空白 |
| `invalid` | 错误对象 | 校验失败 |
| `clear-error` | 字段名 | 用户修改了字段,父组件应清除该字段错误 |

```vue
<PlanForm v-model="form" :errors="errors" @invalid="errors = $event" @submit="startPlan" />
```

### DestinationCard

`views/home/components/DestinationCard.vue` 推荐目的地卡片(`role="button"`,可聚焦)。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `destination` | `Object`(必填) | `{ id, name, description, icon }` |
| `selected` | `Boolean`,默认 `false` | 选中时 `aria-pressed="true"` 并高亮 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `select` | 目的地名称 | 点击、Enter 或空格 |

## 对话页

### ChatPage

`views/chat/ChatPage.vue` 对话页。无消息时显示 `EmptyState`,有消息时显示 `MessageList`,底部始终显示 `MessageInput`。"新对话"按钮清空当前会话(不弹确认框)。回复期间禁用发送。无 props 和事件。

### EmptyState

`views/chat/components/EmptyState.vue` 空状态:助手名称、介绍、背景插图和常见问题。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `faqItems` | `Array`(必填) | `[{ id, text }]` |
| `disabled` | `Boolean`,默认 `false` | 禁用常见问题按钮 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `select-faq` | 问题文本 | 点击某个常见问题 |

### MessageList

`views/chat/components/MessageList.vue` 渲染时间分隔标签与消息气泡,回复中时末尾显示 `TypingIndicator`。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `items` | `Array`(必填) | `buildChatItems` 的结果 |
| `replying` | `Boolean`,默认 `false` | 是否显示输入中提示 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `retry` | 消息 ID | 点击失败消息的"重试" |

### MessageBubble

`views/chat/components/MessageBubble.vue` 消息气泡。用户消息靠右、助手消息靠左,带头像与气泡尾巴;内容以文本渲染并保留换行;右键菜单"复制"内容;用户消息显示"发送中/已发送/发送失败"。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `message` | `Object`(必填) | `{ id, role, content, timestamp, status }` |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `retry` | 消息 ID | 点击"重试"(仅失败时显示) |

iOS Safari 长按不会触发 `contextmenu`,因此该系统上无法使用"复制"菜单。

### MessageInput

`views/chat/components/MessageInput.vue` 输入区,文本框与"发送"按钮同一行。Enter 发送,Shift+Enter 换行,输入法组合输入期间的 Enter 不发送。内容为空白或 `disabled` 时发送按钮禁用;发送后清空并保持焦点。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `disabled` | `Boolean`,默认 `false` | 为真时不能发送 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `send` | 输入内容 | 发送 |

### TimeDivider

`views/chat/components/TimeDivider.vue` 居中的时间分隔标签。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `label` | `String`(必填) | 时间文案 |

### TypingIndicator

`views/chat/components/TypingIndicator.vue` 助手输入中提示(三点动画)。容器带 `role="status"`,含仅供读屏软件读取的"助手正在输入";`prefers-reduced-motion` 下关闭动画。无 props 和事件。

## 我的页面

### ProfilePage

`views/profile/ProfilePage.vue`:挂载时调用 `getUserProfile`。加载中显示 `ElSkeleton`;失败显示错误与"重新加载"按钮;成功显示头像、昵称和信息卡。头像为空时使用默认头像。无 props 和事件。

### ProfileInfoCard

`views/profile/components/ProfileInfoCard.vue` 单个信息卡。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `label` | `String`(必填) | 字段名称 |
| `value` | `String`(必填) | 字段内容 |
| `wide` | `Boolean`,默认 `false` | 为真时在 2 列网格中跨两列 |

## 404

### NotFoundPage

`views/not-found/NotFoundPage.vue` 显示"页面不存在"与"返回首页"链接。无 props 和事件。
