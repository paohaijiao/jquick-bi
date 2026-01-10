import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '', // 直接使用相对路径
  timeout: 1000000
})
const whiteList = [
  '/api/pub/captcha/image' // 获取验证码接口
]
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
     const isInWhiteList = whiteList.some(path => config.url.startsWith(path))
      if (!isInWhiteList) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  },
  error => {
    ElMessage.error({
      message: '请求错误:',
      duration: 3000 
    })
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
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