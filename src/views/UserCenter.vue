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
        <div class="user-info" @click="toggleUserMenu">
          <div class="user-avatar">ZL</div>
          <span class="user-name">张磊</span>
          <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
        </div>
      </div>
    </header>
    
    <!-- 主内容区 -->
      <div class="main-content">
         <SidebarMenu 
        :active-menu="activeMenu" 
        :unread-count="unreadCount"
        @menu-click="setActiveMenu"
        @submenu-click="setActiveSubmenu"
      />
      
      <!-- 右侧个人中心区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title text-align-left">个人中心</h1>
            <p class="page-description">管理您的个人信息、安全设置和偏好配置</p>
          </div>
        </div>
        
        <!-- 个人信息卡片 -->
        <div class="profile-card">
          <div class="profile-avatar">
            {{userInfo.chineseName}}
            <div class="avatar-upload-btn" title="更换头像" @click="openAvatarUpload">
              <i class="fas fa-camera"></i>
            </div>
          </div>
          <div class="profile-info">
            <div class="profile-name text-align-left">{{ userInfo.realName }}</div>
            <div class="profile-role">
              <span>{{ userInfo.userTypeName }}</span>
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
                <span>{{ userInfo.tenantName }}</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-calendar-check"></i>
                <span>加入时间: {{ userInfo.createdTime }}</span>
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
          <div class="form-title text-align-left">基本信息</div>
          <form id="basicInfoForm" @submit.prevent="saveBasicInfo">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label text-align-left" for="fullName">姓名 <span style="color: #ff4d4f;">*</span></label>
                <input type="text" class="form-control" id="fullName" v-model="userInfo.realName" required>
              </div>
              <div class="form-group">
                <label class="form-label text-align-left" for="nickName">昵称<span style="color: #ff4d4f;">*</span></label>
                <input type="text" class="form-control" id="nickName" v-model="userInfo.nickName" required>
                <span class="form-hint text-align-left">显示在系统内的个性化名称</span>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label text-align-left" for="email">电子邮箱 <span style="color: #ff4d4f;">*</span></label>
                <input type="email" class="form-control" id="email" v-model="userInfo.email" required>
                <span class="form-hint text-align-left">用于登录和接收系统通知</span>
              </div>
              <div class="form-group">
                <label class="form-label text-align-left" for="phone"><span style="color: #ff4d4f;">*</span>手机号码</label>
                <input type="tel" class="form-control" id="phone" v-model="userInfo.phone" required>
                <span class="form-hint text-align-left">用于账号安全验证</span>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label text-align-left" for="department"><span style="color: #ff4d4f;">*</span>所属部门</label>
              <input type="text" class="form-control" id="department" v-model="userInfo.dept" required>
            </div>
            
            <div class="form-group">
              <label class="form-label text-align-left" for="jobTitle"><span style="color: #ff4d4f;">*</span>职位</label>
              <input type="text" class="form-control" id="jobTitle" v-model="userInfo.position" required>
            </div>
            
            <div class="form-group">
              <label class="form-label text-align-left" for="signature"><span style="color: #ff4d4f;">*</span>个人签名</label>
              <textarea class="form-control" id="signature" placeholder="输入个人签名，将显示在个人主页" v-model="userInfo.signature" required></textarea>
            </div>
            
            <div class="form-footer">
              <button type="button" class="btn btn-outline" id="cancelBasicInfo" @click="resetForm">取消</button>
              <button type="submit" class="btn btn-primary">保存修改</button>
            </div>
          </form>
        </div>
        

        <div class="form-container" id="security-setting-tab" v-if="activeTab === 'security-setting'">
          <div class="form-title text-align-left">安全设置</div>
          
          <div class="security-item">
            <div class="security-info">
              <div class="security-title text-align-left">修改密码</div>
              <div class="security-desc text-align-left">定期修改密码可提高账号安全性，建议包含字母、数字和特殊字符</div>
            </div>
            <button class="btn btn-outline" id="changePwdBtn" @click="openChangePasswordModal">
              <i class="fas fa-key"></i>
              修改
            </button>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <div class="security-title text-align-left">短信通知</div>
              <div class="security-desc text-align-left">开启后，敏感操作需通过手机验证码验证身份</div>
            </div>
            <div class="security-status">
              <span class="status-enabled" v-if="securitySettings.smsNotificationEnabled">
                <i class="fas fa-check-circle"></i>
                已开启
              </span>
              <span class="status-disabled" v-else>
                <i class="fas fa-times-circle"></i>
                未开启
              </span>
              <button class="btn btn-outline" id="togglePhoneVerify" @click="toggleSecuritySetting('smsNotificationEnabled')">
                {{ securitySettings.smsNotificationEnabled ? '关闭' : '开启' }}
              </button>
            </div>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <div class="security-title text-align-left">邮箱通知</div>
              <div class="security-desc">开启后，登录异常时需通过邮箱验证码验证身份</div>
            </div>
            <div class="security-status">
              <span class="status-enabled" v-if="securitySettings.emailNotificationEnabled">
                <i class="fas fa-check-circle"></i>
                已开启
              </span>
              <span class="status-disabled" v-else>
                <i class="fas fa-times-circle"></i>
                未开启
              </span>
              <button class="btn btn-outline" id="toggleEmailVerify" @click="toggleSecuritySetting('emailNotificationEnabled')">
                {{ securitySettings.emailNotificationEnabled ? '关闭' : '开启' }}
              </button>
            </div>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <div class="security-title text-align-left">登录保护</div>
              <div class="security-desc text-align-left">开启后，陌生设备登录需验证身份</div>
            </div>
            <div class="security-status">
              <span class="status-enabled" v-if="securitySettings.notificationEnabled">
                <i class="fas fa-check-circle"></i>
                已开启
              </span>
              <span class="status-disabled" v-else>
                <i class="fas fa-times-circle"></i>
                未开启
              </span>
              <button class="btn btn-outline" id="toggleLoginProtect" @click="toggleSecuritySetting('notificationEnabled')">
                {{ securitySettings.notificationEnabled ? '关闭' : '开启' }}
              </button>
            </div>
          </div>
            <div class="form-footer">
            <button type="button" class="btn btn-outline" @click="resetSecurity">取消</button>
            <button type="button" class="btn btn-primary" @click="saveSecurity">保存设置</button>
          </div>
        </div>
        
        <div class="form-container" id="preference-tab" v-if="activeTab === 'preference'">
          <div class="form-title text-align-left">偏好配置</div>
          <div class="preference-group">
            <div class="preference-group-title text-align-left">界面设置</div>
            <div class="preference-item">
              <label class="text-align-left">
                <select class="form-control" v-model="preferences.themeStyle">
                  <option :value="t.code" v-for="(t, index) in theme" :key="index">{{t.name}}</option>
                </select>
              </label>
            </div>
            
            <div class="preference-item">
              <input type="checkbox" id="sidebarCollapse" v-model="preferences.sidebarFoldEnabled">
              <label for="sidebarCollapse">
                <span class="text-align-left">侧边栏默认折叠</span>
                <div class="preference-desc text-align-left">登录时默认折叠侧边栏，节省页面空间</div>
              </label>
            </div>
            
            <div class="preference-item">
              <input type="checkbox" id="showBreadcrumb" v-model="preferences.breadcrumbNavigationEnabled">
              <label for="showBreadcrumb">
                显示面包屑导航
                <div class="preference-desc">在页面顶部显示当前位置导航</div>
              </label>
            </div>
          </div>
          
          <div class="preference-group">
            <div class="preference-group-title">通知设置</div>
            <div class="preference-item">
              <input type="checkbox" id="notifyReportShare" v-model="preferences.reportShareNotificationEnabled">
              <label for="notifyReportShare">
                报表共享通知
                <div class="preference-desc">当有报表共享给我时接收通知</div>
              </label>
            </div>
            
            <div class="preference-item">
              <input type="checkbox" id="notifyDataChange" v-model="preferences.dataUpdateNotificationEnabled">
              <label for="notifyDataChange">
                数据更新通知
                <div class="preference-desc">关注的数据源发生更新时接收通知</div>
              </label>
            </div>
            
            <div class="preference-item">
              <input type="checkbox" id="notifySystem" v-model="preferences.systemNotificationEnabled">
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
              <div class="activity-action">{{ activity.content }}</div>
              <div class="activity-time">{{ activity.createdTime }}</div>
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
    
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import request from '../api/request';
import { ElMessage } from 'element-plus';
const activeTab = ref('basic-info');
const theme = ref([]);
const userInfo = reactive({});


