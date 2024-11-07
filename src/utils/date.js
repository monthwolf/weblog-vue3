export function formatDate(date) {
    if (!date) return ''
    if (typeof date === 'string') {
        date = new Date(date)
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function formatDateShort(date) {
    if (!date) return ''
    if (typeof date === 'string') {
        date = new Date(date)
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export function getTimeAgo(date) {
    if (!date) return ''
    if (typeof date === 'string') {
        date = new Date(date)
    }

    const now = new Date()
    const diff = now - date
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
        return days + '天前'
    } else if (hours > 0) {
        return hours + '小时前'
    } else if (minutes > 0) {
        return minutes + '分钟前'
    } else {
        return '刚刚'
    }
}

export function isToday(date) {
    if (!date) return false
    if (typeof date === 'string') {
        date = new Date(date)
    }

    const today = new Date()
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
}

export function isThisWeek(date) {
    if (!date) return false
    if (typeof date === 'string') {
        date = new Date(date)
    }

    const now = new Date()
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    const weekEnd = new Date(now.setDate(now.getDate() + 6))

    return date >= weekStart && date <= weekEnd
}

export function isThisMonth(date) {
    if (!date) return false
    if (typeof date === 'string') {
        date = new Date(date)
    }

    const now = new Date()
    return date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
} 