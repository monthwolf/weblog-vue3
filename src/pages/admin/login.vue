<template>
    <div class="grid grid-cols-2 h-screen overflow-hidden">
        <!-- 左边栏 -->
        <div
            class="col-span-2 h-full order-2 p-10 md:col-span-1 md:order-1 bg-gradient-to-br from-slate-900 to-slate-800 animate__animated animate__fadeInLeft">
            <div class="flex justify-center items-center h-full flex-col relative">
                <!-- 添加背景动画元素 -->
                <div class="absolute inset-0 opacity-10">
                    <div class="floating-squares"></div>
                </div>

                <h2
                    class="font-bold text-4xl mb-7 text-white tracking-wider animate__animated animate__fadeInUp animate__delay-1s">
                    Weblog 博客登录
                </h2>
                <p class="text-gray-300 text-center max-w-md animate__animated animate__fadeInUp animate__delay-1s">
                    一款由 Spring Boot + Mybaits Plus + Vue 3.2 + Vite 4 开发的前后端分离博客。
                </p>
                <img src="@/assets/images/developer.png"
                    class="w-1/2 mt-8 hover:scale-105 transition-transform duration-300 animate__animated animate__fadeInUp animate__delay-2s">
            </div>
        </div>

        <!-- 右边栏 -->
        <div
            class="col-span-2 order-1 h-full md:col-span-1 md:order-2 bg-gradient-to-br from-teal-50 to-teal-100 animate__animated animate__fadeInRight">
            <div class="flex justify-center items-center h-full text-black flex-col p-8">
                <h1
                    class="font-bold text-4xl mb-5 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent animate__animated animate__fadeInDown">
                    欢迎回来
                </h1>

                <div
                    class="flex items-center justify-center mb-7 text-gray-500 space-x-3 animate__animated animate__fadeInDown animate__delay-1s">
                    <span class="h-[1px] w-16 bg-gradient-to-r from-transparent to-gray-300"></span>
                    <span class="text-sm">账号密码登录</span>
                    <span class="h-[1px] w-16 bg-gradient-to-l from-transparent to-gray-300"></span>
                </div>

                <el-form :model="form" :rules="rules" ref="formRef"
                    class="w-5/6 md:w-2/5 space-y-4 animate__animated animate__fadeInUp animate__delay-1s">
                    <el-form-item prop="username">
                        <el-input size="large" v-model="form.username" placeholder="请输入用户名" :prefix-icon="User"
                            clearable class="login-input hover:shadow-lg transition-all duration-300" />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input size="large" v-model="form.password" type="password" placeholder="请输入密码"
                            :prefix-icon="Lock" clearable
                            class="login-input hover:shadow-lg transition-all duration-300" show-password />
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            class="w-full login-button hover:transform hover:scale-102 transition-all duration-300"
                            size="large" :loading="loading" type="primary" @click="onSubmit">
                            登录
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
// 引入图标
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import 'animate.css'
import { login } from '@/api/admin/user'
import { showMessage } from '@/composables/utils'
import { setToken } from '@/composables/auth'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 添加键盘监听
onMounted(() => {
    document.addEventListener('keyup', handleKeyUp)
})
onBeforeUnmount(() => {
    document.removeEventListener('keyup', handleKeyUp)
})

// 定义键盘监听函数
const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
        onSubmit()
    }
}

// 定义表单数据
const form = reactive({
    username: '',
    password: ''
})

// 定义表单规则
const rules = reactive({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

// 定义表单实例
const formRef = ref(null)

// 定义路由
const router = useRouter()

// 定义登录状态
const loading = ref(false)

// 定义登录函数
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            loading.value = true
            login(form.username, form.password).then(res => {
                console.log(res)
                if (res.success) {
                    setToken(res.data.token)
                    userStore.setUserInfo()
                    router.push('/admin/index')
                    showMessage('登录成功')
                } else {
                    let message = res.message
                    showMessage(message, 'error')
                }
            }).finally(() => {
                loading.value = false
            })
        } else {
            showMessage('请输入正确的用户名和密码', 'error')
        }
    })
}
</script>

<style scoped>
.login-input :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(229, 231, 235, 0.5);
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.login-input :deep(.el-input__wrapper.is-focus) {
    border-color: #60A5FA;
    box-shadow: 0 8px 16px -1px rgba(96, 165, 250, 0.2);
}

.login-button {
    background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
    border: none;
    border-radius: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
}

.floating-squares {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.1) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.1) 75%);
    background-size: 20px 20px;
    animation: animate-squares 20s linear infinite;
}

@keyframes animate-squares {
    0% {
        background-position: 0 0, 10px 0, 10px -10px, 0px 10px;
    }

    100% {
        background-position: 40px 40px, 50px 40px, 50px 30px, 40px 50px;
    }
}
</style>