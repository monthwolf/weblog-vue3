<template>
    <div class="tags-manage animate__animated animate__fadeIn">
        <div class="header-actions">
            <div class="left">
                <h2 class="title">标签管理</h2>
                <p class="subtitle">共 {{ totalTags }} 个标签</p>
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
        <div class="search-bar">
            <el-input v-model="searchName" placeholder="搜索标签名称" clearable>
                <template #prefix>
                    <el-icon>
                        <Search />
                    </el-icon>
                </template>
            </el-input>
            <el-date-picker v-model="searchDateRange" type="daterange" placeholder="选择创建日期" value-format="YYYY-MM-DD"
                start-placeholder="开始日期" end-placeholder="结束日期" class="date-picker" :shortcuts="shortcuts" />
            <el-button type="primary" @click="handleSearch">
                <el-icon>
                    <Search />
                </el-icon>
                搜索
            </el-button>
            <el-button @click="resetSearch">
                <el-icon>
                    <Refresh />
                </el-icon>
                重置
            </el-button>
        </div>
        <div class="tags-content animate__animated animate__fadeInUp animation-delay-200">
            <el-card shadow="hover" class="tags-card">
                <el-table :data="tagsList" style="width: 100%" v-loading="loading" :stripe="true" :border="true">
                    <el-table-column prop="name" label="标签名称">
                        <template #default="{ row }">
                            <div class="tag-name">
                                <div class="color-block" :style="{ backgroundColor: row.color }"></div>
                                <el-tag :style="getTagStyle(row.color)" effect="plain">
                                    {{ row.name }}
                                </el-tag>
                            </div>
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

                <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :total="totalTags" layout="total, prev, pager, next, jumper, sizes"
                    :page-sizes="[5, 10, 20, 30, 50]" @size-change="handleSizeChange" />
            </el-card>
        </div>

        <!-- 新增/编辑标签对话框 -->
        <FormDialog :title="dialogType === 'add' ? '新增标签' : '编辑标签'" v-model="dialogVisible" :model="tagForm"
            :rules="rules" @submit="submitTag" :loading="submitting" @cancel="closeDialog">
            <template #content>
                <el-form-item label="标签名称" prop="name">
                    <el-input v-model="tagForm.name" placeholder="请输入标签名称" :maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item label="标签颜色">
                    <el-color-picker v-model="tagForm.color" show-alpha :predefine="predefineColors" />
                    <div class="color-preview" :style="{ background: tagForm.color }">
                        预览效果
                    </div>
                </el-form-item>
            </template>
        </FormDialog>

        <!-- 批量添加对话框 -->
        <FormDialog title="批量添加标签" v-model="batchDialogVisible" :model="batchForm" @submit="submitBatchTags"
            :rules="rules" :loading="batchSubmitting" @cancel="closeDialog">
            <template #content>
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
            </template>
        </FormDialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Files, Timer, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { shortcuts } from '@/composables/utils'
import { getTagsList, deleteTag, updateTag, addTags, updateTagStatus } from '@/api/admin/tag'
import { formatDate } from '@/composables/date'
import FormDialog from '@/components/admin/common/FormDialog.vue'

