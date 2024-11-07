import '@/assets/main.css'
import 'animate.css'
import 'nprogress/nprogress.css'
import '@/styles/animations.css'

import * as ElementPlusIconVue from '@element-plus/icons-vue'
import { createApp } from 'vue'
import App from '@/App.vue'
import { createPinia } from 'pinia'
//引入路由
import router from '@/router'
import permission from '@/permission'

// Markdown 编辑器相关导入
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// 引入代码高亮
import hljs from 'highlight.js'

// 使用 github 主题并配置代码高亮
VMdEditor.use(githubTheme, {
    Hljs: hljs,
})
VMdPreview.use(githubTheme, {
    Hljs: hljs,
})
const pinia = createPinia()
// 创建Vue应用实例
const app = createApp(App)

// 注册ElementPlusIconVue组件
for (const [key, component] of Object.entries(ElementPlusIconVue)) {
    app.component(key, component)
}

// 使用pinia
app.use(pinia)

// 使用编辑器
app.use(VMdEditor)
app.use(VMdPreview)

// 挂载路由
app.use(router).mount('#app')
