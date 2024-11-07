<template>
    <div class="footer" :class="{ 'mobile-footer': isMobile }">
        <div class="footer-content">
            <p class="copyright">© {{ currentYear }} 博客管理系统</p>
            <div class="links" v-if="!isMobile">
                <el-link type="primary" href="/" target="_blank">访问网站</el-link>
                <el-divider direction="vertical" />
                <el-link type="info" @click="showAbout">关于系统</el-link>
            </div>
        </div>

        <!-- 使用 el-dialog 替代 el-message-box -->
        <el-dialog v-model="dialogVisible" title="关于系统" width="300px" align-center :append-to-body="true">
            <div class="about-content">
                <h3>博客管理系统</h3>
                <p>Version: 1.0.0</p>
                <p>基于 Vue3 + Element Plus 开发</p>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
    isMobile: {
        type: Boolean,
        default: false
    }
})

const currentYear = computed(() => new Date().getFullYear())
const dialogVisible = ref(false)

const showAbout = () => {
    dialogVisible.value = true
}
</script>

<style scoped>
.footer {
    padding: 15px 0;
    text-align: center;
    background: #f8f9fa;
    border-top: 1px solid #eee;
    transition: all 0.3s ease-in-out;
}

.footer-content {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

.copyright {
    margin: 0;
}

.links {
    display: flex;
    align-items: center;
    gap: 8px;
}

.links .el-link {
    font-size: 14px;
}

/* 关于弹窗样式 */
.about-content {
    text-align: center;
    padding: 10px 0;
}

.about-content h3 {
    margin: 0 0 15px;
    color: var(--el-color-primary);
}

.about-content p {
    margin: 8px 0;
    color: #666;
}

.dialog-footer {
    width: 100%;
    display: flex;
    justify-content: center;
}

/* 移动端样式 */
.mobile-footer {
    padding: 10px 0;
}

.mobile-footer .footer-content {
    padding: 0 10px;
    justify-content: center;
}

.mobile-footer .copyright {
    font-size: 12px;
}

@media screen and (max-width: 576px) {
    .footer {
        padding: 8px 0;
    }

    .footer-content {
        padding: 0 8px;
    }
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
    .footer {
        background: #1a1a1a;
        border-top-color: #2c2c2c;
    }

    .footer-content {
        color: #999;
    }

    .about-content h3 {
        color: var(--el-color-primary);
    }

    .about-content p {
        color: #999;
    }
}
</style>