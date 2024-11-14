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
                                <img v-else :src="getAssetsFile('default-avatar.png')" class="avatar" />
                                <div class="avatar-hover">
                                    <el-icon>
                                        <Camera />
                                    </el-icon>
                                    <span>更换头像</span>
                                </div>
                            </div>
                        </el-upload>
                        <div class="flex flex-wrap gap-2 w-full justify-center">
                            <div class="user-role" v-for="role in userInfo.roles" :key="role">{{ role }}</div>
                        </div>
                    </div>
                    <div class="info-list">
                        <div class="info-item">
                            <span class="label">账号</span>
                            <span class="value">{{ userInfo.username }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">邮箱</span>
                            <span class="value">{{ userInfo.email || '未填写' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">注册时间</span>
                            <span class="value">{{ userInfo.createTime }}</span>
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
                    <el-form :model="profileForm" label-position="top" :rules="profileRules" ref="profileFormRef">
                        <div class="form-grid">
                            <el-form-item label="昵称" prop="username">
                                <el-input v-model="profileForm.username" />
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
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
                            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef"
                                class="security-form">
                                <el-form-item prop="currentPassword">
                                    <el-input v-model="passwordForm.currentPassword" type="password" placeholder="当前密码"
                                        :prefix-icon="Lock" show-password class="security-input" />
                                </el-form-item>
                                <el-form-item prop="newPassword">
                                    <el-input v-model="passwordForm.newPassword" type="password" placeholder="新密码"
                                        :prefix-icon="Lock" show-password class="security-input"
                                        @input="checkPasswordStrength" />
                                    <div class="password-strength-container w-full">
                                        <div class="password-strength-text h-full">{{ passwordStrengthText }}</div>
                                        <div class="password-strength-bar w-full">
                                            <div :style="{ width: passwordStrengthPercentage + '%', background: passwordStrengthGradient }"
                                                class="strength-bar"></div>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item prop="confirmPassword">
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
                                        userInfo.isActive ? 'text-green-500' : 'text-orange-500'
                                    ]">
                                        <CircleCheck v-if="userInfo.isActive" />
                                        <Warning v-else />
                                    </el-icon>
                                    <div class="status-info">
                                        <span class="text-gray-700 dark:text-gray-200">{{ userInfo.email || '未填写'
                                            }}</span>
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

/* 头像部分 */
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
    @apply text-gray-800;
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

/* 安全设置样式 */
.security-section {
    @apply col-span-2;
}

.security-item {
    @apply p-4 rounded-lg bg-gray-50;
}

.security-header {
    @apply mb-4;
}

.security-grid {
    @apply grid gap-6 lg:grid-cols-2;
}

.security-item {
    @apply bg-gray-50 rounded-xl p-6 transition-all duration-300;
}

.security-item:hover {
    @apply shadow-md transform -translate-y-1;
}

.security-form {
    @apply space-y-4;
}

.security-form :deep(.el-input__wrapper) {
    @apply bg-white border-0 shadow-sm hover:shadow transition-shadow;
}

.security-form :deep(.el-input__wrapper.is-focus) {
    @apply ring-2 ring-purple-200;
}

.security-button {
    @apply w-full flex items-center justify-center gap-1 mt-2;
}

.email-verify-content {
    @apply mt-6 space-y-4;
}

.verify-status {
    @apply flex items-center gap-4 p-4 bg-white rounded-lg;
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

/* 移除重复的暗色模式样式，只保留组件特定的暗色样式 */
.dark {
    .user-profile {
        @apply bg-gray-900;
    }

    /* 特定于用户资料的暗色样式 */
    .user-role {
        @apply bg-purple-900/30 text-purple-300;
    }

    .security-form :deep(.el-input__wrapper.is-focus) {
        @apply ring-purple-900;
    }

    .password-strength-bar {
        @apply bg-gray-700;
    }

    /* 数据统计卡片样式 */
    .stat-item {
        background-color: #1f2937;
        border: 1px solid #374151;

        &:hover {
            background-color: rgba(139, 92, 246, 0.1);
            transform: translateY(-5px);
        }

        .el-icon {
            color: #a78bfa;
        }
    }

    .stat-value {
        color: #e5e7eb;
    }

    .stat-label {
        color: #9ca3af;
    }

    .stats-header {
        color: #9ca3af;
    }

    .stats-number {
        color: #a78bfa;
    }

    .stats-label {
        color: #9ca3af;
    }

    .stats-card {
        &:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
    }
}

/* Element Plus 窗式重写 */
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

/* 基础样式 */
.el-message-box {
    @apply rounded-lg border-0 shadow-xl !important;
}

.el-message-box__header {
    @apply p-5 border-b border-gray-100 !important;
}

.el-message-box__title {
    @apply text-lg font-semibold text-gray-800 !important;
}

.el-message-box__headerbtn .el-message-box__close {
    @apply text-gray-500 hover:text-gray-700 !important;
}

.el-message-box__content {
    @apply p-5 bg-white text-gray-600 !important;
}

.el-message-box__btns {
    @apply p-5 pt-3 flex gap-3 bg-white border-t border-gray-100 !important;
}

.el-button--default {
    @apply bg-white text-gray-700 border-gray-300 hover:bg-gray-50 !important;
}

.el-button--primary {
    @apply bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:border-purple-700 !important;
}

/* 消息提示样式 */
.el-message {
    @apply min-w-[300px] rounded-lg border-0 shadow-lg !important;
    animation: messageFadeInDown 0.3s ease-out;
}

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

/* 暗色模式适配 */
.dark {
    .el-message-box {
        @apply bg-gray-800 !important;
    }

    .el-message-box__header {
        @apply border-gray-700 !important;
    }

    .el-message-box__title {
        @apply text-gray-100 !important;
    }

    .el-message-box__headerbtn .el-message-box__close {
        @apply text-gray-400 hover:text-gray-200 !important;
    }

    .el-message-box__content {
        @apply bg-gray-800 text-gray-300 !important;
    }

    .el-message-box__btns {
        @apply bg-gray-800 border-gray-700 !important;
    }

    .el-button--default {
        @apply bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 !important;
    }

    .el-button--primary {
        @apply bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:border-purple-700 !important;
    }

    .el-message {
        @apply border-l-4 !important;
    }

    .el-message--success {
        @apply bg-green-900/30 !important;
    }

    .el-message--warning {
        @apply bg-yellow-900/30 !important;
    }

    .el-message--error {
        @apply bg-red-900/30 !important;
    }

    .el-message--info {
        @apply bg-blue-900/30 !important;
    }
}

/* 遮罩与动画 */
.v-modal {
    @apply backdrop-blur-sm bg-black/30 !important;
    animation: fadeIn 0.3s ease-out;
}

.el-message-box__wrapper {
    @apply flex items-center justify-center;
}

.el-message-box {
    @apply w-[96%] max-w-md mx-auto !important;
    animation: dialogFadeIn 0.3s ease-out;
}

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

/* 添加日间和夜间模式支持 */
:deep(.avatar-uploader) {
    background-color: var(--el-bg-color-page);
    color: var(--el-text-color-primary);
}

:deep(.avatar-hover) {
    @apply dark:bg-black/50 bg-gray-100/80;
    @apply dark:text-white text-gray-700;
}

:deep(.info-item .label) {
    color: var(--el-text-color-secondary);
}

:deep(.info-item .value) {
    color: var(--el-text-color-primary);
}

:deep(.security-item) {
    background-color: var(--el-bg-color-page);
    color: var(--el-text-color-primary);
    @apply dark:border-gray-700 border-gray-200;
}

:deep(.verify-status) {
    background-color: var(--el-bg-color-page);
    color: var(--el-text-color-primary);
    @apply dark:border-gray-700 border-gray-200;
}

:deep(.status-icon) {
    color: var(--el-color-primary);
}

:deep(.verify-button) {
    background-color: var(--el-bg-color-page);
    color: var(--el-text-color-primary);
    @apply hover:bg-gray-100 dark:hover:bg-gray-700;
}

.password-strength-container {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 5px;
    margin-top: 5px;
}

.password-strength-text {
    color: var(--el-text-color-secondary);
}

.security-form {
    @apply space-y-4;
}

.el-progress {
    margin-top: 5px;
    height: 8px;
    border-radius: 4px;
}

.el-progress-bar__inner {
    transition: width 0.3s ease;
}

.password-strength-bar {
    height: 5px;
    @apply dark:bg-gray-700 bg-gray-200;
    border-radius: 4px;
    overflow: hidden;
}

.strength-bar {
    height: 100%;
    transition: width 0.3s ease, background 0.3s ease;
}

/* 暗色模式样式 */
.dark {
    .user-profile {
        background-color: #111827;
    }

    .profile-card {
        background-color: #1f2937;
        border-color: #374151;

        &:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        }
    }

    .card-header {
        border-color: #374151;

        h2 {
            color: #e5e7eb;
        }

        .header-icon {
            color: #a78bfa;
        }
    }

    .avatar-section {
        .avatar-wrapper {
            background-color: #374151;
        }

        .avatar-hover {
            background-color: rgba(0, 0, 0, 0.7);
            color: #e5e7eb;
        }
    }

    .user-role {
        background-color: rgba(139, 92, 246, 0.2);
        color: #a78bfa;
    }

    .info-list {
        .info-item {
            .label {
                color: #9ca3af;
            }

            .value {
                color: #e5e7eb;
            }
        }
    }

    .security-item {
        background-color: #1f2937;
        border: 1px solid #374151;

        &:hover {
            background-color: #242b38;
        }

        .security-header {
            h3 {
                color: #e5e7eb;
            }

            p {
                color: #9ca3af;
            }
        }
    }

    .verify-status {
        background-color: #374151;
        border-color: #4b5563;

        .status-info {
            span:first-child {
                color: #e5e7eb;
            }
        }
    }

    .security-form {
        :deep(.el-input__wrapper) {
            background-color: #374151;
            border-color: #4b5563;

            &.is-focus {
                border-color: #8b5cf6;
                box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
            }
        }
    }

    .password-strength-container {
        .password-strength-text {
            color: #9ca3af;
        }

        .password-strength-bar {
            background-color: #374151;
        }
    }

    /* 表单相关 */
    :deep(.el-form-item__label) {
        color: #e5e7eb;
    }

    :deep(.el-input__wrapper) {
        background-color: #374151;
        border-color: #4b5563;

        input {
            color: #e5e7eb;
        }
    }

    :deep(.el-textarea__wrapper) {
        background-color: #374151;
        border-color: #4b5563;

        textarea {
            color: #e5e7eb;
        }
    }

    :deep(.el-cascader) {
        input {
            color: #e5e7eb;
        }
    }

    :deep(.el-cascader__dropdown) {
        background-color: #1f2937;
        border-color: #374151;

        .el-cascader-node {
            color: #e5e7eb;

            &:not(.is-disabled):hover {
                background-color: #374151;
            }

            &.in-active-path,
            &.is-active {
                background-color: rgba(139, 92, 246, 0.2);
            }
        }
    }

    /* 按钮样式 */
    :deep(.el-button) {
        &.el-button--default {
            background-color: #374151;
            border-color: #4b5563;
            color: #e5e7eb;

            &:hover {
                background-color: #4b5563;
                border-color: #6b7280;
            }
        }

        &.el-button--primary {
            background-color: #8b5cf6;
            border-color: #8b5cf6;
            color: #ffffff;

            &:hover {
                background-color: #7c3aed;
                border-color: #7c3aed;
            }
        }
    }

    /* 消息��样式 */
    .el-message-box {
        background-color: #1f2937;
        border-color: #374151;

        .el-message-box__title {
            color: #e5e7eb;
        }

        .el-message-box__content {
            color: #d1d5db;
        }

        .el-message-box__container {
            background-color: #1f2937;
        }
    }

    /* 上传组件样式 */
    .avatar-uploader {
        border-color: #4b5563;

        &:hover {
            border-color: #8b5cf6;
        }

        .upload-placeholder {
            color: #9ca3af;
        }
    }
}
</style>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Camera, Edit, User, Lock, Message, CircleCheck, Warning, Check } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { changePassword as changePasswordApi } from '@/api/admin/user'
import { showMessage } from '@/composables/utils'
import { useRouter } from 'vue-router'
import { getAssetsFile } from '@/composables/utils'

const userStore = useUserStore()
const router = useRouter()

// 用户基本信息
const userInfo = userStore.userInfo


// 密码表单
const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})
const profileForm = reactive({
    username: userInfo.username,
    email: userInfo.email,
    location: [],
    bio: ''
})

