<template>
  <!-- 写博客 -->
  <el-dialog v-model="isArticlePublishEditorShow" :fullscreen="true" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <!-- 固钉组件，固钉到顶部 -->
      <el-affix :offset="20" style="width: 100%; height: 50px">
        <!-- 指定 flex 布局， 高度为 10， 背景色为白色 -->
        <div class="flex h-10 bg-white items-center p-2">
          <!-- 字体加粗 -->
          <h4 class="font-bold">写文章</h4>
          <!-- 靠右对齐 -->
          <div class="ml-auto flex">
            <el-button @click="isArticlePublishEditorShow = false">取消</el-button>
            <el-button type="primary" @click="publishArticleSubmit">
              <el-icon class="mr-1">
                <Promotion />
              </el-icon>
              发布
            </el-button>
          </div>
        </div>
      </el-affix>
    </template>
    <!-- label-position="top" 用于指定 label 元素在上面 -->
    <el-form
      :model="form"
      ref="publishArticleFormRef"
      label-position="top"
      size="large"
      :rules="rules"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="form.title"
          autocomplete="off"
          size="large"
          maxlength="40"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="内容" prop="content" class="h-1/3">
        <!-- Markdown 编辑器 -->
        <MdEditor
          v-model="form.content"
          editorId="publishArticleEditor"
          @onUploadImg="onUploadImg"
          :style="{
            minHeight: '500px',
            width: '100%',
            fontSize: '16px',
            paddingBottom: '2%',
          }"
        />
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-upload
          class="avatar-uploader"
          action="#"
          :on-change="handleCoverChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <img v-if="form.cover" :src="form.cover" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="摘要" prop="summary">
        <!-- :rows="3" 指定 textarea 默认显示 3 行 -->
        <el-input
          v-model="form.summary"
          :rows="3"
          type="textarea"
          placeholder="请输入文章摘要"
        />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select
          v-model="form.categoryId"
          clearable
          placeholder="---请选择---"
          size="large"
        >
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <span class="w-60">
          <!-- 标签选择 -->
          <el-select
            v-model="form.tags"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入文章标签"
            remote-show-suffix
            allow-create
            default-first-option
            :remote-method="remoteMethod"
            :loading="tagSelectLoading"
            size="large"
          >
            <el-option
              v-for="item in tags"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </span>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 编辑博客 -->
  <el-dialog
    v-model="isArticleUpdateEditorShow"
    :fullscreen="true"
    :show-close="false"
    :close-on-press-escape="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <!-- 固钉组件，固钉到顶部 -->
      <el-affix :offset="20" style="width: 100%">
        <!-- 指定 flex 布局， 高度为 10， 背景色为白色 -->
        <div class="flex h-10 bg-white">
          <!-- 字体加粗 -->
          <h4 class="font-bold">编辑文章</h4>
          <!-- 靠右对齐 -->
          <div class="ml-auto flex">
            <el-button @click="isArticleUpdateEditorShow = false">取消</el-button>
            <el-button type="primary" @click="updateSubmit">
              <el-icon class="mr-1">
                <Promotion />
              </el-icon>
              保存
            </el-button>
          </div>
        </div>
      </el-affix>
    </template>
    <!-- label-position="top" 用于指定 label 元素在上面 -->
    <el-form
      :model="updateArticleForm"
      ref="updateArticleFormRef"
      label-position="top"
      size="large"
      :rules="rules"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="updateArticleForm.title"
          autocomplete="off"
          size="large"
          maxlength="40"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <!-- Markdown 编辑器 -->
        <MdEditor
          v-model="updateArticleForm.content"
          @onUploadImg="onUploadImg"
          editorId="updateArticleEditor"
        />
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-upload
          class="avatar-uploader"
          action="#"
          :on-change="handleUpdateCoverChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <img
            v-if="updateArticleForm.cover"
            :src="updateArticleForm.cover"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="摘要" prop="summary">
        <!-- :rows="3" 指定 textarea 默认显示 3 行 -->
        <el-input
          v-model="updateArticleForm.summary"
          :rows="3"
          type="textarea"
          placeholder="请输入文章摘要"
        />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select
          v-model="updateArticleForm.categoryId"
          clearable
          placeholder="---请选择---"
          size="large"
        >
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <span class="w-60">
          <!-- 标签选择 -->
          <el-select
            v-model="updateArticleForm.tags"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入文章标签"
            remote-show-suffix
            allow-create
            default-first-option
            :remote-method="remoteMethod"
            :loading="tagSelectLoading"
            size="large"
          >
            <el-option
              v-for="item in tags"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </span>
      </el-form-item>
    </el-form>
  </el-dialog>

  <div class="article-list animate__animated animate__fadeIn">
    <div class="search-bar animate__animated animate__slideInDown">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="文章标题">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入文章标题"
            clearable
            :prefix-icon="Search"
          />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" @click="handleSearch" :icon="Search"
              >搜索</el-button
            >
            <el-button @click="resetSearch" :icon="RefreshRight">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container animate__animated animate__fadeInUp animation-delay-200">
      <el-card shadow="hover" class="table-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">文章列表</span>
            <el-button
              type="primary"
              :icon="Plus"
              @click="isArticlePublishEditorShow = true"
              >新增文章</el-button
            >
          </div>
        </template>

        <el-table
          :data="articleList"
          style="width: 100%"
          v-loading="loading"
          row-key="id"
          :stripe="true"
          :border="true"
          @row-click="handleRowClick"
        >
          <el-table-column prop="id" label="ID" width="50" />
          <el-table-column prop="cover" label="封面" width="150">
            <template #default="{ row }">
              <img
                :src="row.cover"
                alt="封面"
                style="width: 100%; height: auto; border-radius: 4px"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            min-width="200"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <div class="title-cell">
                <span class="title-text">{{ row.title }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="category" label="分类" width="120">
            <template #default="{ row }">
              <el-tag size="small" :type="getCategoryType(row.category)">
                {{ row.category }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="发布时间" width="180">
            <template #default="{ row }">
              <div class="time-cell">
                <el-icon>
                  <Timer />
                </el-icon>
                <el-tooltip :content="formatDate(row.createTime)" placement="top">
                  <span>{{ formatArticleDate(row.createTime) }}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="views" label="阅读量" width="100">
            <template #default="{ row }">
              <el-tooltip :content="`${row.readNum} 次阅读`" placement="top">
                <div class="views-cell">
                  <el-icon>
                    <View />
                  </el-icon>
                  <span>{{ formatNumber(row.readNum) }}</span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="operation-cell">
                <el-tooltip content="编辑" placement="top">
                  <el-button type="primary" link @click="showArticleUpdateEditor(row)">
                    <el-icon>
                      <Edit />
                    </el-icon>
                  </el-button>
                </el-tooltip>

                <el-tooltip content="预览" placement="top">
                  <el-button type="success" link @click.stop="handlePreview(row.id)">
                    <el-icon>
                      <View />
                    </el-icon>
                  </el-button>
                </el-tooltip>

                <el-tooltip content="删除" placement="top">
                  <el-button type="danger" link @click.stop="handleDelete(row)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  RefreshRight,
  Plus,
  Document,
  Edit,
  View,
  Delete,
  Timer,
  FolderOpened,
} from "@element-plus/icons-vue";
import { formatDate, getTimeAgo, isToday } from "@/composables/date";
import {
  getArticlePageList,
  deleteArticle,
  publishArticle,
  getArticleDetail,
  updateArticle,
} from "@/api/admin/article";
import { getCategorySelectList } from "@/api/admin/category";
import { uploadFile } from "@/api/admin/settings";
import { searchTags, getTagSelectList } from "@/api/admin/tag";
import { showMessage } from "@/composables/utils";
import { useRouter } from "vue-router";

const isArticlePublishEditorShow = ref(false);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const router = useRouter();

const searchForm = reactive({
  title: "",
  dateRange: [],
});
const categories = ref([]);

// 发布文章表单引用
const publishArticleFormRef = ref(null);

// 表单对象
const form = reactive({
  id: null,
  title: "",
  content: "请输入内容",
  cover: "",
  categoryId: null,
  tags: [],
  summary: "",
});

// 表单校验规则
const rules = {
  title: [
    { required: true, message: "请输入文章标题", trigger: "blur" },
    {
      min: 1,
      max: 40,
      message: "文章标题要求大于1个字符，小于40个字符",
      trigger: "blur",
    },
  ],
  content: [{ required: true }],
  cover: [{ required: true }],
  categoryId: [{ required: true, message: "请选择文章分类", trigger: "blur" }],
  tags: [{ required: true, message: "请选择文章标签", trigger: "blur" }],
};

const fetchCategories = async () => {
  try {
    const response = await getCategorySelectList();
    categories.value = response.data;
  } catch (error) {
    console.log(error);
    ElMessage.error("获取分类列表失败");
  }
};

onMounted(() => {
  fetchCategories();
});
const getCategoryType = (categoryId) => {
  const category = categories.value.find((cat) => cat.id === categoryId);
  return category ? category.name : "未知分类";
};

const articleList = ref([]);

const fetchArticles = async () => {
  loading.value = true;
  try {
    const response = await getArticlePageList({
      current: currentPage.value,
      size: pageSize.value,
      title: searchForm.title,
      startDate: searchForm.dateRange[0],
      endDate: searchForm.dateRange[1],
    });
    articleList.value = response.data;
    total.value = response.total;
  } catch (error) {
    ElMessage.error("获取文章列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchArticles();
};

const resetSearch = () => {
  searchForm.title = "";
  searchForm.category = "";
  currentPage.value = 1;
  fetchArticles();
};

// 编辑文章按钮点击事件
const showArticleUpdateEditor = (row) => {
  // 显示编辑文章对话框
  isArticleUpdateEditorShow.value = true;
  // 拿到文章 ID
  let articleId = row.id;
  getArticleDetail(articleId).then((res) => {
    if (res.success) {
      // 设置表单数据
      updateArticleForm.id = res.data.id;
      updateArticleForm.title = res.data.title;
      updateArticleForm.cover = res.data.cover;
      updateArticleForm.content = res.data.content;
      updateArticleForm.categoryId = res.data.categoryId;
      updateArticleForm.tags = res.data.tagIds;
      updateArticleForm.summary = res.data.summary;
    }
  });
};

const handlePreview = (articleId) => {
  // 跳转文章详情页
  router.push("/article/" + articleId);
};

const handleDelete = (row) => {
  ElMessageBox.confirm("确定要删除该文章吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteArticle(row.id).then(() => {
      ElMessage.success("删除成功");
      fetchArticles(); // Refresh the list after deletion
    });
  });
};

