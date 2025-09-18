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
          <i class="fas fa-search"></i>
          <input type="text" placeholder="搜索报表、数据源或文档...">
        </div>
        <div class="notification-icon">
          <i class="far fa-bell"></i>
          <span class="notification-badge">3</span>
        </div>
        <div class="user-info" @click="toggleUserMenu">
          <div class="user-avatar">ZL</div>
          <span class="user-name">张磊</span>
          <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
        </div>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧菜单 -->
      <aside class="sidebar">
        <div class="menu-section">
          <div class="menu-section-title">主导航</div>
          <div class="menu-item" :class="{ active: activeMenu === 'home' }" @click="setActiveMenu('home')">
            <i class="fas fa-home"></i>
            <span>首页</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'dataSource' }" @click="toggleSubmenu('dataSource')">
            <i class="fas fa-database"></i>
            <span>数据源</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;" :class="{ 'rotate-180': submenus.dataSource }"></i>
          </div>
          <div class="submenu" id="dataSourceSubmenu" :class="{ show: submenus.dataSource }">
            <div class="submenu-item" :class="{ active: activeSubmenu.dataSource === 'list' }" @click="setActiveSubmenu('dataSource', 'list')">数据源列表</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.dataSource === 'add' }" @click="setActiveSubmenu('dataSource', 'add')">新增数据源</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.dataSource === 'permission' }" @click="setActiveSubmenu('dataSource', 'permission')">数据源权限</div>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'report' }" @click="toggleSubmenu('report')">
            <i class="fas fa-file-alt"></i>
            <span>报表</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;" :class="{ 'rotate-180': submenus.report }"></i>
          </div>
          <div class="submenu" id="reportSubmenu" :class="{ show: submenus.report }">
            <div class="submenu-item" :class="{ active: activeSubmenu.report === 'my' }" @click="setActiveSubmenu('report', 'my')">我的报表</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.report === 'shared' }" @click="setActiveSubmenu('report', 'shared')">共享报表</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.report === 'favorite' }" @click="setActiveSubmenu('report', 'favorite')">收藏报表</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.report === 'recycle' }" @click="setActiveSubmenu('report', 'recycle')">回收站</div>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'dashboard' }" @click="setActiveMenu('dashboard')">
            <i class="fas fa-chart-pie"></i>
            <span>仪表盘</span>
            <span class="menu-badge">5</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'dataset' }" @click="setActiveMenu('dataset')">
            <i class="fas fa-cubes"></i>
            <span>数据集</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">系统管理</div>
          <div class="menu-item" :class="{ active: activeMenu === 'userManage' }" @click="setActiveMenu('userManage')">
            <i class="fas fa-users"></i>
            <span>用户管理</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'rolePermission' }" @click="setActiveMenu('rolePermission')">
            <i class="fas fa-user-shield"></i>
            <span>角色权限</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'operationLog' }" @click="setActiveMenu('operationLog')">
            <i class="fas fa-history"></i>
            <span>操作日志</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">个人中心</div>
          <div class="menu-item" :class="{ active: activeMenu === 'personalInfo' }" @click="setActiveMenu('personalInfo')">
            <i class="fas fa-user-circle"></i>
            <span>个人信息</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'security' }" @click="setActiveMenu('security')">
            <i class="fas fa-lock"></i>
            <span>安全设置</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'preference' }" @click="setActiveMenu('preference')">
            <i class="fas fa-cog"></i>
            <span>偏好配置</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'logout' }" @click="setActiveMenu('logout')">
            <i class="fas fa-sign-out-alt"></i>
            <span>退出登录</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">帮助中心</div>
          <div class="menu-item" :class="{ active: activeMenu === 'helpDoc' }" @click="setActiveMenu('helpDoc')">
            <i class="fas fa-question-circle"></i>
            <span>帮助文档</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'videoTutorial' }" @click="setActiveMenu('videoTutorial')">
            <i class="fas fa-play-circle"></i>
            <span>视频教程</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'contactService' }" @click="setActiveMenu('contactService')">
            <i class="fas fa-comment-dots"></i>
            <span>联系客服</span>
          </div>
        </div>
      </aside>
      
      <!-- 右侧个人中心区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title">个人中心</h1>
            <p class="page-description">管理您的个人信息、安全设置和偏好配置</p>
          </div>
        </div>
        
        <!-- 个人信息卡片 -->
        <div class="profile-card">
          <div class="profile-avatar">
            ZL
            <div class="avatar-upload-btn" title="更换头像" @click="openAvatarUpload">
              <i class="fas fa-camera"></i>
            </div>
          </div>
          <div class="profile-info">
            <div class="profile-name">{{ userInfo.fullName }}</div>
            <div class="profile-role">
              <span>{{ userInfo.role }}</span>
              <span class="profile-role-badge">{{ userInfo.version }}</span>
            </div>
            <div class="profile-contact">
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>{{ userInfo.email }}</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>{{ userInfo.phone }}</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-building"></i>
                <span>{{ userInfo.company }}</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-calendar-check"></i>
                <span>加入时间: {{ userInfo.joinDate }}</span>
              </div>
            </div>
          </div>
          <div class="profile-actions">
            <button class="btn btn-outline" id="editProfileBtn" @click="switchTab('basic-info')">
              <i class="fas fa-edit"></i>
              编辑信息
            </button>
          </div>
        </div>
        
        <!-- 个人中心选项卡 -->
        <div class="profile-tabs">
          <div class="profile-tab" :class="{ active: activeTab === 'basic-info' }" @click="switchTab('basic-info')">基本信息</div>
          <div class="profile-tab" :class="{ active: activeTab === 'security-setting' }" @click="switchTab('security-setting')">安全设置</div>
          <div class="profile-tab" :class="{ active: activeTab === 'preference' }" @click="switchTab('preference')">偏好配置</div>
          <div class="profile-tab" :class="{ active: activeTab === 'activity' }" @click="switchTab('activity')">近期活动</div>
        </div>
        
        <!-- 基本信息表单 -->
        <div class="form-container" id="basic-info-tab" v-if="activeTab === 'basic-info'">
          <div class="form-title">基本信息</div>
          <form id="basicInfoForm" @submit.prevent="saveBasicInfo">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="fullName">姓名 <span style="color: #ff4d4f;">*</span></label>
                <input type="text" class="form-control" id="fullName" v-model="formData.fullName" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="nickName">昵称</label>
                <input type="text" class="form-control" id="nickName" v-model="formData.nickName">
                <span class="form-hint">显示在系统内的个性化名称</span>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="email">电子邮箱 <span style="color: #ff4d4f;">*</span></label>
                <input type="email" class="form-control" id="email" v-model="formData.email" required>
                <span class="form-hint">用于登录和接收系统通知</span>
              </div>
              <div class="form-group">
                <label class="form-label" for="phone">手机号码</label>
                <input type="tel" class="form-control" id="phone" v-model="formData.phone">
                <span class="form-hint">用于账号安全验证</span>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="department">所属部门</label>
              <input type="text" class="form-control" id="department" v-model="formData.department">
            </div>
            
            <div class="form-group">
              <label class="form-label" for="jobTitle">职位</label>
              <input type="text" class="form-control" id="jobTitle" v-model="formData.jobTitle">
            </div>
            
            <div class="form-group">
              <label class="form-label" for="signature">个人签名</label>
              <textarea class="form-control" id="signature" placeholder="输入个人签名，将显示在个人主页" v-model="formData.signature"></textarea>
            </div>
            
            <div class="form-footer">
              <button type="button" class="btn btn-outline" id="cancelBasicInfo" @click="resetForm">取消</button>
              <button type="submit" class="btn btn-primary">保存修改</button>
            </div>
          </form>
        </div>
        
        <!-- 安全设置表单 -->
        <div class="form-container" id="security-setting-tab" v-if="activeTab === 'security-setting'">
          <div class="form-title">安全设置</div>
          
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">修改密码</div>
              <div class="security-desc">定期修改密码可提高账号安全性，建议包含字母、数字和特殊字符</div>
            </div>
            <button class="btn btn-outline" id="changePwdBtn" @click="openChangePasswordModal">
              <i class="fas fa-key"></i>
              修改
            </button>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">手机验证</div>
              <div class="security-desc">开启后，敏感操作需通过手机验证码验证身份</div>
            </div>
            <div class="security-status">
              <span class="status-enabled" v-if="securitySettings.phoneVerify">
                <i class="fas fa-check-circle"></i>
                已开启
              </span>
              <span class="status-disabled" v-else>
                <i class="fas fa-times-circle"></i>
                未开启
              </span>
              <button class="btn btn-outline" id="togglePhoneVerify" @click="toggleSecuritySetting('phoneVerify')">
                {{ securitySettings.phoneVerify ? '关闭' : '开启' }}
              </button>
            </div>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">邮箱验证</div>
              <div class="security-desc">开启后，登录异常时需通过邮箱验证码验证身份</div>
            </div>
            <div class="security-status">
              <span class="status-enabled" v-if="securitySettings.emailVerify">
                <i class="fas fa-check-circle"></i>
                已开启
              </span>
              <span class="status-disabled" v-else>
                <i class="fas fa-times-circle"></i>
                未开启
              </span>
              <button class="btn btn-outline" id="toggleEmailVerify" @click="toggleSecuritySetting('emailVerify')">
                {{ securitySettings.emailVerify ? '关闭' : '开启' }}
              </button>
            </div>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">登录保护</div>
              <div class="security-desc">开启后，陌生设备登录需验证身份</div>
            </div>
            <div class="security-status">
              <span class="status-enabled" v-if="securitySettings.loginProtect">
                <i class="fas fa-check-circle"></i>
                已开启
              </span>
              <span class="status-disabled" v-else>
                <i class="fas fa-times-circle"></i>
                未开启
              </span>
              <button class="btn btn-outline" id="toggleLoginProtect" @click="toggleSecuritySetting('loginProtect')">
                {{ securitySettings.loginProtect ? '关闭' : '开启' }}
              </button>
            </div>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">登录日志</div>
              <div class="security-desc">查看最近登录记录，检测异常登录行为</div>
            </div>
            <button class="btn btn-outline" id="viewLoginLogBtn" @click="openLoginLogModal">
              <i class="fas fa-history"></i>
              查看
            </button>
          </div>
        </div>
        
        <!-- 偏好配置表单 -->
        <div class="form-container" id="preference-tab" v-if="activeTab === 'preference'">
          <div class="form-title">偏好配置</div>
          
          <div class="preference-group">
            <div class="preference-group-title">界面设置</div>
            
            <div class="preference-item">
              <label>
                主题风格
                <select class="form-control" v-model="preferences.theme">
                  <option value="light">浅色主题</option>
                  <option value="dark">深色主题</option>
                  <option value="auto">跟随系统</option>
                </select>
              </label>
            </div>
            
            <div class="preference-item">
              <input type="checkbox" id="sidebarCollapse" v-model="preferences.sidebarCollapse">
              <label for="sidebarCollapse">
                侧边栏默认折叠
                <div class="preference-desc">登录时默认折叠侧边栏，节省页面空间</div>
              </label>
            </div>
            
            <div class="preference-item">
              <input type="checkbox" id="showBreadcrumb" v-model="preferences.showBreadcrumb">
              <label for="showBreadcrumb">
                显示面包屑导航
                <div class="preference-desc">在页面顶部显示当前位置导航</div>
              </label>
            </div>
          </div>
          
          <div class="preference-group">
            <div class="preference-group-title">通知设置</div>
            
            <div class="preference-item">
              <input type="checkbox" id="notifyReportShare" v-model="preferences.notifyReportShare">
              <label for="notifyReportShare">
                报表共享通知
                <div class="preference-desc">当有报表共享给我时接收通知</div>
              </label>
            </div>
            
            <div class="preference-item">
              <input type="checkbox" id="notifyDataChange" v-model="preferences.notifyDataChange">
              <label for="notifyDataChange">
                数据更新通知
                <div class="preference-desc">关注的数据源发生更新时接收通知</div>
              </label>
            </div>
            
            <div class="preference-item">
              <input type="checkbox" id="notifySystem" v-model="preferences.notifySystem">
              <label for="notifySystem">
                系统公告通知
                <div class="preference-desc">接收系统更新和公告信息</div>
              </label>
            </div>
          </div>
          
          <div class="form-footer">
            <button type="button" class="btn btn-outline" @click="resetPreferences">取消</button>
            <button type="button" class="btn btn-primary" @click="savePreferences">保存设置</button>
          </div>
        </div>
        
        <!-- 近期活动 -->
        <div class="activity-list" v-if="activeTab === 'activity'">
          <div class="activity-title">近期活动</div>
          
          <div class="activity-item" v-for="(activity, index) in activities" :key="index">
            <div class="activity-icon">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <div class="activity-action">{{ activity.action }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <!-- 修改密码模态框 -->
    <div class="modal-overlay" :class="{ show: showChangePasswordModal }" @click="closeChangePasswordModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">修改密码</div>
          <button class="modal-close" @click="closeChangePasswordModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="changePasswordForm" @submit.prevent="changePassword">
            <div class="form-group">
              <label class="form-label" for="oldPassword">原密码</label>
              <input type="password" class="form-control" id="oldPassword" v-model="passwordForm.oldPassword" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="newPassword">新密码</label>
              <input type="password" class="form-control" id="newPassword" v-model="passwordForm.newPassword" required>
              <span class="form-hint">密码长度至少8位，包含字母、数字和特殊字符</span>
            </div>
            <div class="form-group">
              <label class="form-label" for="confirmPassword">确认新密码</label>
              <input type="password" class="form-control" id="confirmPassword" v-model="passwordForm.confirmPassword" required>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeChangePasswordModal">取消</button>
          <button class="btn btn-primary" @click="changePassword">确认修改</button>
        </div>
      </div>
    </div>
    
    <!-- 登录日志模态框 -->
    <div class="modal-overlay" :class="{ show: showLoginLogModal }" @click="closeLoginLogModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">登录日志</div>
          <button class="modal-close" @click="closeLoginLogModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="activity-list" style="padding: 0;">
            <div class="activity-item" v-for="(log, index) in loginLogs" :key="index">
              <div class="activity-icon">
                <i class="fas fa-sign-in-alt"></i>
              </div>
              <div class="activity-content">
                <div class="activity-action">
                  在 {{ log.device }} 上登录，IP: {{ log.ip }}，地点: {{ log.location }}
                </div>
                <div class="activity-time">{{ log.time }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="closeLoginLogModal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// 状态管理
const activeMenu = ref('personalInfo');
const submenus = ref({
  dataSource: false,
  report: false
});
const activeSubmenu = ref({
  dataSource: '',
  report: ''
});
const activeTab = ref('basic-info');

// 用户信息
const userInfo = reactive({
  fullName: '张磊',
  nickName: '磊哥',
  role: '系统管理员',
  version: '企业版',
  email: 'zhanglei@example.com',
  phone: '138****1234',
  company: '京东科技',
  joinDate: '2023-01-15',
  department: '技术部',
  jobTitle: '技术架构师',
  signature: '专注数据可视化与BI系统建设'
});

// 表单数据
const formData = reactive({ ...userInfo });
const originalFormData = { ...userInfo };

// 安全设置
const securitySettings = reactive({
  phoneVerify: true,
  emailVerify: true,
  loginProtect: false
});

// 偏好设置
const preferences = reactive({
  theme: 'light',
  sidebarCollapse: false,
  showBreadcrumb: true,
  notifyReportShare: true,
  notifyDataChange: false,
  notifySystem: true
});
const originalPreferences = { ...preferences };

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 模态框状态
const showChangePasswordModal = ref(false);
const showLoginLogModal = ref(false);

// 活动记录
const activities = ref([
  {
    icon: 'fas fa-file-export',
    action: '导出了报表 "2023年销售数据分析"',
    time: '今天 09:45'
  },
  {
    icon: 'fas fa-share-alt',
    action: '将报表 "用户活跃度分析" 共享给了 王小明',
    time: '昨天 16:20'
  },
  {
    icon: 'fas fa-database',
    action: '新增了数据源 "MySQL - 订单数据库"',
    time: '2023-10-15 10:12'
  },
  {
    icon: 'fas fa-chart-pie',
    action: '创建了仪表盘 "产品运营总览"',
    time: '2023-10-12 14:30'
  },
  {
    icon: 'fas fa-user-circle',
    action: '更新了个人信息',
    time: '2023-10-10 09:15'
  }
]);

// 登录日志
const loginLogs = ref([
  {
    device: 'Chrome 浏览器 (Windows 10)',
    ip: '192.168.1.100',
    location: '北京市',
    time: '今天 08:30'
  },
  {
    device: 'Safari 浏览器 (macOS)',
    ip: '192.168.1.101',
    location: '北京市',
    time: '昨天 19:45'
  },
  {
    device: '微信小程序',
    ip: '203.0.113.5',
    location: '上海市',
    time: '2023-10-15 16:20'
  }
]);

// 方法
const setActiveMenu = (menu) => {
  activeMenu.value = menu;
  // 关闭所有子菜单
  Object.keys(submenus.value).forEach(key => {
    submenus.value[key] = false;
  });
};

const toggleSubmenu = (menu) => {
  activeMenu.value = menu;
  submenus.value[menu] = !submenus.value[menu];
};

const setActiveSubmenu = (parent, submenu) => {
  activeSubmenu.value[parent] = submenu;
};

const switchTab = (tab) => {
  activeTab.value = tab;
};

const saveBasicInfo = () => {
  // 保存表单数据到用户信息
  Object.assign(userInfo, formData);
  // 这里可以添加保存到服务器的逻辑
  alert('个人信息保存成功');
};

const resetForm = () => {
  // 重置表单数据
  Object.assign(formData, originalFormData);
};

const toggleSecuritySetting = (setting) => {
  securitySettings[setting] = !securitySettings[setting];
  // 这里可以添加保存到服务器的逻辑
};

const openChangePasswordModal = () => {
  showChangePasswordModal.value = true;
  // 重置密码表单
  passwordForm.oldPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
};

const closeChangePasswordModal = () => {
  showChangePasswordModal.value = false;
};

const changePassword = () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('两次输入的新密码不一致');
    return;
  }
  
  if (passwordForm.newPassword.length < 8) {
    alert('密码长度至少8位');
    return;
  }
  
  // 这里可以添加密码修改逻辑
  alert('密码修改成功');
  closeChangePasswordModal();
};

