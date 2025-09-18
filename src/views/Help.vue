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
          <div class="submenu" :class="{ show: submenus.dataSource }">
            <div class="submenu-item" :class="{ active: activeSubmenu.dataSource === 'list' }" @click="setActiveSubmenu('dataSource', 'list')">数据源列表</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.dataSource === 'new' }" @click="setActiveSubmenu('dataSource', 'new')">新增数据源</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.dataSource === 'permission' }" @click="setActiveSubmenu('dataSource', 'permission')">数据源权限</div>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'report' }" @click="toggleSubmenu('report')">
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
      
      <!-- 右侧帮助文档区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title">帮助文档</h1>
            <p class="page-description">所有文档和资源均托管在GitHub上，点击链接查看详细内容</p>
          </div>
        </div>
        
        <div class="github-banner">
          <i class="fab fa-github"></i>
          <div class="github-banner-content">
            <div class="github-banner-title">JQuick BI 文档库</div>
            <div class="github-banner-desc">所有官方文档均托管在GitHub上，欢迎贡献和反馈</div>
          </div>
          <a href="https://github.com" target="_blank" class="github-banner-link">
            访问 GitHub 仓库 <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
        
        <div class="documentation-grid">
          <div class="doc-card">
            <div class="doc-card-icon">
              <i class="fas fa-book"></i>
            </div>
            <div class="doc-card-title">用户手册</div>
            <div class="doc-card-desc">详细介绍JQuick BI的各项功能和使用方法，适合新用户快速上手。</div>
            <a href="https://github.com" target="_blank" class="doc-card-link">
              查看用户手册 <i class="fas fa-arrow-right"></i>
            </a>
          </div>
          
          <div class="doc-card">
            <div class="doc-card-icon">
              <i class="fas fa-code"></i>
            </div>
            <div class="doc-card-title">开发者指南</div>
            <div class="doc-card-desc">包含API文档、集成指南和二次开发教程，帮助开发者扩展系统功能。</div>
            <a href="https://github.com" target="_blank" class="doc-card-link">
              查看开发者指南 <i class="fas fa-arrow-right"></i>
            </a>
          </div>
          
          <div class="doc-card">
            <div class="doc-card-icon">
              <i class="fas fa-cogs"></i>
            </div>
            <div class="doc-card-title">管理员手册</div>
            <div class="doc-card-desc">系统部署、配置和维护的详细指南，适合系统管理员参考。</div>
            <a href="https://github.com" target="_blank" class="doc-card-link">
              查看管理员手册 <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
        
        <div class="doc-section">
          <div class="doc-section-title">快速入门</div>
          <div class="doc-section-content">
            <div class="doc-item">
              <div class="doc-item-icon">
                <el-icon><Files /></el-icon>
              </div>
              <div class="doc-item-content">
                <div class="doc-item-title">JQuick BI 简介</div>
                <div class="doc-item-desc">了解JQuick BI的核心功能、优势和适用场景。</div>
                <div class="doc-item-links">
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> 查看文档
                  </a>
                </div>
              </div>
            </div>
            
            <div class="doc-item">
              <div class="doc-item-icon">
                   <el-icon><User /></el-icon>
              </div>
              <div class="doc-item-content">
                <div class="doc-item-title">注册与登录</div>
                <div class="doc-item-desc">如何注册账号、登录系统以及找回密码的详细步骤。</div>
                <div class="doc-item-links">
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> 查看文档
                  </a>
                </div>
              </div>
            </div>
            
            <div class="doc-item">
              <div class="doc-item-icon">
                <el-icon><PieChart /></el-icon>
              </div>
              <div class="doc-item-content">
                <div class="doc-item-title">快速创建第一个报表</div>
                <div class="doc-item-desc">从数据源连接到报表发布的完整流程演示。</div>
                <div class="doc-item-links">
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> 查看文档
                  </a>
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> 示例代码
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="doc-section">
          <div class="doc-section-title">功能指南</div>
          <div class="doc-section-content">
            <div class="doc-item">
              <div class="doc-item-icon">
                <i class="fas fa-database"></i>
              </div>
              <div class="doc-item-content">
                <div class="doc-item-title">数据源管理</div>
                <div class="doc-item-desc">连接、配置和管理各种类型的数据源。</div>
                <div class="doc-item-links">
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> 关系型数据库
                  </a>
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> 大数据平台
                  </a>
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> API数据源
                  </a>
                </div>
              </div>
            </div>
            
            <div class="doc-item">
              <div class="doc-item-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="doc-item-content">
                <div class="doc-item-title">报表设计</div>
                <div class="doc-item-desc">使用报表设计器创建和编辑交互式报表。</div>
                <div class="doc-item-links">
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> 基础操作
                  </a>
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> 图表类型
                  </a>
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> 交互设置
                  </a>
                </div>
              </div>
            </div>
            
            <div class="doc-item">
              <div class="doc-item-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="doc-item-content">
                <div class="doc-item-title">用户与权限管理</div>
                <div class="doc-item-desc">管理用户账户、角色和资源访问权限。</div>
                <div class="doc-item-links">
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> 用户管理
                  </a>
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> 角色配置
                  </a>
                  <a href="https://github.com" target="_blank" class="doc-item-link">
                    <i class="fab fa-github"></i> 权限设置
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="help-resources">
          <div class="resources-title">其他资源</div>
          <div class="resources-grid">
            <a href="https://github.com" target="_blank" class="resource-item">
              <div class="resource-icon">
                <i class="fas fa-bug"></i>
              </div>
              <div class="resource-name">问题反馈</div>
            </a>
            
            <a href="https://github.com" target="_blank" class="resource-item">
              <div class="resource-icon">
                <i class="fas fa-code-branch"></i>
              </div>
              <div class="resource-name">源码仓库</div>
            </a>
            
            <a href="https://github.com" target="_blank" class="resource-item">
              <div class="resource-icon">
                <i class="fas fa-file-export"></i>
              </div>
              <div class="resource-name">下载中心</div>
            </a>
            
            <a href="https://github.com" target="_blank" class="resource-item">
              <div class="resource-icon">
                <i class="fas fa-exchange-alt"></i>
              </div>
              <div class="resource-name">API文档</div>
            </a>
            
            <a href="https://github.com" target="_blank" class="resource-item">
              <div class="resource-icon">
                <i class="fas fa-book-open"></i>
              </div>
              <div class="resource-name">知识库</div>
            </a>
            
            <a href="https://github.com" target="_blank" class="resource-item">
              <div class="resource-icon">
                <i class="fas fa-lightbulb"></i>
              </div>
              <div class="resource-name">最佳实践</div>
            </a>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HelpPage'
}
</script>
<script setup>
import { ref } from 'vue';

