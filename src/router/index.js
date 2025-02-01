import Index from '@/pages/frontend/index.vue'
import Login from '@/pages/admin/login.vue'
import AdminIndex from '@/pages/admin/index.vue'
import ArticleList from '@/components/admin/views/ArticleList.vue'
import ArticleCategory from '@/components/admin/views/ArticleCategory.vue'
import ArticleTags from '@/components/admin/views/ArticleTags.vue'
import BlogSettings from '@/components/admin/views/BlogSettings.vue'
import Dashboard from '@/components/admin/views/Dashboard.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ArchiveList from '@/pages/frontend/archive-list.vue'
import CategoryList from '@/pages/frontend/category-list.vue'
import CategoryArticleList from '@/pages/frontend/category-article-list.vue'
import TagList from '@/pages/frontend/tag-list.vue'
import TagArticleList from '@/pages/frontend/tag-article-list.vue'
import ArticleDetails from '@/pages/frontend/article-details.vue'



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
        path: '/archive/list', // 归档页
        component: ArchiveList,
        meta: { // meta 信息
            title: 'Weblog 归档页'
        }
    },
    {
        path: '/category/list', // 分类页
        component: CategoryList,
        meta: { // meta 信息
            title: 'Weblog 分类页'
        }
    },
    {
        path: '/tag/list', // 标签列表页
        component: TagList,
        meta: { // meta 信息
            title: 'Weblog 标签列表页'
        }
    },
    {
        path: '/tag/article/list', // 标签列表页
        component: TagArticleList,
        meta: { // meta 信息
            title: 'Weblog 标签文章页'
        }
    },
    {
        path: '/category/article/list', // 分类文章页
        component: CategoryArticleList,
        meta: { // meta 信息
            title: 'Weblog 分类文章页'
        }
    },
    {
        path: '/article/:articleId', // 文章详情页
        component: ArticleDetails,
        meta: { // meta 信息
            title: 'Weblog 详情页'
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
