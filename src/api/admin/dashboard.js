import axios from "@/axios";

// 获取仪表盘基础信息（文章数、分类数、标签数、总浏览量）
export function getBaseStatisticsInfo(data) {
    return axios.post("/admin/dashboard/statistics", data)
}

/**
 * 获取一年的pv访问量统计数据
 * @param {Object} data 请求参数
 * @returns {Object} 返回格式为 { "2024-02-04": 0, "2024-02-05": 0 } 形式的日期-访问量键值对
 */
export function getPvStatistics(data) {
    return axios.post("/admin/dashboard/pv/statistics", data)
}

/**
 * 
 * @param {*} data 
 * @returns 
 */
// 获取一年的文章发布热点信息
export function getYearArticlePublished(data) {
    return axios.post("/admin/dashboard/publishArticle/statistics", data)
}
/**
 * 获取分类文章数量
 * @returns 
 */
export function getCategoryArticlesCount() {
    return axios.get("/admin/dashboard/category/count")
}
