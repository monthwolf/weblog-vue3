<template>
    <div class="article-publish">
        <!-- 顶部操作栏 -->
        <div class="publish-header">
            <div class="left">

                <h2 class="title">{{ isEdit ? '编辑文章' : '发布新文章' }}</h2>
                <el-divider direction="vertical" />
            </div>
            <div class="right">
                <el-button-group>
                    <el-button @click="saveDraft" :loading="saving" :icon="DocumentAdd">
                        保存草稿
                    </el-button>
                    <el-button type="primary" @click="publishArticle" :loading="publishing" :icon="Position">
                        {{ isEdit ? '更新文章' : '发布文章' }}
                    </el-button>
                </el-button-group>
            </div>
        </div>

        <!-- 主要内容区 -->
        <div class="publish-container">
            <el-row :gutter="20">
                <!-- 左侧编辑区 -->
                <el-col :span="18">
                    <el-card class="edit-card">
                        <el-form :model="articleForm" :rules="rules" ref="formRef" label-position="top">
                            <el-form-item prop="title" class="title-input">
                                <el-input v-model="articleForm.title" placeholder="请输入文章标题..." :maxlength="100"
                                    show-word-limit size="large" />
                            </el-form-item>

                            <div class="editor-toolbar">
                                <el-space>
                                    <el-button-group>
                                        <el-button :icon="Document" :type="editorMode === 'edit' ? 'primary' : ''"
                                            @click="editorMode = 'edit'">编辑</el-button>
                                        <el-button :icon="View" :type="editorMode === 'preview' ? 'primary' : ''"
                                            @click="editorMode = 'preview'">预览</el-button>
                                    </el-button-group>
                                </el-space>
                            </div>

                            <div class="editor-wrapper">
                                <v-md-editor v-show="editorMode === 'edit'" v-model="articleForm.content"
                                    :height="editorConfig.height" :toolbar="editorConfig.toolbars"
                                    :code-highlight-extension-map="editorConfig.codeHighlightExtensionMap"
                                    @change="handleContentChange" />
                                <v-md-preview v-show="editorMode === 'preview'" :text="articleForm.content"
                                    :height="editorConfig.height" />
                            </div>
                        </el-form>
                    </el-card>
                </el-col>

                <!-- 右侧设置区 -->
                <el-col :span="6">
                    <el-card class="setting-card">
                        <el-form :model="articleForm" label-position="top">
                            <div class="setting-section">
                                <h3 class="section-title">发布信息</h3>
                                <el-form-item label="分类" prop="category">
                                    <el-select v-model="articleForm.category" class="w-full">
                                        <el-option v-for="item in categories" :key="item.id" :label="item.name"
                                            :value="item.id" />
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="标签">
                                    <el-select v-model="articleForm.tags" multiple filterable allow-create
                                        class="w-full" placeholder="请选择或输入标签">
                                        <el-option v-for="tag in tags" :key="tag" :label="tag" :value="tag" />
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="封面图">
                                    <el-upload class="cover-uploader" action="/api/upload/cover" :show-file-list="false"
                                        :on-success="handleCoverSuccess" :before-upload="beforeCoverUpload">
                                        <el-image v-if="articleForm.cover" :src="articleForm.cover" fit="cover"
                                            class="cover-image" />
                                        <div v-else class="upload-placeholder">
                                            <el-icon>
                                                <Plus />
                                            </el-icon>
                                            <span>点击上传封面</span>
                                        </div>
                                    </el-upload>
                                </el-form-item>
                            </div>

                            <el-divider />

                            <div class="setting-section">
                                <h3 class="section-title">文章设置</h3>
                                <el-form-item label="文章摘要">
                                    <el-input v-model="articleForm.summary" type="textarea" :rows="4"
                                        placeholder="请输入文章摘要，如果不输入将自动提取正文前200字" />
                                </el-form-item>

                                <el-form-item>
                                    <el-space direction="vertical" fill>
                                        <el-switch v-model="articleForm.isPublic" active-text="公开" inactive-text="私密" />
                                        <el-switch v-model="articleForm.allowComment" active-text="允许评论"
                                            inactive-text="禁止评论" />
                                        <el-switch v-model="articleForm.isTop" active-text="置顶文章"
                                            inactive-text="普通文章" />
                                    </el-space>
                                </el-form-item>
                            </div>
                        </el-form>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    ArrowLeft, DocumentAdd, Position, Picture, Grid, Link,
    Document, View, Plus, Cpu
} from '@element-plus/icons-vue'
import { formatDate } from '@/utils/date'

