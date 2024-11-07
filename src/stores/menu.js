import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
    // 左栏默认宽度
    const collapsed = ref(false)

    function toggleCollapsed() {
        collapsed.value = !collapsed.value
    }

    return { collapsed, toggleCollapsed }
})
