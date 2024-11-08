<template>
    <div class="category-manage animate__animated animate__fadeIn">
        <div class="header-actions">
            <div class="left">
                <h2 class="title">分类管理</h2>
                <p class="subtitle">共 {{ categoryList.length }} 个分类</p>
            </div>
            <el-button type="primary" @click="showAddDialog" class="animate__animated animate__fadeInRight">
                <el-icon>
                    <Plus />
                </el-icon>新增分类
            </el-button>
        </div>

        <div class="category-content animate__animated animate__fadeInUp animation-delay-200">
            <el-card shadow="hover" class="category-card">
                <el-table :data="categoryList" style="width: 100%" v-loading="loading" :stripe="true" :border="true">
                    <el-table-column prop="name" label="分类名称">
                        <template #default="{ row }">
                            <div class="category-name">
                                <el-icon>
                                    <Folder />
                                </el-icon>
                                <span>{{ row.name }}</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="articleCount" label="文章数量" width="120">
                        <template #default="{ row }">
                            <el-tag :type="getCountType(row.articleCount)" effect="light">
                                {{ row.articleCount }} 篇
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column prop="createTime" label="创建时间" width="180">
                        <template #default="{ row }">
                            <div class="time-cell">
                                <el-icon>
                                    <Timer />
                                </el-icon>
                                <span>{{ formatDate(row.createTime) }}</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="sort" label="排序" width="150">
                        <template #default="{ row }">
                            <el-input-number v-model="row.sort" :min="0" :max="99" size="small"
                                @change="handleSortChange(row)" />
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="200" fixed="right">
                        <template #default="{ row }">
                            <div class="operation-cell">
                                <el-tooltip content="编辑" placement="top">
                                    <el-button type="primary" link @click="handleEdit(row)">
                                        <el-icon>
                                            <Edit />
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip content="查看文章" placement="top">
                                    <el-button type="success" link @click="handleViewArticles(row)">
                                        <el-icon>
                                            <Document />
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip content="删除" placement="top">
                                    <el-button type="danger" link @click="handleDelete(row)">
                                        <el-icon>
                                            <Delete />
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <!-- 新增/编辑分类对话框 -->
        <el-dialog :title="dialogType === 'add' ? '新增分类' : '编辑分类'" v-model="dialogVisible" width="500px"
            destroy-on-close class="category-dialog">
            <el-form :model="categoryForm" :rules="rules" ref="formRef" label-width="100px" class="category-form">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="categoryForm.name" placeholder="请输入分类名称" :maxlength="20" show-word-limit />
                </el-form-item>

                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="categoryForm.sort" :min="0" :max="99" :step="1" step-strictly />
                    <div class="form-tip">数值越小越靠前，范围0-99</div>
                </el-form-item>

                <el-form-item label="描述">
                    <el-input v-model="categoryForm.description" type="textarea" rows="3" placeholder="请输入分类描述"
                        :maxlength="200" show-word-limit />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitCategory" :loading="submitting">
                        {{ dialogType === 'add' ? '新增' : '保存' }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Folder, Timer, Edit, Document, Delete } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/date'

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)

const categoryForm = reactive({
    name: '',
    sort: 0,
    description: ''
})

const rules = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    sort: [
        { required: true, message: '请输入排序号', trigger: 'blur' },
        { type: 'number', message: '排序号必须为数字', trigger: 'blur' }
    ]
}

const categoryList = ref([
    {
        id: 1,
        name: '技术博客',
        articleCount: 10,
        createTime: '2024-01-15 10:00:00',
        sort: 1
    },
    {
        id: 2,
        name: '生活随笔',
        articleCount: 5,
        createTime: '2024-01-15 11:00:00',
        sort: 2
    },
    {
        id: 3,
        name: '项目分享',
        articleCount: 8,
        createTime: '2024-01-15 12:00:00',
        sort: 3
    }
])

// 获取文章数量对应的标签类型
const getCountType = (count) => {
    if (count > 10) return 'success'
    if (count > 5) return 'warning'
    return 'info'
}

const showAddDialog = () => {
    dialogType.value = 'add'
    dialogVisible.value = true
    if (formRef.value) {
        formRef.value.resetFields()
    }
}

const handleEdit = (row) => {
    dialogType.value = 'edit'
    dialogVisible.value = true
    Object.assign(categoryForm, row)
}

const handleDelete = (row) => {
    ElMessageBox.confirm(
        `确定要删除分类"${row.name}"吗？\n删除后该分类下的文章将变为未分类状态`,
        '删除确认',
        {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'warning',
            draggable: true
        }
    ).then(() => {
        // 实现删除逻辑
        ElMessage.success('删除成功')
    })
}

const handleViewArticles = (row) => {
    // 实现查看分类文章列表的逻辑
    ElMessage.info(`查看 ${row.name} 分类下的文章`)
}

const handleSortChange = (row) => {
    ElMessage.success(`${row.name} 排序已更新为 ${row.sort}`)
}

const submitCategory = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true
            try {
                // 实现提交逻辑
                await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟请求
                ElMessage.success(dialogType.value === 'add' ? '新增成功' : '更新成功')
                dialogVisible.value = false
            } finally {
                submitting.value = false
            }
        }
    })
}
</script>

<style scoped>
.category-manage {
    padding: 20px;
}

.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
}

.subtitle {
    margin: 5px 0 0;
    font-size: 14px;
    color: var(--el-text-color-secondary);
}

.category-card {
    transition: all 0.3s;
}

.category-card:hover {
    transform: translateY(-2px);
}

.category-name {
    display: flex;
    align-items: center;
    gap: 8px;
}

.time-cell {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--el-text-color-secondary);
}

.operation-cell {
    display: flex;
    gap: 8px;
}

.category-form {
    padding: 20px 0;
}

.form-tip {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-top: 4px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

/* 动画延迟类 */
.animation-delay-200 {
    animation-delay: 0.2s;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
    .category-manage {
        padding: 10px;
    }

    .title {
        font-size: 20px;
    }

    .operation-cell {
        flex-direction: column;
        gap: 4px;
    }
}

@media screen and (max-width: 576px) {
    .header-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
}
</style>