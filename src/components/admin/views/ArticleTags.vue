<template>
    <div class="tags-manage animate__animated animate__fadeIn">
        <div class="header-actions">
            <div class="left">
                <h2 class="title">标签管理</h2>
                <p class="subtitle">共 {{ tagsList.length }} 个标签</p>
            </div>
            <div class="action-buttons animate__animated animate__fadeInRight">
                <el-button-group>
                    <el-button type="primary" @click="showAddDialog">
                        <el-icon>
                            <Plus />
                        </el-icon>新增标签
                    </el-button>
                    <el-button type="success" @click="handleBatchAdd">
                        <el-icon>
                            <Files />
                        </el-icon>批量添加
                    </el-button>
                </el-button-group>
            </div>
        </div>

        <div class="tags-content animate__animated animate__fadeInUp animation-delay-200">
            <el-card shadow="hover" class="tags-card">
                <el-table :data="tagsList" style="width: 100%" v-loading="loading" :stripe="true" :border="true">
                    <el-table-column prop="name" label="标签名称">
                        <template #default="{ row }">
                            <div class="tag-name">
                                <el-tag :color="row.color" effect="plain" class="animate-breathe">
                                    {{ row.name }}
                                </el-tag>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="articleCount" label="文章数量" width="120">
                        <template #default="{ row }">
                            <el-badge :value="row.articleCount" :type="getCountType(row.articleCount)"
                                class="count-badge" />
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

                    <el-table-column label="状态" width="120">
                        <template #default="{ row }">
                            <el-switch v-model="row.status" :active-value="true" :inactive-value="false"
                                @change="(val) => handleStatusChange(row, val)" class="status-switch" />
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="180" fixed="right">
                        <template #default="{ row }">
                            <div class="operation-cell">
                                <el-tooltip content="编辑标签" placement="top">
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
                                <el-tooltip content="删除标签" placement="top">
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

        <!-- 新增/编辑标签对话框 -->
        <el-dialog :title="dialogType === 'add' ? '新增标签' : '编辑标签'" v-model="dialogVisible" width="500px"
            destroy-on-close class="tag-dialog">
            <el-form :model="tagForm" :rules="rules" ref="formRef" label-width="100px" class="tag-form">
                <el-form-item label="标签名称" prop="name">
                    <el-input v-model="tagForm.name" placeholder="请输入标签名称" :maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item label="标签颜色">
                    <el-color-picker v-model="tagForm.color" show-alpha :predefine="predefineColors" />
                    <div class="color-preview" :style="{ background: tagForm.color }">
                        预览效果
                    </div>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="tagForm.description" type="textarea" rows="3" placeholder="请输入标签描述"
                        :maxlength="200" show-word-limit />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitTag" :loading="submitting">
                        {{ dialogType === 'add' ? '新增' : '保存' }}
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 批量添加对话框 -->
        <el-dialog title="批量添加标签" v-model="batchDialogVisible" width="500px" destroy-on-close>
            <el-form :model="batchForm" ref="batchFormRef" label-width="100px">
                <el-form-item label="标签列表" prop="tags">
                    <el-input type="textarea" v-model="batchForm.tags" rows="6" placeholder="请输入标签名称，多个标签用逗号或换行分隔" />
                    <div class="form-tip">
                        已识别 {{ recognizedTags.length }} 个标签
                    </div>
                </el-form-item>
                <div class="recognized-tags" v-if="recognizedTags.length">
                    <el-tag v-for="tag in recognizedTags" :key="tag" class="mx-1" closable
                        @close="removeRecognizedTag(tag)">
                        {{ tag }}
                    </el-tag>
                </div>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="batchDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitBatchTags" :loading="batchSubmitting"
                        :disabled="!recognizedTags.length">
                        确定添加
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Files, Timer, Edit, Document, Delete } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/date'

const loading = ref(false)
const submitting = ref(false)
const batchSubmitting = ref(false)
const dialogVisible = ref(false)
const batchDialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const batchFormRef = ref(null)

const tagForm = reactive({
    name: '',
    color: '#409EFF',
    description: ''
})

const batchForm = reactive({
    tags: ''
})

// 预定义颜色
const predefineColors = [
    '#409EFF',
    '#67C23A',
    '#E6A23C',
    '#F56C6C',
    '#909399',
    '#9C27B0',
    '#FF9800',
    '#795548'
]

// 计算已识别的标签
const recognizedTags = computed(() => {
    if (!batchForm.tags) return []
    return [...new Set(
        batchForm.tags
            .split(/[,，\n]/)
            .map(tag => tag.trim())
            .filter(tag => tag)
    )]
})

const removeRecognizedTag = (tag) => {
    const tags = recognizedTags.value.filter(t => t !== tag)
    batchForm.tags = tags.join('\n')
}

const tagsList = ref([
    {
        id: 1,
        name: 'Vue3',
        articleCount: 5,
        createTime: '2024-01-15 10:00:00',
        status: true,
        color: '#409EFF'
    },
    {
        id: 2,
        name: 'JavaScript',
        articleCount: 8,
        createTime: '2024-01-15 10:00:00',
        status: true,
        color: '#67C23A'
    }
])

const showAddDialog = () => {
    dialogType.value = 'add'
    dialogVisible.value = true
    if (formRef.value) {
        formRef.value.resetFields()
    }
}

const handleBatchAdd = () => {
    batchDialogVisible.value = true
    batchForm.tags = ''
}

const handleEdit = (row) => {
    dialogType.value = 'edit'
    dialogVisible.value = true
    Object.assign(tagForm, row)
}

const handleDelete = (row) => {
    ElMessageBox.confirm('确定要删除该标签吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        ElMessage.success('删除成功')
    })
}

const handleStatusChange = (row, value) => {
    ElMessage.success(`${row.name} 状态已${value ? '启用' : '禁用'}`)
}

const submitTag = async () => {
    if (!formRef.value) return
    await formRef.value.validate((valid) => {
        if (valid) {
            ElMessage.success(dialogType.value === 'add' ? '新增成功' : '更新成功')
            dialogVisible.value = false
        }
    })
}

const submitBatchTags = () => {
    if (!batchForm.tags.trim()) {
        ElMessage.warning('请输入标签')
        return
    }
    const tags = batchForm.tags.split(/[,，\n]/).filter(tag => tag.trim())
    if (tags.length === 0) {
        ElMessage.warning('请输入有效的标签')
        return
    }
    ElMessage.success(`成功添加 ${tags.length} 个标签`)
    batchDialogVisible.value = false
}

// 添加 getCountType 函数
const getCountType = (count) => {
    if (count > 10) return 'danger'
    if (count > 5) return 'warning'
    return 'info'
}
</script>

<style scoped>
.tags-manage {
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

.tags-card {
    transition: all 0.3s;
}

.tags-card:hover {
    transform: translateY(-2px);
}

.tag-name {
    display: flex;
    align-items: center;
    gap: 8px;
}

.count-badge {
    transition: all 0.3s;
}

.count-badge:hover {
    transform: scale(1.1);
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

.tag-form {
    padding: 20px 0;
}

.color-preview {
    margin-top: 8px;
    padding: 8px;
    border-radius: 4px;
    text-align: center;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.form-tip {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-top: 4px;
}

.recognized-tags {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
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
    .tags-manage {
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

    .action-buttons {
        width: 100%;
    }

    .action-buttons .el-button-group {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
}
</style>