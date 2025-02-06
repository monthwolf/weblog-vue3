<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content animate__animated animate__fadeInDown">
        <h1>欢迎回来，{{ userStore.userInfo.username }}</h1>
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
          <el-avatar :size="80" :src="userStore.userInfo.avatar">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          </el-avatar>
          <div class="user-status">
            <el-tag size="small" type="success" effect="dark">在线</el-tag>
          </div>
        </div>
        <div class="user-info">
          <h3>{{ userStore.userInfo.username }}</h3>
          <p>{{ userStore.userInfo.role }}</p>
          <div class="last-login">
            <el-icon>
              <Timer />
            </el-icon>
            <span>上次登录：{{ userStore.userInfo.lastLogin }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据概览 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :xs="12" :sm="12" :md="6" v-for="item in statistics" :key="item.title">
        <el-card class="data-card w-full" shadow="hover" :body-style="{ padding: '10px', width: '100%' }"
          :style="{ 'animation-delay': item.delay }">
          <div class="data-info justify-center">
            <div class="flex flex-row items-center w-full gap-4">
              <div class="data-icon" :style="{ background: item.color }">
                <el-icon>
                  <component :is="item.icon"></component>
                </el-icon>
              </div>
              <div class="data-title flex-1">
                {{ item.title }}
                <div class="data-value">
                  <CountTo :value="item.value"></CountTo>
                </div>
              </div>
              <div class="data-trend flex-1 animate__animated animate__fadeIn" :class="item.trend > 0 ? 'up' : 'down'"
                :style="{ display: item.trend ? '' : 'none', 'animation-delay': '1s' }" v-show="item.trend">
                <el-icon>
                  <component :is="item.trend > 0 ? 'ArrowUp' : 'ArrowDown'"></component>
                </el-icon>
                {{ Math.abs(item.trend) }}% 较上月
              </div>
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
              <el-timeline-item v-for="(activity, index) in recentActivities" :key="index" :type="activity.type"
                :color="activity.color" :size="activity.size" :hollow="activity.hollow" :timestamp="activity.time">
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
import {
  ref,
  computed,
  inject,
  reactive,
  onMounted,
  onUnmounted,
  onBeforeMount,
  watch,
} from "vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";

import { useUserStore } from "@/stores/user";
import {
  getBaseStatisticsInfo,
  getPvStatistics,
  getYearArticlePublished,
  getCategoryArticlesCount,
} from "@/api/admin/dashboard";
import { number } from "echarts";
import CountTo from "@/components/common/CountTo.vue";

const userStore = useUserStore();

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

// 注入 addView 方法
const addView = inject("addView");

// 当前日期和问候语
const currentDate = computed(() => {
  return new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return "凌晨好";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 17) return "下午好";
  if (hour < 19) return "傍晚好";
  return "晚上好";
});

// 统计数据
const statistics = reactive([
  {
    title: "文章",
    icon: ElementPlusIconsVue.Document,
    color: "#409EFF",
    delay: "0s",
  },
  {
    title: "分类",
    icon: ElementPlusIconsVue.ChatDotRound,
    color: "#67C23A",
    delay: "0s",
  },
  {
    title: "标签",
    icon: ElementPlusIconsVue.View,
    color: "#E6A23C",
    delay: "0s",
  },
  {
    title: "访问量",
    icon: ElementPlusIconsVue.User,
    color: "#F56C6C",
    delay: "0s",
  },
]);

