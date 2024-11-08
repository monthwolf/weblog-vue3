<template>
    <div class="blog-settings animate__animated animate__fadeIn">
        <div class="header-actions">
            <div class="left">
                <h2 class="title">博客设置</h2>
                <p class="subtitle">配置博客基本信息和功能</p>
            </div>
        </div>

        <div class="settings-content animate__animated animate__fadeInUp animation-delay-200">
            <el-card shadow="hover" class="settings-card">
                <el-tabs v-model="activeTab" class="custom-tabs">
                    <el-tab-pane label="基本设置" name="basic">
                        <el-form :model="basicForm" :rules="basicRules" ref="basicFormRef" label-width="120px">
                            <el-form-item label="博客名称" prop="blogName">
                                <el-input v-model="basicForm.blogName" placeholder="请输入博客名称" />
                            </el-form-item>
                            <el-form-item label="博客描述" prop="description">
                                <el-input type="textarea" v-model="basicForm.description" rows="3"
                                    placeholder="请输入博客描述" />
                            </el-form-item>
                            <el-form-item label="博客Logo">
                                <el-upload class="logo-uploader" action="/api/upload" :show-file-list="false"
                                    :on-success="handleLogoSuccess" :before-upload="beforeLogoUpload">
                                    <el-image v-if="basicForm.logo" :src="basicForm.logo" class="logo" fit="cover" />
                                    <div v-else class="upload-placeholder">
                                        <el-icon class="upload-icon">
                                            <Plus />
                                        </el-icon>
                                        <span>点击上传Logo</span>
                                    </div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="ICP备案号">
                                <el-input v-model="basicForm.icp" placeholder="请输入ICP备案号" />
                            </el-form-item>
                            <el-form-item label="版权信息">
                                <el-input v-model="basicForm.copyright" placeholder="请输入版权信息" />
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="评论设置" name="comment">
                        <el-form :model="commentForm" label-width="120px">
                            <el-form-item label="评论功能">
                                <el-switch v-model="commentForm.enable" />
                                <div class="form-tip">开启后访客可以对文章进行评论</div>
                            </el-form-item>
                            <el-form-item label="评论审核">
                                <el-switch v-model="commentForm.needReview" />
                                <div class="form-tip">开启后评论需要审核后才会显示</div>
                            </el-form-item>
                            <el-form-item label="评论通知">
                                <el-switch v-model="commentForm.emailNotify" />
                                <div class="form-tip">开启后将收到评论邮件通知</div>
                            </el-form-item>
                            <el-form-item label="屏蔽词">
                                <el-select v-model="commentForm.blockWords" multiple filterable allow-create
                                    default-first-option placeholder="请输入屏蔽词，回车确认" class="w-full">
                                </el-select>
                                <div class="form-tip">包含屏蔽词的评论将被自动过滤</div>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="SEO设置" name="seo">
                        <el-form :model="seoForm" label-width="120px">
                            <el-form-item label="站点标题">
                                <el-input v-model="seoForm.title" placeholder="请输入站点标题" />
                                <div class="form-tip">显示在浏览器标签页上的标题</div>
                            </el-form-item>
                            <el-form-item label="关键词">
                                <el-input v-model="seoForm.keywords" placeholder="请输入关键词，用英文逗号分隔" />
                                <div class="form-tip">用于搜索引擎优化，多个关键词用英文逗号分隔</div>
                            </el-form-item>
                            <el-form-item label="站点描述">
                                <el-input type="textarea" v-model="seoForm.description" rows="3" placeholder="请输入站点描述"
                                    show-word-limit maxlength="200" />
                                <div class="form-tip">用于搜索引擎结果页面的网站描述</div>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>

                <div class="settings-footer">
                    <el-button type="primary" @click="saveSettings" :loading="saving">
                        <el-icon>
                            <Check />
                        </el-icon>
                        保存设置
                    </el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Check } from '@element-plus/icons-vue'

const activeTab = ref('basic')
const basicFormRef = ref(null)
const saving = ref(false)

const basicForm = reactive({
    blogName: '',
    description: '',
    logo: '',
    icp: '',
    copyright: ''
})

const commentForm = reactive({
    enable: true,
    needReview: true,
    emailNotify: true,
    blockWords: []
})

const seoForm = reactive({
    title: '',
    keywords: '',
    description: ''
})

const basicRules = {
    blogName: [{ required: true, message: '请输入博客名称', trigger: 'blur' }]
}

const handleLogoSuccess = (res) => {
    basicForm.logo = res.url
    ElMessage.success('Logo上传成功')
}

const beforeLogoUpload = (file) => {
    const isImage = file.type.startsWith('image/')
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
        ElMessage.error('Logo只能是图片格式!')
    }
    if (!isLt2M) {
        ElMessage.error('Logo大小不能超过 2MB!')
    }

    return isImage && isLt2M
}

const saveSettings = async () => {
    saving.value = true
    try {
        if (activeTab.value === 'basic') {
            if (!basicFormRef.value) return
            await basicFormRef.value.validate((valid) => {
                if (valid) {
                    ElMessage.success('保存成功')
                }
            })
        } else {
            ElMessage.success('保存成功')
        }
    } finally {
        saving.value = false
    }
}
</script>

<style scoped>
.blog-settings {
    padding: 20px;
}

.header-actions {
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

.settings-card {
    transition: all 0.3s;
}

.settings-card:hover {
    transform: translateY(-2px);
}

.logo-uploader {
    border: 1px dashed var(--el-border-color);
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
    transition: all 0.3s;
}

.logo-uploader:hover {
    border-color: var(--el-color-primary);
}

.upload-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-secondary);
}

.upload-icon {
    font-size: 28px;
    margin-bottom: 8px;
}

.logo {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.form-tip {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-top: 4px;
}

.settings-footer {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid var(--el-border-color-lighter);
    text-align: center;
}

:deep(.el-tabs__nav-wrap::after) {
    height: 1px;
}

:deep(.custom-tabs .el-tabs__item) {
    font-size: 16px;
    padding: 0 20px;
}

:deep(.custom-tabs .el-tabs__item.is-active) {
    font-weight: 600;
}

/* 动画延迟类 */
.animation-delay-200 {
    animation-delay: 0.2s;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
    .blog-settings {
        padding: 10px;
    }

    .title {
        font-size: 20px;
    }

    :deep(.el-form-item) {
        margin-bottom: 20px;
    }
}

@media screen and (max-width: 576px) {
    .logo-uploader {
        width: 100%;
        height: 120px;
    }
}
</style>