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
          <el-icon><search /></el-icon>
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
          <div class="menu-item" :class="{ active: activeMenu === 'home' }" @click="setActiveMenu('home')">
            <i class="fas fa-home"></i>
            <span>首页</span>
          </div>
          <div class="menu-item" @click="toggleSubmenu('dataSource')">
            <i class="fas fa-database"></i>
            <span>数据源</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;" :class="{ 'rotate-180': submenus.dataSource }"></i>
          </div>
          <div class="submenu" :class="{ show: submenus.dataSource }">
            <div class="submenu-item" :class="{ active: activeSubmenu.dataSource === 'list' }" @click="setActiveSubmenu('dataSource', 'list')">数据源列表</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.dataSource === 'new' }" @click="setActiveSubmenu('dataSource', 'new')">新增数据源</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.dataSource === 'permission' }" @click="setActiveSubmenu('dataSource', 'permission')">数据源权限</div>
          </div>
          <div class="menu-item" @click="toggleSubmenu('report')">
            <i class="fas fa-file-alt"></i>
            <span>报表</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;" :class="{ 'rotate-180': submenus.report }"></i>
          </div>
          <div class="submenu" :class="{ show: submenus.report }">
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
          <div class="menu-item" :class="{ active: activeMenu === 'user' }" @click="setActiveMenu('user')">
            <i class="fas fa-users"></i>
            <span>用户管理</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'role' }" @click="setActiveMenu('role')">
            <i class="fas fa-user-shield"></i>
            <span>角色权限</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'log' }" @click="setActiveMenu('log')">
            <i class="fas fa-history"></i>
            <span>操作日志</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">帮助中心</div>
          <div class="menu-item" :class="{ active: activeMenu === 'help' }" @click="setActiveMenu('help')">
            <i class="fas fa-question-circle"></i>
            <span>帮助文档</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'video' }" @click="setActiveMenu('video')">
            <i class="fas fa-play-circle"></i>
            <span>视频教程</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'contact' }" @click="setActiveMenu('contact')">
            <i class="fas fa-comment-dots"></i>
            <span>联系客服</span>
          </div>
        </div>
      </aside>
      
      <!-- 右侧用户统计信息区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title">数据分析概览</h1>
            <p class="welcome-message">欢迎回来，张磊！这是您的数据分析使用统计</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline" @click="exportReport">
              <i class="fas fa-download"></i>
              导出报告
            </button>
            <button class="btn btn-primary" @click="createReport">
              <i class="fas fa-plus"></i>
              创建报表
            </button>
          </div>
        </div>
        
        <!-- 核心统计卡片 -->
        <div class="stats-cards">
          <div class="stat-card" v-for="stat in stats" :key="stat.id" :class="stat.color">
            <div class="stat-title">
              <i :class="stat.icon"></i>
              {{ stat.title }}
            </div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-change" :class="stat.changeType">
              <i :class="stat.changeIcon"></i>
              {{ stat.changeText }}
            </div>
          </div>
        </div>
        
        <!-- 使用趋势图表 -->
        <div class="usage-trends">
          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">报表创建趋势</div>
              <div class="chart-filter">
                <select v-model="chartFilters.trend">
                  <option>近7天</option>
                  <option value="30">近30天</option>
                  <option>近90天</option>
                  <option>今年</option>
                </select>
              </div>
            </div>
            <div class="chart-container">
              <div class="chart-placeholder">
                <i class="fas fa-chart-line"></i>
                <p>报表创建趋势图表</p>
              </div>
            </div>
          </div>
          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">数据访问分布</div>
              <div class="chart-filter">
                <select v-model="chartFilters.distribution">
                  <option value="source">按数据源</option>
                  <option>按日期</option>
                </select>
              </div>
            </div>
            <div class="chart-container">
              <div class="chart-placeholder">
                <i class="fas fa-chart-pie"></i>
                <p>数据访问分布图表</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 最近活动 -->
        <div class="recent-activity">
          <div class="activity-header">
            <div class="activity-title">最近操作记录</div>
            <div class="view-all" @click="viewAllActivities">查看全部</div>
          </div>
          <div class="activity-list">
            <div class="activity-item" v-for="activity in activities" :key="activity.id">
              <div class="activity-icon" :class="activity.type">
                <i :class="activity.icon"></i>
              </div>
              <div class="activity-content">
                <div class="activity-desc">{{ activity.description }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 常用资源 -->
        <div class="frequent-resources">
          <div class="resources-header">
            <div class="resources-title">常用资源</div>
            <div class="view-all" @click="manageResources">管理资源</div>
          </div>
          <div class="resource-tabs">
            <div class="resource-tab" :class="{ active: activeResourceTab === 'report' }" @click="setResourceTab('report')">报表</div>
            <div class="resource-tab" :class="{ active: activeResourceTab === 'datasource' }" @click="setResourceTab('datasource')">数据源</div>
            <div class="resource-tab" :class="{ active: activeResourceTab === 'dataset' }" @click="setResourceTab('dataset')">数据集</div>
          </div>
          <div class="resource-list">
            <div class="resource-card" v-for="resource in resources" :key="resource.id" @click="openResource(resource)">
              <div class="resource-card-header">
                <div>
                  <div class="resource-name">{{ resource.name }}</div>
                  <div class="resource-type">{{ resource.type }}</div>
                </div>
                <div class="resource-time">{{ resource.accessTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
export default {
  name: 'IndexPage'
}
</script>
<script setup>
import { ref } from 'vue';

// 菜单状态管理
const activeMenu = ref('home');
const submenus = ref({
  dataSource: false,
  report: false
});
const activeSubmenu = ref({
  dataSource: '',
  report: ''
});

// 切换子菜单显示/隐藏
const toggleSubmenu = (menu) => {
  submenus.value[menu] = !submenus.value[menu];
};

// 设置激活的主菜单
const setActiveMenu = (menu) => {
  activeMenu.value = menu;
  // 关闭所有子菜单
  Object.keys(submenus.value).forEach(key => {
    submenus.value[key] = false;
  });
  // 清空子菜单激活状态
  Object.keys(activeSubmenu.value).forEach(key => {
    activeSubmenu.value[key] = '';
  });
};

// 设置激活的子菜单
const setActiveSubmenu = (parent, child) => {
  activeSubmenu.value[parent] = child;
  activeMenu.value = parent;
};

// 用户菜单切换
const toggleUserMenu = () => {
  // 实际项目中可以在这里实现用户菜单的显示/隐藏逻辑
  console.log('用户菜单被点击');
};

// 图表筛选器
const chartFilters = ref({
  trend: '30',
  distribution: 'source'
});

// 资源标签切换
const activeResourceTab = ref('report');
const setResourceTab = (tab) => {
  activeResourceTab.value = tab;
};

// 统计数据
const stats = ref([
  {
    id: 1,
    title: '我的报表总数',
    value: 24,
    icon: 'fas fa-file-alt',
    changeType: 'positive',
    changeIcon: 'fas fa-arrow-up',
    changeText: '较上月增长 12%'
  },
  {
    id: 2,
    title: '数据源数量',
    value: 8,
    icon: 'fas fa-database',
    color: 'blue',
    changeType: 'positive',
    changeIcon: 'fas fa-arrow-up',
    changeText: '较上月增长 1'
  },
  {
    id: 3,
    title: '本月访问量',
    value: 356,
    icon: 'fas fa-eye',
    color: 'green',
    changeType: 'positive',
    changeIcon: 'fas fa-arrow-up',
    changeText: '较上月增长 28%'
  },
  {
    id: 4,
    title: '共享报表数',
    value: 12,
    icon: 'fas fa-share-alt',
    color: 'purple',
    changeType: 'negative',
    changeIcon: 'fas fa-arrow-down',
    changeText: '较上月减少 2'
  }
]);

// 活动记录
const activities = ref([
  {
    id: 1,
    type: 'create',
    icon: 'fas fa-plus',
    description: '创建了新报表《2023年Q3销售分析》',
    time: '今天 09:45'
  },
  {
    id: 2,
    type: 'edit',
    icon: 'fas fa-edit',
    description: '编辑了数据源《CRM客户数据》',
    time: '昨天 16:20'
  },
  {
    id: 3,
    type: '',
    icon: 'fas fa-share-alt',
    description: '将报表《用户活跃度分析》共享给市场部',
    time: '2023-09-28 14:10'
  },
  {
    id: 4,
    type: 'delete',
    icon: 'fas fa-trash',
    description: '删除了过期报表《2023年Q1运营数据》',
    time: '2023-09-27 10:30'
  },
  {
    id: 5,
    type: 'edit',
    icon: 'fas fa-edit',
    description: '更新了仪表盘《销售总览》的数据刷新频率',
    time: '2023-09-26 15:45'
  }
]);

// 资源列表
const resources = ref([
  {
    id: 1,
    name: '月度销售业绩分析',
    type: '报表',
    accessTime: '2小时前访问'
  },
  {
    id: 2,
    name: '客户画像分析',
    type: '报表',
    accessTime: '昨天访问'
  },
  {
    id: 3,
    name: '产品库存监控',
    type: '仪表盘',
    accessTime: '3天前访问'
  },
  {
    id: 4,
    name: '销售订单明细',
    type: '数据集',
    accessTime: '上周访问'
  }
]);

// 按钮事件处理
const exportReport = () => {
  console.log('导出报告');
};

const createReport = () => {
  console.log('创建报表');
};

const viewAllActivities = () => {
  console.log('查看全部活动');
};

const manageResources = () => {
  console.log('管理资源');
};

const openResource = (resource) => {
  console.log('打开资源:', resource.name);
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

/* 右侧用户统计信息区域 */
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

.welcome-message {
  font-size: 16px;
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

/* 核心统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--card-shadow);
  border-left: 4px solid var(--primary-color);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-card.blue {
  border-left-color: #1890ff;
}

.stat-card.green {
  border-left-color: #52c41a;
}

.stat-card.purple {
  border-left-color: #722ed1;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.stat-title i {
  margin-right: 8px;
  font-size: 16px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-change {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.stat-change.positive {
  color: #52c41a;
}

.stat-change.negative {
  color: #ff4d4f;
}

.stat-change i {
  margin-right: 4px;
}

/* 使用趋势图表区域 */
.usage-trends {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--card-shadow);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
}

.chart-filter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-filter select {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
  color: #666;
}

.chart-container {
  height: 300px;
  background-color: #fafafa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  overflow: hidden;
}

.chart-placeholder {
  text-align: center;
}

.chart-placeholder i {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.3;
}

/* 最近活动区域 */
.recent-activity {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--card-shadow);
  margin-bottom: 24px;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
}

.view-all {
  font-size: 13px;
  color: var(--primary-color);
  cursor: pointer;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.create {
  background-color: #f0f9eb;
  color: #52c41a;
}

.activity-icon.edit {
  background-color: #e6f7ff;
  color: #1890ff;
}

.activity-icon.delete {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.activity-content {
  flex: 1;
}

.activity-desc {
  font-size: 14px;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

/* 常用资源区域 */
.frequent-resources {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--card-shadow);
}

.resources-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.resources-title {
  font-size: 16px;
  font-weight: 600;
}

.resource-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.resource-tab {
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.resource-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  font-weight: 500;
}

.resource-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.resource-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;
  cursor: pointer;
}

.resource-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 8px rgba(255, 131, 38, 0.1);
}

.resource-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.resource-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.resource-type {
  font-size: 12px;
  color: #999;
}

.resource-time {
  font-size: 12px;
  color: #999;
}
</style>