// 密码表单校验规则
const passwordRules = {
    currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== passwordForm.newPassword) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            }, trigger: 'blur'
        }
    ]
}
// 表单验证规则
const profileRules = {
    email: [
        { required: true, message: '请填写邮箱信息', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
    ]
}
// 密码强度相关
const passwordStrengthPercentage = ref(0)
const passwordStrengthText = ref('')
const passwordStrengthGradient = ref('')

const checkPasswordStrength = () => {
    const strength = calculatePasswordStrength(passwordForm.newPassword)
    if (strength === 0) {
        passwordStrengthPercentage.value = 0
        passwordStrengthText.value = ''
        passwordStrengthGradient.value = ''
    } else if (strength < 2) {
        passwordStrengthPercentage.value = 33
        passwordStrengthText.value = '弱'
        passwordStrengthGradient.value = 'linear-gradient(to right, #f56c6c, #f56c6c)' // 弱
    } else if (strength < 4) {
        passwordStrengthPercentage.value = 66
        passwordStrengthText.value = '中'
        passwordStrengthGradient.value = 'linear-gradient(to right, #e6a23c, #f56c6c)' // 中
    } else {
        passwordStrengthPercentage.value = 100
        passwordStrengthText.value = '强'
        passwordStrengthGradient.value = 'linear-gradient(to right, #67c23a, #e6a23c)' // 强
    }
}

const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[\W_]/.test(password)) strength++
    return strength
}

