<template>
    <div class="header">
        <div class="left">
            <el-icon class="fold-btn" @click="toggleAside">
                <Fold v-if="!isCollapse" />
                <Expand v-else />
            </el-icon>
            <el-breadcrumb separator="/" v-if="!isMobile">
                <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="right">
            <!-- 添加vueuse的点击刷新展示 -->
            <el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom">
                <el-icon @click="refresh" color="#666" size="20" class="refresh-btn">
                    <RefreshRight />
                </el-icon>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="全屏" placement="bottom">
                <el-icon @click="toggle" color="#666" size="20" class="full-screen-btn">
                    <FullScreen v-if="!isFullscreen" />
                    <Aim v-else />
                </el-icon>
            </el-tooltip>
            <el-dropdown trigger="click">
                <span class="user-info">
                    <el-avatar :size="isMobile ? 28 : 32"
                        :src="userStore.userInfo.avatar || getAssetsFile('default-avatar.png')" />
                    <span class="username" v-if="!isMobile">{{ userStore.userInfo.username }}</span>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleCommand('front')">返回前台</el-dropdown-item>
                        <el-dropdown-item @click="handleCommand('profile')">个人信息</el-dropdown-item>
                        <el-dropdown-item @click="handleCommand('logout')">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFullscreen } from '@vueuse/core'
import { useUserStore } from '@/stores/user'
import { showMessage, showModel } from '@/composables/utils'
import { getAssetsFile } from '@/composables/utils'

const props = defineProps({
    isCollapse: Boolean,
    isMobile: Boolean
})

const emit = defineEmits(['update:isCollapse'])
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { isFullscreen, toggle } = useFullscreen()
const refresh = () => {
    console.log('刷新')
    location.reload()
}

const toggleAside = () => {
    emit('update:isCollapse', !props.isCollapse)
}

const handleCommand = (command) => {
    switch (command) {
        case 'front':
            router.push('/')
            break
        case 'profile':
            router.push('/admin/settings/blog')
            break
        case 'logout':
            showModel('确定要退出登录吗？').then(() => {
                // 处理退出登录逻辑
                userStore.logout()
                showMessage('退出登录成功')
                // 跳转登录页
                router.push('/login')
            })
            break
    }
}
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    height: 60px;
    border-bottom: 1px solid #eee;
}

.left {
    display: flex;
    align-items: center;
}

.box-item {
    margin-right: 20px;
}

.full-screen-btn {
    margin-right: 20px;
    cursor: pointer;
    font-size: 20px;
}

.refresh-btn {
    margin-right: 20px;
    cursor: pointer;
    font-size: 20px;
}

.fold-btn {
    margin-right: 20px;
    cursor: pointer;
    font-size: 20px;
}

.right {
    display: flex;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.username {
    margin-left: 8px;
}

/* 响应式样式 */
@media screen and (max-width: 768px) {
    .header {
        padding: 0 10px;
    }

    .fold-btn {
        margin-right: 10px;
        font-size: 18px;
    }
}
</style>