const openLoginLogModal = () => {
  showLoginLogModal.value = true;
};

const closeLoginLogModal = () => {
  showLoginLogModal.value = false;
};

const savePreferences = () => {
  // 这里可以添加保存到服务器的逻辑
  Object.assign(originalPreferences, preferences);
  alert('偏好设置保存成功');
};

const resetPreferences = () => {
  // 重置偏好设置
  Object.assign(preferences, originalPreferences);
};

const openAvatarUpload = () => {
  alert('打开头像上传对话框');
  // 这里可以添加头像上传逻辑
};

const toggleUserMenu = () => {
  // 这里可以添加用户菜单切换逻辑
  console.log('用户菜单被点击');
};

onMounted(() => {
  // 初始化逻辑
  console.log('组件挂载完成');
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
  --sidebar-width: 260px;
  --header-height: 60px;
  --transition: all 0.3s ease;
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

/* 右侧个人中心区域 */
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

/* 个人信息卡片 */
.profile-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  position: relative;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.avatar-upload-btn:hover {
  background-color: var(--secondary-color);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.profile-role {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-role-badge {
  padding: 2px 8px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border-radius: 8px;
  font-size: 12px;
}

.profile-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.profile-actions {
  display: flex;
  gap: 12px;
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

/* 个人中心内容区域 - 选项卡样式 */
.profile-tabs {
  display: flex;
  gap: 2px;
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  margin-bottom: 24px;
  overflow: hidden;
}

.profile-tab {
  flex: 1;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
  border-bottom: 3px solid transparent;
}

.profile-tab:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.profile-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

/* 表单样式 */
.form-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 24px;
  margin-bottom: 24px;
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

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 20px;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

/* 安全设置特有样式 */
.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.security-item:last-child {
  border-bottom: none;
}

.security-info {
  display: flex;
  flex-direction: column;
}

.security-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.security-desc {
  font-size: 14px;
  color: #666;
}

.security-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-enabled {
  color: #52c41a;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-disabled {
  color: #ff4d4f;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 偏好设置特有样式 */
.preference-group {
  margin-bottom: 24px;
}

.preference-group-title {
  font-weight: 600;
  margin-bottom: 16px;
  font-size: 16px;
}

.preference-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.preference-item label {
  flex: 1;
  font-size: 14px;
  cursor: pointer;
}

.preference-desc {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

/* 近期活动样式 */
.activity-list {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 24px;
}

.activity-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.activity-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-action {
  font-weight: 500;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
}

.modal-overlay.show {
  opacity: 1;
  visibility: visible;
}

.modal {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(20px);
  transition: var(--transition);
}

.modal-overlay.show .modal {
  transform: translateY(0);
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--primary-color);
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-actions {
    margin-top: 16px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .profile-tabs {
    flex-direction: column;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .activity-icon {
    margin-bottom: 8px;
  }
}

/* 辅助样式 */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>