// 菜单状态管理
const activeMenu = ref('help'); // 默认激活帮助文档
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
  activeMenu.value = menu;
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
const setActiveSubmenu = (parentMenu, submenu) => {
  activeMenu.value = parentMenu;
  activeSubmenu.value[parentMenu] = submenu;
};

// 用户菜单切换
const toggleUserMenu = () => {
  // 实际项目中可以实现用户菜单的显示/隐藏逻辑
  console.log('用户菜单被点击');
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
  --github-color: #24292e;
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

/* 右侧帮助文档区域 */
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

.github-banner {
  background-color: var(--github-color);
  color: white;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.github-banner i {
  font-size: 24px;
}

.github-banner-content {
  flex: 1;
}

.github-banner-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.github-banner-desc {
  font-size: 14px;
  opacity: 0.9;
}

.github-banner-link {
  color: #58a6ff;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.github-banner-link:hover {
  text-decoration: underline;
}

.documentation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.doc-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 24px;
  transition: all 0.3s;
}

.doc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.doc-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
}

.doc-card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.doc-card-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.doc-card-link {
  display: inline-flex;
  align-items: center;
  color: var(--github-color);
  font-weight: 500;
  text-decoration: none;
  gap: 8px;
  transition: color 0.2s;
}

.doc-card-link:hover {
  color: var(--primary-color);
}

.doc-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 24px;
  margin-bottom: 32px;
}

.doc-section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.doc-section-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.doc-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.doc-item:last-child {
  border-bottom: none;
}

.doc-item-icon {
  width: 24px;
  height: 24px;
  color: var(--github-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 3px;
}

.doc-item-content {
  flex: 1;
}

.doc-item-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.doc-item-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.doc-item-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.doc-item-link {
  display: inline-flex;
  align-items: center;
  color: #58a6ff;
  font-size: 14px;
  text-decoration: none;
  gap: 4px;
}

.doc-item-link:hover {
  text-decoration: underline;
}

.help-resources {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 24px;
}

.resources-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.resource-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
  text-decoration: none;
  color: var(--text-color);
}

.resource-item:hover {
  background-color: var(--secondary-color);
  border-color: var(--primary-color);
}

.resource-icon {
  font-size: 24px;
  color: var(--github-color);
  margin-bottom: 8px;
}

.resource-name {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

/* 旋转动画类 */
.rotate-180 {
  transform: rotate(180deg);
}
</style>