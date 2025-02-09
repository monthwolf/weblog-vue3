<template>
  <!-- 路由视图 -->
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup  lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.js'
const locale = zhCn
</script>

