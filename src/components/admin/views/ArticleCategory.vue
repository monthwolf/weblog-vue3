<template>
    <div class="category-container">
        <!-- 搜索栏 -->
        <div class="search-bar">
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="分类名称">
                    <el-input v-model="searchForm.name" placeholder="请输入分类名称" clearable />
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD"
                        :shortcuts="shortcuts" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 分类列表 -->
        <el-card class="category-list">
            <template #header>
                <div class="card-header">
                    <span>分类列表</span>
                    <el-button type="primary" @click="handleAdd">新增分类</el-button>
                </div>
            </template>

            <el-table :data="categoryList" v-loading="loading" border stripe>
                <el-table-column type="index" label="序号" width="80" />
                <el-table-column prop="name" label="分类名称" />
                <el-table-column prop="sort" label="优先级" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag size="small" type="info">{{ row.sort }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="articleCount" label="文章数量" width="120" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
                        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <div class="pagination-container">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[5, 10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </el-card>

        <!-- 使用通用表单对话框 -->
        <FormDialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增分类' : '编辑分类'" :model="categoryForm"
            :rules="rules" @submit="submitForm" @cancel="dialogVisible = false">
            <template #content>
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
                </el-form-item>
                <el-form-item label="优先级" prop="sort">
                    <el-input-number v-model="categoryForm.sort" :min="1" :max="99" placeholder="优先级(1~99)" />
                    <div class="form-tip text-gray-400 text-sm mt-1">
                        范围为1~99，数字越小越靠前，默认为50
                    </div>
                </el-form-item>
            </template>
        </FormDialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategoryList, addCategory, deleteCategory, updateCategory } from '@/api/admin/category'
import FormDialog from '../common/FormDialog.vue'
import { sortUtil, shortcuts } from '@/composables/utils'
// 数据相关
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const categoryList = ref([])

// 搜索表单
const searchForm = reactive({
    name: '',
    dateRange: []
})

// 新增/编辑表单
const dialogVisible = ref(false)
const dialogType = ref('add')
const categoryForm = reactive({
    name: '',
    sort: 50
})

const rules = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    sort: [
        { required: true, message: '请输入优先级', trigger: 'blur' },
        { type: 'number', min: 1, max: 99, message: '优先级必须在1-99之间', trigger: 'blur' }
    ]
}

// 获取分类列表数据
const fetchCategoryList = async () => {
    try {
        loading.value = true
        const params = {
            current: currentPage.value,
            size: pageSize.value,
            name: searchForm.name,
            startDate: searchForm.dateRange?.[0],
            endDate: searchForm.dateRange?.[1]
        }
        const res = await getCategoryList(params)
        if (res.success) {
            if (res.data != null) {
                categoryList.value = res.data.sort((a, b) => sortUtil(a, b, 'sort', 'name'))
            } else {
                categoryList.value = []
            }
            total.value = res.total
        }
    } catch (error) {
        console.error('获取分类列表失败:', error)
        ElMessage.error('获取分类列表失败')
    } finally {
        loading.value = false
    }
}

// 搜索和重置
const handleSearch = () => {
    currentPage.value = 1
    fetchCategoryList()
}

const resetSearch = () => {
    searchForm.name = ''
    searchForm.dateRange = []
    handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
    pageSize.value = val
    fetchCategoryList()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    fetchCategoryList()
}

// 新增/编辑/删除处理
const handleAdd = () => {
    dialogType.value = 'add'
    categoryForm.name = ''
    categoryForm.sort = 50
    dialogVisible.value = true
}

const handleEdit = (row) => {
    dialogType.value = 'edit'
    categoryForm.name = row.name
    categoryForm.sort = row.sort
    categoryForm.id = row.id
    dialogVisible.value = true
}

const handleDelete = (row) => {
    ElMessageBox.confirm('确认删除该分类吗？', '提示', {
        type: 'warning'
    }).then(async () => {
        try {
            const res = await deleteCategory(row.id)
            if (res.success) {
                ElMessage.success('删除成功')
                fetchCategoryList()
            }
        } catch (error) {
            console.error('删除分类失败:', error)
            ElMessage.error('删除分类失败')
        }
    })
}

// 简化后的提交表单方法
const submitForm = async (formData) => {
    try {
        console.log(formData)

        const res = dialogType.value === 'add' ? await addCategory(formData.name, formData.sort) : await updateCategory(formData.id, formData.name, formData.sort)
        if (res.success) {
            ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
            dialogVisible.value = false
            fetchCategoryList()
        }
    } catch (error) {
        console.error('提交分类失败:', error)
        ElMessage.error('提交失败')
    }
}

// 初始化
onMounted(() => {
    fetchCategoryList()
})
</script>

<style scoped lang="scss">
.category-container {
    padding: 20px;
}

.search-bar {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 20px;
}

.category-list {
    background: #fff;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.form-tip {
    font-size: 12px;
    color: #909399;
}

/* 暗色模式样式 */
:deep(.dark) {
    .category-container {

        .search-bar,
        .category-list {
            @apply bg-gray-800 text-gray-300;
        }

        .el-table {
            @apply bg-gray-800 text-gray-300;

            th.el-table__cell {
                @apply bg-gray-700;
            }

            .el-table__cell {
                @apply border-gray-700;
            }
        }

        .form-tip {
            @apply text-gray-400;
        }

        .el-pagination {
            @apply bg-gray-800 text-gray-300;

            .btn-prev,
            .btn-next {
                @apply bg-gray-700;
            }

            .el-pager li {
                @apply bg-gray-700 text-gray-300;

                &.active {
                    @apply bg-primary-600 text-white;
                }
            }
        }
    }
}
</style>