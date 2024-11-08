import nprogress from 'nprogress';
import 'element-plus/es/components/message-box/style/css'
import { useCookies } from '@vueuse/integrations/useCookies';

// 消息提示
export function showMessage(message = '提示内容', type = 'success', customClass = '') {
    return ElMessage({
        type: type,
        message,
        customClass,
    })
}

// 弹出确认框
export function showModel(content = '提示内容', type = 'warning', title = '') {
    return ElMessageBox.confirm(
        content,
        title,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type,
        }
    )
}

// 进度条
export function startLoading() {
    nprogress.start()
}

export function closeLoading() {
    nprogress.done()
}

/**
 * 引入本地图片
 * @param {*} src
 * @returns
 */
export const getAssetsFile = (url) => {
    const urlArr = String(url).split('/') // 通过'/'分割成数组
    const fileName = urlArr.slice(-1)[0] // 获取最后一个值
    // layer决定需要几个..

    return new URL(`../assets/images/${fileName}`, import.meta.url).href // 使用vite推荐的方法渲染
}

/**
 * 菜单列表
 * @returns
 */
export const menuList = [
    {
        name: "后台首页",
        icon: "House",
        path: "/admin/index"
    },
    {
        name: "内容管理",
        icon: "Document",
        path: "/admin/content",
        children: [
            {
                name: "文章列表",
                path: "/admin/article/list"
            },
            {
                name: "发布文章",
                path: "/admin/article/publish"
            },
            {
                name: "文章分类",
                path: "/admin/article/category"
            },
            {
                name: "标签管理",
                path: "/admin/article/tags"
            }
        ]
    },
    {
        name: "系统设置",
        icon: "Setting",
        path: "/admin/settings",
        children: [
            {
                name: "博客设置",
                path: "/admin/settings/blog"
            },
            {
                name: "个人信息",
                path: "/admin/settings/profile"
            }
        ]
    }
]

// 权限映射
export const permissionMap = {
    "ROLE_ADMIN": "超级管理员",
    "ROLE_USER": "普通用户",
    "ROLE_VISITOR": "游客"
}

// cookie存取标签页
const cookies = useCookies()

export const getTabList = () => {
    return cookies.get('tabList') || [{ title: '后台首页', path: '/admin/index' }]
}

export const setTabList = (tabList) => {
    // 判断是否有首页
    if (tabList.some(v => v.path === '/admin/index')) {
        cookies.set('tabList', tabList)
    } else {
        cookies.set('tabList', [{ title: '后台首页', path: '/admin/index' }, ...tabList])
    }
}

