import router from "@/router/index"
import { getToken } from "@/composables/auth"
import { showMessage } from "@/composables/utils"
import { startLoading, closeLoading } from "@/composables/utils"
import { useBlogSettingsStore } from "../stores/bloginfo"

// 前置路由守卫
router.beforeEach((to, from, next) => {
    console.log("==>前置路由守卫")

    // 进度条
    startLoading()
    // 登录校检
    const token = getToken()
    if (!token && to.path.startsWith('/admin')) {
        showMessage('请先登录', 'warning')
        next({ path: '/login' })
    } else if (token && to.path.startsWith('/login')) {
        showMessage('您已登录，请勿重复登录', 'warning')
        // 跳转到之前的路由
        next({ path: from.path })
    } else if (!to.path.startsWith('/admin')) {
        // 如果访问的非 /admin 前缀路由
        // 引入博客设置 store
        let blogSettingsStore = useBlogSettingsStore()
        // 获取博客设置信息并保存到全局状态中
        if (Object.keys(blogSettingsStore.blogSettings).length == 0) {
            blogSettingsStore.getBlogSettings()
        }
        next()
    } else {
        next()
    }
})

// 后置路由守卫
router.afterEach((to, from) => {
    console.log("==>后置路由守卫")

    // 进度条
    closeLoading()

    // 动态设置页面 Title
    let title = (to.meta.title ? to.meta.title : '') + ' - Weblog'
    document.title = title
})

export default router
