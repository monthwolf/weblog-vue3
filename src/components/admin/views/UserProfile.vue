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
        </div>
    </div>
</template>

<style scoped>
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
}
</style>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    Camera, Message, Location, Timer, Clock, Lock,
    Document, ChatDotRound, View, Star, User, Edit
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
        ElMessage.error('两次输入的密码不一致')
        return
    }

    ElMessageBox.confirm(
        '确定要修改密码吗?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        // 这里添加实际的密码修改逻辑
        ElMessage.success('密码修改成功')

        // 重置表单
        passwordForm.currentPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
    }).catch(() => {
        ElMessage.info('已取消密码修改')
    })
}

// 发送验证邮件
const sendVerificationEmail = () => {
    ElMessageBox.confirm(
        `确定要向 ${emailVerifyForm.email} 发送验证邮件吗?`,
        '发送验证邮件',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
        }
    ).then(() => {
        // 这里添加实际的发送验证邮件逻辑
        ElMessage.success('验证邮件已发送')
    }).catch(() => {
        ElMessage.info('已取消发送')
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