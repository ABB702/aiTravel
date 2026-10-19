# 后端(Java)

开发中,尚未创建项目。

## 对接前端的接口约定

前端已按以下契约实现,后端需要遵循,详见 [接口文档](../frontend/docs/api.md):

- 业务响应格式:`{ "code": 0, "data": ..., "message": "..." }`,成功码为 `0`。
- `POST /chat/messages`:请求体 `{ "messages": [{ "role", "content", "timestamp" }] }`,响应 `data` 为 `{ "content": "..." }`。
- `GET /user/profile`:响应 `data` 为 `{ avatar, nickname, userId, gender, city, bio, registeredAt }`。

前端通过环境变量 `VITE_USE_MOCK=false` 与 `VITE_API_BASE_URL` 切换到真实后端。
