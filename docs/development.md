# 开发规范

## 目录规范

| 目录 | 放什么 |
| --- | --- |
| `src/views/<页面>/` | 页面组件 `XxxPage.vue`;该页面专用的子组件放在 `components/` |
| `src/components/layout/` | 布局相关的共用组件(导航、摘要条、抽屉) |
| `src/components/common/` | 跨页面共用的通用组件 |
| `src/layouts/` | 布局壳组件 |
| `src/composables/` | 组合式函数 |
| `src/stores/` | Pinia store |
| `src/api/` | 接口封装,每个业务域一个文件;Mock 放在 `src/api/mock/` |
| `src/utils/` | 工具函数,按职责拆分为独立文件 |
| `src/constants/` | 常量,按主题拆分为独立文件 |
| `src/styles/` | 全局样式与主题变量 |
| `tests/unit`、`tests/property` | 示例测试、属性测试;共享生成器在 `tests/helpers` |

依赖方向见 [架构设计](architecture.md)。两条硬性规则:

- 视图、组件、布局不得直接导入 `axios`,请求统一经由 `src/api`。
- 路由名称、菜单、预算与人数范围、消息角色与状态、断点等值必须引用 `src/constants`,不在组件或工具函数中硬编码。

## 命名规范

- 组件文件使用 PascalCase,例如 `MessageBubble.vue`。多单词命名以满足 `vue/multi-word-component-names`,例如 `AppSidebar` 而不是 `Sidebar`。
- 页面组件以 `Page` 结尾,例如 `HomePage.vue`。
- 组合式函数以 `use` 开头,例如 `useLayoutMode`,文件名与函数名一致。
- 工具函数和常量文件使用小驼峰或小写单词,例如 `chatStorage.js`、`breakpoints.js`。
- 常量名使用大写下划线,例如 `BUDGET_RANGE`。
- CSS 类名使用 BEM 风格,例如 `message__bubble`、`app-sidebar--collapsed`。

## 组件编写规范

- 使用 `<script setup>` 与组合式 API。
- `props` 用对象形式声明类型与默认值;`emit` 事件用 `defineEmits` 声明,需要时带校验函数。
- 子组件不直接修改 props,通过事件通知父组件。表单值由父组件持有。
- 单个页面文件(`views/**/*Page.vue`)不超过 200 行,超出时拆分子组件。
- 用户内容以文本插值渲染,不使用 `v-html`,避免 XSS。
- 可点击的非原生元素要加 `role`、`tabindex` 并响应 Enter 与空格。
- 图片必须提供 `alt`;装饰性图片使用空 `alt`。
- 每个导出的函数和组合式函数写中文 JSDoc,说明参数、返回值和用途。

## 样式规范

- 组件样式只通过 CSS 变量取色、圆角和间距,不写十六进制色值。颜色变量集中在 `src/styles/theme.css`。
- 移动端优先:默认规则即手机端,只用 `min-width` 媒体查询。SCSS 中使用 `@media #{$mq-tablet-up}`、`@media #{$mq-desktop-up}`,不要直接写 `768px`、`1200px`。
- 触控目标(按钮、菜单项、卡片、摘要条)在手机端不小于 44px,相邻间距不小于 8px,分别使用 `--touch-target-min`、`--touch-gap-min`。
- 需要覆盖 Element Plus 样式时,优先通过 CSS 变量;主色相关的覆盖统一放在 `element-overrides.css`。
- 样式加载顺序固定为:Element Plus → `theme.css` → `element-overrides.css` → `base.scss` → `responsive.scss`。

## 提交规范

建议使用"类型: 简述"的提交信息,正文说明动机,使用简体中文。

| 类型 | 用途 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 修复缺陷 |
| `docs` | 仅文档变更 |
| `style` | 不影响逻辑的格式调整 |
| `refactor` | 重构 |
| `test` | 测试相关 |
| `chore` | 构建、依赖、配置 |

提交前运行 `npm run lint` 和 `npm run test`,确保没有错误。

## 代码检查、格式化与测试

| 命令 | 说明 |
| --- | --- |
| `npm run lint` | 用 ESLint 检查 `src` 下的 `.js` 和 `.vue` 文件 |
| `npm run format` | 用 Prettier 格式化 `src`、`tests` 与根目录配置文件 |
| `npm run test` | 用 Vitest 单次执行测试(不进入监听模式) |

换行统一使用 LF:`.gitattributes` 设置了 `* text=auto eol=lf`,Prettier 配置了 `endOfLine: "lf"`。Windows 下也会以 LF 检出,不会出现"LF will be replaced by CRLF"的警告。如果编辑器默认写入 CRLF,请把它的换行设置改为 LF。

测试约定:

- 纯函数的属性测试使用 fast-check,每个属性 `numRuns: 100`,放在 `tests/property/*.property.test.js`,并在属性上方加注释 `// Feature: ai-travel-planner, Property N: <标题>`。
- 示例测试放在 `tests/unit/*.test.js`。
- Element Plus 的表单项错误提示有约 100ms 的防抖,测试中使用假计时器时需要推进计时器。

## 文档同步约定

项目新增或删除对外导出的组件、接口、常量或工具函数时,必须在同一次变更中同步更新对应文档:

- 组件 → [components.md](components.md)
- 常量、工具函数、组合式函数 → [utils-constants.md](utils-constants.md)
- 接口、Mock → [api.md](api.md)
- 主题变量、断点 → [theme.md](theme.md)
