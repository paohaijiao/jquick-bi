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
            <div class="submenu-item" :class="{ active: activeSubMenu.dataSource === 'new' }" @click="setActiveSubMenu('dataSource', 'new')">新增数据源</div>
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
          <div class="menu-item" :class="{ active: activeMainMenu === 'help' }" @click="setActiveMainMenu('help')">
            <i class="fas fa-question-circle"></i>
            <span>帮助文档</span>
          </div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'video' }" @click="setActiveMainMenu('video')">
            <i class="fas fa-play-circle"></i>
            <span>视频教程</span>
          </div>
          <div class="menu-item" :class="{ active: activeMainMenu === 'contact' }" @click="setActiveMainMenu('contact')">
            <i class="fas fa-comment-dots"></i>
            <span>联系客服</span>
          </div>
        </div>
      </aside>
      
      <!-- 右侧我的报表区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title">我的报表</h1>
            <p class="page-description">管理您创建的所有报表，包括编辑、删除和共享等操作</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline">
              <i class="fas fa-folder-plus"></i>
              新建文件夹
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-plus"></i>
              创建报表
            </button>
          </div>
        </div>
        
        <!-- 筛选和视图切换 -->
        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-item">
              <label>报表状态</label>
              <select v-model="filterStatus">
                <option value="">全部状态</option>
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
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
            <div class="filter-item">
              <label>所属文件夹</label>
              <select v-model="filterFolder">
                <option value="">全部文件夹</option>
                <option value="sales">销售报表</option>
                <option value="marketing">市场分析</option>
                <option value="operation">运营数据</option>
              </select>
            </div>
          </div>
          <div class="search-filter">
            <el-icon><Search /></el-icon>
            <input type="text" placeholder="搜索报表名称..." v-model="searchKeyword">
          </div>
          <div class="view-controls">
            <button class="view-btn" :class="{ active: viewMode === 'grid' }" @click="setViewMode('grid')">
              <i class="fas fa-th-large"></i>
              卡片视图
            </button>
            <button class="view-btn" :class="{ active: viewMode === 'list' }" @click="setViewMode('list')">
              <i class="fas fa-list"></i>
              列表视图
            </button>
          </div>
        </div>
        
        <!-- 报表列表 - 卡片视图 -->
        <div class="reports-grid" v-if="viewMode === 'grid'">
          <div class="report-card" v-for="(report, index) in filteredReports" :key="index">
            <div class="report-preview">
              <div class="report-preview-placeholder">
                <i :class="report.icon"></i>
                <p>{{ report.previewText }}</p>
              </div>
              <div class="report-favorite" :class="{ active: report.favorite }" @click="toggleFavorite(index)">
                <i class="fas fa-star"></i>
              </div>
            </div>
            <div class="report-info">
              <div class="report-name">{{ report.name }}</div>
              <div class="report-meta">
                <span>更新于 {{ report.updateTime }}</span>
                <span>{{ report.views }} 访问</span>
              </div>
              <div class="report-tags">
                <span class="report-tag" v-for="(tag, tagIndex) in report.tags" :key="tagIndex">{{ tag }}</span>
              </div>
              <div class="report-actions">
                <span class="report-status" :class="'status-' + report.status">{{ report.statusText }}</span>
                <div class="action-dropdown">
                  <button class="action-btn">
                    <i class="fas fa-ellipsis-v"></i>
                    <span>操作</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页控件 -->
        <div class="pagination">
          <div class="pagination-info">显示 1-6 条，共 24 条</div>
          <div class="pagination-controls">
            <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="page-btn" :class="{ active: currentPage === 1 }" @click="changePage(1)">1</button>
            <button class="page-btn" :class="{ active: currentPage === 2 }" @click="changePage(2)">2</button>
            <button class="page-btn" :class="{ active: currentPage === 3 }" @click="changePage(3)">3</button>
            <button class="page-btn" :class="{ active: currentPage === 4 }" @click="changePage(4)">4</button>
            <button class="page-btn" :disabled="currentPage === 4" @click="changePage(currentPage + 1)">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 菜单状态管理
const activeMainMenu = ref('report');
const showSubMenu = ref({
  dataSource: false,
  report: true
});
const activeSubMenu = ref({
  dataSource: '',
  report: 'my'
});

// 视图模式管理
const viewMode = ref('grid');

// 筛选条件
const filterStatus = ref('');
const filterTime = ref('');
const filterFolder = ref('');
const searchKeyword = ref('');

// 分页管理
const currentPage = ref(1);