// 发布文章
const publishArticleSubmit = () => {
  console.log("提交 md 内容：" + form.content);
  // 校验表单
  publishArticleFormRef.value.validate((valid) => {
    if (!valid) {
      return false;
    }

    publishArticle(form).then((res) => {
      if (res.success == false) {
        // 获取服务端返回的错误消息
        let message = res.message;
        // 提示错误消息
        showMessage(message, "error");
        return;
      }

      showMessage("发布成功");
      // 隐藏发布文章对话框
      isArticlePublishEditorShow.value = false;
      // 将 form 表单字段置空
      form.title = "";
      form.content = "";
      form.cover = "";
      form.summary = "";
      form.categoryId = null;
      form.tags = [];
      // 重新请求分页接口，渲染列表数据
      getTableData();
    });
  });
};

// 保存文章
const updateSubmit = () => {
  updateArticleFormRef.value.validate((valid) => {
    // 校验表单
    if (!valid) {
      return false;
    }

    // 请求更新文章接口
    updateArticle(updateArticleForm).then((res) => {
      if (res.success == false) {
        // 获取服务端返回的错误消息
        let message = res.message;
        // 提示错误消息
        showMessage(message, "error");
        return;
      }

      showMessage("保存成功");
      // 隐藏编辑框
      isArticleUpdateEditorShow.value = false;
      // 重新请求分页接口，渲染列表数据
      getTableData();
    });
  });
};

