<template>
  <Header></Header>

  <!-- 主内容区域 -->
  <main class="container max-w-screen-xl mx-auto p-4 px-6">
    <!-- grid 表格布局，分为 4 列 -->
    <div class="grid grid-cols-4 gap-7">
      <!-- 左边栏，占用 3 列 -->
      <div class="col-span-4 md:col-span-3 mb-3">
        <!-- 分类列表 -->
        <CategoryList></CategoryList>
      </div>

      <!-- 右边侧边栏，占用一列 -->
      <AsideCard :showCategory="false"></AsideCard>
    </div>
  </main>

  <Footer></Footer>
</template>

<script setup>
import Footer from "@/components/frontend/Footer.vue";
import Header from "@/components/frontend/Header.vue";
import AsideCard from "@/components/frontend/AsideCard.vue";
import CategoryList from "@/components/frontend/CategoryList.vue";
</script>
