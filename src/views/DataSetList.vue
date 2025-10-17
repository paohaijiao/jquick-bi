<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">
        <i class="fas fa-database"></i>
        <span>JQuick DataSet</span>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="搜索数据集、Code...">
        </div>
        <div class="notification-icon">
          <i class="far fa-bell"></i>
          <span class="notification-badge">2</span>
        </div>
        <div class="user-info">
          <div class="user-avatar">JD</div>
          <span class="user-name">JavaDeveloper</span>
          <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
        </div>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧菜单 -->
      <aside class="sidebar">
        <div class="menu-section">
          <div class="menu-section-title">数据管理</div>
          <div class="menu-item active">
            <i class="fas fa-table"></i>
            <span>数据集列表</span>
            <span class="menu-badge">4</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-plug"></i>
            <span>数据源管理</span>
            <span class="menu-badge">3</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-code-branch"></i>
            <span>关联关系</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-history"></i>
            <span>查询历史</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-cog"></i>
            <span>设置</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">数据集分类</div>
          <div class="menu-item">
            <i class="fas fa-shopping-cart"></i>
            <span>销售相关</span>
            <span class="menu-badge">2</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-users"></i>
            <span>用户相关</span>
            <span class="menu-badge">1</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-box"></i>
            <span>产品相关</span>
            <span class="menu-badge">1</span>
          </div>
        </div>
      </aside>
      
      <!-- 右侧数据集内容区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title">数据集管理</h1>
            <p class="page-description">管理所有数据集信息，包括名称、Code和SQL等</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline" @click="refreshList">
              <i class="fas fa-sync-alt"></i>
              <span>刷新列表</span>
            </button>
            <button class="btn btn-primary" @click="openAddModal">
              <i class="fas fa-plus"></i>
              <span>新增数据集</span>
            </button>
          </div>
        </div>
        
        <!-- 数据集列表 -->
        <div class="dataset-list">
          <!-- 数据集表头 -->
          <div class="table-header dataset-header">
            <div>ID</div>
            <div>数据集名称</div>
            <div>数据集Code</div>
            <div>图标</div>
            <div>状态</div>
            <div>操作</div>
          </div>
          
          <!-- 数据集行 -->
          <div 
            class="table-row dataset-row" 
            :data-id="item.id" 
            v-for="item in datasetList" 
            :key="item.id"
          >
            <div>{{ item.id }}</div>
            <div>{{ item.name }}</div>
            <div>{{ item.code }}</div>
            <div class="icon-container">
              <div class="dataset-icon">
                <i :class="['fas', item.icon]"></i>
              </div>
            </div>
            <div>
              <span 
                class="status" 
                :class="item.status === 'active' ? 'status-active' : 'status-inactive'"
              >
                {{ item.status === 'active' ? '启用' : '禁用' }}
              </span>
            </div>
            <div class="operation-buttons">
              <button class="operation-btn view-btn" title="查看详情" @click="viewDetail(item.id)">
                <i class="fas fa-eye"></i>
              </button>
              <button class="operation-btn edit-btn" title="编辑" @click="openEditModal(item.id)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="operation-btn delete-btn" title="删除" @click="openDeleteModal(item.id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 分页控件 -->
        <div class="pagination">
          <div class="pagination-info">显示 {{ startItem }}-{{ endItem }} 条，共 {{ totalItems }} 条</div>
          <div class="pagination-controls">
            <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">
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
            <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
    
    <!-- 新增/编辑数据集模态框 -->
    <div class="modal-overlay" id="datasetModal" :style="{ display: showDatasetModal ? 'flex' : 'none' }">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditMode ? '编辑数据集' : '新增数据集' }}</h2>
          <button class="modal-close" @click="closeDatasetModal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="datasetForm">
            <input type="hidden" v-model="formData.id">
            <div class="form-group">
              <label for="name " class="text-align-left">数据集名称 <span style="color: #f5222d;">*</span></label>
              <input 
                type="text" 
                id="name" 
                class="form-control" 
                required 
                placeholder="请输入数据集名称"
                v-model="formData.name"
              >
            </div>
            <div class="form-group">
              <label for="code" class="text-align-left">数据集Code <span style="color: #f5222d;">*</span></label>
              <input 
                type="text" 
                id="code" 
                class="form-control" 
                required 
                placeholder="请输入数据集唯一标识，英文小写、数字和下划线组成"
                v-model="formData.code"
              >
              <div class="form-hint text-align-left">由英文小写字母、数字和下划线组成，不能以数字开头</div>
            </div>
            <div class="form-group">
              <label for="sql" class="text-align-left">SQL查询语句 <span style="color: #f5222d;">*</span></label>
              <textarea 
                id="sql" 
                class="form-control" 
                required 
                placeholder="请输入SQL查询语句"
                v-model="formData.sql"
              ></textarea>
              <div class="form-hint text-align-left" >支持标准SQL语法，通过此SQL从数据源获取数据</div>
            </div>
            <div class="form-group">
              <label class="text-align-left">图标选择</label>
              <div class="icon-selector">
                <div 
                  class="icon-option" 
                  :class="{ 'selected': formData.icon === icon }"
                  v-for="icon in iconList" 
                  :key="icon"
                  @click="formData.icon = icon"
                >
                  <i :class="['fas', icon]"></i>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="status" class="text-align-left">状态</label>
              <select 
                id="status" 
                class="form-control"
                v-model="formData.status"
              >
                <option value="active">启用</option>
                <option value="inactive">禁用</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeDatasetModal">取消</button>
          <button class="btn btn-primary" @click="saveDataset">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 查看数据集详情模态框 -->
    <div class="modal-overlay" id="detailModal" :style="{ display: showDetailModal ? 'flex' : 'none' }">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">数据集详情</h2>
          <button class="modal-close" @click="closeDetailModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-item">
            <div class="detail-label">ID</div>
            <div class="detail-value">{{ detailData.id }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">数据集名称</div>
            <div class="detail-value">{{ detailData.name }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">数据集Code</div>
            <div class="detail-value">{{ detailData.code }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">图标</div>
            <div class="detail-value">
              <div class="dataset-icon">
                <i :class="['fas', detailData.icon]"></i>
              </div>
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-label">SQL查询语句</div>
            <div class="detail-value detail-sql">{{ detailData.sql }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">状态</div>
            <div class="detail-value">
              <span 
                class="status" 
                :class="detailData.status === 'active' ? 'status-active' : 'status-inactive'"
              >
                {{ detailData.status === 'active' ? '启用' : '禁用' }}
              </span>
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-label">创建时间</div>
            <div class="detail-value">{{ detailData.createTime }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">最后更新时间</div>
            <div class="detail-value">{{ detailData.updateTime }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="closeDetailModal">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 删除确认模态框 -->
    <div class="modal-overlay" id="confirmModal" :style="{ display: showConfirmModal ? 'flex' : 'none' }">
      <div class="modal confirm-modal">
        <div class="modal-header">
          <h2 class="modal-title">确认删除</h2>
          <button class="modal-close" @click="closeConfirmModal">&times;</button>
        </div>
        <div class="confirm-content">
          <div class="confirm-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="confirm-message">
            确定要删除此数据集吗？此操作不可撤销。
          </div>
          <input type="hidden" v-model="deleteId">
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeConfirmModal">取消</button>
          <button class="btn btn-primary" @click="confirmDelete">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// 图标列表
const iconList = [
  'fa-table', 'fa-users', 'fa-box', 'fa-chart-bar'
];

// 数据集列表数据
const datasetList = ref([
  {
    id: 1,
    name: '用户订单数据集',
    code: 'user_order_dataset',
    icon: 'fa-table',
    status: 'active',
    sql: 'SELECT * FROM user_orders WHERE status = 1',
    createTime: '2023-05-15 10:30:00',
    updateTime: '2023-06-20 14:25:00'
  },
  {
    id: 2,
    name: '产品信息数据集',
    code: 'product_info_dataset',
    icon: 'fa-box',
    status: 'active',
    sql: 'SELECT * FROM products WHERE is_active = 1',
    createTime: '2023-05-18 09:15:00',
    updateTime: '2023-06-10 11:40:00'
  },
  {
    id: 3,
    name: '用户信息数据集',
    code: 'user_info_dataset',
    icon: 'fa-users',
    status: 'active',
    sql: 'SELECT * FROM users WHERE register_time > "2023-01-01"',
    createTime: '2023-05-20 16:45:00',
    updateTime: '2023-06-25 09:10:00'
  },
  {
    id: 4,
    name: '销售统计数据集',
    code: 'sales_stat_dataset',
    icon: 'fa-chart-bar',
    status: 'inactive',
    sql: 'SELECT DATE_FORMAT(order_time, "%Y-%m-%d") as date, SUM(amount) as total FROM orders GROUP BY date',
    createTime: '2023-05-22 11:20:00',
    updateTime: '2023-05-22 11:20:00'
  }
]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(4);
const totalPages = ref(1);
const startItem = ref(1);
const endItem = ref(4);

// 模态框显示控制
const showDatasetModal = ref(false);
const showDetailModal = ref(false);
const showConfirmModal = ref(false);

// 编辑模式标识
const isEditMode = ref(false);

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  code: '',
  sql: '',
  icon: 'fa-table',
  status: 'active'
});

// 详情数据
const detailData = reactive({
  id: '',
  name: '',
  code: '',
  icon: '',
  sql: '',
  status: '',
  createTime: '',
  updateTime: ''
});

// 待删除ID
const deleteId = ref('');

// 初始化
onMounted(() => {
  calculatePagination();
});

// 计算分页信息
const calculatePagination = () => {
  totalPages.value = Math.ceil(totalItems.value / pageSize.value);
  startItem.value = (currentPage.value - 1) * pageSize.value + 1;
  endItem.value = Math.min(currentPage.value * pageSize.value, totalItems.value);
};

// 分页控制
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    calculatePagination();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    calculatePagination();
  }
};

const changePage = (page) => {
  currentPage.value = page;
  calculatePagination();
};

// 刷新列表
const refreshList = () => {
  console.log('刷新数据集列表');
};

// 打开新增模态框
const openAddModal = () => {
  isEditMode.value = false;
  // 重置表单
  formData.id = '';
  formData.name = '';
  formData.code = '';
  formData.sql = '';
  formData.icon = 'fa-table';
  formData.status = 'active';
  
  showDatasetModal.value = true;
};

// 打开编辑模态框
const openEditModal = (id) => {
  isEditMode.value = true;
  // 查找对应的数据
  const item = datasetList.value.find(item => item.id === id);
  if (item) {
    formData.id = item.id;
    formData.name = item.name;
    formData.code = item.code;
    formData.sql = item.sql;
    formData.icon = item.icon;
    formData.status = item.status;
  }
  
  showDatasetModal.value = true;
};

// 关闭数据集模态框
const closeDatasetModal = () => {
  showDatasetModal.value = false;
};

// 保存数据集
const saveDataset = () => {
  if (isEditMode.value) {
    // 编辑操作
    const index = datasetList.value.findIndex(item => item.id === formData.id);
    if (index !== -1) {
      datasetList.value[index] = {
        ...datasetList.value[index],
        ...formData,
        updateTime: new Date().toLocaleString()
      };
    }
  } else {
    // 新增操作
    const newId = Math.max(...datasetList.value.map(item => item.id)) + 1;
    const now = new Date().toLocaleString();
    datasetList.value.push({
      id: newId,
      ...formData,
      createTime: now,
      updateTime: now
    });
    totalItems.value++;
    calculatePagination();
  }
  
  showDatasetModal.value = false;
};

// 查看详情
const viewDetail = (id) => {
  const item = datasetList.value.find(item => item.id === id);
  if (item) {
    Object.assign(detailData, item);
  }
  showDetailModal.value = true;
};

// 关闭详情模态框
const closeDetailModal = () => {
  showDetailModal.value = false;
};

// 打开删除确认模态框
const openDeleteModal = (id) => {
  deleteId.value = id;
  showConfirmModal.value = true;
};

// 关闭确认模态框
const closeConfirmModal = () => {
  showConfirmModal.value = false;
};

// 确认删除
const confirmDelete = () => {
  datasetList.value = datasetList.value.filter(item => item.id !== deleteId.value);
  totalItems.value--;
  calculatePagination();
  showConfirmModal.value = false;
};
</script>

<style>
:root {
  --primary-color: #ff6a00;
  --secondary-color: #fff4e5;
  --border-color: #ffd0a8;
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
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 18px;
}

.logo i {
  color: var(--primary-color);
  font-size: 22px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  position: relative;
}

.search-box input {
  padding: 6px 12px 6px 32px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  width: 280px;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.notification-icon {
  position: relative;
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 18px;
  height: 18px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.user-name {
  font-size: 14px;
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
  padding: 20px 0;
  overflow-y: auto;
}

.menu-section {
  margin-bottom: 30px;
}

.menu-section-title {
  padding: 0 20px 10px;
  font-size: 12px;
  text-transform: uppercase;
  color: #888;
  letter-spacing: 1px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.menu-item:hover {
  background-color: var(--secondary-color);
}

.menu-item.active {
  background-color: var(--secondary-color);
  border-left: 3px solid var(--primary-color);
}

.menu-item i {
  width: 20px;
  text-align: center;
  color: var(--primary-color);
}

.menu-badge {
  margin-left: auto;
  background-color: var(--primary-color);
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
}

/* 右侧内容区域 */
.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  margin-bottom: 5px;
}

.page-description {
  color: #666;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: #e05a00;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.btn-outline:hover {
  background-color: var(--secondary-color);
}

/* 数据集列表 */
.dataset-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  margin-bottom: 20px;
}

.table-header {
  display: grid;
  font-weight: 600;
  background-color: var(--light-bg);
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
}

.dataset-header {
  grid-template-columns: 60px 200px 200px 80px 100px 150px;
}

.table-row {
  display: grid;
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: var(--light-bg);
}

.dataset-row {
  grid-template-columns: 60px 200px 200px 80px 100px 150px;
}

.icon-container {
  display: flex;
  align-items: center;
}

.dataset-icon {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: #e6f7ed;
  color: #238636;
}

.status-inactive {
  background-color: #f8f8f8;
  color: #8c8c8c;
}

.operation-buttons {
  display: flex;
  gap: 8px;
}

.operation-btn {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  background-color: transparent;
}

.operation-btn:hover {
  background-color: var(--light-bg);
  color: var(--primary-color);
}

.view-btn:hover {
  color: #1890ff;
}

.edit-btn:hover {
  color: #52c41a;
}

.delete-btn:hover {
  color: #ff4d4f;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
}

.pagination-info {
  color: #666;
}

.pagination-controls {
  display: flex;
  gap: 5px;
}

.page-btn {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.confirm-modal {
  width: 400px;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
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
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--primary-color);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.form-hint {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

/* 图标选择器样式 */
.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.icon-option {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background-color: var(--light-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
}

.icon-option:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.icon-option.selected {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

/* 详情模态框样式 */
.detail-item {
  display: flex;
  margin-bottom: 16px;
}

.detail-label {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #666;
}

.detail-value {
  flex: 1;
}

.detail-sql {
  white-space: pre-wrap;
  background-color: var(--light-bg);
  padding: 10px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 13px;
}
/* 确认删除模态框 */
.confirm-content {
  padding: 20px;
  text-align: center;
}

.confirm-icon {
  font-size: 48px;
  color: #faad14;
  margin-bottom: 16px;
}

.confirm-message {
  font-size: 16px;
  margin-bottom: 20px;
}
</style>