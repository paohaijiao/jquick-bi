<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">
        <i class="fas fa-chart-line"></i>
        <span>JQuick BI</span>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <el-icon><Search /></el-icon>
          <input type="text" placeholder="搜索报表、数据源或文档...">
        </div>
        <div class="notification-icon">
          <i class="far fa-bell"></i>
          <span class="notification-badge">3</span>
        </div>
        <div class="user-info" @click="handleUserClick">
          <div class="user-avatar">ZL</div>
          <span class="user-name">张磊</span>
          <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
        </div>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧菜单 -->
      <aside class="sidebar" :class="{ show: sidebarShow }">
        <div class="menu-section">
          <div class="menu-section-title">主导航</div>
          <div class="menu-item" @click="handleMenuItemClick('home')">
            <i class="fas fa-home"></i>
            <span>首页</span>
          </div>
          <div class="menu-item" @click="toggleSubmenu('dataSource')">
            <i class="fas fa-database"></i>
            <span>数据源</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
          </div>
          <div class="submenu" :class="{ show: submenus.dataSource }">
            <div class="submenu-item" @click="handleSubmenuItemClick('dataSourceList')">数据源列表</div>
            <div class="submenu-item" @click="handleSubmenuItemClick('addDataSource')">新增数据源</div>
            <div class="submenu-item" @click="handleSubmenuItemClick('dataSourcePermission')">数据源权限</div>
          </div>
          <div class="menu-item" @click="toggleSubmenu('report')">
            <i class="fas fa-file-alt"></i>
            <span>报表</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
          </div>
          <div class="submenu" :class="{ show: submenus.report }">
            <div class="submenu-item" @click="handleSubmenuItemClick('myReport')">我的报表</div>
            <div class="submenu-item" @click="handleSubmenuItemClick('sharedReport')">共享报表</div>
            <div class="submenu-item" @click="handleSubmenuItemClick('favoriteReport')">收藏报表</div>
            <div class="submenu-item" @click="handleSubmenuItemClick('recycleBin')">回收站</div>
          </div>
          <div class="menu-item" @click="handleMenuItemClick('dashboard')">
            <i class="fas fa-chart-pie"></i>
            <span>仪表盘</span>
            <span class="menu-badge">5</span>
          </div>
          <div class="menu-item" @click="handleMenuItemClick('dataset')">
            <i class="fas fa-cubes"></i>
            <span>数据集</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">系统管理</div>
          <div class="menu-item" @click="handleMenuItemClick('userManagement')">
            <i class="fas fa-users"></i>
            <span>用户管理</span>
          </div>
          <div class="menu-item" @click="handleMenuItemClick('rolePermission')">
            <i class="fas fa-user-shield"></i>
            <span>角色权限</span>
          </div>
          <div class="menu-item" @click="handleMenuItemClick('operationLog')">
            <i class="fas fa-history"></i>
            <span>操作日志</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">个人中心</div>
          <div class="menu-item" @click="handleMenuItemClick('personalInfo')">
            <i class="fas fa-user-circle"></i>
            <span>个人信息</span>
          </div>
          <div class="menu-item" @click="handleMenuItemClick('securitySetting')">
            <i class="fas fa-lock"></i>
            <span>安全设置</span>
          </div>
          <div class="menu-item" @click="handleMenuItemClick('preference')">
            <i class="fas fa-cog"></i>
            <span>偏好配置</span>
          </div>
          <div class="menu-item" @click="handleMenuItemClick('logout')">
            <i class="fas fa-sign-out-alt"></i>
            <span>退出登录</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">帮助中心</div>
          <div class="menu-item" @click="handleMenuItemClick('helpDoc')">
            <i class="fas fa-question-circle"></i>
            <span>帮助文档</span>
          </div>
          <div class="menu-item" @click="handleMenuItemClick('videoTutorial')">
            <i class="fas fa-play-circle"></i>
            <span>视频教程</span>
          </div>
          <div class="menu-item active" @click="handleMenuItemClick('contact')">
            <i class="fas fa-comment-dots"></i>
            <span>联系客服</span>
          </div>
        </div>
      </aside>
      
      <!-- 右侧联系客服区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title text-align-left">联系客服</h1>
            <p class="page-description">如有任何问题或建议，请通过以下方式联系我们</p>
          </div>
        </div>
        
        <!-- 联系信息卡片 -->
        <div class="contact-card">
          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="contact-details">
                <h3 class="text-align-left">电子邮件支持</h3>
                <p>发送邮件至我们的客服邮箱，我们将在24小时内回复您</p>
                <p style="margin-top: 8px;" class="text-align-left"><a href="mailto:goudingcheng@gmail.com" class="contact-email">goudingcheng@gmail.com</a></p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="contact-details">
                <h3 class="text-align-left">服务时间</h3>
                <p class="text-align-left">工作日: 9:00 - 18:00</p>
                <p class="text-align-left">周末及法定节假日: 10:00 - 16:00</p>
              </div>
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;" class="text-align-left">
            为了能更快速准确地解决您的问题，请在邮件中尽量详细地描述您遇到的情况，
            包括问题截图、操作步骤和系统版本等信息。我们的技术支持团队会尽快为您提供帮助。
          </p>
        </div>
        
        <!-- 发送邮件表单 -->
        <div class="email-form-container">
          <div class="form-title text-align-left" >发送邮件咨询</div>
          <form @submit.prevent="handleFormSubmit">
            <div class="form-group">
              <label class="form-label text-align-left" for="emailSubject">主题 <span style="color: #ff4d4f;">*</span></label>
              <input type="text" class="form-control" id="emailSubject" v-model="formData.subject" placeholder="请输入邮件主题" required>
              <span class="form-hint text-align-left">请简明扼要地描述您的问题主题</span>
            </div>
            
            <div class="form-group">
              <label class="form-label text-align-left" for="emailFrom">您的邮箱 <span style="color: #ff4d4f;">*</span></label>
              <input type="email" class="form-control" id="emailFrom" v-model="formData.from" required>
              <span class="form-hint text-align-left">我们将通过此邮箱回复您的咨询</span>
            </div>
            
            <div class="form-group">
              <label class="form-label text-align-left" for="emailCategory">问题分类 <span style="color: #ff4d4f;">*</span></label>
              <select class="form-control" id="emailCategory" v-model="formData.category" required>
                <option value="">请选择问题类型</option>
                <option value="账号问题">账号问题</option>
                <option value="功能使用">功能使用</option>
                <option value="数据异常">数据异常</option>
                <option value="性能问题">性能问题</option>
                <option value="功能建议">功能建议</option>
                <option value="其他问题">其他问题</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label text-align-left" for="emailMessage">问题描述 <span style="color: #ff4d4f;">*</span></label>
              <textarea class="form-control" id="emailMessage" v-model="formData.message" placeholder="请详细描述您遇到的问题，包括操作步骤、错误信息等..." required></textarea>
              <span class="form-hint text-align-left">请提供尽可能详细的信息，以便我们更快解决您的问题</span>
            </div>
            
            <div class="form-group">
              <label class="form-label text-align-left" for="emailAttachment">附件</label>
              <input type="file" class="form-control" id="emailAttachment" multiple @change="handleFileChange">
              <span class="form-hint text-align-left">可上传截图或相关文件（最多5个文件，单个不超过10MB）</span>
            </div>
            
            <div class="form-footer">
              <button type="reset" class="btn btn-outline" @click="resetForm">
                <i class="fas fa-undo"></i>
                重置
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-paper-plane"></i>
                发送邮件
              </button>
            </div>
          </form>
        </div>
        
        <!-- 常见问题 -->
        <div class="faq-section">
          <div class="form-title">常见问题</div>
          
          <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
            <div class="faq-question" @click="toggleFaq(index)">
              <i class="fas" :class="faq.open ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
              <span>{{ faq.question }}</span>
            </div>
            <div class="faq-answer" v-if="faq.open">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