// 编辑器图片上传
const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        console.log("==> 编辑器开始上传文件...");
        let formData = new FormData();
        formData.append("file", file);
        uploadFile(formData).then((res) => {
          console.log(res);
          console.log("访问路径：" + res.data.url);
          // 调用 callback 函数，回显上传图片
          callback([res.data.url]);
        });
      });
    })
  );
};

// 上传文章封面图片
const handleCoverChange = (file) => {
  // 表单对象
  let formData = new FormData();
  // 添加 file 字段，并将文件传入
  formData.append("file", file.raw);
  uploadFile(formData).then((e) => {
    // 响参失败，提示错误消息
    if (e.success == false) {
      let message = e.message;
      showMessage(message, "error");
      return;
    }

    // 成功则设置表单对象中的封面链接，并提示上传成功
    form.cover = e.data.url;
    showMessage("上传成功");
  });
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchArticles();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchArticles();
};

// 获取标签效果
const getTagEffect = (tag) => {
  return Math.random() > 0.5 ? "light" : "dark";
};

// 行点击处理
const handleRowClick = (row) => {
  handlePreview(row.id);
};

// 添加一个格式化日期的方法
const formatArticleDate = (date) => {
  if (isToday(date)) {
    return getTimeAgo(date);
  }
  return formatDate(date);
};

