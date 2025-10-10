<template>
  <div class="login-page">
    <div class="container">
      <!-- 顶部导航栏 -->
      <header class="header">
        <div class="logo">
          <i class="fas fa-chart-line"></i>
          <span>JQuick BI</span>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <el-icon><search /></el-icon>
            <input type="text" placeholder="搜索报表、数据集或文档...">
          </div>
        </div>
      </header>
      
      <!-- 主内容区 -->
      <div class="main-content">
        <div class="login-container">
          <div class="login-card">
            <div class="card-header">
              <h2 >用户登录</h2>
              <p class="page-description text-align-left">登录JQuick BI数据智能分析平台</p>
            </div>
            <div class="form-container">
              <div class="form-group">
                <div class="input-group">
                  <el-icon><User /></el-icon>
                  <input 
                    type="text" 
                    v-model="username" 
                    placeholder="用户名" 
                    required
                    class="form-control"
                  >
                </div>
              </div>
              <div class="form-group">
                <div class="input-group">
                  <el-icon><Lock /></el-icon>
                  <input 
                    type="password" 
                    v-model="password" 
                    placeholder="密码" 
                    required
                    class="form-control"
                  >
                </div>
              </div>
              
              <!-- 验证码区域 -->
              <div class="form-group">
                <div class="captcha-group">
                  <div class="captcha-input input-group">
                    <el-icon><Key /></el-icon>
                    <input 
                      type="text" 
                      v-model="captchaInput" 
                      placeholder="请输入验证码" 
                      required
                      class="form-control"
                    >
                  </div>
                  <div 
                    class="captcha-image" 
                    @click="generateCaptcha"
                  >
                   <img :src="captchaImage" style="width:120px;height:42px" />
                    <i 
                      class="fas fa-sync-alt refresh-icon" 
                      @click.stop="generateCaptcha"
                    ></i>
                  </div>
                </div>
              </div>
              
              <div class="remember-forgot">
                <label class="remember">
                  <input 
                    type="checkbox" 
                    v-model="rememberMe"
                  >
                  记住我
                </label>
                <a href="#" class="forgot">忘记密码?</a>
              </div>
              
              <button 
                class="btn btn-primary" 
                @click="handleLogin"
              >
                <i class="fas fa-sign-in-alt"></i> 登录
              </button>
              
              <div class="divider">
                <span>或使用其他方式登录</span>
              </div>
              
              <div class="social-login">
                <a href="#" class="operation-btn social-btn social-btn-disabled" disabled>
                  <i class="fab fa-weixin"></i>
                </a>
                <a href="#" class="operation-btn social-btn social-btn-disabled" disabled>
                  <i class="fab fa-qq"></i>
                </a>
                <a href="#" class="operation-btn social-btn social-btn-disabled" disabled>
                  <i class="fab fa-weibo"></i>
                </a>
                <a href="#" class="operation-btn social-btn social-btn-disabled" disabled>
                  <i class="fab fa-github"></i>
                </a>
              </div>
              
              <div class="external-links">
                <a 
                  href="https://github.com/paohaijiao/jquickbi.git" 
                  class="github-link" 
                  target="_blank"
                >
                  <i class="fab fa-github"></i> GitHub项目
                </a>
                <a 
                  @click="register"
                  class="register-link"
                >
                  <i class="fas fa-user-plus"></i> 注册账号
                </a>
              </div>
            </div>
          </div>
          
          <div class="app-info">
            <h2 class="page-title text-align-left">JQuick BI 数据智能分析平台</h2>
            <p class="page-description">将复杂数据转化为直观见解，助力企业智能决策。我们的平台提供强大的数据可视化工具和实时分析功能。</p>
            <ul class="features">
              <li><i class="fas fa-bolt"></i> 快速数据处理与分析</li>
              <li><i class="fas fa-chart-line"></i> 多维度数据可视化</li>
              <li><i class="fas fa-cloud"></i> 云端报告实时共享</li>
              <li><i class="fas fa-shield-alt"></i> 企业级数据安全保障</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p>© 2023 JQuick BI · 数据智能分析平台 · 隐私政策 · 服务条款</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
import request from '../api/request';
const username = ref('');
const password = ref('');
const rememberMe = ref(true);
const captchaImage = ref('');
const captchaInput = ref('');
import { ElMessage } from 'element-plus';
const deviceId = ref('');

