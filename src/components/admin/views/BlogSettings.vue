<template>
  <div class="settings-container">
    <el-card class="settings-card animate__animated animate__fadeIn">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <div class="header-icon">
              <el-icon>
                <Setting />
              </el-icon>
            </div>
            <span class="header-title">系统设置</span>
          </div>
        </div>
      </template>

      <div class="settings-layout">
        <!-- 左侧个人信息 -->
        <div class="profile-section">
          <div class="profile-header">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="uploadAvatar"
            >
              <div class="upload-content relative">
                <img
                  v-if="settingsForm.avatar"
                  :src="settingsForm.avatar"
                  class="avatar"
                />
                <el-icon v-else class="avatar-placeholder">
                  <UserFilled />
                </el-icon>
                <div
                  class="upload-hover-mask absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300"
                >
                  <el-icon class="text-white text-xl">
                    <Upload />
                  </el-icon>
                </div>
              </div>
            </el-upload>
            <h3 class="profile-name">{{ settingsForm.author || "未设置" }}</h3>
            <div class="user-roles">
              <el-tag
                v-for="role in userStore.userInfo.roles"
                :key="role"
                class="role-tag"
                type="primary"
                effect="light"
              >
                {{ role }}
              </el-tag>
            </div>
            <div class="social-links">
              <a
                v-if="settingsForm.githubHomepage"
                :href="settingsForm.githubHomepage"
                target="_blank"
              >
                <i class="fab fa-github"></i>
              </a>
              <a
                v-if="settingsForm.giteeHomepage"
                :href="settingsForm.giteeHomepage"
                target="_blank"
              >
                <i class="fab fa-git-alt"></i>
              </a>
              <a
                v-if="settingsForm.csdnHomepage"
                :href="settingsForm.csdnHomepage"
                target="_blank"
              >
                <i class="fas fa-code"></i>
              </a>
              <a
                v-if="settingsForm.zhihuHomepage"
                :href="settingsForm.zhihuHomepage"
                target="_blank"
              >
                <i class="fas fa-book-reader"></i>
              </a>
            </div>
            <p class="profile-intro">
              {{ settingsForm.introduction || "这个人很懒，什么都没写~" }}
            </p>
          </div>
        </div>

        <!-- 右侧设置表单 -->
        <div class="settings-form">
          <el-form
            ref="formRef"
            :model="settingsForm"
            :rules="rules"
            label-width="100px"
            v-loading="loading"
          >
            <div class="settings-main-container">
              <div class="form-section">
                <div class="section-header">
                  <el-icon>
                    <InfoFilled />
                  </el-icon>
                  <span>基本信息</span>
                </div>
                <div class="section-content">
                  <el-form-item label="博客名称" prop="name">
                    <el-input v-model="settingsForm.name" placeholder="请输入博客名称" />
                  </el-form-item>
                  <el-form-item label="博客Logo" prop="logo">
                    <el-upload
                      class="logo-uploader"
                      :show-file-list="false"
                      :before-upload="beforeLogoUpload"
                      :http-request="uploadLogo"
                    >
                      <div class="relative">
                        <img
                          v-if="settingsForm.logo"
                          :src="settingsForm.logo"
                          class="logo-image"
                        />
                        <el-icon v-else class="logo-placeholder">
                          <Picture />
                        </el-icon>
                        <div
                          class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        >
                          <el-icon class="text-white text-xl">
                            <Upload />
                          </el-icon>
                        </div>
                      </div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="作者名称" prop="author">
                    <el-input
                      v-model="settingsForm.author"
                      placeholder="请输入作者名称"
                    />
                  </el-form-item>
                  <el-form-item label="个人介绍" prop="introduction">
                    <el-input
                      type="textarea"
                      v-model="settingsForm.introduction"
                      :rows="3"
                      placeholder="请输入个人介绍"
                      resize="none"
                    />
                  </el-form-item>
                </div>
              </div>

              <div class="form-section">
                <div class="section-header">
                  <el-icon>
                    <Link />
                  </el-icon>
                  <span>社交链接</span>
                </div>
                <div class="section-content">
                  <el-form-item label="GitHub">
                    <el-input
                      v-model="settingsForm.githubHomepage"
                      placeholder="GitHub主页地址"
                    >
                      <template #prefix><i class="fab fa-github"></i></template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="Gitee">
                    <el-input
                      v-model="settingsForm.giteeHomepage"
                      placeholder="Gitee主页地址"
                    >
                      <template #prefix><i class="fab fa-git-alt"></i></template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="CSDN">
                    <el-input
                      v-model="settingsForm.csdnHomepage"
                      placeholder="CSDN主页地址"
                    >
                      <template #prefix><i class="fas fa-code"></i></template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="知乎">
                    <el-input
                      v-model="settingsForm.zhihuHomepage"
                      placeholder="知乎主页地址"
                    >
                      <template #prefix><i class="fas fa-book-reader"></i></template>
                    </el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="form-actions">
                <el-button
                  type="primary"
                  @click="handleSubmit"
                  :loading="submitting"
                  size="large"
                >
                  <el-icon>
                    <Check />
                  </el-icon>
                  保存设置
                </el-button>
              </div>
            </div>
            <div class="form-section">
              <div class="section-header">
                <el-icon>
                  <Lock />
                </el-icon>
                <span>安全设置</span>
              </div>
              <div class="section-content">
                <el-form
                  :model="passwordForm"
                  :rules="passwordRules"
                  ref="passwordFormRef"
                  class="security-form"
                >
                  <el-form-item prop="currentPassword">
                    <el-input
                      v-model="passwordForm.currentPassword"
                      type="password"
                      placeholder="当前密码"
                      :prefix-icon="Lock"
                      show-password
                    />
                  </el-form-item>
                  <el-form-item prop="newPassword">
                    <el-input
                      v-model="passwordForm.newPassword"
                      type="password"
                      placeholder="新密码"
                      :prefix-icon="Lock"
                      show-password
                      @input="checkPasswordStrength"
                    />
                    <div
                      v-if="passwordForm.newPassword"
                      class="password-strength-container"
                    >
                      <div class="password-strength-text">{{ passwordStrengthText }}</div>
                      <div class="password-strength-bar">
                        <div
                          :style="{
                            width: passwordStrengthPercentage + '%',
                            background: passwordStrengthGradient,
                          }"
                          class="strength-bar"
                        ></div>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item prop="confirmPassword">
                    <el-input
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      placeholder="确认新密码"
                      :prefix-icon="Lock"
                      show-password
                    />
                  </el-form-item>
                  <el-button
                    type="primary"
                    @click="changePassword"
                    class="security-button"
                  >
                    <el-icon>
                      <Key />
                    </el-icon>
                    修改密码
                  </el-button>
                </el-form>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  Edit,
  User,
  Setting,
  Upload,
  Check,
  UserFilled,
  InfoFilled,
  Lock,
  Key,
} from "@element-plus/icons-vue";
import { getBlogSettings, updateBlogSettings, uploadFile } from "@/api/admin/settings";
import { changePassword as changePasswordApi } from "@/api/admin/user";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const loading = ref(false);
const submitting = ref(false);
const formRef = ref(null);

