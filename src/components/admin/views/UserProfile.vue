<template>
    <div class="user-profile">
        <div class="profile-container">
            <!-- 基本信息卡片 -->
            <div class="profile-card">
                <div class="card-header">
                    <el-icon class="header-icon">
                        <User />
                    </el-icon>
                    <h2>基本信息</h2>
                </div>
                <div class="card-content">
                    <div class="avatar-section">
                        <el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeAvatarUpload"
                            :on-progress="handleAvatarProgress" :on-success="handleAvatarSuccess">
                            <div class="avatar-wrapper">
                                <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
                                <img v-else :src="defaultAvatar" class="avatar" />
                                <div class="avatar-hover">
                                    <el-icon>
                                        <Camera />
                                    </el-icon>
                                    <span>更换头像</span>
                                </div>
                            </div>
                        </el-upload>
                        <div class="user-role">{{ userInfo.role }}</div>
                    </div>
                    <div class="info-list">
                        <div class="info-item">
                            <span class="label">账号</span>
                            <span class="value">{{ userInfo.nickname }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">邮箱</span>
                            <span class="value">{{ userInfo.email }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">注册时间</span>
                            <span class="value">{{ userInfo.registeredAt }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 编辑资料卡片 -->
            <div class="profile-card edit-section">
                <div class="card-header">
                    <el-icon class="header-icon">
                        <Edit />
                    </el-icon>
                    <h2>编辑资料</h2>
                </div>
                <div class="card-content">
                    <el-form :model="profileForm" label-position="top">
                        <div class="form-grid">
                            <el-form-item label="昵称">
                                <el-input v-model="profileForm.nickname" />
                            </el-form-item>
                            <el-form-item label="邮箱">
                                <el-input v-model="profileForm.email" />
                            </el-form-item>
                        </div>
                        <el-form-item label="地区">
                            <el-cascader v-model="profileForm.location" :options="locationOptions" placeholder="请选择所在地区"
                                class="w-full" />
                        </el-form-item>
                        <el-form-item label="个人简介">
                            <el-input type="textarea" v-model="profileForm.bio" :rows="4" placeholder="介绍一下自己..." />
                        </el-form-item>
                        <div class="form-actions">
                            <el-button @click="resetForm">重置</el-button>
                            <el-button type="primary" @click="saveProfile">保存更改</el-button>
                        </div>
                    </el-form>
                </div>
            </div>

            <!-- 数据统计卡片 -->
            <div class="profile-card stats-section">
                <div class="card-header">
                    <el-icon class="header-icon">
                        <Document />
                    </el-icon>
                    <h2>数据统计</h2>
                </div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <el-icon>
                            <Document />
                        </el-icon>
                        <div class="stat-info">
                            <div class="stat-value">{{ userStats.articles }}</div>
                            <div class="stat-label">文章</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <el-icon>
                            <ChatDotRound />
                        </el-icon>
                        <div class="stat-info">
                            <div class="stat-value">{{ userStats.comments }}</div>
                            <div class="stat-label">评论</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <el-icon>
                            <View />
                        </el-icon>
                        <div class="stat-info">
                            <div class="stat-value">{{ userStats.views }}</div>
                            <div class="stat-label">浏览</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <el-icon>
                            <Star />
                        </el-icon>
                        <div class="stat-info">
                            <div class="stat-value">{{ userStats.likes }}</div>
                            <div class="stat-label">获赞</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 安全设置卡片 -->
            <div class="profile-card security-section">
                <div class="card-header">
                    <el-icon class="header-icon">
                        <Lock />
                    </el-icon>
                    <h2>安全设置</h2>
                </div>
                <div class="card-content">
                    <div class="security-grid">
                        <!-- 密码修改部分 -->
                        <div class="security-item">
                            <div class="security-header">
                                <div class="flex items-center gap-2">
                                    <el-icon class="text-purple-600">
                                        <Lock />
                                    </el-icon>
                                    <h3 class="text-lg font-medium">修改密码</h3>
                                </div>
                                <p class="text-sm text-gray-500 mt-1">建议定期更换密码，确保账号安全</p>
                            </div>
                            <el-form :model="passwordForm" class="security-form">
                                <el-form-item>
                                    <el-input v-model="passwordForm.currentPassword" type="password" placeholder="当前密码"
                                        :prefix-icon="Lock" show-password class="security-input" />
                                </el-form-item>
                                <el-form-item>
                                    <el-input v-model="passwordForm.newPassword" type="password" placeholder="新密码"
                                        :prefix-icon="Lock" show-password class="security-input" />
                                </el-form-item>
                                <el-form-item>
                                    <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="确认新密码"
                                        :prefix-icon="Lock" show-password class="security-input" />
                                </el-form-item>
                                <el-button type="primary" @click="changePassword" class="security-button">
                                    <el-icon class="mr-1">
                                        <Check />
                                    </el-icon>
                                    确认修改
                                </el-button>
                            </el-form>
                        </div>

                        <!-- 邮箱验证部分 -->
                        <div class="security-item">
                            <div class="security-header">
                                <div class="flex items-center gap-2">
                                    <el-icon class="text-purple-600">
                                        <Message />
                                    </el-icon>
                                    <h3 class="text-lg font-medium">邮箱验证</h3>
                                </div>
                                <p class="text-sm text-gray-500 mt-1">验证邮箱以提升账号安全性</p>
                            </div>
                            <div class="email-verify-content">
                                <div class="verify-status">
                                    <el-icon :class="[
                                        'status-icon',
                                        userInfo.isEmailVerified ? 'text-green-500' : 'text-orange-500'
                                    ]">
                                        <CircleCheck v-if="userInfo.isEmailVerified" />
                                        <Warning v-else />
                                    </el-icon>
                                    <div class="status-info">
                                        <span class="text-gray-700 dark:text-gray-200">{{ userInfo.email }}</span>
                                        <span class="text-sm"
                                            :class="userInfo.isEmailVerified ? 'text-green-500' : 'text-orange-500'">
                                            {{ userInfo.isEmailVerified ? '已验证' : '未验证' }}
                                        </span>
                                    </div>
                                </div>
                                <el-button :type="userInfo.isEmailVerified ? 'success' : 'primary'"
                                    @click="sendVerificationEmail" class="verify-button">
                                    <el-icon class="mr-1">
                                        <Message v-if="!userInfo.isEmailVerified" />
                                        <Check v-else />
                                    </el-icon>
                                    {{ userInfo.isEmailVerified ? '已验证' : '发送验证' }}
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.user-profile {
    @apply min-h-screen bg-gray-50 p-4 md:p-6;
    background-color: var(--el-bg-color-page);
    color: var(--el-text-color-primary);
}

:deep(.dark) .user-profile {
    background-color: #1f1f1f;
    color: #e0e0e0;
}

.profile-container {
    @apply max-w-7xl mx-auto grid gap-6;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.profile-card {
    @apply bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300;
}

.profile-card:hover {
    @apply shadow-md;
}

.card-header {
    @apply flex items-center gap-3 p-4 border-b border-gray-100;
}

.header-icon {
    @apply text-xl text-purple-600;
}

.card-header h2 {
    @apply text-lg font-medium text-gray-800;
}

.card-content {
    @apply p-6;
}

/* 头像部分样式 */
.avatar-section {
    @apply flex flex-col items-center gap-4 mb-6;
}

.avatar-wrapper {
    @apply relative w-24 h-24 rounded-full overflow-hidden cursor-pointer;
}

.avatar {
    @apply w-full h-full object-cover;
}

.avatar-hover {
    @apply absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 transition-opacity duration-300;
}

.avatar-wrapper:hover .avatar-hover {
    @apply opacity-100;
}

.user-role {
    @apply px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium;
}

/* 信息列表样式 */
.info-list {
    @apply space-y-4;
}

.info-item {
    @apply flex justify-between items-center;
}

.info-item .label {
    @apply text-gray-500;
}

.info-item .value {
    @apply text-gray-800 font-medium;
}

/* 表单样式 */
.form-grid {
    @apply grid md:grid-cols-2 gap-4;
}

.form-actions {
    @apply flex justify-end gap-3 mt-6;
}

/* 统计卡片样式 */
.stats-grid {
    @apply grid grid-cols-2 gap-4 p-4;
}

.stat-item {
    @apply flex items-center gap-4 p-4 rounded-lg bg-gray-50 transition-all duration-300;
}

.stat-item:hover {
    @apply bg-purple-50 transform -translate-y-1;
}

.stat-item .el-icon {
    @apply text-2xl text-purple-600;
}

.stat-info {
    @apply flex flex-col;
}

.stat-value {
    @apply text-xl font-semibold text-gray-800;
}

.stat-label {
    @apply text-sm text-gray-500;
}

/* 响应式调整 */
@media (min-width: 1024px) {
    .edit-section {
        @apply col-span-2;
    }
}

@media (max-width: 768px) {
    .profile-container {
        @apply grid-cols-1;
    }

    .form-grid {
        @apply grid-cols-1;
    }

    .stats-grid {
        @apply grid-cols-2;
    }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
    .user-profile {
        @apply bg-gray-900;
    }

    .profile-card {
        @apply bg-gray-800 border-gray-700;
    }

    .card-header {
        @apply border-gray-700;
    }

    .card-header h2 {
        @apply text-gray-200;
    }

    .info-item .label {
        @apply text-gray-400;
    }

    .info-item .value {
        @apply text-gray-200;
    }

    .stat-item {
        @apply bg-gray-700;
    }

    .stat-value {
        @apply text-gray-200;
    }

    .stat-label {
        @apply text-gray-400;
    }

    .security-item {
        @apply bg-gray-700;
    }
}

.security-section {
    @apply col-span-2;
}

.security-item {
    @apply p-4 rounded-lg bg-gray-50;
}

.security-header {
    @apply mb-4;
}

/* 安全设置卡片样式 */
.security-grid {
    @apply grid gap-6 lg:grid-cols-2;
}

.security-item {
    @apply bg-gray-50 dark:bg-gray-700 rounded-xl p-6 transition-all duration-300;
}

.security-item:hover {
    @apply shadow-md transform -translate-y-1;
}

.security-header {
    @apply mb-6;
}

.security-form {
    @apply space-y-4;
}

.security-form :deep(.el-input__wrapper) {
    @apply bg-white dark:bg-gray-600 border-0 shadow-sm hover:shadow transition-shadow;
}

.security-form :deep(.el-input__wrapper.is-focus) {
    @apply ring-2 ring-purple-200 dark:ring-purple-900;
}

.security-button {
    @apply w-full flex items-center justify-center gap-1 mt-2;
}

.email-verify-content {
    @apply mt-6 space-y-4;
}

.verify-status {
    @apply flex items-center gap-4 p-4 bg-white dark:bg-gray-600 rounded-lg;
}

.status-icon {
    @apply text-2xl;
}

.status-info {
    @apply flex flex-col;
}

.verify-button {
    @apply w-full flex items-center justify-center gap-1;
}

/* 响应式调整 */
@media (max-width: 1024px) {
    .security-grid {
        @apply grid-cols-1;
    }
}

/* 暗色模式额外调整 */
:deep(.dark) .security-item {
    @apply bg-gray-800;
}

:deep(.dark) .verify-status {
    @apply bg-gray-700;
}

/* Element Plus 弹窗样式重写 */
.el-message-box {
    @apply rounded-lg border-0 shadow-xl !important;
}

.el-message-box__header {
    @apply p-4 border-b border-gray-100 dark:border-gray-700 !important;
}

.el-message-box__title {
    @apply text-lg font-medium text-gray-800 dark:text-gray-200 !important;
}

.el-message-box__content {
    @apply p-4 text-gray-600 dark:text-gray-300 !important;
}

.el-message-box__btns {
    @apply p-4 border-t border-gray-100 dark:border-gray-700 !important;
}

/* 暗色模式适配 */
html.dark {
    .el-message-box {
        @apply bg-gray-800 !important;
    }

    .el-message-box__header {
        @apply bg-gray-800 !important;
    }

    .el-message-box__headerbtn .el-message-box__close {
        @apply text-gray-400 hover:text-gray-200 !important;
    }

    .el-message-box__content {
        @apply bg-gray-800 !important;
    }

    .el-message-box__btns {
        @apply bg-gray-800 !important;
    }

    .el-button--default {
        @apply bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 !important;
    }

    .el-button--primary {
        @apply bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:border-purple-700 !important;
    }
}

/* 消息提示样式优化 */
.el-message {
    @apply rounded-lg border-0 shadow-lg !important;
}

.el-message--success {
    @apply bg-green-50 dark:bg-green-900/50 !important;
}

.el-message--warning {
    @apply bg-yellow-50 dark:bg-yellow-900/50 !important;
}

.el-message--error {
    @apply bg-red-50 dark:bg-red-900/50 !important;
}

.el-message--info {
    @apply bg-blue-50 dark:bg-blue-900/50 !important;
}

/* 弹窗动画优化 */
.el-message-box {
    animation: messageBoxIn 0.3s ease-out !important;
}

@keyframes messageBoxIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 遮罩层样式优化 */
.v-modal {
    @apply backdrop-blur-sm bg-black/50 !important;
}

/* 弹窗容器样式 */
.el-message-box__wrapper {
    @apply flex items-center justify-center;
}

.el-message-box {
    @apply w-[96%] max-w-md mx-auto rounded-xl border-0 shadow-2xl !important;
    animation: dialogFadeIn 0.3s ease-out;
}

/* 弹窗头部样式 */
.el-message-box__header {
    @apply p-5 border-b !important;
}

.el-message-box__title {
    @apply text-lg font-semibold !important;
}

.el-message-box__headerbtn {
    @apply top-5 right-5 !important;
}

/* 弹窗内容样式 */
.el-message-box__content {
    @apply p-5 !important;
}

.el-message-box__message {
    @apply text-base leading-relaxed !important;
}

/* 弹窗按钮样式 */
.el-message-box__btns {
    @apply p-5 pt-3 flex gap-3 !important;
}

.el-message-box__btns .el-button {
    @apply flex-1 h-10 !important;
}

/* 消息提示样式 */
.el-message {
    @apply min-w-[300px] rounded-lg border-0 shadow-lg !important;
    animation: messageFadeInDown 0.3s ease-out;
}

/* 暗色模式适配 */
.dark .el-message-box {
    @apply bg-gray-800 !important;
}

.dark .el-message-box__header {
    @apply border-gray-700 !important;
}

.dark .el-message-box__title {
    @apply text-gray-100 !important;
}

.dark .el-message-box__content {
    @apply text-gray-300 !important;
}

.dark .el-message-box__btns {
    @apply border-t border-gray-700 !important;
}

.dark .el-button--default {
    @apply bg-gray-700 text-gray-200 border-gray-600 !important;
}

.dark .el-button--default:hover {
    @apply bg-gray-600 border-gray-500 !important;
}

.dark .el-button--primary {
    @apply bg-purple-600 border-purple-600 !important;
}

.dark .el-button--primary:hover {
    @apply bg-purple-700 border-purple-700 !important;
}

/* 遮罩层样式 */
.v-modal {
    @apply backdrop-blur-sm !important;
    animation: fadeIn 0.3s ease-out;
}

/* 动画效果 */
@keyframes dialogFadeIn {
    from {
        opacity: 0;
        transform: translate3d(0, -30px, 0);
    }

    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

@keyframes messageFadeInDown {
    from {
        opacity: 0;
        transform: translate3d(0, -100%, 0);
    }

    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* 消息类型样式 */
.el-message--success {
    @apply bg-green-50 border-l-4 border-green-500 !important;
}

.el-message--warning {
    @apply bg-yellow-50 border-l-4 border-yellow-500 !important;
}

.el-message--error {
    @apply bg-red-50 border-l-4 border-red-500 !important;
}

.el-message--info {
    @apply bg-blue-50 border-l-4 border-blue-500 !important;
}

.dark .el-message {
    @apply border-l-4 !important;
}

.dark .el-message--success {
    @apply bg-green-900/30 !important;
}

.dark .el-message--warning {
    @apply bg-yellow-900/30 !important;
}

.dark .el-message--error {
    @apply bg-red-900/30 !important;
}

.dark .el-message--info {
    @apply bg-blue-900/30 !important;
}
</style>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    Camera, Message, Location, Timer, Clock, Lock,
    Document, ChatDotRound, View, Star, User, Edit,
    Check, CircleCheck, Warning
} from '@element-plus/icons-vue'

// 用户基本信息（增加了更多字段）
const userInfo = reactive({
    nickname: '张三',
    avatar: '',
    role: '管理员',
    email: 'zhangsan@example.com',
    location: '北京市',
    lastLogin: '2024-01-15 14:30:45',
    registeredAt: '2023-06-01 10:00:00',
    level: 3,
    isVerified: true,
    isEmailVerified: false,
    lastUpdateTime: '2024-01-20 15:30:45'
})

// 密码表单
const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

// 邮箱验证表单
const emailVerifyForm = reactive({
    email: userInfo.email
})

// 修改密码方法
const changePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        ElMessage({
            message: '两次输入的密码不一致',
            type: 'error',
            duration: 3000,
            showClose: true,
            center: true
        })
        return
    }

    ElMessageBox.confirm('确定要修改密码吗？修改后需要重新登录。', '修改密码', {
        confirmButtonText: '确认修改',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        showClose: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '修改中...'
                setTimeout(() => {
                    instance.confirmButtonLoading = false
                    ElMessage({
                        type: 'success',
                        message: '密码修改成功，请重新登录',
                        center: true,
                        duration: 2000
                    })
                    passwordForm.currentPassword = ''
                    passwordForm.newPassword = ''
                    passwordForm.confirmPassword = ''
                    done()
                }, 1000)
            } else {
                done()
            }
        }
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消密码修改',
            center: true
        })
    })
}

