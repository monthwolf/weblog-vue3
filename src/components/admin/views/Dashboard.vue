<template>
    <div class="dashboard">
        <!-- 欢迎区域 -->
        <div class="welcome-section">
            <div class="welcome-content animate__animated animate__fadeInDown">
                <h1>欢迎回来，{{ userInfo.nickname }}</h1>
                <p class="subtitle">
                    <span>{{ currentDate }}</span>
                    <el-divider direction="vertical" />
                    <span>{{ currentTime }}</span>
                    <el-divider direction="vertical" />
                    <span>{{ greeting }}</span>
                </p>
                <div class="weather-info" v-if="weather.temp">
                    <el-icon>
                        <Sunny />
                    </el-icon>
                    <span>{{ weather.temp }}°C</span>
                    <span>{{ weather.text }}</span>
                    <span>{{ weather.city }}</span>
                </div>
            </div>
            <div class="user-card animate__animated animate__fadeInRight">
                <div class="avatar-wrapper">
                    <el-avatar :size="80" :src="userInfo.avatar">
                        <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                    </el-avatar>
                    <div class="user-status">
                        <el-tag size="small" type="success" effect="dark">在线</el-tag>
                    </div>
                </div>
                <div class="user-info">
                    <h3>{{ userInfo.nickname }}</h3>
                    <p>{{ userInfo.role }}</p>
                    <div class="last-login">
                        <el-icon>
                            <Timer />
                        </el-icon>
                        <span>上次登录：{{ userInfo.lastLogin }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 数据概览 -->
        <el-row :gutter="20" class="data-overview">
            <el-col :xs="12" :sm="12" :md="6" v-for="item in statistics" :key="item.title">
                <el-card class="data-card animate__animated animate__zoomIn" shadow="hover"
                    :style="{ 'animation-delay': item.delay }">
                    <div class="data-icon" :style="{ background: item.color }">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                    </div>
                    <div class="data-info">
                        <div class="data-title">{{ item.title }}</div>
                        <div class="data-value">
                            <count-up :end-val="Number(item.value)" :duration="2.5" :decimal-places="0"
                                :options="{ separator: ',' }" />
                        </div>
                        <div class="data-trend" :class="item.trend > 0 ? 'up' : 'down'">
                            <el-icon>
                                <component :is="item.trend > 0 ? 'ArrowUp' : 'ArrowDown'"></component>
                            </el-icon>
                            {{ Math.abs(item.trend) }}% 较上月
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 图表统计 -->
        <el-row :gutter="20" class="chart-statistics">
            <el-col :sm="24" :md="16">
                <el-card class="chart-card animate__animated animate__fadeInLeft" shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>访问统计</span>
                            <el-radio-group v-model="visitTimeRange" size="small">
                                <el-radio-button label="week">本周</el-radio-button>
                                <el-radio-button label="month">本月</el-radio-button>
                                <el-radio-button label="year">全年</el-radio-button>
                            </el-radio-group>
                        </div>
                    </template>
                    <div class="chart-container">
                        <v-chart class="chart" :option="visitChartOption" autoresize />
                    </div>
                </el-card>
            </el-col>
            <el-col :sm="24" :md="8">
                <el-card class="chart-card animate__animated animate__fadeInRight" shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>文章分类</span>
                        </div>
                    </template>
                    <div class="chart-container">
                        <v-chart class="chart" :option="categoryChartOption" autoresize />
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 最近活动和系统信息 -->
        <el-row :gutter="20" class="bottom-section">
            <el-col :sm="24" :md="16">
                <el-card class="activity-card animate__animated animate__fadeInUp" shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>最近活动</span>
                            <el-button link type="primary">查看全部</el-button>
                        </div>
                    </template>
                    <div class="activity-list">
                        <el-timeline>
                            <el-timeline-item v-for="(activity, index) in recentActivities" :key="index"
                                :type="activity.type" :color="activity.color" :size="activity.size"
                                :hollow="activity.hollow" :timestamp="activity.time">
                                {{ activity.content }}
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </el-card>
            </el-col>
            <el-col :sm="24" :md="8">
                <el-card class="system-card animate__animated animate__fadeInUp" shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>系统信息</span>
                            <el-tag size="small" type="success">运行正常</el-tag>
                        </div>
                    </template>
                    <div class="system-info">
                        <div class="info-item" v-for="(item, index) in systemInfo" :key="index">
                            <div class="info-label">{{ item.label }}</div>
                            <div class="info-value">{{ item.value }}</div>
                            <el-progress :percentage="item.percentage" :status="item.status" :stroke-width="8" />
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 快捷操作 -->
        <div class="quick-actions animate__animated animate__fadeInUp">
            <el-card shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>快捷操作</span>
                    </div>
                </template>
                <div class="actions-grid">
                    <el-button v-for="action in quickActions" :key="action.name" :type="action.type" :icon="action.icon"
                        class="action-btn" @click="action.handler">
                        {{ action.name }}
                    </el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, inject, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import CountUp from 'vue-countup-v3'

use([
    CanvasRenderer,
    LineChart,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
])

const router = useRouter()

// 注入 addView 方法
const addView = inject('addView')

// 用户信息
const userInfo = ref({
    nickname: '管理员',
    avatar: '',
    lastLogin: '2024-01-15 10:00:00'
})

// 当前日期和问候语
const currentDate = computed(() => {
    return new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })
})