function generateCaptcha() {
  const currentTimestamp = Date.now();
  deviceId.value = currentTimestamp;
  request.get('/api/pub/captcha/image?deviceId=' + currentTimestamp, {
    responseType: 'arraybuffer'  
  })
  .then(response => {
    const blob = new Blob([response], { type: 'image/png' })
    const reader = new FileReader()
    reader.onload = (e) => {
      captchaImage.value = e.target.result
    }
    reader.readAsDataURL(blob)
  })
  .catch(error => {
    console.error('获取验证码失败:', error);
  });
}

function register() {
  router.push('/register');
}

function handleLogin() {
  if (!username.value || !password.value || !captchaInput.value) {
    ElMessage.warning('请填写所有必填字段！');
    return;
  }
  
  const params = new URLSearchParams();
  params.append('client_id', 'client');
  params.append('client_secret', '1qaz@WSX');
  params.append('grant_type', 'captcha');
  params.append('username', username.value);
  params.append('password', password.value);
  params.append('scope', 'all');
  params.append('captcha', captchaInput.value);
  params.append('deviceId', deviceId.value);

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  
  request.post('/api/oauth/token', params.toString(), config)
    .then(response => {
      ElMessage.success('登录成功');
      localStorage.setItem('tokenInfo', JSON.stringify(response));
      localStorage.setItem('token', response.access_token);
      router.push('/index');
    })
    .catch(error => {
      console.log(error);
      ElMessage.error('登录失败，请检查用户名密码');
    });
}

// 组件挂载时初始化验证码
onMounted(() => {
  generateCaptcha();
});
</script>

<style scoped>
:root {
  --primary-color: #ff8326;
  --secondary-color: #fff5eb;
  --border-color: #ffd5b8;
  --text-color: #2d3e50;
  --light-bg: #f9f9f9;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  --header-height: 60px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  color: var(--text-color);
  background-color: var(--light-bg);
  height: 100vh;
  overflow: hidden;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 顶部导航栏 */
.header {
  height: var(--header-height);
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: var(--primary-color);
  font-size: 22px;
}

.logo i {
  margin-right: 10px;
  font-size: 26px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  position: relative;
  width: 280px;
}

.search-box input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.2);
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

/* 主内容区 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 24px;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 40px;
  align-items: center;
}

.login-card {
  flex: 1;
  max-width: 450px;
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--light-bg);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
}

.page-description {
  font-size: 14px;
  color: #666;
}

.form-container {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.input-group {
  position: relative;
}

.input-group i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
}

.form-control {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.2);
}

/* 验证码区域 */
.captcha-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-input {
  flex: 1;
  position: relative;
}

.captcha-image {
  width: 120px;
  height: 42px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  position: relative;
  cursor: pointer;
}

.refresh-icon {
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 12px;
  color: #666;
  background-color: rgba(255, 255, 255, 0.7);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
  font-size: 14px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.remember input {
  accent-color: var(--primary-color);
}

.forgot {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s;
}

.forgot:hover {
  color: #e65c00;
}

/* 按钮样式 */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  width: 100%;
}

.btn-primary {
  background: linear-gradient(to right, #ff8326, #ff6a00);
  color: white;
  box-shadow: 0 2px 5px rgba(255, 131, 38, 0.3);
  padding: 10px 16px;
}

.btn-primary:hover {
  background: linear-gradient(to right, #ff6a00, #ff8326);
  box-shadow: 0 4px 8px rgba(255, 131, 38, 0.4);
  transform: translateY(-1px);
}

.btn i {
  margin-right: 8px;
}

.divider {
  margin: 24px 0;
  height: 1px;
  background-color: var(--border-color);
  position: relative;
  text-align: center;
}

.divider span {
  position: relative;
  top: -10px;
  background-color: white;
  padding: 0 12px;
  color: #666;
  font-size: 12px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.operation-btn {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  background-color: transparent;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s;
}

.operation-btn:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.social-btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.external-links {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.github-link, .register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.github-link i, .register-link i {
  margin-right: 8px;
}

.github-link:hover, .register-link:hover {
  color: #e65c00;
  text-decoration: underline;
}

.app-info {
  flex: 1;
  padding: 24px;
}

.features {
  list-style: none;
  margin-top: 24px;
}

.features li {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #666;
}

.features i {
  margin-right: 12px;
  color: var(--primary-color);
  width: 24px;
  height: 24px;
  background-color: var(--secondary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  font-size: 14px;
  color: #666;
}

@media (max-width: 992px) {
  .login-container {
    flex-direction: column;
  }
  
  .app-info {
    order: -1;
    text-align: center;
  }
  
  .features li {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .captcha-group {
    flex-direction: column;
  }
  
  .captcha-image {
    width: 100%;
  }
  
  .header-actions {
    display: none;
  }
}
</style>