import axios from "@/axios";

/**
 * 获取博客基础信息
 */
export function getBlogSettings() {
    return axios.post("/admin/blog/settings/details");
}

/**
 * 更新博客基础信息
 * @param {Object} data - 博客设置数据
 * @param {string} data.name - 博客名称
 * @param {string} data.author - 作者名称
 * @param {string} data.introduction - 博客介绍
 * @param {string} data.avatar - 头像地址
 * @param {string} data.logo - Logo地址
 * @param {string} data.githubHomepage - GitHub主页
 * @param {string} data.giteeHomepage - Gitee主页
 * @param {string} data.csdnHomepage - CSDN主页
 * @param {string} data.zhihuHomepage - 知乎主页
 */
export function updateBlogSettings(data) {
    return axios.post("/admin/blog/settings/update", data);
}

/**
 * 上传文件
 * @param {File} file - 要上传的文件
 * @returns {Promise} 返回上传结果
 */
export function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post("/admin/file/upload", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
} 