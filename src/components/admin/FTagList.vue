<template>
    <div class="tags-nav" :class="{ 'is-mobile': isMobile }">
        <el-scrollbar class="tags-nav-scroll" ref="scrollbarRef">
            <div class="tags-nav-wrapper">
                <el-tabs v-model="activeTab" type="card" @tab-change="handleClick" @tab-remove="removeTab"
                    class="custom-tabs">
                    <el-tab-pane v-for="item in visitedViews" :key="item.path" :label="item.title" :name="item.path"
                        :closable="item.path !== '/admin/index'">
                        <template #label>
                            <span class="tab-label">
                                <el-icon v-if="item.path === '/admin/index'">
                                    <HomeFilled />
                                </el-icon>
                                {{ item.title }}
                            </span>
                        </template>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-scrollbar>

        <div class="tags-options" v-if="!isMobile">
            <el-dropdown @command="handleTagsOption" trigger="click" :show-timeout="100">
                <el-button class="tags-options-btn" type="primary" :icon="Operation" circle></el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="closeOther">
                            <el-icon>
                                <CircleClose />
                            </el-icon>
                            <span>关闭其他标签页</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="closeAll">
                            <el-icon>
                                <FolderDelete />
                            </el-icon>
                            <span>关闭全部标签页</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="closeRight">
                            <el-icon>
                                <DArrowRight />
                            </el-icon>
                            <span>关闭右侧标签页</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="closeLeft">
                            <el-icon>
                                <DArrowLeft />
                            </el-icon>
                            <span>关闭左侧标签页</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { Operation, CircleClose, FolderDelete, DArrowRight, DArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router'
import { getTabList, setTabList } from '@/composables/utils'

onBeforeRouteUpdate((to, from) => {
    addView({
        path: to.path,
        title: to.meta.title
    })
})

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['update:activeView'])

const activeTab = ref(route.path)
const visitedViews = ref(getTabList())

onMounted(() => {
    addView({
        path: route.path,
        title: route.meta.title
    })
})


// 添加视图
function addView({ path, title }) {
    if (visitedViews.value.some(v => v.path === path)) {
        activeTab.value = path
        emit('update:activeView', path)
        return
    }
    visitedViews.value.push({ path, title })
    setTabList(visitedViews.value)
    activeTab.value = path
    emit('update:activeView', path)
}

// 处理标签点击
function handleClick(tab) {
    router.push(tab.props.name)
    emit('update:activeView', tab.props.name)
}

// 移除标签
function removeTab(targetPath) {
    if (targetPath === '/admin/index') {
        ElMessage.warning('首页不能关闭！')
        return
    }

    const tabs = visitedViews.value
    let activePath = activeTab.value

    if (activePath === targetPath) {
        tabs.forEach((tab, index) => {
            if (tab.path === targetPath) {
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                    activePath = nextTab.path
                }
            }
        })
    }

    activeTab.value = activePath
    visitedViews.value = tabs.filter(tab => tab.path !== targetPath)
    setTabList(visitedViews.value)
    emit('update:activeView', activePath)
}

// 处理标签选项
function handleTagsOption(command) {
    const currentPath = activeTab.value

    switch (command) {
        case 'closeOther':
            visitedViews.value = visitedViews.value.filter(
                item => item.path === '/admin/index' || item.path === currentPath
            )
            setTabList(visitedViews.value)
            break
        case 'closeAll':
            visitedViews.value = visitedViews.value.filter(item => item.path === '/admin/index')
            activeTab.value = '/admin/index'
            emit('update:activeView', '/admin/index')
            setTabList(visitedViews.value)
            break
        case 'closeRight':
            const currentIndex = visitedViews.value.findIndex(item => item.path === currentPath)
            if (currentIndex !== -1) {
                visitedViews.value = visitedViews.value.filter((item, index) =>
                    index <= currentIndex || item.path === '/admin/index'
                )
            }
            setTabList(visitedViews.value)
            break
        case 'closeLeft':
            const currIndex = visitedViews.value.findIndex(item => item.path === currentPath)
            if (currIndex !== -1) {
                visitedViews.value = visitedViews.value.filter((item, index) =>
                    index >= currIndex || item.path === '/admin/index'
                )
            }
            setTabList(visitedViews.value)
            break
    }
}
// 当activetab变化时，触发handleClick
watch(activeTab, (newPath) => {
    handleClick({ props: { name: newPath } })
})

defineExpose({
    addView
})

defineProps({
    isMobile: Boolean
})
</script>

<style scoped>
.tags-nav {
    padding: 4px 16px;
    background: #fff;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    transition: all 0.3s;
}

.tags-nav-scroll {
    flex: 1;
}

.tags-options {
    padding-left: 15px;
}

.tags-options-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 32px;
    height: 32px;
}

.tags-options-btn:hover {
    transform: rotate(180deg);
    background: var(--el-color-primary-light-3);
}

:deep(.custom-tabs .el-tabs__header) {
    margin: 0;
    border: none;
}

:deep(.custom-tabs .el-tabs__nav) {
    border: none !important;
    border-radius: 0;
}

:deep(.custom-tabs .el-tabs__item) {
    height: 32px;
    line-height: 32px;
    padding: 0 16px !important;
    border: 1px solid #dcdfe6 !important;
    margin: 0 4px;
    border-radius: 4px;
    color: #666;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: #fff;
}

:deep(.custom-tabs .el-tabs__item.is-active) {
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary) !important;
    color: var(--el-color-primary);
}

:deep(.custom-tabs .el-tabs__item:hover) {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary-light-5) !important;
    background: var(--el-color-primary-light-9);
}

.tab-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

:deep(.el-dropdown-menu__item) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
}

:deep(.el-dropdown-menu__item:hover) {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
}

:deep(.el-dropdown-menu__item .el-icon) {
    margin-right: 0;
}

/* 响应式样式 */
.is-mobile {
    padding: 4px 8px;
}

.is-mobile :deep(.el-tabs__item) {
    padding: 0 12px !important;
    font-size: 13px;
}

@media screen and (max-width: 768px) {
    .tags-nav {
        padding: 4px 8px;
    }

    :deep(.el-tabs__item) {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

@media screen and (max-width: 576px) {
    :deep(.el-tabs__item) {
        max-width: 100px;
        padding: 0 8px !important;
    }
}
</style>