// 编辑器配置
const editorConfig = {
    height: 'calc(100vh - 300px)',
    toolbars: [
        'bold', 'italic', 'strikethrough', '|',
        'title', 'quote', 'ordered-list', 'unordered-list', '|',
        'code', 'code-block', 'link', 'image', '|',
        'table', 'preview', 'fullscreen'
    ],
    codeHighlightExtensionMap: {
        vue: 'xml',
        typescript: 'javascript'
    }
}

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const editorMode = ref('edit')
const lastSaveTime = ref(null)

// 状态
const isEdit = computed(() => Boolean(route.query.id))
const publishing = ref(false)
const saving = ref(false)
const aiLoading = reactive({
    title: false,
    summary: false,
    content: false
})

// 表单数据
const articleForm = reactive({
    title: '',
    content: '',
    category: '',
    tags: [],
    cover: '',
    summary: '',
    isPublic: true,
    allowComment: true,
    isTop: false
})

// 自动保存
let autoSaveTimer = null
const setupAutoSave = () => {
    autoSaveTimer = setInterval(() => {
        if (hasChanges.value) {
            saveDraft()
        }
    }, 60000) // 每分钟自动保存
}

onMounted(() => {
    setupAutoSave()
})

onBeforeUnmount(() => {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer)
    }
})

// 方法实现
const goBack = () => {
    router.back()
}

const publishArticle = async () => {
    if (!formRef.value) return
    try {
        publishing.value = true
        await formRef.value.validate()
        // 实现发布逻辑
        ElMessage.success('发布成功')
        router.push('/admin/articles')
    } catch (error) {
        ElMessage.error('请完善文章信息')
    } finally {
        publishing.value = false
    }
}

// ... 其他方法实现
</script>

<style scoped>
.article-publish {
    height: 100%;
    background-color: var(--el-bg-color-page);
}

.publish-header {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 16px 24px;
    background: white;
    border-bottom: 1px solid var(--el-border-color-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.publish-header .left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.publish-header .title {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
}

.publish-container {
    padding: 20px;
    min-height: calc(100vh - 64px);
}

.edit-card,
.setting-card {
    margin-bottom: 20px;
}

.title-input {
    margin-bottom: 20px;
}

.title-input :deep(.el-input__wrapper) {
    padding: 8px 16px;
}

.title-input :deep(.el-input__inner) {
    font-size: 24px;
    font-weight: 500;
}

.editor-toolbar {
    padding: 12px 0;
    border-bottom: 1px solid var(--el-border-color-light);
    margin-bottom: 20px;
}

.editor-wrapper {
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;
    overflow: hidden;
}

:deep(.v-md-editor) {
    background-color: var(--el-bg-color-page);
    color: var(--el-text-color-primary);
}

:deep(.v-md-editor__toolbar) {
    background-color: var(--el-bg-color-page);
    border-bottom: 1px solid var(--el-border-color-light);
}

:deep(.v-md-editor__editor-wrapper) {
    background-color: var(--el-bg-color-page);
    color: var(--el-text-color-primary);
}

:deep(.v-md-editor__preview) {
    background-color: var(--el-bg-color-page);
    color: var(--el-text-color-primary);
}

.setting-section {
    margin-bottom: 24px;
}

.section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: var(--el-text-color-primary);
}

.cover-uploader {
    width: 100%;
    height: 160px;
    border: 1px dashed var(--el-border-color);
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
}

.cover-uploader:hover {
    border-color: var(--el-color-primary);
}

.cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.upload-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-secondary);
}

/* 响应式布局 */
@media screen and (max-width: 1200px) {
    .el-row {
        margin: 0 !important;
    }

    .el-col {
        padding: 0 !important;
    }
}

@media screen and (max-width: 768px) {
    .publish-container {
        padding: 10px;
    }

    .publish-header {
        padding: 12px;
    }

    .title-input :deep(.el-input__inner) {
        font-size: 20px;
    }
}

/* 代码块样式 */
:deep(.v-md-editor__preview pre) {
    background-color: #282c34 !important;
    color: #abb2bf;
}

:deep(.v-md-editor__preview code) {
    background-color: #282c34 !important;
    color: #abb2bf;
}

/* 代码行号样式 */
:deep(.line-numbers-mode) {
    color: #999;
}

/* 代码复制按钮样式 */
:deep(.copy-code-btn) {
    background-color: var(--el-bg-color-page);
    color: var(--el-text-color-primary);
}

/* 表情面板样式 */
:deep(.v-md-emoji-picker) {
    background-color: var(--el-bg-color-page);
    color: var(--el-text-color-primary);
}

/* 任务列表样式 */
:deep(.v-md-todo-list) {
    background-color: var(--el-bg-color-page);
    color: var(--el-text-color-primary);
}
</style>