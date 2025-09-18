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
        <div class="notification-icon active">
          <i class="far fa-bell"></i>
          <span class="notification-badge">{{ unreadCount }}</span>
        </div>
        <div class="user-info">
          <div class="user-avatar">{{ userNameInitials }}</div>
          <span class="user-name">{{ userName }}</span>
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
          <div class="menu-item" @click="toggleSubmenu('datasource')">
            <i class="fas fa-database"></i>
            <span>数据源</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
          </div>
          <div class="submenu" :class="{ show: showSubmenu.datasource }">
            <div class="submenu-item" :class="{ active: activeSubmenu.datasource === 'list' }" @click="setActiveSubmenu('datasource', 'list')">数据源列表</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.datasource === 'new' }" @click="setActiveSubmenu('datasource', 'new')">新增数据源</div>
            <div class="submenu-item" :class="{ active: activeSubmenu.datasource === 'permission' }" @click="setActiveSubmenu('datasource', 'permission')">数据源权限</div>
          </div>
          <div class="menu-item" @click="toggleSubmenu('report')">
            <i class="fas fa-file-alt"></i>
            <span>报表</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
          </div>
          <div class="submenu" :class="{ show: showSubmenu.report }">
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
          <div class="menu-item" :class="{ active: activeMenu === 'message' }" @click="setActiveMenu('message')">
            <i class="fas fa-envelope"></i>
            <span>站内消息</span>
            <span class="menu-badge">{{ unreadCount }}</span>
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
          <div class="menu-item" :class="{ active: activeMenu === 'doc' }" @click="setActiveMenu('doc')">
            <i class="fas fa-question-circle"></i>
            <span>帮助文档</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'video' }" @click="setActiveMenu('video')">
            <i class="fas fa-play-circle"></i>
            <span>视频教程</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'service' }" @click="setActiveMenu('service')">
            <i class="fas fa-comment-dots"></i>
            <span>联系客服</span>
          </div>
        </div>
      </aside>
      
      <!-- 右侧消息列表区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title">站内消息</h1>
            <p class="page-description">查看和管理所有系统消息、通知和个人消息</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline" @click="clearReadMessages">
              <i class="fas fa-trash-alt"></i>
              清空已读
            </button>
            <button class="btn btn-primary" @click="markAllAsRead">
              <i class="fas fa-check"></i>
              全部标为已读
            </button>
          </div>
        </div>
        
        <!-- 筛选和搜索区域 -->
        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-item">
              <label>消息类型</label>
              <select v-model="filter.type">
                <option value="">全部类型</option>
                <option value="system">系统消息</option>
                <option value="notice">通知公告</option>
                <option value="personal">个人消息</option>
              </select>
            </div>
            <div class="filter-item">
              <label>消息状态</label>
              <select v-model="filter.status">
                <option value="">全部状态</option>
                <option value="unread">未读</option>
                <option value="read">已读</option>
              </select>
            </div>
            <div class="filter-item">
              <label>时间范围</label>
              <select v-model="filter.timeRange">
                <option value="">全部时间</option>
                <option value="day">今天</option>
                <option value="week">近7天</option>
                <option value="month">近30天</option>
              </select>
            </div>
          </div>
          <div class="search-filter">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="搜索消息内容..." v-model="filter.searchText">
          </div>
        </div>
        
        <!-- 消息列表 -->
        <div class="message-list">
          <div class="table-header">
            <div>消息内容</div>
            <div>类型</div>
            <div>发送时间</div>
            <div>操作</div>
          </div>
          
          <div 
            class="message-row" 
            :class="{ unread: message.unread }"
            v-for="message in filteredMessages" 
            :key="message.id"
            @click="handleMessageClick(message)"
          >
            <div class="message-content">
              <div class="sender-avatar" :class="message.senderType">
                <i v-if="message.senderType === 'system'" class="fas fa-robot"></i>
                <i v-else-if="message.senderType === 'admin'" class="fas fa-user-shield"></i>
                <span v-else>{{ message.senderInitials }}</span>
              </div>
              <div class="message-info">
                <div class="message-header">
                  <span class="sender-name">
                    {{ message.senderName }}
                    <span class="unread-dot" v-if="message.unread"></span>
                  </span>
                </div>
                <div class="message-text">{{ message.content }}</div>
              </div>
            </div>
            <div>
              <span class="message-type" :class="'type-' + message.type">
                {{ message.type === 'system' ? '系统消息' : message.type === 'notice' ? '通知公告' : '个人消息' }}
              </span>
            </div>
            <div>{{ message.time }}</div>
            <div class="operation-buttons">
              <button 
                class="operation-btn" 
                title="标记为已读" 
                v-if="message.unread"
                @click.stop="markAsRead(message)"
              >
                <i class="fas fa-check"></i>
              </button>
              <button 
                class="operation-btn" 
                title="回复" 
                v-if="message.type === 'personal'"
                @click.stop="replyMessage(message)"
              >
                <i class="fas fa-reply"></i>
              </button>
              <button 
                class="operation-btn" 
                title="删除" 
                @click.stop="deleteMessage(message.id)"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
          
          <!-- 分页控件 -->
          <div class="pagination">
            <div class="pagination-info">显示 {{ startItem }}-{{ endItem }} 条，共 {{ totalMessages }} 条</div>
            <div class="pagination-controls">
              <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button 
                class="page-btn" 
                :class="{ active: currentPage === page }" 
                v-for="page in totalPages" 
                :key="page"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
              <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 用户信息
