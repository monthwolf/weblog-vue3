<template>
    <el-container class="admin-container" :class="{ 'dark': isDark }">
        <!-- 移动端遮罩层 -->
        <div class="mobile-mask" v-if="isMobile && !isCollapse" @click="isCollapse = true"></div>

        <!-- 侧边栏 -->
        <el-aside :class="{ 'mobile-aside': isMobile }" :style="asideStyle">
            <f-app-aside :is-collapse="isCollapse" @select-menu="handleMenuSelect"/>
        </el-aside>

        <!-- 主容器 -->
        <el-container class="main-wrapper" :style="mainStyle">
            <el-header class="h-1/3">
                <div>
                    <f-app-header v-model:is-collapse="isCollapse" :is-mobile="isMobile" />
                    <f-tag-list ref="tagList" v-model:activeView="currentView" :is-mobile="isMobile" />
                </div>
            </el-header>

            <el-main class="h-1/2">
                <div class="main-content h-96/100">
                    <!-- 为页面使用过渡动画 -->
                    <router-view v-slot="{ Component }">
                        <keep-alive :max="10">
                            <component :is="Component" />
                        </keep-alive>
                    </router-view>
                </div>
            </el-main>

            <el-footer v-if="!isMobile" class="h-1/6">
                <f-app-footer :is-mobile="isMobile" />
            </el-footer>
        </el-container>
        <!-- 现有的布局内容 -->
        <ThemeToggle />
    </el-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, provide, shallowRef } from 'vue'
import { useTheme } from '@/config/theme'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const { isDark } = useTheme()
import FAppAside from '@/components/admin/FAppAside.vue'
import FAppHeader from '@/components/admin/FAppHeader.vue'
import FAppFooter from '@/components/admin/FAppFooter.vue'
import FTagList from '@/components/admin/FTagList.vue'
import { useRoute } from 'vue-router'
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
    position: relative;
    overflow-x: hidden;
    background-color: theme('backgroundColor.admin.light');
    transition: background-color 0.3s ease;
}

.dark .admin-container {
    background-color: theme('backgroundColor.admin.dark');
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
