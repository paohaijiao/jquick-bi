<template>
  <aside class="sidebar">
    <div class="menu-section">
      <div class="menu-section-title">主导航</div>
      <div class="menu-item" :class="{ active: activeMenu === 'home' }" @click="handleMenuClick('home')">
        <i class="fas fa-home"></i>
        <span>首页</span>
      </div>
      <div class="menu-item" @click="toggleSubmenu('datasource')">
        <i class="fas fa-database"></i>
        <span>数据源</span>
        <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
      </div>
      <div class="submenu" :class="{ show: showSubmenu.datasource }">
        <div class="submenu-item" :class="{ active: activeSubmenu.datasource === 'list' }" @click="handleSubmenuClick('datasource', 'list')">数据源列表</div>
        <div class="submenu-item" :class="{ active: activeSubmenu.datasource === 'new' }" @click="handleSubmenuClick('datasource', 'new')">新增数据源</div>
        <div class="submenu-item" :class="{ active: activeSubmenu.datasource === 'permission' }" @click="handleSubmenuClick('datasource', 'permission')">数据源权限</div>
      </div>
      <div class="menu-item" @click="toggleSubmenu('report')">
        <i class="fas fa-file-alt"></i>
        <span>报表</span>
        <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
      </div>
      <div class="submenu" :class="{ show: showSubmenu.report }">
        <div class="submenu-item" :class="{ active: activeSubmenu.report === 'my' }" @click="handleSubmenuClick('report', 'my')">我的报表</div>
        <div class="submenu-item" :class="{ active: activeSubmenu.report === 'shared' }" @click="handleSubmenuClick('report', 'shared')">共享报表</div>
        <div class="submenu-item" :class="{ active: activeSubmenu.report === 'favorite' }" @click="handleSubmenuClick('report', 'favorite')">收藏报表</div>
        <div class="submenu-item" :class="{ active: activeSubmenu.report === 'recycle' }" @click="handleSubmenuClick('report', 'recycle')">回收站</div>
      </div>
      <div class="menu-item" :class="{ active: activeMenu === 'dashboard' }" @click="handleMenuClick('dashboard')">
        <i class="fas fa-chart-pie"></i>
        <span>仪表盘</span>
        <span class="menu-badge">5</span>
      </div>
      <div class="menu-item" :class="{ active: activeMenu === 'dataset' }" @click="handleMenuClick('dataset')">
        <i class="fas fa-cubes"></i>
        <span>数据集</span>
      </div>
      <div class="menu-item" :class="{ active: activeMenu === 'message' }" @click="handleMenuClick('message')">
        <i class="fas fa-envelope"></i>
        <span>站内消息</span>
        <span class="menu-badge">{{ unreadCount }}</span>
      </div>
    </div>
    
    <div class="menu-section">
      <div class="menu-section-title">系统管理</div>
      <div class="menu-item" :class="{ active: activeMenu === 'user' }" @click="handleMenuClick('user')">
        <i class="fas fa-users"></i>
        <span>用户管理</span>
      </div>
      <div class="menu-item" :class="{ active: activeMenu === 'role' }" @click="handleMenuClick('role')">
        <i class="fas fa-user-shield"></i>
        <span>角色权限</span>
      </div>
      <div class="menu-item" :class="{ active: activeMenu === 'log' }" @click="handleMenuClick('log')">
        <i class="fas fa-history"></i>
        <span>操作日志</span>
      </div>
    </div>
    
    <div class="menu-section">
      <div class="menu-section-title">帮助中心</div>
      <div class="menu-item" :class="{ active: activeMenu === 'doc' }" @click="handleMenuClick('doc')">
        <i class="fas fa-question-circle"></i>
        <span>帮助文档</span>
      </div>
      <div class="menu-item" :class="{ active: activeMenu === 'video' }" @click="handleMenuClick('video')">
        <i class="fas fa-play-circle"></i>
        <span>视频教程</span>
      </div>
      <div class="menu-item" :class="{ active: activeMenu === 'service' }" @click="handleMenuClick('service')">
        <i class="fas fa-comment-dots"></i>
        <span>联系客服</span>
      </div>
    </div>
  </aside>
</template>
<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

// 定义组件属性
const props = defineProps({
  activeMenu: {
    type: String,
    default: ''
  },
  unreadCount: {
    type: Number,
    default: 0
  }
})

// 定义组件事件
const emit = defineEmits(['menu-click', 'submenu-click'])

// 子菜单状态
const showSubmenu = ref({
  datasource: false,
  report: false
})

const activeSubmenu = ref({
  datasource: '',
  report: ''
})

// 切换子菜单显示状态
const toggleSubmenu = (menu) => {
  showSubmenu.value[menu] = !showSubmenu.value[menu]
}

// 处理菜单点击事件
const handleMenuClick = (menu) => {
  emit('menu-click', menu)
}

// 处理子菜单点击事件
const handleSubmenuClick = (parent, sub) => {
  activeSubmenu.value[parent] = sub
  emit('submenu-click', { parent, sub })
}

// 监听外部传入的 activeMenu 变化
watch(() => props.activeMenu, (newValue) => {
  console.log(newValue)
  // 可以根据需要处理菜单激活状态的同步
})
</script>

<style scoped>
/* 这里保留原有的所有菜单样式 */
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
</style>