onBeforeMount(() => {
  getBaseStatisticsInfo().then((res) => {
    if (res.success) {
      statistics[0].value = res.data.articleTotalCount;
      statistics[0].trend = Number(
        (res.data.articlePublishIncreaseRate * 100).toFixed(2)
      );
      statistics[1].value = res.data.categoryTotalCount;
      statistics[1].trend = Number(
        (res.data.categoryPublishIncreaseRate * 100).toFixed(2)
      );
      statistics[2].value = res.data.tagTotalCount;
      statistics[2].trend = Number((res.data.tagPublishIncreaseRate * 100).toFixed(2));
      statistics[3].value = res.data.pvTotalCount;
      statistics[3].trend = Number((res.data.pvIncreaseRate * 100).toFixed(2));
    }
  });
});
// 系统信息
const systemInfo = [
  {
    label: "CPU使用率",
    value: "32%",
    percentage: 32,
    status: "success",
  },
  {
    label: "内存使用率",
    value: "65%",
    percentage: 65,
    status: "warning",
  },
  {
    label: "磁盘使用率",
    value: "85%",
    percentage: 85,
    status: "exception",
  },
];

// 快捷操作
const quickActions = [
  {
    name: "发布文章",
    type: "primary",
    icon: ElementPlusIconsVue.Document,
    handler: () =>
      addView({
        path: "/admin/article/list",
        title: "文章列表",
      }),
  },
  {
    name: "分类管理",
    type: "success",
    icon: ElementPlusIconsVue.Document,
    handler: () =>
      addView({
        path: "/admin/article/category",
        title: "文章分类",
      }),
  },
  {
    name: "系统设置",
    type: "warning",
    icon: ElementPlusIconsVue.Setting,
    handler: () =>
      addView({
        path: "/admin/settings/blog",
        title: "博客设置",
      }),
  },
  {
    name: "标签管理",
    type: "info",
    icon: ElementPlusIconsVue.User,
    handler: () =>
      addView({
        path: "/admin/article/tags",
        title: "标签管理",
      }),
  },
];

// 添加实时时钟
const currentTime = ref("");
const updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  currentTime.value = `${hours}:${minutes}:${seconds}`;
};

// 启动时钟
let timeInterval;
onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
});

// 天气信息
const weather = reactive({
  temp: 26,
  text: "晴",
  city: "广州市",
});

// 访问统计图表
const visitTimeRange = ref("week");
const visitChartData = reactive({
  dates: [],
  pvData: [],
  articleData: [],
});

// 获取并处理统计数据
const fetchStatisticsData = async () => {
  try {
    // 并行请求PV统计和文章发布统计
    const [pvRes, articleRes] = await Promise.all([
      getPvStatistics(),
      getYearArticlePublished(),
    ]);

    if (pvRes.success && articleRes.success) {
      // 获取完整的一年数据
      const fullDates = Object.keys(articleRes.data);
      const fullPvData = pvRes.data.pvCounts;
      const fullArticleData = fullDates.map((date) => articleRes.data[date] || 0);

      // 根据选择的时间范围截取数据
      let sliceLength;
      switch (visitTimeRange.value) {
        case "week":
          sliceLength = 7;
          break;
        case "month":
          sliceLength = 30;
          break;
        case "year":
          sliceLength = fullDates.length; // 使用全部数据
          break;
      }

      // 从后往前截取数据
      visitChartData.dates = fullDates.slice(-sliceLength);
      visitChartData.pvData = fullPvData.slice(-sliceLength);
      visitChartData.articleData = fullArticleData.slice(-sliceLength);
    }
  } catch (error) {
    console.error("获取统计数据失败:", error);
  }
};

// 监听时间范围变化
watch(visitTimeRange, () => {
  fetchStatisticsData();
});

