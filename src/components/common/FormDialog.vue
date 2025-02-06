<template>
    <el-dialog v-model="visible" :title="title" :width="width" @close="handleClose">
        <el-form ref="formRef" :model="model" :rules="rules" :label-width="labelWidth">
            <slot name="content"></slot>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    // 对话框标题
    title: {
        type: String,
        required: true
    },
    // 表单数据模型
    model: {
        type: Object,
        required: true
    },
    // 表单验证规则
    rules: {
        type: Object,
        default: () => ({})
    },
    // 对话框宽度
    width: {
        type: String,
        default: '500px'
    },
    // 表单标签宽度
    labelWidth: {
        type: String,
        default: '80px'
    }
})

const emit = defineEmits(['submit', 'cancel'])

const visible = ref(false)
const formRef = ref(null)
const loading = ref(false)

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        loading.value = true
        await formRef.value.validate()
        emit('submit', props.model)
    } catch (error) {
        console.error('表单验证失败:', error)
    } finally {
        loading.value = false
    }
}

// 取消
const handleCancel = () => {
    emit('cancel')
    visible.value = false
}

// 关闭对话框
const handleClose = () => {
    formRef.value?.resetFields()
    handleCancel()
}

// 暴露方法给父组件
defineExpose({
    formRef,
    visible
})
</script>