const userName = ref('张磊');
const userNameInitials = computed(() => {
  return userName.value.substring(0, 2);
});

// 菜单状态
const activeMenu = ref('message');
const showSubmenu = ref({
  datasource: false,
  report: false
});
const activeSubmenu = ref({
  datasource: '',
  report: ''
});

// 消息数据
const messages = ref([
  {
    id: 1,
    senderName: '系统通知',
    senderType: 'system',
    senderInitials: '',
    content: '您创建的"季度销售分析"报表已成功生成，点击查看详情。',
    type: 'system',
    time: '2023-10-15 14:30',
    unread: true
  },
  {
    id: 2,
    senderName: '管理员',
    senderType: 'admin',
    senderInitials: '',
    content: '系统将于10月20日进行维护升级，预计持续2小时，期间可能无法访问。',
    type: 'notice',
    time: '2023-10-15 10:15',
    unread: true
  },
  {
    id: 3,
    senderName: '李娜',
    senderType: 'user',
    senderInitials: 'L',
    content: '你分享的"区域销售对比"报表我已查看，能否帮忙调整一下数据维度？',
    type: 'personal',
    time: '2023-10-14 16:45',
    unread: true
  },
  {
    id: 4,
    senderName: '系统通知',
    senderType: 'system',
    senderInitials: '',
    content: '数据源"MySQL销售数据库"连接成功，已自动同步最新数据。',
    type: 'system',
    time: '2023-10-14 09:20',
    unread: false
  },
  {
    id: 5,
    senderName: '管理员',
    senderType: 'admin',
    senderInitials: '',
    content: '新功能"数据预警"已上线，可在报表设置中配置关键指标预警规则。',
    type: 'notice',
    time: '2023-10-13 15:30',
    unread: false
  },
  {
    id: 6,
    senderName: '王强',
    senderType: 'user',
    senderInitials: 'W',
    content: '关于上周的销售数据报表，我有几个疑问想和你讨论一下。',
    type: 'personal',
    time: '2023-10-12 11:20',
    unread: false
  },
  {
    id: 7,
    senderName: '系统通知',
    senderType: 'system',
    senderInitials: '',
    content: '您的报表"年度财务总结"已超过30天未更新，建议检查数据时效性。',
    type: 'system',
    time: '2023-10-11 16:40',
    unread: true
  },
  {
    id: 8,
    senderName: '管理员',
    senderType: 'admin',
    senderInitials: '',
    content: '本周六将举办新功能培训，点击查看详情并报名。',
    type: 'notice',
    time: '2023-10-10 09:15',
    unread: false
  }
]);

