<template>
  <div class="register-page">
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
        <div class="register-container">
          <div class="login-card">
            <div class="card-header">
              <h2>创建您的账号</h2>
              <p class="page-description text-align-left">请填写租户及管理员信息完成注册，带 <span style="color: var(--primary-color);">*</span> 为必填项</p>
            </div>
            
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
                <div class="form-group">
                  <div class="input-group">
                    <el-icon><Platform /></el-icon>
                    <input 
                      type="text" 
                      v-model="tenantForm.name" 
                      placeholder="租户名称 *" 
                      required
                      class="form-control"
                    >
                  </div>
                </div>
                
                <div class="form-group">
                  <div class="input-group">
                    <el-icon><Collection /></el-icon>
                    <input 
                      type="text" 
                      v-model="tenantForm.code" 
                      placeholder="营业执照/机构代码 *" 
                      required
                      class="form-control"
                    >
                  </div>
                </div>
                
                <div class="form-group">
                  <div class="input-group">
                    <el-icon><Phone /></el-icon>
                    <input 
                      type="tel" 
                      v-model="tenantForm.tel" 
                      placeholder="企业联系电话 *" 
                      required
                      class="form-control"
                    >
                  </div>
                </div>
                
                <div class="form-group">
                  <div class="input-group">
                    <el-icon><Suitcase /></el-icon>
                    <select 
                      v-model="tenantForm.industryId" 
                      required
                      class="form-control"
                    >
                      <option value="" disabled>请选择所属行业 *</option>
                      <option v-for="industry in industrys" :key="industry.id" :value="industry.id">{{ industry.name }}</option>
                    </select>
                  </div>
                </div>
                
                <div class="form-group">
                  <div class="input-group">
                    <el-icon><Location /></el-icon>
                    <textarea 
                      v-model="tenantForm.address" 
                      placeholder="企业地址 *" 
                      required
                      class="form-control"
                    ></textarea>
                  </div>
                </div>
                
                <button 
                  class="btn btn-primary" 
                  @click="activeTab = 'admin'"
                  style="margin-top: 16px;"
                >
                  下一步
                </button>
              </div>
              
              <!-- 管理员信息Tab内容 -->
              <div class="tab-content" :class="{ active: activeTab === 'admin' }">
                <div class="form-group">
                  <div class="input-group">
                    <el-icon><User /></el-icon>
                    <input 
                      type="text" 
                      v-model="adminForm.loginName" 
                      placeholder="登录名 *" 
                      required
                      class="form-control"
                    >
                  </div>
                </div>
                
                <div class="form-group">
                  <div class="input-group">
                    <el-icon><Box /></el-icon>
                    <input 
                      type="email" 
                      v-model="adminForm.email" 
                      placeholder="电子邮箱 *" 
                      required
                      class="form-control"
                    >
                  </div>
                </div>
                
                <div class="form-group">
                  <div class="input-group">
                    <el-icon><Cellphone /></el-icon>
                    <input 
                      type="tel" 
                      v-model="adminForm.phone" 
                      placeholder="手机号码 *" 
                      required
                      class="form-control"
                    >
                  </div>
                </div>
                
                <div class="form-group">
                  <div class="input-group">
                    <el-icon><Compass /></el-icon>
                    <input 
                      type="password" 
                      v-model="adminForm.passwd" 
                      placeholder="设置密码 *" 
                      required
                      class="form-control"
                    >
                  </div>
                </div>
                
                <div class="form-group">
                  <div class="input-group">
                    <el-icon><Switch /></el-icon>
                    <input 
                      type="password" 
                      v-model="adminForm.confirmPassword" 
                      placeholder="确认密码 *" 
                      required
                      class="form-control"
                    >
                  </div>
                </div>
                
                <!-- 验证码区域 -->
                <div class="form-group">
                  <div class="captcha-group">
                    <div class="captcha-input input-group">
                      <el-icon><Promotion /></el-icon>
                      <input 
                        type="text" 
                        v-model="captchaInput" 
                        placeholder="请输入验证码 *" 
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
                
                <div class="terms form-group">
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
                  class="btn btn-primary" 
                  @click="handleRegister"
                >
                  完成注册
                </button>
                
                <div class="login-link" style="text-align: center; margin-top: 16px;">
                  已有账号？<a @click="login" class="register-link">立即登录</a>
                </div>
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
import request from '../api/request';
const router = useRouter();
const activeTab = ref('tenant');
const captchaInput = ref('');
const agreeTerms = ref(false);
const industrys = ref([]);
const tenantForm = ref({
  name: '',
  code: '',
  tel: '',
  industryId: '',
  address: ''
});