// 发送验证邮件
const sendVerificationEmail = () => {
    ElMessageBox.confirm(
        `确定要向 ${emailVerifyForm.email} 发送验证邮件吗？`,
        '发送验证邮件',
        {
            confirmButtonText: '发送',
            cancelButtonText: '取消',
            type: 'info',
            center: true,
            showClose: true,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    instance.confirmButtonText = '发送中...'
                    setTimeout(() => {
                        instance.confirmButtonLoading = false
                        ElMessage({
                            type: 'success',
                            message: '验证邮件已发送，请查收',
                            center: true,
                            duration: 2000
                        })
                        done()
                    }, 1000)
                } else {
                    done()
                }
            }
        }
    ).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消发送',
            center: true
        })
    })
}

// 用户活动统计
const userStats = reactive({
    articles: 42,
    comments: 128,
    views: 5672,
    likes: 256
})

// 个人信息表单
const profileForm = reactive({
    nickname: userInfo.nickname,
    email: userInfo.email,
    location: [],
    bio: ''
})

// 位置选择选项
const locationOptions = [
    {
        value: '北京',
        label: '北京',
        children: [
            { value: '海淀区', label: '海淀区' },
            { value: '朝阳区', label: '朝阳区' }
        ]
    },
    {
        value: '上海',
        label: '上海',
        children: [
            { value: '浦东新区', label: '浦东新区' },
            { value: '徐汇区', label: '徐汇区' }
        ]
    }
]