const securitySettings = reactive({});

// 偏好设置
const preferences = reactive({});
const originalPreferences = { ...preferences };

const passwordForm = reactive({});

// 模态框状态
const showChangePasswordModal = ref(false);

const activities = ref([]);

const switchTab = (tab) => {
  activeTab.value = tab;
  if(tab==='security-setting'||tab==='preference'){
    handleMyPreference();
  }
  if(tab==='activity'){
    handleACtivity();
  }
};
const handleACtivity= () =>{
  request.get('/api/business/activity/recent?limit=5').then(response => {
    if(200==response.code){
      activities.value=response.data;
    }else{
      ElMessage.success(`加载数据出错`);
    }
  }
)
}
const saveBasicInfo = () => {
  let param=new Object();
  param.realName=userInfo.realName;
  param.chineseName=userInfo.chineseName;
  param.email=userInfo.email;
  param.phone=userInfo.phone;
  param.tenantName=userInfo.tenantName;
  param.nickName=userInfo.nickName;      
  param.dept=userInfo.dept;      
  param.position=userInfo.position;
  param.signature=userInfo.signature;
  request.post('/api/uaa-user/updateProfile',param).then(response => {
    if(200==response.code){
      ElMessage.success(`修改成功`);
    }else{
      ElMessage.success(`加载数据出错`);
    }
  }
)
};

