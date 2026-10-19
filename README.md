# AI 旅游规划助手

全栈项目:Vue 3 前端 + Java 后端,使用 monorepo 管理。用户填写目的地、预算和出行人数,与 AI 助手对话,获得旅游规划建议。

## 仓库结构

```text
aiTravel/
├─ frontend/    Vue 3 + Vite + Element Plus 单页应用(可独立运行,默认使用本地 Mock)
├─ backend/     Java 后端(开发中)
├─ .gitattributes   统一使用 LF 换行
├─ .gitignore       全局与后端忽略规则(前端规则见 frontend/.gitignore)
└─ LICENSE
```

| 目录 | 说明 | 文档 |
| --- | --- | --- |
| [`frontend/`](frontend/) | 前端应用,包含完整的页面、状态管理、Mock 与文档 | [前端 README](frontend/README.md) |
| [`backend/`](backend/) | Java 后端 | [后端 README](backend/README.md) |

## 快速开始

前端不依赖后端即可运行(默认 Mock 模式):

```bash
cd frontend
npm install
npm run dev
```

前后端之间的接口约定见 [接口文档](frontend/docs/api.md)。后端实现时请遵循该契约;如需调整接口,请在同一次提交中同步修改前端与文档。

## 开发约定

- 前端的命令都在 `frontend/` 目录下执行。
- 换行统一为 LF(见 `.gitattributes`),编辑器请不要默认写入 CRLF。
- 提交信息建议使用"类型: 简述"的格式,详见 [开发规范](frontend/docs/development.md)。

## 许可证

见 [LICENSE](LICENSE)。
