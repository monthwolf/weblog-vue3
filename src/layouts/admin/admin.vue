<template>
    <el-container class="admin-container">
        <!-- 移动端遮罩层 -->
        <div class="mobile-mask" v-if="isMobile && !isCollapse" @click="isCollapse = true"></div>

        <!-- 侧边栏 -->
        <el-aside :class="{ 'mobile-aside': isMobile }" :style="asideStyle">
            <f-app-aside :is-collapse="isCollapse" @select-menu="handleMenuSelect" />
        </el-aside>

        <!-- 主容器 -->
        <el-container class="main-wrapper" :style="mainStyle">
            <el-header height="60px">
                <f-app-header v-model:is-collapse="isCollapse" :is-mobile="isMobile" />
            </el-header>

            <el-main>
                <f-tag-list ref="tagList" v-model:activeView="currentView" :is-mobile="isMobile" />
                <div class="main-content">
                    <!-- 为页面使用过渡动画 -->
                    <router-view v-slot="{ Component }">
                        <keep-alive :max="10">
                            <transition name="fade">
                                <component :is="Component" />
                            </transition>
                        </keep-alive>
                    </router-view>
                </div>
            </el-main>

            <el-footer height="50px" v-if="!isMobile">
                <f-app-footer :is-mobile="isMobile" />
            </el-footer>
        </el-container>
    </el-container>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed, provide, shallowRef } from 'vue'
import FAppAside from '@/components/admin/FAppAside.vue'
import FAppHeader from '@/components/admin/FAppHeader.vue'
import FAppFooter from '@/components/admin/FAppFooter.vue'
import FTagList from '@/components/admin/FTagList.vue'
import { useRoute } from 'vue-router'
import { menuList } from '@/composables/utils'
import router from '@/router'

const route = useRoute()
const isCollapse = ref(false)
const isMobile = ref(false)
const tagList = ref(null)
const currentView = ref(route.path)

// 处理菜单选择
const handleMenuSelect = (menu) => {
    router.push(menu.path)
}


// const goRoutePath = (path = route.path) => {
//     if (path !== '/admin/index') {
//         let menuItem = menuList.find(item => item.path === path || item.children?.some(child => child.path === path))

//         console.log(menuItem)
//         if (menuItem) {
//             // 如果菜单项有子菜单，则找到是第几个子菜单并添加子菜单，否则添加菜单项
//             const index = menuItem.children?.findIndex(child => child.path === path)
//             console.log(index)
//             if (index !== -1) {
//                 console.log(menuItem.children[index])
//                 menuItem = menuItem.children[index]
//                 tagList.value?.addView({
//                     path: menuItem.path,
//                     title: menuItem.name
//                 })
//                 currentView.value = menuItem.path
//             } else {
//                 tagList.value?.addView({
//                     path: menuItem.path,
//                     title: menuItem.name
//                 })
//                 currentView.value = menuItem.path
//             }
//         }
//     }
// }

// 检查设备类型
const checkDevice = () => {
    isMobile.value = window.innerWidth < 768
    isCollapse.value = window.innerWidth < 992
}

// 监听窗口大小变化
onMounted(() => {
    checkDevice()
    window.addEventListener('resize', checkDevice)
    // goRoutePath()
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkDevice)
})

// 计算侧边栏样式
const asideStyle = computed(() => {
    const width = isCollapse.value ? '64px' : '250px'
    return {
        width,
        transform: isMobile.value && isCollapse.value ? `translateX(-${width})` : 'none'
    }
})

// 计算主容器样式
const mainStyle = computed(() => {
    if (isMobile.value) {
        return {
            marginLeft: '0',
            width: '100%'
        }
    }
    const marginLeft = isCollapse.value ? '64px' : '250px'
    return {
        marginLeft,
        width: `calc(100% - ${marginLeft})`
    }
})

// 提供 addView 方法给子组件使用
provide('addView', (menu) => {
    tagList.value?.addView(menu)
    currentView.value = menu.path // 直接更新当前视图
})
</script>

<style scoped>
/* 内容区域过渡动画：淡入淡出效果 */
/* 刚开始进入时 */
.fade-enter-from {
    /* 透明度 */
    opacity: 0;
}

/* 刚开始结束 */
.fade-enter-to {
    opacity: 1;
}

/* 刚开始离开 */
.fade-leave-from {
    opacity: 1;
}

/* 离开已结束 */
.fade-leave-to {
    opacity: 0;
}

/* 离开进行中 */
.fade-leave-active {
    transition: all 0.3s;
}

/* 进入进行中 */
.fade-enter-active {
    transition: all 0.3s;
    transition-delay: 0.3s;
}

.admin-container {
    height: 100vh;
    position: relative;
    overflow-x: hidden;
}

.mobile-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.el-aside {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    transition: all 0.3s ease-in-out;
    z-index: 1000;
}

.main-wrapper {
    min-height: 100vh;
    transition: all 0.3s ease-in-out;
    position: relative;
}

.el-header {
    padding: 0;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    position: sticky;
    top: 0;
    z-index: 99;
}

.el-main {
    padding: 0;
    background-color: #f5f5f5;
    overflow-x: hidden;
}

.main-content {
    background-color: #fff;
    margin: 15px;
    padding: 20px;
    min-height: calc(100vh - 210px);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
}

.welcome {
    text-align: center;
    padding: 50px;
    color: #666;
}

/* 响应式样式 */
@media screen and (max-width: 768px) {
    .main-content {
        margin: 10px;
        padding: 15px;
    }

    .el-main {
        padding: 0;
    }

    .el-aside {
        transform: translateX(0);
    }
}

@media screen and (max-width: 576px) {
    .main-content {
        margin: 5px;
        padding: 10px;
    }
}

/* 优化组件切换动画 */
.component-fade {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>