// 表单数据
const settingsForm = reactive({
  name: "",
  author: "",
  introduction: "",
  avatar: "",
  logo: "",
  githubHomepage: "",
  giteeHomepage: "",
  csdnHomepage: "",
  zhihuHomepage: "",
});

// 表单验证规则
const rules = {
  name: [
    { required: true, message: "请输入博客名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
  ],
  author: [{ required: true, message: "请输入作者名称", trigger: "blur" }],
  introduction: [{ required: true, message: "请输入博客介绍", trigger: "blur" }],
};

// 社交媒体图标映射
const iconMap = {
  github: "icon-github",
  gitee: "icon-gitee",
  csdn: "icon-csdn",
  zhihu: "icon-zhihu",
};

// 获取设置数据
const fetchSettings = async () => {
  try {
    loading.value = true;
    const res = await getBlogSettings();
    if (res.success && res.data) {
      Object.assign(settingsForm, res.data);
    }
  } catch (error) {
    console.error("获取设置失败:", error);
    ElMessage.error("获取设置失败");
  } finally {
    loading.value = false;
  }
};

// 提交设置
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitting.value = true;
    const res = await updateBlogSettings(settingsForm);
    if (res.success) {
      ElMessage.success("保存成功");
    }
  } catch (error) {
    console.error("保存设置失败:", error);
    ElMessage.error("保存失败");
  } finally {
    submitting.value = false;
  }
};

