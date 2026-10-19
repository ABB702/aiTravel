# AI 旅游规划助手

基于 Vue 3、Vite 和 Element Plus 的纯前端单页应用。用户在首页填写目的地、预算和出行人数(也可点击推荐目的地回填),点击"开始规划"后进入对话页,与 AI 助手进行类似 QQ 的聊天,获得旅游规划建议。

应用默认使用本地 Mock 数据,无需后端即可完整演示;通过环境变量即可切换到真实后端。

## 功能列表

- **首页**:旅程规划表单(目的地、预算、人数)、6 个推荐目的地一键回填、表单校验。
- **对话页**:空状态(助手介绍与常见问题)、QQ 风格聊天界面、时间分隔标签、发送状态与失败重试、右键复制消息、"新对话"。
- **我的页面**:个人资料展示、骨架屏加载、失败重新加载。
- **响应式布局**:桌面(三栏)、平板(折叠侧栏 + 旅程摘要抽屉)、手机(底部标签栏 + 旅程摘要抽屉)。
- **会话持久化**:当前会话保存在浏览器本地存储,刷新后恢复。
- **无障碍**:导航、推荐卡片、摘要条均可通过键盘操作,抽屉支持焦点管理。

## 技术栈

以下为 `npm install` 后实际安装的精确版本(`package.json` 中不含 `^`、`~`,`.npmrc` 设置了 `save-exact=true`)。`npm ls` 检查依赖树没有 invalid 或 missing 项,当前版本组合可正常构建,没有回退过版本。

| 类别 | 依赖 | 版本 |
| --- | --- | --- |
| 框架 | `vue` | 3.5.44 |
| 构建 | `vite` / `@vitejs/plugin-vue` | 8.3.4 / 6.0.10 |
| UI | `element-plus` / `@element-plus/icons-vue` | 2.14.7 / 2.3.2 |
| 状态管理 | `pinia` | 4.1.0 |
| 路由 | `vue-router` | 5.4.0 |
| 请求 | `axios` | 1.20.0 |
| 样式 | `sass` | 1.105.2 |
| 测试 | `vitest` / `fast-check` / `@vue/test-utils` / `jsdom` | 5.0.5 / 4.10.2 / 2.5.1 / 30.1.3 |
| 代码质量 | `eslint` / `eslint-plugin-vue` / `@eslint/js` / `globals` / `eslint-config-prettier` / `prettier` | 10.13.0 / 10.11.1 / 10.0.1 / 17.13.0 / 10.1.8 / 3.9.10 |

## 环境要求

- Node.js v24.22.0
- npm(随 Node 安装)

## 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建(产物在 dist 目录)
npm run build

# 本地预览生产构建
npm run preview

# 代码检查与格式化
npm run lint
npm run format

# 运行测试(单次执行,不进入监听模式)
npm run test
```

### npm 镜像源

项目根目录的 `.npmrc` 将 registry 指向 `https://registry.npmmirror.com`,并设置 `save-exact=true`,保证以后新增依赖时也写入精确版本。如需使用官方源,修改或删除 `.npmrc` 中的 `registry` 一行即可。

### 环境变量

| 变量 | 说明 |
| --- | --- |
| `VITE_USE_MOCK` | `false` 时调用真实后端,其余取值(含未设置)使用本地 Mock。开发环境为 `true`,生产环境为 `false` |
| `VITE_API_BASE_URL` | 接口基础地址,默认 `/api` |

详见 [部署文档](docs/deployment.md)。

## 目录结构

```text
aiTravel/
├─ index.html                 入口页面(含 viewport meta)
├─ vite.config.js             Vite、别名 @、SCSS 断点注入、Vitest 配置
├─ eslint.config.js           ESLint(flat config)
├─ .prettierrc.json           Prettier 配置
├─ .env  .env.production  .env.example
├─ docs/                      项目文档
├─ tests/
│  ├─ helpers/                fast-check 共享生成器
│  ├─ unit/                   示例测试
│  └─ property/               属性测试
└─ src/
   ├─ main.js  App.vue
   ├─ api/                    Http_Client、错误处理、业务接口与 Mock
   ├─ assets/                 头像与背景插图
   ├─ components/             布局组件(layout)与通用组件(common)
   ├─ composables/            布局模式、视口高度、抽屉、聊天滚动
   ├─ constants/              路由、菜单、范围、文案等常量
   ├─ layouts/                MainLayout
   ├─ router/                 路由
   ├─ stores/                 Pinia:plan、chat
   ├─ styles/                 主题变量与全局样式
   ├─ utils/                  纯函数与浏览器能力封装
   └─ views/                  首页、对话页、我的页面、404
```

## 文档索引

- [架构设计](docs/architecture.md):分层、布局模式、状态管理、数据流
- [开发规范](docs/development.md):目录、命名、组件、样式、提交规范
- [接口文档](docs/api.md):Http_Client、ApiError、业务接口、Mock 切换
- [组件文档](docs/components.md):全部自定义组件的 props、事件与示例
- [常量与工具函数](docs/utils-constants.md):全部导出项说明
- [主题与样式](docs/theme.md):CSS 变量、断点、三种布局模式、触控规则
- [部署文档](docs/deployment.md):环境变量、构建、服务器配置

## 许可证

见 [LICENSE](LICENSE)。
