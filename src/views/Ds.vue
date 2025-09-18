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
      <!-- 左侧BI菜单 -->
      <aside class="sidebar">
        <div class="menu-section">
          <div class="menu-section-title">主导航</div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'home' }" @click="setActiveMainMenu('home')">
            <i class="fas fa-home"></i>
            <span>首页</span>
          </div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'dataSource' }" @click="toggleSubMenu('dataSource')">
            <i class="fas fa-database"></i>
            <span>数据源</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
          </div>
          <div class="submenu" :class="{ show: showSubMenu.dataSource }">
            <div class="submenu-item" :class="{ active: activeSubMenu.dataSource === 'list' }" @click="setActiveSubMenu('dataSource', 'list')">数据源列表</div>
            <div class="submenu-item" :class="{ active: activeSubMenu.dataSource === 'add' }" @click="setActiveSubMenu('dataSource', 'add')">新增数据源</div>
            <div class="submenu-item" :class="{ active: activeSubMenu.dataSource === 'permission' }" @click="setActiveSubMenu('dataSource', 'permission')">数据源权限</div>
          </div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'report' }" @click="toggleSubMenu('report')">
            <i class="fas fa-file-alt"></i>
            <span>报表</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
          </div>
          <div class="submenu" :class="{ show: showSubMenu.report }">
            <div class="submenu-item" :class="{ active: activeSubMenu.report === 'my' }" @click="setActiveSubMenu('report', 'my')">我的报表</div>
            <div class="submenu-item" :class="{ active: activeSubMenu.report === 'shared' }" @click="setActiveSubMenu('report', 'shared')">共享报表</div>
            <div class="submenu-item" :class="{ active: activeSubMenu.report === 'favorite' }" @click="setActiveSubMenu('report', 'favorite')">收藏报表</div>
            <div class="submenu-item" :class="{ active: activeSubMenu.report === 'recycle' }" @click="setActiveSubMenu('report', 'recycle')">回收站</div>
          </div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'dashboard' }" @click="setActiveMainMenu('dashboard')">
            <i class="fas fa-chart-pie"></i>
            <span>仪表盘</span>
            <span class="menu-badge">5</span>
          </div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'dataset' }" @click="setActiveMainMenu('dataset')">
            <i class="fas fa-cubes"></i>
            <span>数据集</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">系统管理</div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'user' }" @click="setActiveMainMenu('user')">
            <i class="fas fa-users"></i>
            <span>用户管理</span>
          </div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'role' }" @click="setActiveMainMenu('role')">
            <i class="fas fa-user-shield"></i>
            <span>角色权限</span>
          </div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'log' }" @click="setActiveMainMenu('log')">
            <i class="fas fa-history"></i>
            <span>操作日志</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">帮助中心</div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'doc' }" @click="setActiveMainMenu('doc')">
            <i class="fas fa-question-circle"></i>
            <span>帮助文档</span>
          </div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'video' }" @click="setActiveMainMenu('video')">
            <i class="fas fa-play-circle"></i>
            <span>视频教程</span>
          </div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'service' }" @click="setActiveMainMenu('service')">
            <i class="fas fa-comment-dots"></i>
            <span>联系客服</span>
          </div>
        </div>
      </aside>
      
      <!-- 右侧数据源列表区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title">数据源列表</h1>
            <p class="page-description">管理所有可用的数据源，包括数据库、API和文件等类型</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline" @click="exportList">
              <i class="fas fa-download"></i>
              导出列表
            </button>
            <button class="btn btn-primary" @click="addDataSource">
              <i class="fas fa-plus"></i>
              新增数据源
            </button>
          </div>
        </div>
        
        <!-- 筛选和搜索区域 -->
        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-item">
              <label>数据源类型</label>
              <select v-model="filter.type">
                <option value="">全部类型</option>
                <option value="database">数据库</option>
                <option value="api">API接口</option>
                <option value="file">文件</option>
              </select>
            </div>
            <div class="filter-item">
              <label>连接状态</label>
              <select v-model="filter.status">
                <option value="">全部状态</option>
                <option value="online">已连接</option>
                <option value="offline">未连接</option>
              </select>
            </div>
            <div class="filter-item">
              <label>创建时间</label>
              <select v-model="filter.timeRange">
                <option value="">全部时间</option>
                <option value="week">近7天</option>
                <option value="month">近30天</option>
                <option value="quarter">近90天</option>
              </select>
            </div>
          </div>
          <div class="search-filter">
            <el-icon><Search /></el-icon>
            <input type="text" placeholder="搜索数据源名称..." v-model="filter.keyword">
          </div>
        </div>
        
        <!-- 数据源列表 -->
        <div class="data-source-list">
          <div class="table-header">
            <div>数据源名称</div>
            <div>类型</div>
            <div>连接状态</div>
            <div>最后同步时间</div>
            <div>操作</div>
          </div>
          
          <div class="table-row" v-for="(source, index) in filteredDataSources" :key="index">
            <div class="data-source-name">
              <div class="data-source-icon" :class="source.iconClass">
                <i :class="source.icon"></i>
              </div>
              <div class="data-source-info">
                <div class="source-name">{{ source.name }}</div>
                <div class="source-desc">{{ source.description }}</div>
              </div>
            </div>
            <div>{{ source.type }}</div>
            <div>
              <span class="status-badge" :class="source.statusClass">{{ source.statusText }}</span>
            </div>
            <div>{{ source.lastSyncTime }}</div>
            <div class="operation-buttons">
              <button class="operation-btn" title="编辑" @click="editDataSource(source)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="operation-btn" title="测试连接" @click="testConnection(source)">
                <i class="fas fa-plug"></i>
              </button>
              <button class="operation-btn" title="更多" @click="moreOptions(source)">
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
          
          <!-- 分页控件 -->
          <div class="pagination">
            <div class="pagination-info">显示 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalItems) }} 条，共 {{ totalItems }} 条</div>
            <div class="pagination-controls">
              <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="page-btn" v-for="page in pageCount" :key="page" :class="{ active: currentPage === page }" @click="changePage(page)">
                {{ page }}
              </button>
              <button class="page-btn" :disabled="currentPage === pageCount" @click="changePage(currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script >
