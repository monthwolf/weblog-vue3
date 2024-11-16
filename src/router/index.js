import Index from '@/pages/frontend/index.vue'
import Login from '@/pages/admin/login.vue'
import AdminIndex from '@/pages/admin/index.vue'
import ArticleList from '@/components/admin/views/ArticleList.vue'
import ArticlePublish from '@/components/admin/views/ArticlePublish.vue'
import ArticleCategory from '@/components/admin/views/ArticleCategory.vue'
import ArticleTags from '@/components/admin/views/ArticleTags.vue'
import BlogSettings from '@/components/admin/views/BlogSettings.vue'
import Dashboard from '@/components/admin/views/Dashboard.vue'
import { createRouter, createWebHistory } from 'vue-router'

//统一在下面声明所有路由
const routes = [
    {
        path: '/',
        component: Index,
        meta: {
            title: 'Weblog 首页'
        }
    },
    {
        path: '/login',
        component: Login,
        meta: {
            title: 'Weblog 登录'
        }
    },
    {
        path: '/admin',
        component: AdminIndex,
        children: [
            {
                path: 'index',
                component: Dashboard,
                meta: {
                    title: 'Weblog 后台首页'
                }
            },
            {
                path: 'article/list',
                component: ArticleList,
                meta: {
                    title: 'Weblog 文章列表'
                }
            },
            {
                path: 'article/publish',
                component: ArticlePublish,
                meta: {
                    title: 'Weblog 文章发布'
                }
            },
            {
                path: 'article/category',
                component: ArticleCategory,
                meta: {
                    title: 'Weblog 文章分类'
                }
            },
            {
                path: 'article/tags',
                component: ArticleTags,
                meta: {
                    title: 'Weblog 文章标签'
                }
            },
            {
                path: 'settings/blog',
                component: BlogSettings,
                meta: {
                    title: 'Weblog 博客设置'
                }
            }
        ]
    }
]

//创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

//导出路由实例
export default router
