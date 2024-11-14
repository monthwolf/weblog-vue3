<template>
    <div class="article-list animate__animated animate__fadeIn">
        <div class="search-bar animate__animated animate__slideInDown">
            <el-form :inline="true" :model="searchForm" class="search-form">
                <el-form-item label="文章标题">
                    <el-input v-model="searchForm.title" placeholder="请输入文章标题" clearable :prefix-icon="Search" />
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
                        <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id">
                            <el-icon>
                                <FolderOpened />
                            </el-icon>
                            <span class="ml-2">{{ item.name }}</span>
                            <span class="text-gray-400 ml-auto">{{ item.count }}篇</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchForm.status" placeholder="文章状态" clearable>
                        <el-option label="已发布" :value="1" />
                        <el-option label="草稿" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="时间范围">
                    <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" :shortcuts="dateShortcuts" />
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
                        <el-button @click="resetSearch" :icon="RefreshRight">重置</el-button>
                    </el-button-group>
                </el-form-item>
            </el-form>
        </div>

        <div class="table-container animate__animated animate__fadeInUp animation-delay-200">
            <el-card shadow="hover" class="table-card">
                <template #header>
                    <div class="card-header">
                        <span class="header-title">文章列表</span>
                        <el-button type="primary" :icon="Plus" @click="handleAdd">新增文章</el-button>
                    </div>
                </template>

                <el-table :data="articleList" style="width: 100%" v-loading="loading" row-key="id" :stripe="true"
                    :border="true" @row-click="handleRowClick">
                    <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip>
                        <template #default="{ row }">
                            <div class="title-cell">
                                <el-icon>
                                    <Document />
                                </el-icon>
                                <span class="title-text">{{ row.title }}</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="category" label="分类" width="120">
                        <template #default="{ row }">
                            <el-tag size="small" :type="getCategoryType(row.category)">
                                {{ row.category }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column prop="tags" label="标签" width="200">
                        <template #default="{ row }">
                            <div class="tags-wrapper">
                                <el-tag v-for="tag in row.tags" :key="tag" size="small" class="mx-1"
                                    :effect="getTagEffect(tag)">
                                    {{ tag }}
                                </el-tag>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="createTime" label="发布时间" width="180">
                        <template #default="{ row }">
                            <div class="time-cell">
                                <el-icon>
                                    <Timer />
                                </el-icon>
                                <el-tooltip :content="formatDate(row.createTime)" placement="top">
                                    <span>{{ formatArticleDate(row.createTime) }}</span>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="status" label="状态" width="100">
                        <template #default="{ row }">
                            <el-tag :type="row.status === 1 ? 'success' : 'info'"
                                :effect="row.status === 1 ? 'light' : 'plain'">
                                {{ row.status === 1 ? '已发布' : '草稿' }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column prop="views" label="阅读量" width="100">
                        <template #default="{ row }">
                            <el-tooltip :content="`${row.views} 次阅读`" placement="top">
                                <div class="views-cell">
                                    <el-icon>
                                        <View />
                                    </el-icon>
                                    <span>{{ formatNumber(row.views) }}</span>
                                </div>
                            </el-tooltip>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="200" fixed="right">
                        <template #default="{ row }">
                            <div class="operation-cell">
                                <el-tooltip content="编辑" placement="top">
                                    <el-button type="primary" link @click.stop="handleEdit(row)">
                                        <el-icon>
                                            <Edit />
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>

                                <el-tooltip content="预览" placement="top">
                                    <el-button type="success" link @click.stop="handlePreview(row)">
                                        <el-icon>
                                            <View />
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>

                                <el-tooltip content="删除" placement="top">
                                    <el-button type="danger" link @click.stop="handleDelete(row)">
                                        <el-icon>
                                            <Delete />
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination-container">
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 30, 50]" :total="total" :background="true"
                        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    Search, RefreshRight, Plus, Document,
    Edit, View, Delete, Timer, FolderOpened
} from '@element-plus/icons-vue'
import { formatDate, getTimeAgo, isToday } from '@/composables/date'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const searchForm = reactive({
    title: '',
    category: '',
    status: '',
    dateRange: []
})

const categories = [
    { id: 1, name: '技术博客' },
    { id: 2, name: '生活随笔' },
    { id: 3, name: '项目分享' }
]

const articleList = ref([
    {
        id: 1,
        title: 'Vue3 组合式 API 最佳实践',
        category: '技术博客',
        tags: ['Vue3', 'JavaScript'],
        createTime: '2024-01-15 10:00:00',
        status: 1,
        views: 1000
    },
    // 更多文章数据...
])

const handleSearch = () => {
    // 实现搜索逻辑
}

