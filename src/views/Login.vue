<template>
  <div class="login-container">
    <div class="login-background">


      <div class="login-right-panel">
        <div class="login-form-container">
          <div class="form-header">
            <h2>欢迎回来</h2>
            <p>请输入您的账号密码登录系统</p>
          </div>

          <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form">
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名或邮箱"
                size="large"
                prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <a class="forgot-password" @click="handleForgotPassword">忘记密码？</a>
            </div>

            <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleLogin"
              class="login-btn"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>

            <div class="divider">
              <span>或</span>
            </div>

            <div class="social-login">
              <el-button class="social-btn wechat">
                <span class="social-icon">💬</span>
                微信登录
              </el-button>
              <el-button class="social-btn dingtalk">
                <span class="social-icon">🔔</span>
                钉钉登录
              </el-button>
            </div>
          </el-form>

          <div class="register-link">
            还没有账号？<a @click="handleRegister">立即注册</a>
          </div>
        </div>
      </div>
    </div>

    <div class="login-footer">
      <p>© 2024 QuickBI 智能数据分析平台 · 隐私政策 · 服务条款</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const loginFormRef = ref(null)
    const loading = ref(false)
    const rememberMe = ref(false)

    const loginForm = reactive({
      username: '',
      password: ''
    })

    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名长度不能小于3个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
      ]
    }

    const handleLogin = async () => {
      if (!loginFormRef.value) return
      
      try {
        const valid = await loginFormRef.value.validate()
        if (valid) {
          loading.value = true
          // 模拟登录请求
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          ElMessage.success('登录成功！')
          router.push('/dashboard')
        }
      } catch (error) {
        ElMessage.error('登录失败，请检查用户名和密码')
      } finally {
        loading.value = false
      }
    }

    const handleForgotPassword = () => {
      ElMessage.info('忘记密码功能即将开放')
    }

    const handleRegister = () => {
      ElMessage.info('注册功能即将开放')
    }

    return {
      loginFormRef,
      loginForm,
      rules,
      loading,
      rememberMe,
      handleLogin,
      handleForgotPassword,
      handleRegister
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff8f0 0%, #ffe5d0 100%);
  display: flex;
  flex-direction: column;
}

.login-background {
  flex: 1;
  display: flex;
  min-height: calc(100vh - 60px);
}

.login-left-panel {
  flex: 1;
  background: linear-gradient(135deg, #ff7b00 0%, #ff5500 100%);
  color: white;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.logo-section {
  margin-bottom: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 48px;
}

.logo h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.slogan {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.feature-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-text h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.feature-text p {
  margin: 0;
  opacity: 0.8;
  font-size: 14px;
}

.login-form-container {
  background: white;
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(255, 119, 0, 0.15);
  width: 100%;
  max-width: 450px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #ff7b00;
  margin: 0 0 10px 0;
}

.form-header p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.login-form {
  width: 100%;
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(255, 119, 0, 0.1);
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 2px 12px rgba(255, 119, 0, 0.2);
}

:deep(.el-input__inner) {
  color: #333;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

:deep(.el-checkbox) {
  color: #666;
}

.forgot-password {
  color: #ff7b00;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff7b00 0%, #ff5500 100%);
  border: none;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 30px;
}

.login-btn:hover {
  background: linear-gradient(135deg, #ff5500 0%, #ff3d00 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 119, 0, 0.3);
}

.divider {
  position: relative;
  text-align: center;
  margin: 30px 0;
  color: #ccc;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #eee;
  z-index: 1;
}

.divider span {
  background: white;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.social-login {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.social-btn {
  flex: 1;
  height: 45px;
  border-radius: 12px;
  border: 1px solid #eee;
  background: white;
  color: #666;
}

.social-btn:hover {
  border-color: #ff7b00;
  color: #ff7b00;
  transform: translateY(-1px);
}

.social-icon {
  margin-right: 8px;
  font-size: 16px;
}

.register-link {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.register-link a {
  color: #ff7b00;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}

.register-link a:hover {
  text-decoration: underline;
}

.login-footer {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  color: #666;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-background {
    flex-direction: column;
  }
  
  .login-left-panel {
    padding: 40px 20px;
  }
  
  .login-right-panel {
    padding: 20px;
  }
  
  .login-form-container {
    padding: 30px;
  }
  
  .features {
    gap: 20px;
  }
  
  .feature-item {
    gap: 15px;
  }
  
  .feature-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
}
</style>