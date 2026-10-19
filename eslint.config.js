import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  // 全局忽略
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },

  // 检查范围:src 下的 .js 与 .vue 文件
  {
    files: ['src/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
  },

  // 基础推荐规则
  { ...js.configs.recommended, files: ['**/*.js', '**/*.vue'] },

  // Vue 推荐规则(flat config)
  ...pluginVue.configs['flat/recommended'],

  // 项目通用规则
  {
    files: ['**/*.{js,vue}'],
    rules: {
      // 保持默认开启;App.vue 为应用根组件,允许单词命名
      'vue/multi-word-component-names': ['error', { ignores: ['App'] }],
    },
  },

  // 视图、组件、布局层禁止直接导入 axios,必须经由 src/api 发起请求
  {
    files: ['src/views/**/*.{js,vue}', 'src/components/**/*.{js,vue}', 'src/layouts/**/*.{js,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message: '视图、组件和布局中不得直接导入 axios,请通过 src/api 下的接口函数发起请求',
            },
          ],
        },
      ],
    },
  },

  // 测试文件:使用 Vitest 全局变量与 Node 环境
  {
    files: ['tests/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node, ...globals.vitest },
    },
  },

  // 根目录配置文件(Node 环境)
  {
    files: ['*.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // 必须放最后:关闭与 Prettier 冲突的格式化规则
  prettier,
]