// 上传相关方法
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  const isLt10M = file.size / 1024 / 1024 < 10;

  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  if (!isLt10M) {
    ElMessage.error("图片大小不能超过 10MB!");
    return false;
  }
  return true;
};

const beforeLogoUpload = beforeAvatarUpload;

const uploadAvatar = async ({ file }) => {
  try {
    let formData = new FormData();
    formData.append("file", file);
    const res = await uploadFile(formData);
    if (res.success && res.data) {
      settingsForm.avatar = res.data.url;
      ElMessage.success("头像上传成功");
    }
  } catch (error) {
    console.error("上传失败:", error);
    ElMessage.error("上传失败");
  }
};

const uploadLogo = async ({ file }) => {
  try {
    const res = await uploadFile(file);
    if (res.success && res.data) {
      settingsForm.logo = res.data.url;
      ElMessage.success("Logo上传成功");
    }
  } catch (error) {
    console.error("上传失败:", error);
    ElMessage.error("上传失败");
  }
};

// 获取store和router实例
const userStore = useUserStore();
const router = useRouter();

// 添加密码相关的响应式数据
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordFormRef = ref(null);
const passwordStrengthPercentage = ref(0);
const passwordStrengthText = ref("");
const passwordStrengthGradient = ref("");

// 密码表单校验规则
const passwordRules = {
  currentPassword: [{ required: true, message: "请输入当前密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

// 检查密码强度
const checkPasswordStrength = () => {
  const strength = calculatePasswordStrength(passwordForm.newPassword);
  if (strength === 0) {
    passwordStrengthPercentage.value = 0;
    passwordStrengthText.value = "";
    passwordStrengthGradient.value = "";
  } else if (strength < 2) {
    passwordStrengthPercentage.value = 33;
    passwordStrengthText.value = "弱";
    passwordStrengthGradient.value = "#f56c6c";
  } else if (strength < 4) {
    passwordStrengthPercentage.value = 66;
    passwordStrengthText.value = "中";
    passwordStrengthGradient.value = "#e6a23c";
  } else {
    passwordStrengthPercentage.value = 100;
    passwordStrengthText.value = "强";
    passwordStrengthGradient.value = "#67c23a";
  }
};

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[\W_]/.test(password)) strength++;
  return strength;
};

// 修改密码方法
const changePassword = () => {
  if (!passwordFormRef.value) return;

  passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await changePasswordApi(
          userStore.userInfo.username,
          passwordForm.currentPassword,
          passwordForm.newPassword
        );
        if (res.success) {
          ElMessage.success("密码修改成功，请重新登录");
          userStore.logout();
          router.push("/login");
        }
      } catch (error) {
        console.error("修改密码失败:", error);
        ElMessage.error("修改密码失败");
      }
    }
  });
};

// 初始化
onMounted(() => {
  fetchSettings();
});
</script>

