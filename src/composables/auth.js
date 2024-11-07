import { useCookies } from '@vueuse/integrations/useCookies'

// 创建cookies实例
const TOKEN_KEY = 'Authorization'
const cookies = useCookies()

// 获取用户token
export function getToken() {
    return cookies.get(TOKEN_KEY) || null
}

// 设置用户token
export function setToken(token) {
    cookies.set(TOKEN_KEY, token)
}

// 删除用户token
export function clearToken() {
    cookies.remove(TOKEN_KEY)
}