export default {
  name: 'contactPage'
}
</script>
<script setup>
import { ref, reactive } from 'vue';

// 侧边栏状态
const sidebarShow = ref(true);

// 子菜单状态管理
const submenus = reactive({
  dataSource: false,
  report: false
});

// 表单数据
const formData = reactive({
  subject: '',
  from: 'zhanglei@example.com',
  category: '',
  message: '',
  attachments: []
});

// 常见问题数据
const faqs = reactive([
  {
    question: '如何重置我的密码？',
    answer: '您可以在登录页面点击"忘记密码"，通过注册邮箱或手机验证码重置密码。也可以进入个人中心的安全设置页面修改密码。',
    open: false
  },
  {
    question: '如何导出报表数据？',
    answer: '在报表详情页，点击右上角的"导出"按钮，可以选择导出为Excel、PDF或图片格式。企业版用户还可以设置定时导出任务。',
    open: false
  },
  {
    question: '为什么我的数据源连接失败？',
    answer: '数据源连接失败可能有多种原因：网络问题、数据库地址或端口错误、账号密码不正确、防火墙限制等。请检查相关设置，或联系您的IT管理员确认网络配置。',
    open: false
  }
]);

// 切换子菜单显示/隐藏
const toggleSubmenu = (menuName) => {
  submenus[menuName] = !submenus[menuName];
};