const resetForm = () => {
  alert('个人信息保存成功');
};

const toggleSecuritySetting = (setting) => {
  securitySettings[setting] = !securitySettings[setting];
};
const saveSecurity = () => {
  let param=new Object();
  param.notificationEnabled= securitySettings.notificationEnabled;
  param.emailNotificationEnabled=securitySettings.emailNotificationEnabled;
  param.smsNotificationEnabled=securitySettings.smsNotificationEnabled;
   request.post('/api/user/preference/saveOrUpdateSecurity',param).then(response => {
        if(200==response.code){
            ElMessage.success(`更新成功`);
            handleMyPreference();
        }else{
          ElMessage.success(`加载数据出错`);
        }
      }
    )
}
const openChangePasswordModal = () => {
  showChangePasswordModal.value = true;
  passwordForm.oldPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
};

const closeChangePasswordModal = () => {
  showChangePasswordModal.value = false;
};

const changePassword = () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.success('两次输入的新密码不一致');
    return;
  }
  if (passwordForm.newPassword.length < 8) {
    ElMessage.success('密码长度至少8位');
    return;
  }
  let param=new Object();
  param.oldPasswd=passwordForm.oldPassword;
  param.newPasswd=passwordForm.newPassword;
  debugger;
  request.post('/api/uaa-user/updatePasswd',param).then(response => {
    if(200==response.code){
       ElMessage.success(`修改成功`);
    }else{
      ElMessage.error(response.message);
    }
  }
)
  closeChangePasswordModal();
};
const savePreferences = () => {
   let param=new Object();
  param.themeStyle= preferences.themeStyle;
  param.sidebarFoldEnabled=preferences.sidebarFoldEnabled;
  param.breadcrumbNavigationEnabled=preferences.breadcrumbNavigationEnabled;
  param.reportShareNotificationEnabled=preferences.reportShareNotificationEnabled;
  param.dataUpdateNotificationEnabled=preferences.dataUpdateNotificationEnabled;
  param.systemNotificationEnabled=preferences.systemNotificationEnabled;
   request.post('/api/user/preference/saveOrUpdatePreference',param).then(response => {
        if(200==response.code){
            ElMessage.success(`更新成功`);
            handleMyPreference();
        }else{
          ElMessage.success(`加载数据出错`);
        }
      }
    )
};

const resetPreferences = () => {
  Object.assign(preferences, originalPreferences);
};

const openAvatarUpload = () => {
  ElMessage.success('打开头像上传对话框');
};
const handleMyPreference = () => {
    request.get('/api/user/preference/getPreference').then(response => {
        if(200==response.code){
          securitySettings.notificationEnabled=response.data.notificationEnabled;
          securitySettings.emailNotificationEnabled=response.data.emailNotificationEnabled;
          securitySettings.smsNotificationEnabled=response.data.smsNotificationEnabled;

          preferences.themeStyle=response.data.themeStyle;
          preferences.sidebarFoldEnabled=response.data.sidebarFoldEnabled;
          preferences.breadcrumbNavigationEnabled=response.data.breadcrumbNavigationEnabled;
          preferences.reportShareNotificationEnabled=response.data.reportShareNotificationEnabled;
          preferences.dataUpdateNotificationEnabled=response.data.dataUpdateNotificationEnabled;
          preferences.systemNotificationEnabled=response.data.systemNotificationEnabled;
          
          
        }else{
          ElMessage.success(`加载数据出错`);
        }
      }
    )
}
const handleMyInfo = () => {
request.get('/api/uaa-user/getCurrentUserInfo').then(response => {
    if(200==response.code){
      userInfo.realName=response.data.realName;
      userInfo.chineseName=response.data.chineseName;
      userInfo.email=response.data.email;
      userInfo.phone=response.data.phone;
      userInfo.tenantName=response.data.tenantName;
      userInfo.createdTime=response.data.createdTime;
      userInfo.nickName=response.data.nickName;      
      userInfo.dept=response.data.dept;      
      userInfo.position=response.data.position;
      userInfo.signature=response.data.signature;
    }else{
      ElMessage.success(`加载数据出错`);
    }
  }
)
}
const handleThemeType=()=>{
  request.get('/api/user/preference/getThemeType').then(response => {
    if(200==response.code){
      theme.value=response.data;
    }else{
      ElMessage.success(`加载数据出错`);
    }
  }
)
}
onMounted(() => {
    handleMyInfo();
    handleThemeType();
});
</script>

<style>
#app{
  text-align: left !important;
}
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