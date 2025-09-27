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
      
      <!-- 右侧用户管理区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title text-align-left">用户管理</h1>
            <p class="page-description">管理系统内所有用户账户、角色及权限</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline" @click="exportUsers">
              <i class="fas fa-download"></i>
              导出用户
            </button>
            <button class="btn btn-primary" @click="addUser">
              <i class="fas fa-plus"></i>
              新增用户
            </button>
          </div>
        </div>
        
        <!-- 筛选和搜索区域 -->
        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-item">
              <label>用户类型</label>
              <select v-model="filterUserType" @change="handleUserQuery()">
                <option value="">全部类型</option>
                <option  v-for="(t) in userType"  :key="t.code"    :value="t.code">{{t.name}}</option>
              </select>
            </div>
            <div class="filter-item">
              <label>用户状态</label>
              <select v-model="filterStatus"  @change="handleUserQuery()">
                <option value="">全部状态</option>
                <option  v-for="(t) in userStatus"  :key="t.code"    :value="t.code">{{t.name}}</option>
              </select>
            </div>
            <div class="filter-item">
              <label>创建时间</label>
              <select v-model="filterTime">
                <option value="">全部时间</option>
                <option value="week">近7天</option>
                <option value="month">近30天</option>
                <option value="quarter">近90天</option>
              </select>
            </div>
          </div>
          <div class="search-filter">
            <el-icon><Search /></el-icon>
            <input type="text" placeholder="搜索用户名或邮箱..." v-model="searchKeyword" @click="handleUserQuery()">
          </div>
        </div>
        
        <!-- 用户列表 -->
        <div class="user-list">
          <div class="table-header">
            <div >登录名</div>
            <div>手机号</div>
            <div>邮箱</div>
            <div>状态</div>
  
            <div>操作</div>
          </div>
          
          <div class="table-row"   v-for="(u) in users"   :key="u.id">
            <div class="user-info">
              <div class="user-avatar-large admin" :class="u.userTypeIcon">
                {{ u.chineseName }}
              </div>
              <div class="user-details">
                <div class="user-name text-align-center">{{ u.loginName}}</div>
                <div class="user-email text-align-center">{{ u.userTypeName }}</div>
              </div>
            </div>
            <div><span class="role-badge role-analyst" >{{ u.phone }}</span></div>
            <div><span class="role-badge role-analyst" >{{ u.email }}</span></div>
            <div><span class="status-badge " :class="'status-' + u.status">{{ u.statusName }}</span></div>
            <div class="operation-buttons">
              <button class="operation-btn" title="编辑" @click="editUser(u.id)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="operation-btn" title="重置密码" @click="resetPassword(u.id)">
                <i class="fas fa-key"></i>
              </button>
              <button class="operation-btn" title="更多" @click="moreActions(u.id)">
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
          
          <!-- 分页控件 -->
          <div class="pagination">
            <div class="pagination-info">显示 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalUsers) }} 条，共 {{ totalUsers }} 条</div>
            <div class="pagination-controls">
              <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="page-btn" v-for="page in pageNumbers" :key="page" :class="{ active: currentPage === page }" @click="changePage(page)">
                {{ page }}
              </button>
              <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        <el-dialog 
          title="编辑用户" 
          v-model="editDialogVisible" 
          width="500px"
          @close="() => { editDialogVisible = false; currentEditUserId = null; }"
        >
          <UserForm 
            :visible="editDialogVisible"
            :is-edit="edit" 
            :user-id="currentEditUserId"  
            :user-type="userType" 
            :user-status="userStatus"  
            @update:visible="editDialogVisible = $event"  
            @success="handleEditSuccess"  
          />
        </el-dialog>
      </main>
    </div>
  </div>
</template>
<script>
export default {
  name: 'userManagePage'
}
</script>
<script setup>
import { ref, computed,onMounted } from 'vue';
import {ElDialog} from 'element-plus';
import SidebarMenu from '@/components/SidebarMenu.vue';
import UserForm from '@/components/UserForm.vue';  
import request from '../api/request';
// 菜单状态管理
const activeMenu = ref('user');
const edit = ref(true);