// 筛选条件
const filter = ref({
  type: '',
  status: '',
  timeRange: '',
  searchText: ''
});

// 分页相关
const currentPage = ref(1);
const pageSize = ref(5);

// 计算未读消息数量
const unreadCount = computed(() => {
  return messages.value.filter(msg => msg.unread).length;
});

// 计算总消息数
const totalMessages = computed(() => {
  return filteredMessages.value.length;
});

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalMessages.value / pageSize.value);
});

// 计算当前页显示的起始和结束条目
const startItem = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1;
});

const endItem = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalMessages.value);
});

// 计算筛选后的消息
const filteredMessages = computed(() => {
  return messages.value.filter(msg => {
    // 类型筛选
    if (filter.value.type && msg.type !== filter.value.type) {
      return false;
    }
    
    // 状态筛选
    if (filter.value.status === 'unread' && !msg.unread) {
      return false;
    }
    if (filter.value.status === 'read' && msg.unread) {
      return false;
    }
    
    // 搜索内容筛选
    if (filter.value.searchText && !msg.content.includes(filter.value.searchText)) {
      return false;
    }
    
    // 时间范围筛选（简化实现）
    // 实际应用中需要根据具体时间逻辑实现
    return true;
  }).slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});

// 菜单相关方法
const setActiveMenu = (menu) => {
  activeMenu.value = menu;
};

const toggleSubmenu = (menu) => {
  showSubmenu.value[menu] = !showSubmenu.value[menu];
};

const setActiveSubmenu = (parent, sub) => {
  activeSubmenu.value[parent] = sub;
};

// 分页方法
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

// 消息操作方法
const handleMessageClick = (message) => {
  if (message.unread) {
    message.unread = false;
  }
};

const markAsRead = (message) => {
  message.unread = false;
};

const markAllAsRead = () => {
  messages.value.forEach(msg => {
    msg.unread = false;
  });
};

const deleteMessage = (id) => {
  if (confirm('确定要删除这条消息吗？')) {
    messages.value = messages.value.filter(msg => msg.id !== id);
  }
};

const clearReadMessages = () => {
  if (confirm('确定要清空所有已读消息吗？')) {
    messages.value = messages.value.filter(msg => msg.unread);
  }
};

const replyMessage = (message) => {
  alert(`回复 ${message.senderName} 的消息: ${message.content}`);
  // 实际应用中这里会打开回复对话框
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
  --unread-color: #ff4d4f;
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
  color: var(--primary-color);
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

/* 右侧消息列表区域 */
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

/* 消息列表 */
.message-list {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 120px;
  padding: 16px 20px;
  background-color: var(--light-bg);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 14px;
}

.message-row {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 120px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  transition: background-color 0.2s;
  cursor: pointer;
}

.message-row:hover {
  background-color: var(--secondary-color);
}

.message-row.unread {
  background-color: #fff8f5;
}

.message-row:last-child {
  border-bottom: none;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.sender-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;
}

.sender-avatar.system {
  background-color: #e6f7ff;
  color: #1890ff;
}

.sender-avatar.user {
  background-color: #f6f6f6;
  color: #0061a8;
}

.sender-avatar.admin {
  background-color: #fef7e0;
  color: #fa8c16;
}

.message-info {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.sender-name {
  font-weight: 500;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--unread-color);
  margin-left: 8px;
  display: inline-block;
}

.message-text {
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-type {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.type-system {
  background-color: #e6f7ff;
  color: #1890ff;
}

.type-notice {
  background-color: #fff7e6;
  color: #fa8c16;
}

.type-personal {
  background-color: #f0f9eb;
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