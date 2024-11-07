import axios from "axios";
import { getToken } from "@/composables/auth";
import { showMessage } from "@/composables/utils";

// 创建 Axios 实例
const instance = axios.create({
    baseURL: "/api", // 你的 API 基础 URL
    timeout: 6000, // 请求超时时间
})

// 添加请求拦截器
instance.interceptors.request.use(config => {
    const token = getToken()
    console.log("添加token", token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}` // 设置请求头
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(response => {
    return response.data
}, error => {
    // 响应码超过2xx，则抛出错误
    let message = error.response.data.message || "请求失败"
    showMessage(message, "error")
    return Promise.reject(error)
})


// 暴露出去
export default instance;
