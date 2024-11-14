import axios from "@/axios";


/**
 * 批量添加标签
 * @param {Array<{name: string, color: string}>} tags - 标签列表
 */
export function addTags(tags) {
    return axios.post("/admin/tag/add", { tags });
}

/**
 * 获取标签分页列表
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页数量
 * @param {string} [params.name] - 标签名称(可选)
 * @param {string} [params.startDate] - 创建起始日期(可选)
 * @param {string} [params.endDate] - 创建结束日期(可选)
 */
export function getTagsList(params) {
    return axios.post("/admin/tag/list", params);
}

/**
 * 删除标签
 * @param {number} id - 标签ID
 */
export function deleteTag(id) {
    return axios.post("/admin/tag/delete", { id });
}

/**
 * 更新标签
 * @param {number} id - 标签ID
 * @param {string} name - 标签名称
 * @param {string} color - 标签颜色
 */
export function updateTag(id, name, color) {
    return axios.post("/admin/tag/update", { id, name, color });
}

/**
 * 修改标签状态
 * @param {number} id - 标签ID
 */
export function updateTagStatus(id, status) {
    return axios.post("/admin/tag/change/status", { id });
}

/**
 * 获取标签下拉列表
 */
export function getTagSelectList() {
    return axios.post("/admin/tag/select/list");
}