// 处理菜单项点击
const handleMenuItemClick = (itemName) => {
  console.log('点击菜单项:', itemName);
  // 可以在这里添加路由跳转逻辑
};

// 处理子菜单项点击
const handleSubmenuItemClick = (itemName) => {
  console.log('点击子菜单项:', itemName);
  // 可以在这里添加路由跳转逻辑
};

// 处理用户信息点击
const handleUserClick = () => {
  console.log('点击用户信息');
};

// 处理文件上传
const handleFileChange = (e) => {
  formData.attachments = Array.from(e.target.files);
  console.log('选中的文件:', formData.attachments);
};

// 表单提交处理
const handleFormSubmit = () => {
  // 表单验证
  if (!formData.subject || !formData.message || !formData.from || !formData.category) {
    alert('请填写所有必填字段');
    return;
  }
  
  // 这里可以添加实际的表单提交逻辑
  console.log('表单提交数据:', formData);
  
  // 模拟邮件发送
  alert('邮件准备发送，将打开您的邮件客户端');
  
  // 构建mailto链接
  const mailtoLink = `mailto:support@jquickbi.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.message)}&from=${encodeURIComponent(formData.from)}`;
  window.location.href = mailtoLink;
};

// 重置表单
const resetForm = () => {
  formData.subject = '';
  formData.category = '';
  formData.message = '';
  formData.attachments = [];
  // 清空文件输入
  const fileInput = document.getElementById('emailAttachment');
  if (fileInput) fileInput.value = '';
};

// 切换FAQ展开/收起
const toggleFaq = (index) => {
  faqs[index].open = !faqs[index].open;
};
</script>

<style>
:root {
  --primary-color: #ff8326;
  --secondary-color: #fff5eb;
  --border-color: #ffd5b8;
  --text-color: #2d3e50;
  --light-bg: #f9f9f9;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  --sidebar-width: 260px;
  --header-height: 60px;
  --transition: all 0.3s ease;
}
.text-align-left{
    text-align:left;
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

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: var(--secondary-color);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.user-name {
  font-size: 14px;
  white-space: nowrap;
}

.notification-icon {
  position: relative;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  transition: color 0.2s;
}

.notification-icon:hover {
  color: var(--primary-color);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #ff4d4f;
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 主内容区 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧菜单 */
.sidebar {
  width: var(--sidebar-width);
  background-color: white;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100vh - var(--header-height));
}

.menu-section {
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.menu-section-title {
  padding: 0 20px;
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.menu-item:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.menu-item.active {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border-left: 3px solid var(--primary-color);
}

.menu-item i {
  width: 20px;
  margin-right: 12px;
  text-align: center;
}

.menu-item .menu-badge {
  margin-left: auto;
  padding: 2px 8px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 10px;
  font-size: 12px;
}

.submenu {
  background-color: #fff9f2;
  padding: 0 0 0 52px;
  display: none;
}

.submenu.show {
  display: block;
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
}

.submenu-item:hover {
  color: var(--primary-color);
}

.submenu-item.active {
  color: var(--primary-color);
  font-weight: 500;
}

/* 右侧联系客服区域 */
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: var(--light-bg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
}

.page-description {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* 联系客服卡片 */
.contact-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 24px;
  margin-bottom: 24px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.contact-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-details h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.contact-details p {
  color: #666;
  font-size: 14px;
}

.contact-email {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.contact-email:hover {
  text-decoration: underline;
}

/* 邮件表单样式 */
.email-form-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 24px;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
}

.form-hint {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.2);
}

textarea.form-control {
  min-height: 150px;
  resize: vertical;
  line-height: 1.6;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

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
}

.btn-primary {
  background: linear-gradient(to right, #ff8326, #ff6a00);
  color: white;
  box-shadow: 0 2px 5px rgba(255, 131, 38, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(to right, #ff6a00, #ff8326);
  box-shadow: 0 4px 8px rgba(255, 131, 38, 0.4);
  transform: translateY(-1px);
}

.btn-outline {
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-outline:hover {
  background-color: var(--secondary-color);
}

.btn i {
  margin-right: 8px;
}

/* 常见问题 */
.faq-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 24px;
  margin-top: 24px;
}

.faq-item {
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 16px;
}

.faq-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.faq-question {
  font-weight: 500;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.faq-question i {
  color: var(--primary-color);
}

.faq-answer {
  color: #666;
  font-size: 14px;
  padding-left: 24px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sidebar {
    width: 0;
    overflow: hidden;
    transition: width var(--transition);
  }
  
  .sidebar.show {
    width: var(--sidebar-width);
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>