const dateShortcuts = [
  {
    text: "最近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  // 添加更多快捷选项...
];

// 标签 select Loading 状态，默认不显示
const tagSelectLoading = ref(false);
// 文章标签
const tags = ref([]);
// 渲染标签数据
getTagSelectList().then((res) => {
  tags.value = res.data;
});
// 根据用户输入的标签名称，远程模糊查询
const remoteMethod = (query) => {
  console.log("远程搜索：" + tags.value);
  // 如果用户的查询关键词不为空
  if (query) {
    // 显示 loading
    tagSelectLoading.value = true;
    // 调用标签模糊查询接口
    searchTags(query)
      .then((e) => {
        if (e.success) {
          // 设置到 tags 变量中
          tags.value = e.data;
        }
      })
      .finally(() => (tagSelectLoading.value = false)); // 隐藏 loading
  }
};

// 是否显示编辑文章对话框
const isArticleUpdateEditorShow = ref(false);
// 编辑文章表单引用
const updateArticleFormRef = ref(null);

// 修改文章表单对象
const updateArticleForm = reactive({
  id: null,
  title: "",
  content: "请输入内容",
  cover: "",
  categoryId: null,
  tags: [],
  summary: "",
});

// 编辑文章：上传文章封面图片
const handleUpdateCoverChange = (file) => {
  // 表单对象
  let formData = new FormData();
  // 添加 file 字段，并将文件传入
  formData.append("file", file.raw);
  uploadFile(formData).then((e) => {
    // 响参失败，提示错误消息
    if (e.success == false) {
      let message = e.message;
      showMessage(message, "error");
      return;
    }

    // 成功则设置表单对象中的封面链接，并提示上传成功
    updateArticleForm.cover = e.data.url;
    showMessage("上传成功");
  });
};

const formatNumber = (num) => {
  return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num;
};

onMounted(() => {
  fetchArticles();
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 200px;
  height: 100px;
  display: block;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 100px;
  text-align: center;
}

.article-list {
  padding: 20px;
  min-height: 100%;
}

.search-bar {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.table-card {
  transition: all 0.3s;
}

.table-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-text {
  color: var(--el-color-primary);
  cursor: pointer;
}

.title-text:hover {
  text-decoration: underline;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.time-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
}

.operation-cell {
  display: flex;
  gap: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 动画延迟类 */
.animation-delay-200 {
  animation-delay: 0.2s;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .article-list {
    padding: 10px;
  }

  .search-bar {
    padding: 15px;
  }

  .search-form {
    flex-direction: column;
  }

  .search-form .el-form-item {
    margin-bottom: 10px;
  }

  .operation-cell {
    flex-direction: column;
    gap: 4px;
  }

  .md-editor {
    min-height: 200px;
    /* Adjusted for smaller screens */
  }
}

@media screen and (max-width: 576px) {
  .el-table {
    font-size: 12px;
  }
}

.stats-cards {
  margin-bottom: 20px;
}

.stats-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
}

.stats-content {
  text-align: center;
  padding: 10px 0;
}

.stats-number {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-color-primary);
}

.stats-label {
  margin-left: 4px;
  color: var(--el-text-color-secondary);
}

.views-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--el-text-color-secondary);
}

/* 现有样式保持不变，添加以下暗色模式样式 */
.dark {
  .article-list {
    @apply bg-gray-900;
  }

  .search-bar {
    @apply bg-gray-800 border-gray-700;
  }

  .table-container {
    @apply bg-gray-800;
  }

  .table-card {
    @apply bg-gray-800 border-gray-700;

    &:hover {
      @apply shadow-lg shadow-gray-900/50;
    }
  }

  .title-cell {
    .title-text {
      @apply text-blue-400;

      &:hover {
        @apply text-blue-300;
      }
    }
  }

  .time-cell {
    @apply text-gray-400;
  }

  .views-cell {
    @apply text-gray-400;
  }

  :deep(.el-table) {
    @apply bg-gray-800 text-gray-300;

    th.el-table__cell {
      @apply bg-gray-700;
    }

    .el-table__cell {
      @apply border-gray-700;
    }

    tr:hover > td.el-table__cell {
      @apply bg-gray-700;
    }
  }

  :deep(.el-pagination) {
    @apply bg-gray-800 text-gray-300;

    .btn-prev,
    .btn-next {
      @apply bg-gray-700;
    }

    .el-pager li {
      @apply bg-gray-700 text-gray-300;

      &.active {
        @apply bg-purple-600 text-white;
      }
    }
  }

  :deep(.el-input__wrapper) {
    @apply bg-gray-700 border-gray-600;
  }

  :deep(.el-select__popper) {
    @apply bg-gray-700 border-gray-600;

    .el-select-dropdown__item {
      @apply text-gray-300;

      &.hover {
        @apply bg-gray-600;
      }
    }
  }
}
</style>
