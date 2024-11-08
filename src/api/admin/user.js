import axios from "@/axios";

// 登录接口
export function login(username, password) {
    return axios.post("/login", { username, password });
}

// 获取用户信息接口
export function getUserInfo() {
    return axios.post("/admin/user/info");
}

// 修改密码接口
export function changePassword(username, oldPassword, password) {
    return axios.post("/admin/password/update", { username, oldPassword, password });
}
