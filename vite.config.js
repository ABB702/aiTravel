import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { MEDIA_QUERIES } from './src/constants/breakpoints.js'

// 向每个 SCSS 块注入断点变量。
// 仅包含变量定义,不含任何实际样式,避免样式被重复打包。
// 数值取自 MEDIA_QUERIES,使 CSS 与 JS(matchMedia)共用同一来源。
const scssAdditionalData = [
  `$mq-tablet-up: '${MEDIA_QUERIES.TABLET_UP}';`,
  `$mq-desktop-up: '${MEDIA_QUERIES.DESKTOP_UP}';`,
].join('\n')

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // `@` 指向 src 目录
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `${scssAdditionalData}\n`,
      },
    },
  },
  // Vitest 配置
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.js'],
    // 可选测试任务被跳过时,检查点中的 npm run test 不应因"没有测试文件"而失败
    passWithNoTests: true,
  },
})
