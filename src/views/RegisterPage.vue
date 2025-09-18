<template>
  <div class="register-page">
    
    <div class="main-container">
      <!-- 头部信息 -->
      <div class="page-header">
        <div class="logo">
          <i class="fas fa-chart-line logo-icon"></i>
          <div class="logo-text">JQuick BI</div>
        </div>
        <h1 class="page-title">创建您的账号</h1>
        <p class="page-desc">请填写租户及管理员信息完成注册，带 <span style="color: var(--primary-color);">*</span> 为必填项</p>
      </div>
      
      <!-- 注册卡片容器 -->
      <div class="register-card">
        <!-- Tab导航 -->
        <div class="tabs">
          <div 
            class="tab" 
            :class="{ active: activeTab === 'tenant' }" 
            @click="activeTab = 'tenant'"
          >
            <i class="fas fa-building"></i>
            <span>租户信息</span>
          </div>
          <div 
            class="tab" 
            :class="{ active: activeTab === 'admin' }" 
            @click="activeTab = 'admin'"
          >
            <i class="fas fa-user-tie"></i>
            <span>管理员信息</span>
          </div>
        </div>
        
        <div class="form-container">
          <!-- 租户信息Tab内容 -->
          <div class="tab-content" :class="{ active: activeTab === 'tenant' }">
            <div class="input-group">
              <el-icon><Platform /></el-icon>
              <input 
                type="text" 
                v-model="tenantForm.name" 
                placeholder="租户名称 *" 
                required
              >
            </div>
            
            <div class="input-group">
              <el-icon><Collection /></el-icon>
              <input 
                type="text" 
                v-model="tenantForm.license" 
                placeholder="营业执照/机构代码 *" 
                required
              >
            </div>
            
            <div class="input-group">
              <el-icon><Phone /></el-icon>
              <input 
                type="tel" 
                v-model="tenantForm.phone" 
                placeholder="企业联系电话 *" 
                required
              >
            </div>
            
            <div class="input-group">
              <el-icon><Suitcase /></el-icon>
              <select 
                v-model="tenantForm.industry" 
                required
              >
                <option value="" disabled>请选择所属行业 *</option>
                <option value="it">信息技术</option>
                <option value="finance">金融</option>
                <option value="retail">零售</option>
                <option value="manufacturing">制造业</option>
                <option value="education">教育</option>
                <option value="healthcare">医疗健康</option>
                <option value="other">其他行业</option>
              </select>
            </div>
            
            <div class="input-group">
               <el-icon><Location /></el-icon>
              <textarea 
                v-model="tenantForm.address" 
                placeholder="企业地址 *" 
                required
              ></textarea>
            </div>
          </div>
          
          <!-- 管理员信息Tab内容 -->
          <div class="tab-content" :class="{ active: activeTab === 'admin' }">
            <div class="input-group">
              <el-icon><User /></el-icon>
              <input 
                type="text" 
                v-model="adminForm.name" 
                placeholder="管理员姓名 *" 
                required
              >
            </div>
            
            <div class="input-group">
              <el-icon><Box /></el-icon>
              <input 
                type="email" 
                v-model="adminForm.email" 
                placeholder="电子邮箱 *" 
                required
              >
            </div>
            
            <div class="input-group">
              <el-icon><Cellphone /></el-icon>
              <input 
                type="tel" 
                v-model="adminForm.mobile" 
                placeholder="手机号码 *" 
                required
              >
            </div>
            
            <div class="input-group">
              <el-icon><Compass /></el-icon>
              <input 
                type="password" 
                v-model="adminForm.password" 
                placeholder="设置密码 *" 
                required
              >
            </div>
            
            <div class="input-group">
              <el-icon><Switch /></el-icon>
              <input 
                type="password" 
                v-model="adminForm.confirmPassword" 
                placeholder="确认密码 *" 
                required
              >
            </div>
            
            <!-- 验证码区域 -->
            <div class="captcha-group">
              <div class="captcha-input">
                <el-icon><Promotion /></el-icon>
                <input 
                  type="text" 
                  v-model="captchaInput" 
                  placeholder="请输入验证码 *" 
                  required
                >
              </div>
              <div 
                class="captcha-image" 
                id="captcha-image"
                @click="generateCaptcha"
              >
                <span>{{ captchaText }}</span>
                <i 
                  class="fas fa-sync-alt refresh-icon" 
                  id="refresh-captcha"
                  @click.stop="generateCaptcha"
                ></i>
              </div>
            </div>
            
            <div class="terms">
              <input 
                type="checkbox" 
                id="agree-terms" 
                v-model="agreeTerms"
                required
              >
              <label for="agree-terms">
                我已阅读并同意<a href="#">《服务条款》</a>和<a href="#">《隐私政策》</a>
              </label>
            </div>
            
            <button 
              class="btn-register" 
              id="register-btn"
              @click="handleRegister"
            >
              完成注册
            </button>
            
            <div class="login-link">
              已有账号？<a href="login.html">立即登录</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 页脚 -->
      <div class="footer">
        <p>© 2023 JQuick BI 数据智能分析平台</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 状态管理
const activeTab = ref('tenant');
const captchaText = ref('');
const captchaInput = ref('');
const agreeTerms = ref(false);

// 租户表单数据
const tenantForm = ref({
  name: '',
  license: '',
  phone: '',
  industry: '',
  address: ''
});

// 管理员表单数据
const adminForm = ref({
  name: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: ''
});

// 生成随机验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let captcha = '';
  for (let i = 0; i < 4; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captchaText.value = captcha;
};