const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 6) return '凌晨好'
    if (hour < 9) return '早上好'
    if (hour < 12) return '上午好'
    if (hour < 14) return '中午好'
    if (hour < 17) return '下午好'
    if (hour < 19) return '傍晚好'
    return '晚上好'
})

// 统计数据
const statistics = [
    {
        title: '文章总数',
        value: '128',
        icon: ElementPlusIconsVue.Document,
        color: '#409EFF',
        trend: 12.5,
        delay: '0s'
    },
    {
        title: '评论数',
        value: '356',
        icon: ElementPlusIconsVue.ChatDotRound,
        color: '#67C23A',
        trend: -5.2,
        delay: '0.1s'
    },
    {
        title: '访问量',
        value: '1,286',
        icon: ElementPlusIconsVue.View,
        color: '#E6A23C',
        trend: 8.4,
        delay: '0.2s'
    },
    {
        title: '用户数',
        value: '86',
        icon: ElementPlusIconsVue.User,
        color: '#F56C6C',
        trend: 3.1,
        delay: '0.3s'
    }
]

// 系统信息
const systemInfo = [
    {
        label: 'CPU使用率',
        value: '32%',
        percentage: 32,
        status: 'success'
    },
    {
        label: '内存使用率',
        value: '65%',
        percentage: 65,
        status: 'warning'
    },
    {
        label: '磁盘使用率',
        value: '85%',
        percentage: 85,
        status: 'exception'
    }
]

// 快捷操作
const quickActions = [
    {
        name: '发布文章',
        type: 'primary',
        icon: ElementPlusIconsVue.Document,
        handler: () => addView({
            path: '/admin/article/publish',
            title: '发布文章'
        })
    },
    {
        name: '内容管理',
        type: 'success',
        icon: ElementPlusIconsVue.Document,
        handler: () => addView({
            path: '/admin/article/list',
            title: '文章列表'
        })
    },
    {
        name: '系统设置',
        type: 'warning',
        icon: ElementPlusIconsVue.Setting,
        handler: () => addView({
            path: '/admin/settings/blog',
            title: '博客设置'
        })
    },
    {
        name: '个人信息',
        type: 'info',
        icon: ElementPlusIconsVue.User,
        handler: () => addView({
            path: '/admin/settings/profile',
            title: '个人信息'
        })
    }
]

// 添加实时时钟
const currentTime = ref('')
const updateTime = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    currentTime.value = `${hours}:${minutes}:${seconds}`
}

