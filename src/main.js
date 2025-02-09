import '@/assets/main.css'
import 'animate.css'
import 'nprogress/nprogress.css'
import '@/styles/animations.css'
import '@/styles/dark-mode.css'
import { useTheme } from '@/config/theme'
import App from '@/App.vue'
import * as ElementPlusIconVue from '@element-plus/icons-vue'
import '@fortawesome/fontawesome-free/css/all.css'
import { createApp } from 'vue'
import pinia from '@/stores'
//引入路由
import router from '@/router/permission'
// 图片点击放大
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

// 创建Vue应用实例
const app = createApp(App)

// 注册ElementPlusIconVue组件
for (const [key, component] of Object.entries(ElementPlusIconVue)) {
    app.component(key, component)
}

// 使用pinia
app.use(pinia)


app.use(VueViewer)
// 挂载路由
app.use(router).mount('#app')

const { initTheme } = useTheme()
initTheme() // 初始化主题