// 验证验证码
const validateCaptcha = () => {
  return captchaInput.value.toLowerCase() === captchaText.value.toLowerCase();
};

// 验证密码是否一致
const validatePasswords = () => {
  return adminForm.value.password === adminForm.value.confirmPassword;
};

// 处理注册逻辑
const handleRegister = () => {
  // 验证租户信息
  if (!tenantForm.value.name || !tenantForm.value.license || 
      !tenantForm.value.phone || !tenantForm.value.industry || !tenantForm.value.address) {
    alert('请填写完整的租户信息！');
    activeTab.value = 'tenant';
    return;
  }
  
  // 验证管理员信息
  if (!adminForm.value.name || !adminForm.value.email || 
      !adminForm.value.mobile || !adminForm.value.password || !adminForm.value.confirmPassword) {
    alert('请填写完整的管理员信息！');
    return;
  }
  
  // 验证密码
  if (!validatePasswords()) {
    alert('两次输入的密码不一致！');
    return;
  }
  
  // 验证验证码
  if (!validateCaptcha()) {
    alert('验证码错误，请重新输入！');
    generateCaptcha();
    captchaInput.value = '';
    return;
  }
  
  // 验证条款同意
  if (!agreeTerms.value) {
    alert('请阅读并同意服务条款和隐私政策！');
    return;
  }
  
  // 验证通过，提交注册
  alert('注册信息验证通过！即将提交注册...');
  // 在实际应用中，这里应该提交表单数据到服务器
  console.log('租户信息:', tenantForm.value);
  console.log('管理员信息:', adminForm.value);
};

// 组件挂载时生成初始验证码
onMounted(() => {
  generateCaptcha();
});
</script>

<style>
:root {
  --primary-color: #ff8326;
  --secondary-color: #fff5eb;
  --border-color: #ffd5b8;
  --text-color: #2d3e50;
  --light-bg: #f9f9f9;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  min-height: 100vh;
  background-color: var(--light-bg);
  padding: 20px;
  position: relative;
  overflow-x: hidden;
}

/* 装饰元素 */
.decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: var(--secondary-color);
  opacity: 0.7;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -80px;
  right: 10%;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -50px;
  left: 15%;
}

.main-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  z-index: 2;
  padding: 30px 0;
}

/* 头部信息 */
.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 0 20px;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.logo-icon {
  font-size: 28px;
  color: var(--primary-color);
  margin-right: 10px;
}

.logo-text {
  font-size: 26px;
  font-weight: 700;
  color: var(--primary-color);
}

.page-title {
  font-size: 22px;
  color: var(--text-color);
  margin-bottom: 8px;
}

.page-desc {
  font-size: 15px;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
}

.register-card {
  width: 100%;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

/* Tab导航样式 */
.tabs {
  display: flex;
  background-color: var(--secondary-color);
}

.tab {
  flex: 1;
  padding: 18px;
  text-align: center;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab.active {
  background-color: white;
  border-bottom: 3px solid var(--primary-color);
  color: var(--primary-color);
}

.tab:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.5);
}

.tab i {
  font-size: 16px;
}

.form-container {
  padding: 25px 30px;
}

/* Tab内容样式 */
.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

.input-group {
  margin-bottom: 20px;
  position: relative;
}

.input-group i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
}

.input-group input,
.input-group select,
.input-group textarea {
  width: 100%;
  padding: 14px 20px 14px 50px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
  background-color: white;
}

.input-group textarea {
  min-height: 100px;
  padding-top: 18px;
  resize: vertical;
}

.input-group input:focus,
.input-group select:focus,
.input-group textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 131, 38, 0.2);
  outline: none;
}

/* 验证码区域样式 */
.captcha-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.captcha-input {
  flex: 1;
  position: relative;
}

.captcha-input i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
}

.captcha-input input {
  width: 100%;
  padding: 14px 20px 14px 50px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
  background-color: white;
}

.captcha-input input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 131, 38, 0.2);
  outline: none;
}

.captcha-image {
  height: 48px;
  background: var(--secondary-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  border: 1px solid var(--border-color);
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  font-size: 18px;
  color: var(--primary-color);
  letter-spacing: 5px;
  padding: 0 10px;
  position: relative;
  overflow: hidden;
}

.captcha-image::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.5) 50%, transparent 60%);
  animation: shine 3s infinite linear;
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

.captcha-image .refresh-icon {
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 10px;
  color: var(--primary-color);
}

.terms {
  margin-bottom: 25px;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: flex-start;
}

.terms input {
  margin-right: 8px;
  margin-top: 3px;
  accent-color: var(--primary-color);
}

.terms a {
  color: var(--primary-color);
  text-decoration: none;
}

.terms a:hover {
  text-decoration: underline;
}

.btn-register {
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #ff8326, #ff6a00);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(255, 131, 38, 0.3);
}

.btn-register:hover {
  background: linear-gradient(to right, #ff6a00, #ff8326);
  box-shadow: 0 4px 8px rgba(255, 131, 38, 0.4);
  transform: translateY(-1px);
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 15px;
  color: #666;
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  color: #ff6a00;
  text-decoration: underline;
}

.footer {
  text-align: center;
  color: #999;
  font-size: 13px;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .tab span {
    display: none;
  }
  
  .tab i {
    font-size: 18px;
  }
  
  .captcha-group {
    flex-direction: column;
  }
  
  .captcha-image {
    width: 100%;
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 20px 15px;
  }
  
  .page-title {
    font-size: 19px;
  }
  
  .terms {
    font-size: 13px;
  }
}
</style>