function login() {
  router.push('/login');
}

// 管理员表单数据
const adminForm = ref({
  loginName: '',
  email: '',
  phone: '',
  passwd: '',
  confirmPassword: ''
});

const captchaImage = ref('');
const deviceId = ref('');

const generateCaptcha = () => {
  const currentTimestamp = Date.now();
  deviceId.value = currentTimestamp
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
};

function getIndustry() {
  request.get('/api/pub/industry/list')
  .then(response => {
    industrys.value = response.data;
  })
  .catch(error => {
    console.error('获取行业失败:', error);
  });
}

const validatePasswords = () => {
  return adminForm.value.passwd === adminForm.value.confirmPassword;
};

const handleRegister = () => {
  if (!tenantForm.value.name || !tenantForm.value.code || 
      !tenantForm.value.tel || !tenantForm.value.industryId || !tenantForm.value.address) {
    alert('请填写完整的租户信息！');
    activeTab.value = 'tenant';
    return;
  }
  
  if (!adminForm.value.loginName || !adminForm.value.email || 
      !adminForm.value.phone || !adminForm.value.passwd || !adminForm.value.confirmPassword) {
    alert('请填写完整的管理员信息！');
    return;
  }

  if (!validatePasswords()) {
    alert('两次输入的密码不一致！');
    return;
  }

  if (!agreeTerms.value) {
    alert('请阅读并同意服务条款和隐私政策！');
    return;
  }
  
  const param = {
    deviceId: deviceId.value,
    validateCode: captchaInput.value,
    tenant: tenantForm.value,
    user: adminForm.value
  };
  
  request.post('/api/pub/tenant/create', param)
  .then(response => {
    if (response.code === 200) {
      console.log('注册成功');
      router.push('/login');
    } else {
      alert(response.message);
    }
  })
  .catch(error => {
    console.error('注册失败:', error);
  });
};

// 组件挂载时生成初始验证码
onMounted(() => {
  getIndustry();
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

/* 顶部导航栏 - 与LoginPage保持一致 */
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

/* 主内容区 - 与LoginPage保持一致 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 24px;
}

.register-container {
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

/* Tab导航样式 */
.tabs {
  display: flex;
  background-color: var(--secondary-color);
  border-bottom: 1px solid var(--border-color);
}

.tab {
  flex: 1;
  padding: 12px;
  text-align: center;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab.active {
  background-color: white;
  border-bottom: 2px solid var(--primary-color);
}

.tab:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.5);
}

/* 表单样式 - 与LoginPage保持一致 */
.form-container {
  padding: 24px;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
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

input.form-control, select.form-control {
  height: 42px;
}

textarea.form-control {
  min-height: 100px;
  padding-top: 12px;
  resize: vertical;
}

/* 验证码区域 - 与LoginPage保持一致 */
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

/* 条款和按钮样式 */
.terms {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.terms input {
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

/* 按钮样式 - 与LoginPage保持一致 */
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

/* 链接样式 */
.register-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s;
}

.register-link:hover {
  color: #e65c00;
  text-decoration: underline;
}

/* 应用信息区域 - 与LoginPage保持一致 */
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

/* 页脚 - 与LoginPage保持一致 */
.footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  font-size: 14px;
  color: #666;
}

/* 响应式调整 - 与LoginPage保持一致 */
@media (max-width: 992px) {
  .register-container {
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
  
  .tab span {
    display: none;
  }
}
</style>