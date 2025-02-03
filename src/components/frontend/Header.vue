<template>
  <nav class="sticky z-10 top-0 bg-white border-gray-200 border-b dark:bg-gray-900">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <!-- 博客 LOGO 、博客名称 -->
      <a href="/" class="flex items-center">
        <img
          :src="blogSettingsStore.blogSettings.logo"
          class="h-8 mr-3 rounded-full"
          alt="Flowbite Logo"
        />
        <span
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >{{ blogSettingsStore.blogSettings.name }}</span
        >
      </a>
      <div class="flex items-center md:order-2">
        <button
          type="button"
          data-collapse-toggle="navbar-search"
          aria-controls="navbar-search"
          aria-expanded="false"
          class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1"
        >
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span class="sr-only">搜索</span>
        </button>
        <div class="relative hidden mr-2 md:block">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span class="sr-only">搜索图标</span>
          </div>
          <input
            type="text"
            id="search-navbar"
            class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="请输入关键词..."
          />
        </div>
        <!-- 登录 -->

        <button
          data-collapse-toggle="navbar-search"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-search"
          aria-expanded="false"
        >
          <span class="sr-only">打开主菜单</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <!-- 用户名 -->
        <div
          v-if="userStore.userInfo.username"
          class="text-gray-900 ml-1 mr-1 hover:text-blue-700 justify-center gap-2 items-center flex"
        >
          <span class="hidden md:flex">
            {{ userStore.userInfo.username }}
          </span>
          <!-- <el-image :src="userStore.userInfo.avatar || getAssetsFile('default-avatar.png')"
                        class="w-8 h-8 rounded-full " /> -->
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            class="text-white ml-2 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            <!-- 用户登录头像 -->
            <img
              class="w-8 h-8 rounded-full"
              :src="
                blogSettingsStore.blogSettings.avatar ||
                getAssetsFile('default-avatar.png')
              "
              alt="user photo"
            />
          </button>

          <!-- Dropdown menu -->
          <div
            id="dropdown"
            class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
          >
            <ul
              class="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <a
                  href="/admin/index"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >进入后台</a
                >
              </li>
              <li>
                <a
                  @click="logout"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >退出登录</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          v-else
          class="text-gray-900 ml-1 mr-1 hover:text-blue-700"
          @click="$router.push('/login')"
        >
          登录
        </div>
      </div>
      <div
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="navbar-search"
      >
        <div class="relative mt-3 md:hidden">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="search-navbar"
            class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
          />
        </div>
        <ul
          class="cursor-pointer flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li>
            <a
              @click="router.push('/')"
              :class="[currPath == '/' ? 'text-blue-700' : 'text-gray-900']"
              class="block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 md:dark:text-blue-500"
              aria-current="page"
              >首页</a
            >
          </li>
          <li>
            <a
              @click="router.push('/category/list')"
              :class="[currPath == '/category/list' ? 'text-blue-700' : 'text-gray-900']"
              class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >分类</a
            >
          </li>

          <li>
            <a
              @click="router.push('/tag/list')"
              :class="[currPath == '/tag/list' ? 'text-blue-700' : 'text-gray-900']"
              class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >标签</a
            >
          </li>

          <li>
            <a
              @click="router.push('/archive/list')"
              :class="[currPath == '/archive/list' ? 'text-blue-700' : 'text-gray-900']"
              class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >归档</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted } from "vue";
import { initCollapses, initDropdowns } from "flowbite";
import { useUserStore } from "@/stores/user";
import { getAssetsFile, showModel } from "@/composables/utils";
import { useBlogSettingsStore } from "@/stores/bloginfo";
import { useRouter, useRoute } from "vue-router";

const userStore = useUserStore();
const blogSettingsStore = useBlogSettingsStore();
const route = useRoute();
const router = useRouter();

// 初始化 flowbit 相关组件
onMounted(() => {
  initCollapses();
  initDropdowns();
});

// 当前路由地址
const currPath = ref(route.path);

const logout = () => {
  showModel("确定要退出登录吗？").then(() => {
    // 处理退出登录逻辑
    userStore.logout();
    showMessage("退出登录成功");
    location.reload();
  });
};
</script>