const loading = ref(false)
const submitting = ref(false)
const batchSubmitting = ref(false)
const dialogVisible = ref(false)
const batchDialogVisible = ref(false)
const dialogType = ref('add')
const rules = {
    name: [{ required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
    ],
    color: [{ required: true, message: '请选择标签颜色', trigger: 'blur' }]
}

const tagForm = reactive({
    name: '',
    color: '#409EFF',
})

const batchForm = reactive({
    tags: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const totalTags = ref(0)
const tagsList = ref([])
const searchName = ref('')
const searchDateRange = ref([])

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

// 生成随机颜色
const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

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

const fetchTags = async (page = 1) => {
    loading.value = true
    const response = await getTagsList({ current: page, size: pageSize.value });
    tagsList.value = response.data
    totalTags.value = response.total
    loading.value = false
}
const handleSearch = async () => {
    loading.value = true
    const response = await getTagsList({
        current: currentPage.value,
        size: pageSize.value,
        name: searchName.value,
        startDate: searchDateRange.value[0],
        endDate: searchDateRange.value[1]
    });
    tagsList.value = response.data
    totalTags.value = response.total
    loading.value = false
}

const resetSearch = () => {
    searchName.value = ''
    searchDateRange.value = []
    handleSearch()
}

const handleSizeChange = (size) => {
    pageSize.value = size
    fetchTags(currentPage.value)
}

const handleCurrentChange = (page) => {
    currentPage.value = page
    fetchTags(currentPage.value)
}

onMounted(() => {
    fetchTags(currentPage.value)
})

const showAddDialog = () => {
    dialogType.value = 'add'
    dialogVisible.value = true
    if (tagForm.value) {
        resetTagForm()
    }
}

const handleBatchAdd = () => {
    batchDialogVisible.value = true
    resetBatchForm()
}

const closeDialog = () => {
    dialogVisible.value = false
    batchDialogVisible.value = false
}

const handleEdit = (row) => {
    dialogType.value = 'edit'
    dialogVisible.value = true
    Object.assign(tagForm, row)
}

const handleDelete = async (row) => {
    ElMessageBox.confirm('确定要删除该标签吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        await deleteTag(row.id)
        ElMessage.success('删除成功')
        fetchTags(currentPage.value)
    })
}

const resetTagForm = () => {
    Object.assign(tagForm, {
        name: '',
        color: '#409EFF',
    })
}

const resetBatchForm = () => {
    Object.assign(batchForm, {
        tags: ''
    })
}

const handleStatusChange = async (row) => {
    await updateTagStatus(row.id)
    fetchTags(currentPage.value)
}

const submitTag = async (formData) => {
    if (dialogType.value === 'add') {
        await addTags([tagForm])
        ElMessage.success('新增成功')
    } else {
        await updateTag(tagForm.id, tagForm.name, tagForm.color)
        ElMessage.success('更新成功')
    }
    // 清空表单
    resetTagForm()
    dialogVisible.value = false
    fetchTags(currentPage.value)
}

const submitBatchTags = async () => {
    if (!batchForm.tags.trim()) {
        ElMessage.warning('请输入标签')
        return
    }

    const tags = recognizedTags.value.map(tag => ({ name: tag, color: getRandomColor() }));
    if (tags.length === 0) {
        ElMessage.warning('请输入有效的标签')
        return
    }
    await addTags(tags)
    ElMessage.success(`成功添加 ${tags.length} 个标签`)
    batchDialogVisible.value = false
    resetBatchForm()
    fetchTags(currentPage.value)
}

// 修改 getTagStyle 函数
const getTagStyle = (color) => {
    // 将颜色转换为 RGB 值
    const rgb = color.replace(/^#/, '').match(/.{2}/g)
        ?.map(x => parseInt(x, 16))
        .join(',');

    return {
        '--tag-color': rgb,
        borderColor: color
    };
};
</script>

<style lang="scss" scoped>
.tags-manage {
    height: 100%;
    width: 100%;
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

.search-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px;
    background: var(--el-bg-color-overlay);
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    .el-input {
        max-width: 300px;
    }

    .date-picker {
        width: 360px;
    }

    .el-button {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 16px;

        .el-icon {
            margin-right: 4px;
        }

        &:hover {
            transform: translateY(-1px);
        }
    }
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

    .color-block {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.2);
        }
    }

    .el-tag {
        background-color: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary-light-8);
        color: var(--el-color-primary);

        &.el-tag--plain {
            background-color: transparent;
            border-color: currentColor;

            &[style*="background-color"] {
                background-color: rgba(var(--tag-color), 0.1) !important;
                color: rgb(var(--tag-color)) !important;
                border: 1px solid rgba(var(--tag-color), 0.2) !important;
            }
        }
    }
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

    .search-bar {
        flex-direction: column;
        padding: 12px;

        .el-input,
        .date-picker {
            width: 100%;
            max-width: none;
        }

        .el-button {
            width: 100%;
            justify-content: center;
        }
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

/* 保持现有样式不变，添加以下暗色模式样式 */
.dark {
    .tags-manage {
        background-color: #111827;
    }

    .title {
        color: #e5e7eb;
    }

    .subtitle {
        color: #9ca3af;
    }

    .search-bar {
        background-color: #1f2937;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    }

    .tags-card {
        background-color: #1f2937;
        border-color: #374151;

        &:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        }
    }

    .tag-name {
        .color-block {
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .el-tag {
            background-color: rgba(var(--el-color-primary-rgb), 0.1);
            border-color: rgba(var(--el-color-primary-rgb), 0.2);
            color: var(--el-color-primary-light-3);

            &.el-tag--plain {
                background-color: transparent;

                &[style*="background-color"] {
                    color: var(--el-text-color-primary) !important;
                    background-color: rgba(255, 255, 255, 0.1) !important;
                    border-color: currentColor;
                }
            }
        }
    }

    .time-cell {
        color: #9ca3af;
    }

    :deep(.el-table) {
        background-color: #1f2937;
        color: #d1d5db;

        th.el-table__cell {
            background-color: #374151;
        }

        .el-table__cell {
            border-color: #374151;
        }

        tr:hover>td.el-table__cell {
            background-color: #374151;
        }
    }

    :deep(.el-switch__core) {
        background-color: #4b5563;

        .el-switch__action {
            background-color: #d1d5db;
        }
    }

    .tag-dialog {
        :deep(.el-dialog) {
            background-color: #1f2937;
        }

        :deep(.el-dialog__header) {
            border-color: #374151;
        }

        :deep(.el-dialog__body) {
            color: #d1d5db;
        }

        :deep(.el-form-item__label) {
            color: #d1d5db;
        }

        :deep(.el-input__wrapper) {
            background-color: #374151;
            border-color: #4b5563;
        }

        :deep(.el-textarea__inner) {
            background-color: #374151;
            color: #d1d5db;
        }

        .color-preview {
            border-color: #4b5563;
        }

        .form-tip {
            color: #9ca3af;
        }
    }

    .recognized-tags {
        :deep(.el-tag) {
            background-color: var(--el-bg-color-overlay);
            border-color: var(--border-color);
            color: var(--el-text-color-primary);

            .el-tag__close {
                color: var(--el-text-color-secondary);

                &:hover {
                    background-color: var(--hover-bg);
                    color: var(--el-text-color-primary);
                }
            }
        }
    }
}
</style>