// 启动时钟
let timeInterval
onMounted(() => {
    updateTime()
    timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
    clearInterval(timeInterval)
})

// 天气信息
const weather = reactive({
    temp: 26,
    text: '晴',
    city: '广州市'
})

// 访问统计图表
const visitTimeRange = ref('week')
const visitChartOption = computed(() => ({
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['访问量', '用户量']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '访问量',
            type: 'line',
            smooth: true,
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '用户量',
            type: 'line',
            smooth: true,
            data: [220, 182, 191, 234, 290, 330, 310]
        }
    ]
}))

// 分类统计图表
const categoryChartOption = computed(() => ({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            name: '文章分类',
            type: 'pie',
            radius: '50%',
            data: [
                { value: 1048, name: '技术博客' },
                { value: 735, name: '生活随笔' },
                { value: 580, name: '项目分享' },
                { value: 484, name: '学习笔记' }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
}))

// 最近活动
const recentActivities = [
    {
        content: '发布了新文章《Vue3 组合式 API 最佳实践》',
        time: '刚刚',
        type: 'primary',
        size: 'large'
    },
    {
        content: '更新了系统设置',
        time: '2小时前',
        type: 'success'
    },
    {
        content: '回复了用户评论',
        time: '5小时前',
        type: 'info'
    },
    {
        content: '添加了新分类"学习笔记"',
        time: '昨天',
        type: 'warning'
    }
]
</script>

<style scoped>
.dashboard {
    animation: fadeIn 0.8s ease-out;
}

.welcome-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
}

.welcome-content h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
}

.subtitle {
    margin: 10px 0 0;
    opacity: 0.9;
    font-size: 16px;
}

.user-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    backdrop-filter: blur(5px);
}

.last-login {
    font-size: 14px;
}

.last-login p {
    margin: 0;
    opacity: 0.8;
}

.data-overview {
    margin-bottom: 30px;
}

.data-card {
    display: flex;
    align-items: center;
    padding: 20px;
    height: 100%;
    transition: transform 0.3s;
}

.data-card:hover {
    transform: translateY(-5px);
}

.data-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    margin-right: 15px;
}

.data-icon :deep(.el-icon) {
    font-size: 24px;
    color: white;
}

.data-info {
    flex: 1;
}

.data-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
}

.data-value {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
}

.data-trend {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.data-trend.up {
    color: #67C23A;
}

.data-trend.down {
    color: #F56C6C;
}

.system-info {
    margin-bottom: 30px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.info-item {
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    transition: background-color 0.3s;
}

.info-item:hover {
    background: #f0f2f5;
}

.info-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
}

.info-value {
    font-size: 16px;
    font-weight: 500;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
}

.action-btn {
    width: 100%;
    height: 40px;
    transition: transform 0.3s;
}

.action-btn:hover {
    transform: translateY(-2px);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
    .welcome-section {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }

    .welcome-content h1 {
        font-size: 24px;
    }

    .data-card {
        margin-bottom: 15px;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .actions-grid {
        grid-template-columns: 1fr;
    }
}

/* 添加新样式 */
.weather-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    font-size: 14px;
    opacity: 0.9;
}

.avatar-wrapper {
    position: relative;
}

.user-status {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translate(25%, 25%);
}

.chart-statistics {
    margin-bottom: 20px;
}

.chart-card {
    margin-bottom: 20px;
}

.chart-container {
    height: 300px;
}

.chart {
    height: 100%;
}

.activity-list {
    max-height: 400px;
    overflow-y: auto;
}

.system-info .info-item {
    margin-bottom: 20px;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
    .chart-container {
        height: 200px;
    }

    .activity-list {
        max-height: 300px;
    }
}

@media screen and (max-width: 576px) {
    .weather-info {
        flex-wrap: wrap;
    }

    .chart-container {
        height: 180px;
    }
}
</style>