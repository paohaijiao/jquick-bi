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
      <!-- 左侧菜单 -->
      <SidebarMenu 
        :active-menu="activeMenu" 
        :unread-count="unreadCount"
        @menu-click="setActiveMenu"
        @submenu-click="setActiveSubmenu"
      />
      
      <!-- 右侧租户管理区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title text-align-left">租户管理</h1>
            <p class="page-description">管理系统内所有租户信息、配置及权限</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline" @click="exportTenants">
              <i class="fas fa-download"></i>
              导出租户
            </button>
          </div>
        </div>
        
        <!-- 筛选和搜索区域 -->
        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-item">
              <label>租户状态</label>
              <select v-model="filterStatus">
                <option value="">全部状态</option>
                <option value="enabled">已启用</option>
                <option value="disabled">已禁用</option>
              </select>
            </div>
            <div class="filter-item">
              <label>租户类型</label>
              <select v-model="filterType">
                <option value="">全部类型</option>
                <option value="enterprise">企业版</option>
                <option value="professional">专业版</option>
                <option value="standard">标准版</option>
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
            <input type="text" placeholder="搜索租户名称或域名..." v-model="searchKeyword">
          </div>
        </div>
        <div class="tenant-list">
          <div class="tenant-card" v-for="tenant in filteredTenants" :key="tenant.id">
            <div class="tenant-header">
              <div class="tenant-logo">{{ tenant.enName }}</div>
              <span class="tenant-status" :class="tenant.status === 'enabled' ? 'status-enabled' : 'status-disabled'">
                {{ tenant.status === 'enabled' ? '已启用' : '已禁用' }}
              </span>
            </div>
            <div class="tenant-info">
              <div class="tenant-name text-align-left">{{ tenant.name }}</div>
              <div class="tenant-domain">
                <i class="fas fa-globe" style="font-size: 12px;"></i>
                {{ tenant.code }}
              </div>
              <div class="tenant-description">
                {{ tenant.remark }}
              </div>
            </div>
            <div class="tenant-metrics">
              <div class="metric-item">
                <div class="metric-value">{{ tenant.maxUsers }}</div>
                <div class="metric-label">用户数</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ tenant.maxReports }}</div>
                <div class="metric-label">报表数</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ tenant.dataSourceCount }}</div>
                <div class="metric-label">数据源</div>
              </div>
            </div>
            <div class="tenant-details">
              <div class="detail-item">
                <i class="fas fa-user" style="font-size: 12px;"></i>
                <span>管理员: {{ tenant.admin }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-calendar" style="font-size: 12px;"></i>
                <span>创建: {{ tenant.createTime }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-tag" style="font-size: 12px;"></i>
                <span>{{ tenant.type === 'enterprise' ? '企业版' : tenant.type === 'professional' ? '专业版' : '标准版' }}</span>
              </div>
            </div>
            <div class="tenant-actions">
              <button class="action-btn action-btn-outline config-btn" :data-tenant="tenant.name" @click="handleConfig(tenant.id)">
                <i class="fas fa-cog" style="font-size: 12px;"></i>
                配置
              </button>
            </div>
          </div>
        </div>
        
        <!-- 分页控件 -->
        <div class="pagination">
          <div class="pagination-info">
            显示 {{ currentPage === 1 ? 1 : (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalTenants) }} 条，共 {{ totalTenants }} 条
          </div>
          <div class="pagination-controls">
            <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
              <i class="fas fa-chevron-left" style="font-size: 12px;"></i>
            </button>
            <button class="page-btn" :class="{ active: currentPage === 1 }" @click="changePage(1)">1</button>
            <button class="page-btn" :class="{ active: currentPage === 2 }" @click="changePage(2)">2</button>
            <button class="page-btn" :class="{ active: currentPage === 3 }" @click="changePage(3)">3</button>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
              <i class="fas fa-chevron-right" style="font-size: 12px;"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  
    
    <!-- 配置租户模态框 -->
    <div class="modal-overlay" :class="{ show: showConfigModal }" @click="closeConfigModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">配置租户 - {{ currentTenant.name }}</h3>
          <button class="modal-close" @click="closeConfigModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label text-align-left">租户名称</label>
            <input type="text" class="form-control" v-model="currentTenant.name">
          </div>
          <div class="form-group">
            <label class="form-label text-align-left">租户编码</label>
            <input type="text" class="form-control" v-model="currentTenant.code" disabled>
          </div>
          <div class="form-group">
            <label class="form-label text-align-left">租户描述</label>
            <textarea class="form-control" v-model="currentTenant.remark"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label text-align-left">租户类型</label>
            <select class="form-control" v-model="currentTenant.planType">
              <option value="enterprise">企业版</option>
              <option value="professional">专业版</option>
              <option value="standard">标准版</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label text-align-left">管理员姓名</label>
            <input type="text" class="form-control" v-model="currentTenant.admin">
          </div>
          <div class="form-group">
            <label class="form-label text-align-left">租户状态</label>
            <select class="form-control" v-model="currentTenant.status">
              <option value="enabled">已启用</option>
              <option value="disabled">已禁用</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeConfigModal">取消</button>
          <button class="btn btn-primary" @click="saveTenantConfig">保存配置</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'tenantPage'
}
</script>
<script setup>
import { ref, computed,onMounted } from 'vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import request from '../api/request';
import { ElMessage } from 'element-plus';
// 租户数据
const tenants = ref([
 
]);

// 筛选条件
const filterStatus = ref('');
const filterType = ref('');
const filterTime = ref('');
const searchKeyword = ref('');

// 分页控制
const currentPage = ref(1);
const pageSize = ref(10);
const totalTenants = computed(() => filteredTenants.value.length);
const totalPages = computed(() => Math.ceil(totalTenants.value / pageSize.value));

// 筛选后的租户列表
const filteredTenants = computed(() => {
  return tenants.value.filter(tenant => {
    // 状态筛选
    if (filterStatus.value && tenant.status !== filterStatus.value) {
      return false;
    }
    // 类型筛选
    if (filterType.value && tenant.type !== filterType.value) {
      return false;
    }
    // 搜索关键词筛选
    if (searchKeyword.value && !(
      tenant.name.includes(searchKeyword.value) || 
      tenant.domain.includes(searchKeyword.value)
    )) {
      return false;
    }
    // 时间筛选（实际项目中需要根据实际时间处理）
    if (filterTime.value) {
      // 这里简化处理，实际项目中需要根据createTime进行筛选
    }
    return true;
  });
});

// 分页处理
/**
const paginatedTenants = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredTenants.value.slice(startIndex, startIndex + pageSize.value);
});
**/
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

// 导出租户
const exportTenants = () => {
  console.log('导出所有租户数据');
};

// 配置租户相关
const showConfigModal = ref(false);
const currentTenant = ref({});

const handleConfig = (tenantId) => {
  const tenant = tenants.value.find(t => t.id === tenantId);
  if (tenant) {
    currentTenant.value = { ...tenant };
    showConfigModal.value = true;
  }
};

const closeConfigModal = () => {
  showConfigModal.value = false;
};

const saveTenantConfig = () => {
  const index = tenants.value.findIndex(t => t.id === currentTenant.value.id);
  if (index !== -1) {
    // 更新logo文本
    currentTenant.value.logoText = currentTenant.value.name.substring(0, 2);
    tenants.value[index] = { ...currentTenant.value };
    showConfigModal.value = false;
    alert('配置保存成功');
  }
};
const handleUserQuery = () => {
  let query=new Object();
  query.pageNum=currentPage.value;
  query.pageSize=pageSize.value;
  query.status=filterStatus.value;
  request.post('/api/uaa-tenants/page',query)
  .then(response => {
    if(response.code==200){
      tenants.value=response.data.records;
    }else{
      ElMessage.error(`查询租户失败`);
    }
  }
)

};
onMounted(() => {
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
  --card-shadow-hover: 0 6px 16px rgba(0, 0, 0, 0.12);
  --sidebar-width: 260px;
  --header-height: 60px;
  --transition: all 0.3s ease;
  --modal-overlay: rgba(0, 0, 0, 0.5);
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

/* 右侧租户管理区域 */
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
  flex-wrap: wrap;
  gap: 16px;
}

.filter-group {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
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

/* 租户列表 - 卡片式布局 */
.tenant-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.tenant-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 20px;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;
}

.tenant-card:hover {
  box-shadow: var(--card-shadow-hover);
  transform: translateY(-3px);
  border-color: var(--border-color);
}

.tenant-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.tenant-logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 20px;
  font-weight: bold;
}

.tenant-status {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-enabled {
  background-color: #f0f9eb;
  color: #52c41a;
}

.status-disabled {
  background-color: #f5f5f5;
  color: #8c8c8c;
}

.tenant-info {
  margin-bottom: 16px;
}

.tenant-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.tenant-domain {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tenant-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tenant-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
}

.metric-item {
  text-align: center;
  padding: 8px 4px;
  background-color: var(--light-bg);
  border-radius: 6px;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2px;
}

.metric-label {
  font-size: 12px;
  color: #666;
}

.tenant-details {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
  gap: 10px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tenant-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: auto;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.action-btn-primary:hover {
  background-color: #e07018;
}

.action-btn-outline {
  background-color: transparent;
  color: #666;
  border: 1px solid var(--border-color);
}

.action-btn-outline:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border-color: var(--border-color);
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

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--modal-overlay);
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
  max-width: 600px;
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

/* 表单样式 */
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

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 20px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .tenant-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .tenant-list {
    grid-template-columns: 1fr;
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-filter {
    width: 100%;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .modal {
    width: 95%;
  }
}

/* 动画相关 */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>