const resetSearch = () => {
    searchForm.title = ''
    searchForm.category = ''
}

const handleEdit = (row) => {
    // 实现编辑逻辑
}

const handlePreview = (row) => {
    // 实现预览逻辑
}

const handleDelete = (row) => {
    ElMessageBox.confirm('确定要删除该文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // 实现删除逻辑
        ElMessage.success('删除成功')
    })
}

const handleSizeChange = (val) => {
    pageSize.value = val
    // 重新加载数据
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    // 重新加载数据
}

// 获取分类标签类型
const getCategoryType = (category) => {
    const types = {
        '技术博客': 'primary',
        '生活随笔': 'success',
        '项目分享': 'warning'
    }
    return types[category] || 'info'
}

// 获取标签效果
const getTagEffect = (tag) => {
    return Math.random() > 0.5 ? 'light' : 'dark' // 这里可以根据实际需求设置逻辑
}

// 行点击处理
const handleRowClick = (row) => {
    handlePreview(row)
}

// 添加一个格式化日期的方法
const formatArticleDate = (date) => {
    if (isToday(date)) {
        return getTimeAgo(date)
    }
    return formatDate(date)
}

const stats = reactive({
    totalArticles: 156,
    publishedArticles: 142,
    draftArticles: 14,
    totalViews: 25678
})

const dateShortcuts = [
    {
        text: '最近一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        }
    },
    // 添加更多快捷选项...
]

const formatNumber = (num) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num
}
</script>

<style scoped>
.article-list {
    padding: 20px;
    min-height: 100%;
}

.search-bar {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.search-form {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.table-container {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
}

.table-card {
    transition: all 0.3s;
}

.table-card:hover {
    transform: translateY(-2px);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-title {
    font-size: 16px;
    font-weight: bold;
}

.title-cell {
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-text {
    color: var(--el-color-primary);
    cursor: pointer;
}

.title-text:hover {
    text-decoration: underline;
}

.tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.time-cell {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #666;
}

.operation-cell {
    display: flex;
    gap: 8px;
}

.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

/* 动画延迟类 */
.animation-delay-200 {
    animation-delay: 0.2s;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
    .article-list {
        padding: 10px;
    }

    .search-bar {
        padding: 15px;
    }

    .search-form {
        flex-direction: column;
    }

    .search-form .el-form-item {
        margin-bottom: 10px;
    }

    .operation-cell {
        flex-direction: column;
        gap: 4px;
    }
}

@media screen and (max-width: 576px) {
    .el-table {
        font-size: 12px;
    }
}

.stats-cards {
    margin-bottom: 20px;
}

.stats-card {
    transition: all 0.3s ease;
    cursor: pointer;
}

.stats-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stats-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--el-text-color-secondary);
}

.stats-content {
    text-align: center;
    padding: 10px 0;
}

.stats-number {
    font-size: 24px;
    font-weight: bold;
    color: var(--el-color-primary);
}

.stats-label {
    margin-left: 4px;
    color: var(--el-text-color-secondary);
}

.views-cell {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--el-text-color-secondary);
}

/* 现有样式保持不变，添加以下暗色模式样式 */
.dark {
    .article-list {
        @apply bg-gray-900;
    }

    .search-bar {
        @apply bg-gray-800 border-gray-700;
    }

    .table-container {
        @apply bg-gray-800;
    }

    .table-card {
        @apply bg-gray-800 border-gray-700;

        &:hover {
            @apply shadow-lg shadow-gray-900/50;
        }
    }

    .title-cell {
        .title-text {
            @apply text-blue-400;

            &:hover {
                @apply text-blue-300;
            }
        }
    }

    .time-cell {
        @apply text-gray-400;
    }

    .views-cell {
        @apply text-gray-400;
    }

    :deep(.el-table) {
        @apply bg-gray-800 text-gray-300;

        th.el-table__cell {
            @apply bg-gray-700;
        }

        .el-table__cell {
            @apply border-gray-700;
        }

        tr:hover>td.el-table__cell {
            @apply bg-gray-700;
        }
    }

    :deep(.el-pagination) {
        @apply bg-gray-800 text-gray-300;

        .btn-prev,
        .btn-next {
            @apply bg-gray-700;
        }

        .el-pager li {
            @apply bg-gray-700 text-gray-300;

            &.active {
                @apply bg-purple-600 text-white;
            }
        }
    }

    :deep(.el-input__wrapper) {
        @apply bg-gray-700 border-gray-600;
    }

    :deep(.el-select__popper) {
        @apply bg-gray-700 border-gray-600;

        .el-select-dropdown__item {
            @apply text-gray-300;

            &.hover {
                @apply bg-gray-600;
            }
        }
    }
}
</style>