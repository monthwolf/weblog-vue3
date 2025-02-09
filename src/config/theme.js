import { ref } from 'vue'

// 创建一个全局状态来存储主题模式
const isDark = ref(false)

export const useTheme = () => {
    const toggleTheme = () => {
        isDark.value = !isDark.value
        // 切换 class,
        document.documentElement.classList.toggle('dark', isDark.value)
        // 保存到本地存储
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
        // 同时设置 暗色 主题
        document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
    }

    const initTheme = () => {
        // 优先从本地存储获取主题设置
        const savedTheme = localStorage.getItem('theme')
        isDark.value = savedTheme === 'dark' ||
            (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)

        // 初始化主题
        document.documentElement.classList.toggle('dark', isDark.value)
        document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
    }

    return {
        isDark,
        toggleTheme,
        initTheme
    }
} 