import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 样式加载顺序:Element Plus -> 主题变量 -> Element Plus 主色覆盖 -> 基础样式 -> 响应式规则
import 'element-plus/dist/index.css'
import '@/styles/theme.css'
import '@/styles/element-overrides.css'
import '@/styles/base.scss'
import '@/styles/responsive.scss'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 全局注册图标,菜单等常量中只保存图标名称字符串
for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component)
}

app.use(createPinia()).use(router).use(ElementPlus).mount('#app')