// 访问统计图表配置
const visitChartOption = computed(() => ({
  tooltip: {
    trigger: "axis",
    formatter: function (params) {
      let result = params[0].axisValue + "<br/>";
      params.forEach((param) => {
        result += `${param.seriesName}: ${param.value}<br/>`;
      });
      return result;
    },
  },
  legend: {
    data: ["访问量", "文章发布量"],
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: visitChartData.dates,
    axisLabel: {
      formatter: (value) => {
        // 根据时间范围调整日期显示格式
        const date = new Date(value);
        switch (visitTimeRange.value) {
          case "week":
            return `${date.getMonth() + 1}/${date.getDate()}`;
          case "month":
            return `${date.getMonth() + 1}/${date.getDate()}`;
          case "year":
            return `${date.getMonth() + 1}月`;
        }
      },
    },
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "访问量",
      type: "line",
      smooth: true,
      data: visitChartData.pvData,
      itemStyle: {
        color: "#409EFF",
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(64,158,255,0.2)",
            },
            {
              offset: 1,
              color: "rgba(64,158,255,0)",
            },
          ],
        },
      },
    },
    {
      name: "文章发布量",
      type: "line",
      smooth: true,
      data: visitChartData.articleData,
      itemStyle: {
        color: "#67C23A",
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(103,194,58,0.2)",
            },
            {
              offset: 1,
              color: "rgba(103,194,58,0)",
            },
          ],
        },
      },
    },
  ],
}));

// 在组件挂载时获取初始数据
onMounted(() => {
  fetchStatisticsData();
});

// 分类统计数据
const categoryData = ref([]);

// 获取分类统计数据
const fetchCategoryData = async () => {
  try {
    const res = await getCategoryArticlesCount();
    if (res.success) {
      categoryData.value = res.data.map((item) => ({
        value: item.count,
        name: item.categoryName,
      }));
    }
  } catch (error) {
    console.error("获取分类统计数据失败:", error);
  }
};

// 分类统计图表配置
const categoryChartOption = computed(() => ({
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
    type: "scroll",
    textStyle: {
      overflow: "truncate",
      width: 100,
    },
  },
  series: [
    {
      name: "文章分类",
      type: "pie",
      radius: "50%",
      data: categoryData.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
      label: {
        show: true,
        formatter: "{b}: {c}篇",
      },
    },
  ],
}));

// 在组件挂载时获取数据
onMounted(() => {
  fetchCategoryData();
});

// 最近活动
const recentActivities = [
  {
    content: "发布了新文章《Vue3 组合式 API 最佳实践》",
    time: "刚刚",
    type: "primary",
    size: "large",
  },
  {
    content: "更新了系统设置",
    time: "2小时前",
    type: "success",
  },
  {
    content: "回复了用户评论",
    time: "5小时前",
    type: "info",
  },
  {
    content: '添加了新分类"学习笔记"',
    time: "昨天",
    type: "warning",
  },
];
</script>

<style lang="scss" scoped>
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
  font-size: 20px;
  color: #666;
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
  color: #67c23a;
}

.data-trend.down {
  color: #f56c6c;
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

/* 现有样式保持不变，添加以下暗色模式样式 */
.dark {
  .dashboard {
    @apply bg-gray-900;
  }

  .welcome-section {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  }

  .user-card {
    @apply bg-gray-800/30;
    backdrop-filter: blur(8px);
  }

  .data-card {
    @apply bg-gray-800;

    &:hover {
      @apply shadow-lg shadow-gray-900/50;
    }
  }

  .data-title {
    @apply text-gray-400;
  }

  .data-value {
    @apply text-gray-100;
  }

  .chart-card {
    @apply bg-gray-800 border-gray-700;

    .card-header {
      @apply border-gray-700;
    }
  }

  .activity-card {
    @apply bg-gray-800 border-gray-700;
  }

  .system-card {
    @apply bg-gray-800 border-gray-700;
  }

  .info-item {
    @apply bg-gray-700/50;

    &:hover {
      @apply bg-gray-700;
    }
  }

  .info-label {
    @apply text-gray-400;
  }

  .info-value {
    @apply text-gray-200;
  }

  .action-btn {
    @apply bg-gray-700 border-gray-600 text-gray-200;

    &:hover {
      @apply bg-gray-600 border-gray-500;
    }
  }

  /* 图表相关样式 */
  :deep(.echarts) {
    background: transparent !important;
  }

  :deep(.el-radio-button__inner) {
    @apply bg-gray-700 border-gray-600 text-gray-300;

    &:hover {
      @apply bg-gray-600;
    }
  }

  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    @apply bg-purple-600 border-purple-600 text-white;
  }
}
</style>
