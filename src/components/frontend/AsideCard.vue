<template>
  <!-- 右边侧边栏，占用一列，小屏幕隐藏 -->
  <aside class="hidden md:block col-span-4 md:col-span-1 z-0">
    <div class="sticky top-[5.5rem]">
      <!-- 翻转卡片容器 -->
      <div
        class="relative transition-transform duration-500"
        :class="{ 'transform-style-preserve-3d': isArticle }"
      >
        <!-- 正面:博主信息 -->
        <div
          :class="{ 'backface-hidden': isArticle }"
          :style="{
            transform: showToc ? 'rotateY(180deg)' : 'rotateY(0)',
            backfaceVisibility: 'hidden',
            opacity: showToc ? '0' : '1',
          }"
          class="transition-transform transition-opacity duration-500"
        >
          <!-- 博主信息 -->
          <UserInfoCard></UserInfoCard>

          <!-- 分类 -->
          <CategoryList v-if="showCategory"></CategoryList>

          <!-- 标签 -->
          <TagList v-if="showTag"></TagList>
        </div>

        <!-- 背面:文章目录 -->
        <div
          v-if="isArticle"
          class="absolute top-0 w-full transition-transform transition-opacity duration-500 toc-list"
          :style="{
            transform: showToc ? 'rotateY(0)' : 'rotateY(-180deg)',
            backfaceVisibility: 'hidden',
            opacity: showToc ? '1' : '0',
          }"
        >
          <Toc ref="tocRef"></Toc>
        </div>

        <!-- 翻转按钮 -->
        <button
          v-if="isArticle && hasToc"
          @click="toggleToc"
          class="absolute top-2 right-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
    <ScrollToTop class="sticky top-[90%] w-12"></ScrollToTop>
  </aside>

  <!-- 小屏幕下的按钮 -->
  <div class="md:hidden fixed flex-1 flex bottom-20 right-4 gap-3 flex-col">
    <button
      @click="showUserInfoDialog = true"
      class="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <img
        :src="blogSettingsStore.blogSettings.avatar"
        class="w-10 h-10 rounded-full"
        alt="博主头像"
      />
    </button>
    <ScrollToTop class="w-full"></ScrollToTop>
  </div>

  <!-- 信息卡片弹窗 -->
  <div
    v-if="showUserInfoDialog"
    class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click.self="showUserInfoDialog = false"
  >
    <div class="bg-white dark:bg-gray-800 w-full max-w-sm rounded-lg p-4">
      <UserInfoCard></UserInfoCard>
      <CategoryList v-if="showCategory"></CategoryList>
      <TagList v-if="showTag"></TagList>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useBlogSettingsStore } from "@/stores/bloginfo";
import UserInfoCard from "./UserInfoCard.vue";
import CategoryList from "./CategoryList.vue";
import TagList from "./TagList.vue";
import Toc from "./Toc.vue";
import ScrollToTop from "./ScrollToTop.vue";

// 定义props
const props = defineProps({
  showCategory: {
    type: Boolean,
    default: true,
  },
  showTag: {
    type: Boolean,
    default: true,
  },
  showInfo: {
    type: Boolean,
    default: true,
  },
});
const tocRef = ref(null); // 创建一个 ref 来引用 Toc 组件
const hasToc = computed(() => {
  return tocRef?.value?.hasTocNodes;
});

// 获取当前路由
const route = useRoute();

// 判断是否为文章页面
const isArticle = computed(() => {
  return route.name === "article";
});

// 判断是否显示翻面按钮
const showFlipButton = computed(() => {
  return isArticle.value && hasTocNodes.value;
});

// 控制目录显示状态
const showToc = ref(false);

// 切换目录显示状态
const toggleToc = () => {
  showToc.value = !showToc.value;
};

// 控制信息卡片弹窗显示隐藏
const showUserInfoDialog = ref(false);

// 引入博客设置信息 store
const blogSettingsStore = useBlogSettingsStore();
</script>
