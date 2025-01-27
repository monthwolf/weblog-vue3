import axios from "@/axios";

/**
 * 添加分类
 * @param {string} name - 分类名称
 * @param {number} sort - 排序
 */
export function addCategory(name, sort) {
    return axios.post("/admin/category/add", { name, sort });
}

/**
 * 修改分类
 * @param {number} id - 分类ID
 * @param {string} name - 分类名称
 * @param {number} sort - 排序
 */
export function updateCategory(id, name, sort) {
    return axios.post("/admin/category/update", { id, name, sort });
}

/**
 * 删除分类
 * @param {number} id - 分类ID
 */
export function deleteCategory(id) {
    return axios.post("/admin/category/delete", { id });
}

/**
 * 获取分类分页列表
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页数量
 * @param {string} [params.name] - 分类名称(可选)
 * @param {string} [params.startDate] - 创建起始日期(可选)
 * @param {string} [params.endDate] - 创建结束日期(可选)
 */
export function getCategoryList(params) {
    return axios.post("/admin/category/list", params);
}

// 获取分类 select 数据
export function getCategorySelectList() {
    return axios.post("/admin/category/select/list")
}