const passwordFormRef = ref(null)

// 修改密码方法
const changePassword = () => {
    if (!passwordFormRef.value) return
    passwordFormRef.value.validate((valid) => {
        if (valid) {
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
                        changePasswordApi(userInfo.username, passwordForm.currentPassword, passwordForm.newPassword).then((res) => {
                            instance.confirmButtonLoading = false
                            if (res.success) {
                                showMessage(res.message)
                                userStore.logout()
                                router.push('/login')
                            } else {
                                showMessage(res.message, 'error')

                            }
                            done()
                        })
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
    })
}

// 发送验证邮件
const sendVerificationEmail = () => {
    if (!userInfo.email) {
        ElMessage.error('请先填写邮箱信息')
        return
    }
    ElMessageBox.confirm(
        `确定要向 ${userInfo.email} 发送验证邮件吗？`,
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
// 保存个人信息
const saveProfile = () => {
    if (!profileFormRef.value) return
    profileFormRef.value.validate((valid) => {
        if (valid) {
            // 模拟保存操作
            userInfo.username = profileForm.username
            userInfo.email = profileForm.email
            userInfo.location = profileForm.location.join(' ')

            ElMessage.success('个人信息保存成功')
        } else {
            ElMessage.error('请填写完整的个人信息')
        }
    })
}

// 重置表单
const resetForm = () => {
    profileForm.username = userInfo.username
    profileForm.email = userInfo.email
    profileForm.location = []
    profileForm.bio = ''
}

// 头像上传相关
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

const handleAvatarProgress = (event, file) => {
    // ���理头像上传进度
}

const handleAvatarSuccess = (response, file) => {
    userInfo.avatar = URL.createObjectURL(file.raw)
    ElMessage.success('头像上传成功')
}

const profileFormRef = ref(null)
</script>