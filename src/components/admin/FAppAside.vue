<template>
    <div class="aside" :class="{ 'is-collapse': isCollapse }">
        <div class="logo">
            <el-image :src="getAssetsFile(`@/assets/images/day-logo.png`)" fit="contain" class="logo-img">
                <!-- <template #error>
                    <div class="logo-placeholder">
                        <el-icon>
                            <Monitor />
                        </el-icon>
                    </div>
                </template> -->
            </el-image>
            <span class="logo-text" v-show="!isCollapse">管理后台</span>
        </div>

        <el-scrollbar>
            <el-menu :default-active="activeMenu" unique-opened :collapse="isCollapse" class="border-0 aside-menu"
                background-color="transparent" text-color="rgba(255,255,255,0.85)" active-text-color="#ffffff"
                @select="handleSelect">
                <template v-for="(item, index) in asideMenus" :key="index">
                    <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.name }}</span>
                        </template>
                        <el-menu-item v-for="(child, idx) in item.children" :key="idx" :index="child.path"
                            class="sub-menu-item">
                            <template #title>
                                <span class="menu-title">{{ child.name }}</span>
                            </template>
                        </el-menu-item>
                    </el-sub-menu>

                    <el-menu-item v-else :index="item.path" class="menu-item">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>
                            <span class="menu-title">{{ item.name }}</span>
                        </template>
                    </el-menu-item>
                </template>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { getAssetsFile, menuList } from '@/composables/utils'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = ref(route.path)
const props = defineProps({
    isCollapse: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['select-menu'])
onBeforeRouteUpdate((to, from) => {
    activeMenu.value = to.path
})
// 处理菜单选择
const handleSelect = (index) => {
    // 根据路径查找对应的菜单项
    const findMenuItem = (menus) => {
        for (const item of menus) {
            if (item.path === index) {
                return item
            }
            if (item.children) {
                const found = item.children.find(child => child.path === index)
                if (found) {
                    return found
                }
            }
        }
        return null
    }

    const menuItem = findMenuItem(asideMenus)
    if (menuItem) {
        emit('select-menu', {
            path: index,
            title: menuItem.name
        })
    }
}

// 侧边栏菜单配置
const asideMenus = menuList
</script>

<style scoped>
.aside {
    width: 250px;
    height: 100vh;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(180deg, #304156 0%, #1f2d3d 100%);
    box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
    overflow: hidden;
    position: relative;
}

.logo {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 10px 16px;
    background: rgba(0, 0, 0, .15);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo-img {
    width: 36px;
    height: 36px;
    margin-right: 12px;
    border-radius: 4px;
    transition: all 0.3s;
}

.logo-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    color: #fff;
    font-size: 20px;
}

.logo-text {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    opacity: 1;
    transition: all 0.3s;
}

.aside-menu {
    border-right: none !important;
    margin-top: 8px;
}

:deep(.el-menu) {
    border-right: none;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
    height: 50px;
    line-height: 50px;
    color: rgba(255, 255, 255, 0.85) !important;
    margin: 4px 0;
    transition: all 0.3s;
}

:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
    font-size: 18px;
    margin-right: 10px;
    width: 24px;
    height: 24px;
    text-align: center;
    transition: all 0.3s;
}

:deep(.el-menu-item.is-active) {
    background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3)) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    margin: 4px 10px;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
    background: rgba(255, 255, 255, 0.05) !important;
    border-radius: 4px;
    margin: 4px 10px;
}

:deep(.el-sub-menu.is-active .el-sub-menu__title) {
    color: #fff !important;
}

.sub-menu-item {
    padding-left: 50px !important;
    min-width: auto !important;
}

/* 折叠时的样式 */
.aside.is-collapse {
    width: 64px;
}

.aside.is-collapse .logo {
    padding: 10px;
    justify-content: center;
}

.aside.is-collapse .logo-img {
    margin-right: 0;
}

/* 响应式样式 */
@media screen and (max-width: 768px) {
    .aside {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .aside.is-collapse {
        transform: translateX(-100%);
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
        height: 45px;
        line-height: 45px;
    }
}

/* 优化菜单项动画 */
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-menu-item.is-active) {
    transform: translateX(5px);
}

/* 优化图标动画 */
:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
    transition: transform 0.3s;
}

:deep(.el-menu-item:hover .el-icon),
:deep(.el-sub-menu__title:hover .el-icon) {
    transform: scale(1.2);
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
    .aside {
        background: linear-gradient(180deg, #1a1a1a 0%, #2c2c2c 100%);
    }

    :deep(.el-menu-item:hover),
    :deep(.el-sub-menu__title:hover) {
        background: rgba(255, 255, 255, 0.1) !important;
    }
}
</style>