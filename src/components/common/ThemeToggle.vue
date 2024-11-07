<template>
    <el-button class="theme-toggle" @click="toggleTheme" :type="isDark ? 'primary' : 'default'" circle>
        <el-icon>
            <component :is="isDark ? 'Sunny' : 'Moon'" />
        </el-icon>
    </el-button>
</template>

<script setup>
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useTheme } from '@/config/theme'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
    @apply fixed bottom-6 right-6 z-50 w-12 h-12 shadow-lg transition-all duration-300;
}

.theme-toggle:hover {
    @apply transform -translate-y-1;
}

.dark .theme-toggle {
    @apply bg-gray-700 border-gray-600 text-gray-200;
}

.dark .theme-toggle:hover {
    @apply bg-gray-600;
}
</style>