// 报表数据
const reports = ref([
  {
    name: '2023年Q3销售业绩分析报表',
    updateTime: '2023-10-15',
    views: '3.2k',
    tags: ['销售', '季度', '业绩'],
    status: 'published',
    statusText: '已发布',
    favorite: true,
    icon: 'fas fa-chart-bar',
    previewText: '销售报表预览'
  },
  {
    name: '客户画像与购买行为分析',
    updateTime: '2023-10-12',
    views: '1.8k',
    tags: ['客户', '行为分析'],
    status: 'published',
    statusText: '已发布',
    favorite: false,
    icon: 'fas fa-chart-pie',
    previewText: '客户分析预览'
  },
  {
    name: '产品销量趋势预测分析',
    updateTime: '2023-10-10',
    views: '2.5k',
    tags: ['产品', '销量', '预测'],
    status: 'published',
    statusText: '已发布',
    favorite: true,
    icon: 'fas fa-chart-line',
    previewText: '趋势分析预览'
  },
  {
    name: '区域销售分布明细报表',
    updateTime: '2023-10-08',
    views: '1.2k',
    tags: ['区域', '销售', '明细'],
    status: 'published',
    statusText: '已发布',
    favorite: false,
    icon: 'fas fa-table',
    previewText: '数据表格预览'
  },
  {
    name: 'Q4营销活动效果分析',
    updateTime: '2023-10-05',
    views: '856',
    tags: ['营销', '活动'],
    status: 'draft',
    statusText: '草稿',
    favorite: false,
    icon: 'fas fa-chart-bar',
    previewText: '营销分析预览'
  },
  {
    name: '产品成本与利润分析报表',
    updateTime: '2023-09-30',
    views: '2.1k',
    tags: ['产品', '成本', '利润'],
    status: 'published',
    statusText: '已发布',
    favorite: true,
    icon: 'fas fa-chart-pie',
    previewText: '成本分析预览'
  }
]);

// 切换子菜单显示/隐藏
const toggleSubMenu = (menu) => {
  // 先关闭所有子菜单
  Object.keys(showSubMenu.value).forEach(key => {
    showSubMenu.value[key] = false;
  });
  // 激活当前菜单
  activeMainMenu.value = menu;
  // 切换当前子菜单显示状态
  showSubMenu.value[menu] = !showSubMenu.value[menu];
};

// 设置激活的主导航菜单
const setActiveMainMenu = (menu) => {
  // 关闭所有子菜单
  Object.keys(showSubMenu.value).forEach(key => {
    showSubMenu.value[key] = false;
  });
  activeMainMenu.value = menu;
  // 清空子菜单激活状态
  Object.keys(activeSubMenu.value).forEach(key => {
    activeSubMenu.value[key] = '';
  });
};

// 设置激活的子菜单
const setActiveSubMenu = (parentMenu, subMenu) => {
  activeMainMenu.value = parentMenu;
  activeSubMenu.value[parentMenu] = subMenu;
};

// 切换视图模式
const setViewMode = (mode) => {
  viewMode.value = mode;
};

// 切换收藏状态
const toggleFavorite = (index) => {
  reports.value[index].favorite = !reports.value[index].favorite;
};

// 切换分页
const changePage = (page) => {
  currentPage.value = page;
};

// 切换用户菜单（预留功能）
const toggleUserMenu = () => {
  // 实际项目中可以实现用户菜单的显示/隐藏
  console.log('用户菜单切换');
};

// 筛选报表
const filteredReports = computed(() => {
  return reports.value.filter(report => {
    // 状态筛选
    if (filterStatus.value && report.status !== filterStatus.value) {
      return false;
    }
    
    // 搜索关键词筛选
    if (searchKeyword.value && !report.name.includes(searchKeyword.value)) {
      return false;
    }
    
    // 这里可以添加更多筛选逻辑（时间和文件夹）
    return true;
  });
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

/* 右侧报表列表区域 */
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

/* 筛选和视图切换 */
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

.view-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: white;
  border: 1px solid var(--border-color);
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.view-btn.active {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

/* 报表列表 - 卡片视图 */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.report-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.report-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--border-color);
}

.report-preview {
  height: 160px;
  background-color: #f5f5f5;
  position: relative;
  overflow: hidden;
}

.report-preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #999;
}

.report-preview-placeholder i {
  font-size: 36px;
  margin-bottom: 8px;
  opacity: 0.3;
}

.report-favorite {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ddd;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.report-favorite.active {
  color: #ff4d4f;
}

.report-favorite:hover {
  color: #ff4d4f;
}

.report-info {
  padding: 16px;
}

.report-name {
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.report-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
}

.report-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.report-tag {
  padding: 3px 8px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border-radius: 4px;
  font-size: 12px;
}

.report-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.report-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

.status-draft {
  background-color: #f5f5f5;
  color: #666;
}

.status-published {
  background-color: #e6f7ff;
  color: #1890ff;
}

.action-dropdown {
  position: relative;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
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