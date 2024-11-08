import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/admin/user'
import { clearToken } from '@/composables/auth'
import { permissionMap } from '@/composables/utils'
export const useUserStore = defineStore('user', () => {
    const userInfo = ref({})

    const setUserInfo = () => {
        try {
            getUserInfo().then(res => {
                if (res.success) {
                    userInfo.value = res.data
                    // 将roles数组中的内容映射为中文
                    userInfo.value.roles = userInfo.value.roles.map(role => permissionMap[role])
                }
            })
        } catch (error) {
            console.error('无法获取用户信息:', error)
        }
    }

    // 退出登录
    const logout = () => {
        userInfo.value = {}
        clearToken()
    }
    return { userInfo, setUserInfo, logout }
}, {
    // 开启持久化
    persist: true,
}) 