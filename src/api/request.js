import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例 - 移除环境变量引用
const service = axios.create({
  baseURL: '', // 直接使用相对路径
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.log('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data // 直接返回数据，让组件处理业务逻辑
  },
  error => {
    console.log('响应错误:', error)
    
    let message = '请求失败'
    if (error.response) {
      message = error.response.data?.message || `错误码: ${error.response.status}`
    } else if (error.request) {
      message = '网络连接异常'
    }
    
    ElMessage({
      message,
      type: 'error',
      duration: 3000
    })
    
    return Promise.reject(error)
  }
)

export default service