# 主题与样式

## 样式文件

| 文件 | 说明 |
| --- | --- |
| `src/styles/theme.css` | 全部自定义 CSS 变量 |
| `src/styles/element-overrides.css` | 令 Element Plus 主色与自定义主色一致 |
| `src/styles/base.scss` | 字体、聚焦轮廓、可点击元素反馈、`.page-container` |
| `src/styles/responsive.scss` | 响应式规则与触控目标最小尺寸 |

加载顺序固定(见 `src/main.js`):Element Plus CSS → `theme.css` → `element-overrides.css` → `base.scss` → `responsive.scss`。

## CSS 变量

### 颜色

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--color-primary` | `#1d6fdc` | 主色:按钮、链接、高亮、聚焦轮廓 |
| `--color-primary-light` | `#e8f1fd` | 主色浅底:选中态、悬停底色 |
| `--color-accent` | `#f59e0b` | 强调色 |
| `--color-text` | `#1f2937` | 正文 |
| `--color-text-secondary` | `#5b6472` | 次要文字 |
| `--color-bg` | `#f5f7fa` | 页面背景 |
| `--color-surface` | `#ffffff` | 卡片、导航栏等表面 |
| `--color-border` | `#e5e7eb` | 边框与分隔 |
| `--color-danger` | `#d93025` | 错误、失败状态 |
| `--bubble-user-bg` | `#cfe3fb` | 用户消息气泡 |
| `--bubble-assistant-bg` | `#ffffff` | 助手消息气泡 |

正文文字与背景、卡片表面的对比度不低于 4.5:1。

### 形状与间距

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--radius-sm` / `--radius-md` / `--radius-lg` | 4px / 8px / 16px | 圆角 |
| `--space-1` / `--space-2` / `--space-3` / `--space-4` / `--space-6` | 4 / 8 / 12 / 16 / 24px | 间距 |

### 尺寸

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--sidebar-width` | 200px | 展开的导航栏宽度 |
| `--sidebar-collapsed-width` | 64px | 折叠的导航栏宽度 |
| `--aside-width` | 280px | 桌面端旅程摘要栏宽度 |
| `--tab-bar-height` | 56px | 底部标签栏高度 |
| `--touch-target-min` | 44px | 触控目标最小边长 |
| `--touch-gap-min` | 8px | 相邻触控目标最小间距 |

### 字体

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--font-family` | 系统字体栈(含苹方、微软雅黑) | 全局字体 |
| `--font-size-base` | 14px | 正文 |
| `--font-size-small` | 12px | 辅助文字 |
| `--font-size-subtitle` | 16px | 小节标题 |
| `--font-size-title` | 20px | 页面标题 |

### 运行时变量

| 变量 | 写入方 | 用途 |
| --- | --- | --- |
| `--app-height` | `useViewportHeight` | 应用外壳高度,默认回退 `100dvh` |
| `--app-offset-top` | `useViewportHeight` | 应用外壳顶部偏移,默认 `0` |

## Element Plus 主色覆盖

Element Plus 的派生色不会随主色自动重算,所以 `element-overrides.css` 在 `:root` 中重新声明:

- `--el-color-primary` 引用 `--color-primary`;
- `-light-3`、`-light-5`、`-light-7`、`-light-8`、`-light-9` 通过 `color-mix` 与白色混合得到;
- `-dark-2` 与黑色混合得到。

只需要改 `--color-primary`,两套组件会同步变色。此外还映射了字体、圆角、文字色和边框色。

## 断点

| 名称 | 取值 |
| --- | --- |
| Tablet | `768px` |
| Desktop | `1200px` |

断点在 `src/constants/breakpoints.js` 定义一次。`vite.config.js` 导入 `MEDIA_QUERIES`,通过 `css.preprocessorOptions.scss.additionalData` 向每个 SCSS 块注入变量(只含变量,不含实际样式,避免重复打包):

```scss
$mq-tablet-up: '(min-width: 768px)';
$mq-desktop-up: '(min-width: 1200px)';
```

SCSS 中使用 `@media #{$mq-tablet-up} { ... }`。`useLayoutMode` 用同一组查询字符串调用 `matchMedia`,所以 JS 与 CSS 使用同一来源。

## 三种布局模式

样式采用移动端优先,默认规则即手机端,平板和桌面通过 `min-width` 查询放宽。

| 项目 | Desktop(>= 1200px) | Tablet(768px 至 1199px) | Mobile(< 768px) |
| --- | --- | --- | --- |
| 导航 | 展开侧栏(图标 + 文字) | 折叠侧栏(仅图标,悬停或聚焦显示文字) | 底部标签栏 |
| 旅程摘要 | 右侧固定栏 | 顶部摘要条 → 抽屉(宽 360px) | 顶部摘要条 → 抽屉(宽 85%) |
| 推荐目的地网格 | 3 列 | 2 列 | 1 列 |
| 预算与人数 | 同一行并排 | 同一行并排 | 纵向单列,"开始规划"按钮占满宽度 |
| 消息气泡最大宽度 | 70% | 70% | 80% |
| 空状态常见问题 | 2 列 | 2 列 | 1 列,背景图不超过内容区 60% |
| 个人资料信息卡 | 2 列 | 2 列 | 单列 |
| 输入区 | 底部 | 底部 | 底部标签栏上方,文本框与发送按钮同一行 |

主内容区在自身范围内滚动,并设置 `min-width: 0` 与 `overflow-x: hidden`,宽度不小于 320px 时不产生横向滚动条。

## 触控目标规则

手机端的触控目标(按钮、菜单项、卡片、常见问题、摘要条)满足:

- 可点击区域宽高均不小于 `--touch-target-min`(44px);
- 相邻触控目标间距不小于 `--touch-gap-min`(8px)。

实现方式:`responsive.scss` 在默认(手机)规则中把 `--el-component-size` 设为 44px,并为 `.el-button`、`.summary-bar`、`.destination-card` 等设置 `min-width` 与 `min-height`;平板及以上恢复 Element Plus 默认尺寸。

## 编写样式的约定

- 组件样式只引用 CSS 变量,不写十六进制色值(SVG 插图除外)。
- 不直接写断点数值,使用 `$mq-tablet-up`、`$mq-desktop-up`。
- 新增变量请写入 `theme.css`,并同步更新本文档。