<style scoped lang="scss">
.settings-container {
  @apply p-6 h-full;
  @apply bg-gray-50 dark:bg-gray-900;

  .settings-card {
    @apply max-w-7xl mx-auto rounded-xl shadow-sm;
    @apply bg-white dark:bg-gray-800;

    .card-header {
      @apply border-0 border-b pb-4;
      @apply border-gray-100 dark:border-gray-700;

      .header-left {
        @apply flex items-center gap-3;

        .header-icon {
          @apply w-10 h-10 rounded-lg flex items-center justify-center;
          @apply bg-primary-50 dark:bg-gray-700;

          .el-icon {
            @apply text-xl text-primary-500 dark:text-primary-400;
          }
        }

        .header-title {
          @apply text-xl font-semibold;
          @apply text-gray-800 dark:text-gray-200;
        }
      }
    }
  }

  .settings-layout {
    @apply grid grid-cols-1 lg:grid-cols-4 gap-8 p-6;
  }

  .profile-section {
    @apply lg:col-span-1 rounded-xl p-6;
    @apply bg-gray-50 dark:bg-gray-700;

    .profile-header {
      @apply flex flex-col items-center text-center;

      .avatar-uploader {
        @apply mb-4;

        .upload-content {
          @apply w-24 h-24 rounded-full overflow-hidden bg-white flex items-center justify-center border-2;
          @apply border-gray-200 dark:border-gray-600;
          @apply bg-white dark:bg-gray-800;

          .avatar {
            @apply w-full h-full object-cover;
          }

          .avatar-placeholder {
            @apply text-4xl text-gray-400;
          }
        }

        .upload-hover-mask {
          @apply absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 transition-opacity;

          .el-icon {
            @apply text-white text-xl;
          }
        }

        &:hover .upload-hover-mask {
          @apply opacity-100;
        }
      }

      .profile-name {
        @apply text-lg font-medium text-gray-800 dark:text-gray-200 mb-2;
      }

      .profile-intro {
        @apply text-sm text-gray-500 dark:text-gray-400 mb-4;
      }

      .user-roles {
        @apply flex flex-wrap gap-2 justify-center my-3;

        .role-tag {
          @apply text-xs px-3 py-1 rounded-full font-medium;
          background-color: rgba(var(--el-color-primary-rgb), 0.1);
          border: 1px solid rgba(var(--el-color-primary-rgb), 0.2);
          color: var(--el-color-primary);
        }
      }
    }

    .social-links {
      @apply flex justify-center gap-4;

      a {
        @apply w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary-500 dark:hover:bg-primary-600 hover:text-white;
      }
    }
  }

  .settings-form {
    @apply lg:col-span-3;

    .logo-uploader {
      @apply relative w-24 h-24 rounded-lg overflow-hidden bg-white flex items-center justify-center border-2;
      @apply border-gray-200 dark:border-gray-600;
      @apply bg-white dark:bg-gray-800;
    }

    .settings-main-container {
      @apply flex flex-col gap-8 bg-slate-50 dark:bg-gray-700/30 p-6 rounded-sm mb-3;
    }

    .form-section {
      @apply mb-8 last:mb-0;

      .section-header {
        @apply flex items-center gap-2 mb-6 pb-3 border-b border-gray-100 dark:border-gray-700;

        .el-icon {
          @apply text-lg text-primary-500 dark:text-primary-400;
        }

        span {
          @apply text-lg font-medium text-gray-700 dark:text-gray-300;
        }
      }

      .section-content {
        @apply space-y-4;
      }
    }

    .form-actions {
      @apply flex justify-center mt-8 pt-6 border-t border-gray-100 dark:border-gray-700;
    }
  }
}

// 安全设置表单样式
.security-form {
  :deep(.el-input__wrapper) {
    @apply transition-all duration-300;
    @apply dark:bg-gray-700 dark:border-gray-600;

    &:hover {
      @apply shadow-md dark:shadow-lg dark:shadow-gray-900/30;
    }

    &.is-focus {
      @apply ring-2 ring-opacity-30;
      @apply ring-primary-500 dark:ring-primary-400;
    }
  }
}

.password-strength-container {
  @apply flex items-center gap-2 mt-1 w-full;
}

.password-strength-text {
  @apply text-sm text-gray-500 dark:text-gray-400 min-w-[2em];
}

.password-strength-bar {
  @apply flex-1 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden;
}

.strength-bar {
  @apply h-1 transition-all duration-300;
}

.security-button {
  @apply w-full mt-4 flex items-center justify-center gap-2;
}

// 输入框样式
:deep(.el-input__wrapper) {
  @apply dark:bg-gray-700 dark:border-gray-600;
  @apply dark:text-gray-200;
}

// 文本域样式
:deep(.el-textarea__inner) {
  @apply dark:bg-gray-700 dark:border-gray-600;
  @apply dark:text-gray-200;
}

// 表单标签样式
:deep(.el-form-item__label) {
  @apply dark:text-gray-300;
}
</style>
