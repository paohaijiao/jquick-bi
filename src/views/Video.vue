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
      <aside class="sidebar" :class="{ show: isSidebarShow }">
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
            <div class="submenu-item" :class="{ active: activeSubmenu.dataSource === 'list' }" @click="handleSubmenuItemClick('dataSource', 'list')">数据源列表</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.dataSource === 'add' }" @click="handleSubmenuItemClick('dataSource', 'add')">新增数据源</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.dataSource === 'permission' }" @click="handleSubmenuItemClick('dataSource', 'permission')">数据源权限</div>
          </div>
          <div class="menu-item" @click="toggleSubmenu('report')">
            <i class="fas fa-file-alt"></i>
            <span>报表</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
          </div>
          <div class="submenu" :class="{ show: submenus.report }">
            <div class="submenu-item" :class="{ active: activeSubmenu.report === 'my' }" @click="handleSubmenuItemClick('report', 'my')">我的报表</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.report === 'shared' }" @click="handleSubmenuItemClick('report', 'shared')">共享报表</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.report === 'favorite' }" @click="handleSubmenuItemClick('report', 'favorite')">收藏报表</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.report === 'recycle' }" @click="handleSubmenuItemClick('report', 'recycle')">回收站</div>
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
          <div class="menu-item" @click="handleMenuItemClick('user')">
            <i class="fas fa-users"></i>
            <span>用户管理</span>
          </div>
          <div class="menu-item" @click="handleMenuItemClick('role')">
            <i class="fas fa-user-shield"></i>
            <span>角色权限</span>
          </div>
          <div class="menu-item" @click="handleMenuItemClick('log')">
            <i class="fas fa-history"></i>
            <span>操作日志</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">个人中心</div>
          <div class="menu-item" @click="handleMenuItemClick('profile')">
            <i class="fas fa-user-circle"></i>
            <span>个人信息</span>
          </div>
          <div class="menu-item" @click="handleMenuItemClick('security')">
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
          <div class="menu-item" :class="{ active: activeMenu === 'help' }" @click="handleMenuItemClick('help')">
            <i class="fas fa-question-circle"></i>
            <span>帮助文档</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'video' }" @click="handleMenuItemClick('video')">
            <i class="fas fa-play-circle"></i>
            <span>视频教程</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'support' }" @click="handleMenuItemClick('support')">
            <i class="fas fa-comment-dots"></i>
            <span>联系客服</span>
          </div>
        </div>
      </aside>
      
      <!-- 右侧视频教程区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title text-align-left">视频教程</h1>
            <p class="page-description">观看教程视频，快速掌握JQuick BI的使用技巧</p>
          </div>
        </div>
        
        <!-- 视频分类筛选 -->
        <div class="video-filters">
          <div class="filter-title">教程分类</div>
          <div class="filter-tags">
            <div 
              class="filter-tag" 
              :class="{ active: activeFilter === 'all' }" 
              @click="handleFilterClick('all')"
            >
              全部视频
            </div>
            <div 
              class="filter-tag" 
              :class="{ active: activeFilter === 'beginner' }" 
              @click="handleFilterClick('beginner')"
            >
              新手入门
            </div>
            <div 
              class="filter-tag" 
              :class="{ active: activeFilter === 'dataSource' }" 
              @click="handleFilterClick('dataSource')"
            >
              数据源管理
            </div>
            <div 
              class="filter-tag" 
              :class="{ active: activeFilter === 'report' }" 
              @click="handleFilterClick('report')"
            >
              报表制作
            </div>
            <div 
              class="filter-tag" 
              :class="{ active: activeFilter === 'dashboard' }" 
              @click="handleFilterClick('dashboard')"
            >
              仪表盘设计
            </div>
            <div 
              class="filter-tag" 
              :class="{ active: activeFilter === 'visualization' }" 
              @click="handleFilterClick('visualization')"
            >
              数据可视化
            </div>
            <div 
              class="filter-tag" 
              :class="{ active: activeFilter === 'advanced' }" 
              @click="handleFilterClick('advanced')"
            >
              高级功能
            </div>
            <div 
              class="filter-tag" 
              :class="{ active: activeFilter === 'system' }" 
              @click="handleFilterClick('system')"
            >
              系统管理
            </div>
          </div>
        </div>
        
        <!-- 视频列表 -->
        <div class="video-list">
          <div 
            class="video-card" 
            v-for="video in filteredVideos" 
            :key="video.id"
            @click="handleVideoClick(video)"
          >
            <div class="video-thumbnail">
              <img :src="video.thumbnail" :alt="video.title">
              <div class="video-duration">{{ video.duration }}</div>
              <div class="video-play-icon">
                <i class="fas fa-play"></i>
              </div>
            </div>
            <div class="video-info">
              <div class="video-title">{{ video.title }}</div>
              <div class="video-meta">
                <div class="video-views">
                  <i class="fas fa-eye"></i>
                  <span>{{ video.views }}</span>
                </div>
                <div class="video-date">{{ video.date }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页控件 -->
        <div class="pagination">
          <div 
            class="pagination-btn" 
            :class="{ disabled: currentPage === 1 }"
            @click="handlePrevPage"
          >
            <i class="fas fa-chevron-left"></i>
          </div>
          <div 
            class="pagination-number" 
            :class="{ active: currentPage === page }"
            v-for="page in totalPages" 
            :key="page"
            @click="handlePageClick(page)"
          >
            {{ page }}
          </div>
          <div 
            class="pagination-btn" 
            :class="{ disabled: currentPage === totalPages }"
            @click="handleNextPage"
          >
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
export default {
  name: 'videonPage'
}
</script>
<script setup>
import { ref, computed } from 'vue';

// 侧边栏状态
const isSidebarShow = ref(true);

// 菜单状态管理
const activeMenu = ref('video');
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

// 处理菜单项点击
const handleMenuItemClick = (menu) => {
  activeMenu.value = menu;
  // 关闭所有子菜单
  Object.keys(submenus.value).forEach(key => {
    submenus.value[key] = false;
  });
  // 重置子菜单激活状态
  Object.keys(activeSubmenu.value).forEach(key => {
    activeSubmenu.value[key] = '';
  });
};

// 处理子菜单项点击
const handleSubmenuItemClick = (parentMenu, submenu) => {
  activeSubmenu.value[parentMenu] = submenu;
  activeMenu.value = parentMenu;
};

// 处理用户信息点击
const handleUserClick = () => {
  console.log('用户信息被点击');
};

// 视频筛选状态
const activeFilter = ref('all');

// 处理筛选标签点击
const handleFilterClick = (filter) => {
  activeFilter.value = filter;
  // 重置到第一页
  currentPage.value = 1;
};

// 视频数据
const videos = ref([
  {
    id: 1,
    title: 'JQuick BI 新手入门：5分钟了解核心功能',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    duration: '08:45',
    views: '2,345',
    date: '2023-05-12',
    category: 'beginner'
  },
  {
    id: 2,
    title: '如何连接MySQL数据源并导入数据',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    duration: '12:30',
    views: '1,872',
    date: '2023-04-28',
    category: 'dataSource'
  },
  {
    id: 3,
    title: '报表制作进阶：使用公式和计算字段',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    duration: '15:22',
    views: '1,532',
    date: '2023-05-05',
    category: 'report'
  },
  {
    id: 4,
    title: '仪表盘设计最佳实践：创建交互式数据看板',
    thumbnail: 'https://picsum.photos/400/225?random=4',
    duration: '10:15',
    views: '2,108',
    date: '2023-04-20',
    category: 'dashboard'
  },
  {
    id: 5,
    title: '数据可视化：选择合适的图表展示你的数据',
    thumbnail: 'https://picsum.photos/400/225?random=5',
    duration: '09:38',
    views: '1,765',
    date: '2023-05-08',
    category: 'visualization'
  },
  {
    id: 6,
    title: '高级功能：使用参数和动态筛选创建智能报表',
    thumbnail: 'https://picsum.photos/400/225?random=6',
    duration: '18:42',
    views: '987',
    date: '2023-04-15',
    category: 'advanced'
  }
]);

// 筛选后的视频列表
const filteredVideos = computed(() => {
  if (activeFilter.value === 'all') {
    return videos.value;
  }
  return videos.value.filter(video => video.category === activeFilter.value);
});

// 分页相关
const currentPage = ref(1);
const totalPages = ref(5);

// 处理页码点击
const handlePageClick = (page) => {
  currentPage.value = page;
};

// 上一页
const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// 下一页
const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 处理视频点击
const handleVideoClick = (video) => {
  alert(`准备播放视频: ${video.title}`);
};

// 响应式处理 - 移动端自动隐藏侧边栏
const handleResize = () => {
  if (window.innerWidth <= 768) {
    isSidebarShow.value = false;
  } else {
    isSidebarShow.value = true;
  }
};

// 初始化时检查窗口大小
handleResize();
window.addEventListener('resize', handleResize);
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

/* 右侧视频教程区域 */
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

/* 视频分类筛选 */
.video-filters {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 16px 24px;
  margin-bottom: 24px;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-tag {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border-color);
}

.filter-tag:hover {
  background-color: var(--secondary-color);
}

.filter-tag.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 视频列表 */
.video-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.video-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 160px;
  background-color: #f0f0f0;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.video-card:hover .video-thumbnail img {
  transform: scale(1.05);
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.video-play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background-color: rgba(255, 131, 38, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.video-card:hover .video-play-icon {
  opacity: 1;
}

.video-info {
  padding: 16px;
}

.video-title {
  font-weight: 600;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.video-views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-date {
  white-space: nowrap;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.pagination-number {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-number:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.pagination-number.active {
  background-color: var(--primary-color);
  color: white;
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
  
  .video-list {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}
</style>