export default {
  name: 'DsPage'
}
</script>
<script setup>
import { ref, computed } from 'vue';

// 菜单状态管理
const activeMainMenu = ref('dataSource');
const showSubMenu = ref({
  dataSource: true,
  report: false
});
const activeSubMenu = ref({
  dataSource: 'list',
  report: ''
});

// 切换子菜单显示/隐藏
const toggleSubMenu = (menu) => {
  showSubMenu.value[menu] = !showSubMenu.value[menu];
  activeMainMenu.value = menu;
};

// 设置主菜单激活状态
const setActiveMainMenu = (menu) => {
  activeMainMenu.value = menu;
  // 关闭所有子菜单
  Object.keys(showSubMenu.value).forEach(key => {
    showSubMenu.value[key] = false;
  });
};

// 设置子菜单激活状态
const setActiveSubMenu = (parent, child) => {
  activeSubMenu.value[parent] = child;
  activeMainMenu.value = parent;
};

// 用户菜单切换
const toggleUserMenu = () => {
  // 实际项目中可以实现用户菜单的显示隐藏逻辑
  console.log('用户菜单切换');
};

// 数据源数据
const dataSources = ref([
  {
    name: 'MySQL销售数据库',
    description: '包含所有销售订单和客户信息',
    type: 'MySQL',
    status: 'online',
    statusText: '已连接',
    statusClass: 'status-online',
    lastSyncTime: '2023-10-15 08:30',
    icon: 'fas fa-database',
    iconClass: 'mysql'
  },
  {
    name: 'Oracle ERP系统',
    description: '企业资源计划系统数据',
    type: 'Oracle',
    status: 'online',
    statusText: '已连接',
    statusClass: 'status-online',
    lastSyncTime: '2023-10-14 16:45',
    icon: 'fas fa-database',
    iconClass: 'oracle'
  },
  {
    name: '天气API接口',
    description: '获取实时天气数据',
    type: 'API',
    status: 'online',
    statusText: '已连接',
    statusClass: 'status-online',
    lastSyncTime: '2023-10-15 10:20',
    icon: 'fas fa-cloud',
    iconClass: 'api'
  },
  {
    name: '季度销售计划',
    description: '2023年Q4销售目标Excel表',
    type: 'Excel',
    status: 'online',
    statusText: '已连接',
    statusClass: 'status-online',
    lastSyncTime: '2023-10-12 09:15',
    icon: 'fas fa-file-excel',
    iconClass: 'excel'
  },
  {
    name: '用户行为分析',
    description: '网站用户访问行为记录',
    type: 'MySQL',
    status: 'offline',
    statusText: '未连接',
    statusClass: 'status-offline',
    lastSyncTime: '2023-10-10 14:30',
    icon: 'fas fa-database',
    iconClass: 'mysql'
  }
]);

// 筛选条件
const filter = ref({
  type: '',
  status: '',
  timeRange: '',
  keyword: ''
});

// 分页相关
const currentPage = ref(1);
const pageSize = ref(5);
const totalItems = ref(24); // 模拟总条数

// 计算总页数
const pageCount = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value);
});

// 筛选后的数据
const filteredDataSources = computed(() => {
  // 实际项目中这里应该根据筛选条件过滤数据
  // 这里简化处理，仅返回所有数据
  return dataSources.value;
});

// 分页切换
const changePage = (page) => {
  if (page < 1 || page > pageCount.value) return;
  currentPage.value = page;
  // 实际项目中这里应该根据页码加载对应数据
};

// 按钮事件
const exportList = () => {
  console.log('导出列表');
};

const addDataSource = () => {
  console.log('新增数据源');
};

const editDataSource = (source) => {
  console.log('编辑数据源:', source);
};

const testConnection = (source) => {
  console.log('测试连接:', source);
};

const moreOptions = (source) => {
  console.log('更多操作:', source);
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

/* 右侧数据源列表区域 */
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

/* 数据源列表 */
.data-source-list {
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

.data-source-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.data-source-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.data-source-icon.mysql {
  background-color: #f6f6f6;
  color: #0061a8;
}

.data-source-icon.oracle {
  background-color: #fef7e0;
  color: #f80000;
}

.data-source-icon.api {
  background-color: #e6f7ff;
  color: #1890ff;
}

.data-source-icon.excel {
  background-color: #e8f4e9;
  color: #4caf50;
}

.data-source-info {
  display: flex;
  flex-direction: column;
}

.source-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.source-desc {
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

.status-online {
  background-color: #f0f9eb;
  color: #52c41a;
}

.status-offline {
  background-color: #fff2f0;
  color: #ff4d4f;
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