// 头像上传相关
const defaultAvatar = '/default-avatar.png'
const uploading = ref(false)
const uploadProgress = ref(0)

// 头像上传前校验
const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('头像只能是 JPG 或 PNG 格式!')
        return false
    }
    if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像大小不能超过 2MB!')
        return false
    }
    return true
}

// 头像上传进度
const handleAvatarProgress = (event, file) => {
    uploading.value = true
    uploadProgress.value = Math.round(event.percent)
}

// 头像上传成功
const handleAvatarSuccess = (response, file) => {
    userInfo.avatar = URL.createObjectURL(file.raw)
    uploading.value = false
    uploadProgress.value = 0
    ElMessage.success('头像上传成功')
}

// 保存个人信息
const saveProfile = () => {
    ElMessageBox.confirm(
        '确定要保存个人信息吗?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        // 模拟保存操作
        userInfo.nickname = profileForm.nickname
        userInfo.email = profileForm.email
        userInfo.location = profileForm.location.join(' ')

        ElMessage.success('个人信息保存成功')
    }).catch(() => {
        ElMessage.info('已取消保存')
    })
}

// 重置表单
const resetForm = () => {
    profileForm.nickname = userInfo.nickname
    profileForm.email = userInfo.email
    profileForm.location = []
    profileForm.bio = ''
}

// 页面加载时获取用户信息
onMounted(() => {
    // 这里可以添加获取用户信息的接口调用
    console.log('页面加载，获取用户信息')
})
</script>