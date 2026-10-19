# 部署文档

## 环境变量

Vite 只会把以 `VITE_` 开头的变量暴露给前端代码。

| 文件 | 何时加载 | 默认内容 |
| --- | --- | --- |
| `.env` | 所有模式 | `VITE_USE_MOCK=true`、`VITE_API_BASE_URL=/api` |
| `.env.production` | `npm run build` | `VITE_USE_MOCK=false`(覆盖 `.env`) |
| `.env.example` | 不加载,仅作示例 | 复制后按需修改 |

| 变量 | 说明 |
| --- | --- |
| `VITE_USE_MOCK` | 仅当值为 `false` 时调用真实后端,其余取值使用 Mock |
| `VITE_API_BASE_URL` | 接口基础地址,默认 `/api`(同域反向代理) |

注意:

- 这些变量会被打包进前端产物,不要放入密钥或令牌。
- 修改环境变量后需要重启开发服务器或重新构建。
- 本地覆盖可使用 `.env.local`、`.env.production.local`,它们已在 `.gitignore` 中忽略。

## 生产构建

```bash
npm install
npm run lint
npm run test
npm run build
```

产物输出到 `dist` 目录。可用 `npm run preview` 在本地预览。

注意 `.env.production` 默认关闭 Mock,构建出的应用会请求真实后端:`POST /chat/messages` 与 `GET /user/profile`。如果后端尚未准备好,只想部署演示版,把 `.env.production` 中的 `VITE_USE_MOCK` 改为 `true` 再构建。

## 部署要点

- `dist` 是纯静态文件,可部署到任意静态资源服务器或对象存储。
- 路由使用 History 模式(`createWebHistory`)。直接访问 `/chat` 或刷新页面时,服务器必须把未知路径回退到 `index.html`,否则会返回 404。
- 带哈希的 `assets` 文件可长期缓存,`index.html` 不要缓存或只做短缓存,以便发布新版本时用户能拿到最新入口。
- 应用部署在子路径(如 `/travel/`)时,需要在 `vite.config.js` 设置 `base`,并把 `createWebHistory()` 改为 `createWebHistory(import.meta.env.BASE_URL)`。

### Nginx 示例

```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/ai-travel/dist;
  index index.html;

  # History 模式:未知路径回退到 index.html
  location / {
    try_files $uri $uri/ /index.html;
  }

  # 带哈希的静态资源长期缓存
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # index.html 不缓存
  location = /index.html {
    add_header Cache-Control "no-cache";
  }

  # 同域反向代理后端接口(对应 VITE_API_BASE_URL=/api)
  location /api/ {
    proxy_pass http://127.0.0.1:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

后端地址 `127.0.0.1:8080` 仅为示例,请替换为实际地址。

## 切换到真实后端

1. 确认后端提供以下接口,并使用业务响应格式 `{ code, data, message }`,成功码为 `0`:
   - `POST /chat/messages`:请求体 `{ messages: [{ role, content, timestamp }] }`,响应 `data` 为 `{ content }`;
   - `GET /user/profile`:响应 `data` 为用户资料(字段见 [接口文档](api.md))。
2. 在 `.env.production`(生产)或 `.env.local`(本地)中设置 `VITE_USE_MOCK=false`。
3. 设置 `VITE_API_BASE_URL`:
   - 同域部署:保持 `/api`,由 Nginx 等反向代理转发到后端;
   - 跨域部署:设置为后端完整地址,并在后端配置 CORS。
4. 本地开发时前后端不同源,可在 `vite.config.js` 中增加 `server.proxy`,把 `/api` 转发到后端。
5. 重新构建并部署。

两个接口目前没有鉴权。接入真实后端后,请按需要在 `src/api/http.js` 增加登录令牌的注入与过期处理,并确认后端对 `/chat/messages` 与 `/user/profile` 做了访问控制。