const editDialogVisible = ref (false);
const currentEditUserId = ref (null);
const submenus = ref({
  dataSource: false,
  report: false
});
const activeSubmenu = ref({
  dataSource: '',
  report: ''
});

// 筛选条件
const filterUserType = ref('');
const filterStatus = ref('');
const filterTime = ref('');
const searchKeyword = ref('');

// 分页相关
const currentPage = ref(1);
const pageSize = ref(5);
const totalUsers = ref(32);

// 用户数据
const users = ref([]);
const userStatus = ref([]);
const userType = ref([]);

// 计算属性：总页数
const totalPages = computed(() => {
  return Math.ceil(totalUsers.value / pageSize.value);
});

// 计算属性：页码列表
const pageNumbers = computed(() => {
  const pages = [];
  // 这里简化处理，只显示前5页
  for (let i = 1; i <= Math.min(5, totalPages.value); i++) {
    pages.push(i);
  }
  return pages;
});




const setActiveSubmenu = (parent, submenu) => {
  activeSubmenu.value[parent] = submenu;
  activeMenu.value = parent;
  submenus.value[parent] = true;
};


const exportUsers = () => {

};

const addUser = () => {
     edit.value=false;
     editDialogVisible.value = true; 
};

const editUser = (id) => {
   edit.value=true;
   currentEditUserId.value = id; 
   editDialogVisible.value = true; 
};

const resetPassword = (id) => {
};

const moreActions = (id) => {

};

// 分页方法
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  handleUserQuery();
};
const initStatus= () => {
  request.get('/api/uaa-user/getUserStatus')
  .then(response => {
    if(response.code==200){
      userStatus.value=response.data;
    } 
  })
};
const initUserType= () => {
  request.get('/api/uaa-user/getUserType')
  .then(response => {
    if(response.code==200){
      userType.value=response.data;
    }
    
  })
};


const handleUserQuery = () => {
  let query=new Object();
  query.pageNum=currentPage.value;
  query.pageSize=pageSize.value;
  query.userType=filterUserType.value;
  query.status=filterStatus.value;
  query.nameOrLoginName=searchKeyword.value;
  request.post('/api/uaa-user/page',query)
  .then(response => {
    if(response.code==200){
      users.value=response.data.records;
    }
  }
)
};
onMounted(() => {
  initStatus();
  initUserType();
  handleUserQuery();
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
.text-align-left {
  text-align: left;
}
.text-align-center {
  text-align: center;
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

/* 左侧BI菜单 */
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
  transition: transform 0.3s;
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

.rotate-180 {
  transform: rotate(180deg);
}

/* 右侧用户管理区域 */
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

.action-buttons {
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

/* 筛选和搜索区域 */
.filter-bar {
  background-color: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: var(--card-shadow);
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-group {
  display: flex;
  gap: 16px;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
}

.filter-item select, .filter-item input {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  color: #333;
}

.search-filter {
  position: relative;
  width: 240px;
}

.search-filter input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
}

.search-filter i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

/* 用户列表 */
.user-list {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 120px;
  padding: 16px 20px;
  background-color: var(--light-bg);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 120px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: var(--secondary-color);
}

.table-row:last-child {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-large {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.user-avatar-large.admin {
  background-color: #ffebe6;
  color: #e87722;
}

.user-avatar-large.analyst {
  background-color: #e6f7ff;
  color: #1890ff;
}

.user-avatar-large.viewer {
  background-color: #f6ffed;
  color: #52c41a;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.user-email {
  font-size: 12px;
  color: #666;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: #f0f9eb;
  color: #52c41a;
}

.status-inactive {
  background-color: #f5f5f5;
  color: #8c8c8c;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.role-admin {
  background-color: #fff2e8;
  color: #e87722;
}

.role-analyst {
  background-color: #e6f7ff;
  color: #1890ff;
}

.role-viewer {
  background-color: #f6ffed;
  color: #52c41a;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.operation-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.operation-btn:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  font-size: 14px;
}

.pagination-info {
  color: #666;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.page-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid var(--border-color);
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>