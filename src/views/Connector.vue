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
      
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title text-align-left">连接器</h1>
            <p class="page-description">管理所有可用的数据源，包括数据库、API接口和文件等</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline">
              <i class="fas fa-download"></i>
              <span>导出</span>
            </button>
            <button class="btn btn-primary" id="addDataSourceBtn" @click="openModal('add')">
              <i class="fas fa-plus"></i>
              <span>新增连接器</span>
            </button>
          </div>
        </div>
        
        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-item">
              <label>连接器类型:</label>
              <select v-model="filter.type">
                <option value="">全部</option>
                <option v-for="c in connectorType" :key="c.code" :value="c.code">{{c.name}}</option>
              </select>
            </div>
            <div class="filter-item">
              <label>状态:</label>
              <select v-model="filter.status">
                <option value="">全部</option>
                <option v-for="c in connectorStatus" :key="c.code" :value="c.code">{{c.name}}</option>
              </select>
            </div>
            <div class="filter-item">
              <label>创建时间:</label>
              <input type="date" v-model="filter.startDate">
              <span>至</span>
              <input type="date" v-model="filter.endDate">
            </div>
          </div>
          <div class="search-filter">
            <el-icon><Search /></el-icon>
            <input type="text" placeholder="搜索连接器名称..." v-model="filter.keyword">
          </div>
        </div>
        
        <div class="data-source-list">
          <div class="table-header">
            <div class="text-align-left">连接器名称</div>
            <div>类型</div>
            <div>状态</div>
            <div>创建时间</div>
            <div>操作</div>
          </div>
          
          <div class="table-row" v-for="item in connectors" :key="item.id" :data-id="item.id">
            <div class="data-source-name">
              <div class="data-source-icon" :class="item.type">
                <i :class="item.icon"></i>
              </div>
              <div class="data-source-info">
                <div class="source-name">{{ item.name }}</div>
                <div class="source-desc">{{ item.description }}</div>
              </div>
            </div>
            <div>{{ item.typeName }}</div>
            <div>
              <span class="status-badge" :class="item.status">
                <i :class="item.statusIcon"></i> {{ item.statusName }}
              </span>
            </div>
            <div>{{ item.createTime }}</div>
            <div class="operation-buttons">
              <button class="operation-btn edit-btn" title="编辑" @click="openModal('edit', item)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="operation-btn delete-btn" title="删除" @click="showDeleteConfirm(item.id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="pagination">
          <div class="pagination-info">显示 {{ (currentPage-1)*pageSize + 1 }}-{{ Math.min(currentPage*pageSize, totalItems) }} 条，共 {{ totalItems }} 条</div>
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
      </main>
    </div>

    <!-- 新增/编辑连接器模态框 -->
    <div class="modal-overlay" :class="{ 'modal-visible': isModalVisible }" @click="closeModal(true)">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ modalTitle }}</h3>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-tabs">
          <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="setActiveTab('basic')" data-tab="basic">基本信息</button>
          <button class="tab-btn" :class="{ active: activeTab === 'properties' }" @click="setActiveTab('properties')" data-tab="properties">属性设置</button>
          <button class="tab-btn" :class="{ active: activeTab === 'advanced' }" @click="setActiveTab('advanced')" data-tab="advanced">高级配置</button>
        </div>
        
        <div class="modal-body">
          <!-- 基本信息Tab -->
          <div class="tab-content" :class="{ active: activeTab === 'basic' }" id="basic-tab">
            <input type="hidden" v-model="formData.id">
            <div class="form-group">
              <label class="text-align-left">连接器名称 <span style="color: #ff4d4f;">*</span></label>
              <input type="text" class="form-control" v-model="formData.name" placeholder="请输入连接器名称" required>
            </div>
            <div class="form-group">
              <label class="text-align-left">连接器图标 <span style="color: #ff4d4f;">*</span></label>
              <input type="text" class="form-control" v-model="formData.icon" placeholder="请输入连接器图标" required>
            </div>
            <div class="form-group">
              <label class="text-align-left">连接器类型 <span style="color: #ff4d4f;">*</span></label>
              <select class="form-control" v-model="formData.type" @change="handleTypeChange" required>
                <option value="">请选择连接器类型</option>
                <option v-for="c in connectorType" :key="c.code" :value="c.code">{{c.name}}</option>
              </select>
            </div>
            
            <div class="form-group">
              <label  class="text-align-left">连接器描述信息</label>
              <textarea class="form-control" v-model="formData.description" rows="3" placeholder="请输入连接器描述信息"></textarea>
            </div>
          </div>
          
          <!-- 属性设置Tab -->
          <div class="tab-content" :class="{ active: activeTab === 'properties' }" id="properties-tab">
            <button class="add-property" @click="addProperty">
              <i class="fas fa-plus"></i>
              <span>添加属性</span>
            </button>
            <div class="property-item" v-for="(prop, index) in formData.attrs" :key="index">
              <input type="text" class="form-control" v-model="prop.name" placeholder="属性名称" >
              <input type="text" class="form-control" v-model="prop.value" placeholder="属性值">
              <button class="remove-property" @click="removeProperty(index)">
                <i class="fas fa-minus"></i>
              </button>
            </div>
        
          </div>
          
          <!-- 高级配置Tab -->
          <div class="tab-content" :class="{ active: activeTab === 'advanced' }" id="advanced-tab">
            <div class="form-group">
              <label class="text-align-left">超时时间(秒)</label>
              <input type="number" class="form-control" v-model="formData.timeout" placeholder="连接超时时间" value="30">
            </div>
            <div class="form-group">
              <label class="text-align-left">缓存时间(分钟)</label>
              <input type="number" class="form-control" v-model="formData.cacheTime" placeholder="查询结果缓存时间" value="10">
            </div>
            <div class="form-group">
              <label class="text-align-left">图标</label>
              <input type="text" class="form-control" v-model="formData.maxConnections" placeholder="图标" value="10">
            </div>
            <div class="form-group">
              <label class="text-align-left">备注信息</label>
              <textarea class="form-control" v-model="formData.notes" rows="3" placeholder="请输入备注信息"></textarea>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveConnector">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 确认删除模态框 -->
    <div class="modal-overlay" :class="{ 'modal-visible': isDeleteConfirmVisible }" @click="closeDeleteConfirm(true)">
      <div class="modal confirm-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">确认删除</h3>
          <button class="modal-close" @click="closeDeleteConfirm">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="confirm-content">
          <div class="confirm-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="confirm-message">您确定要删除该数据源吗？此操作不可撤销。</div>
          <div class="modal-footer">
            <button class="btn btn-outline" @click="closeDeleteConfirm">取消</button>
            <button class="btn btn-primary" style="background-color: #ff4d4f;" @click="deleteDataSource">确认删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'connectorPage'
}
</script>
<script setup>
import { ref, computed, onMounted } from 'vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import request from '../api/request';
import { ElMessage } from 'element-plus';
const connectors = ref([]);

// 筛选条件
const filter = ref({
  type: '',
  status: '',
  startDate: '',
  endDate: '',
  keyword: ''
});
const connectorType=ref([]);
const connectorStatus=ref([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(4);
const totalItems = computed(() => connectors.value.length);
const pageCount = computed(() => Math.ceil(totalItems.value / pageSize.value));

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > pageCount.value) return;
  currentPage.value = page;
};

// 模态框相关
const isModalVisible = ref(false);
const modalType = ref('add'); // 'add' 或 'edit'
const modalTitle = computed(() => modalType.value === 'add' ? '新增连接器' : '编辑连接器');
const activeTab = ref('basic');
const formData = ref({
  id: '',
  name: '',
  type: '',
  description: '',
  icon: '',
  status: '',
  attrs: []  ,
  timeout: 30,
  cacheTime: 10,
  maxConnections: 10,
  notes: ''
});

// 打开模态框
const openModal = (type, item = null) => {
  modalType.value = type;
  activeTab.value = 'basic';
  debugger;
  // 如果是编辑模式，填充表单数据
  if (type === 'edit' && item) {
    handleConnectorDetail(item);
  }
  
  isModalVisible.value = true;
};

// 关闭模态框
const closeModal = (isOverlay = false) => {
  // 如果点击的是遮罩层才关闭（避免点击模态框内部也关闭）
  if (!isOverlay || isOverlay) {
    isModalVisible.value = false;
  }
};

// 设置激活的Tab
const setActiveTab = (tab) => {
  if(tab==='properties'){
    if(formData.value.type===''){
        ElMessage.error(`请先选择连接器类型`);
        return;
    }else if(formData.value.id===''){
        request.get('/api/connector/getConnectorAttributeTmpByType?connectType='+formData.value.type)
        .then(response => {
          if(response.code==200){
            formData.value.attrs=response.data;
          }else{
            ElMessage.error(`获取该连接器属性失败`);
          }
        })
    }
  }
  activeTab.value = tab;
};

// 处理数据源类型变化
const handleTypeChange = () => {
};


// 添加属性
const addProperty = () => {
  formData.value.attrs.push({ name: '', value: '' });
};

// 移除属性
const removeProperty = (index) => {
  formData.value.attrs.splice(index, 1);
};
const saveConnector = () => { 
  let param=new Object();
  param.id=formData.value.id;
  param.name=formData.value.name;
  param.type=formData.value.type;
  param.description=formData.value.description;
  param.icon=formData.value.icon;
  param.status=formData.value.status;
  param.attrs=formData.value.attrs;
  request.post('/api/connector/saveOrUpdate',param)
  .then(response => {
    if(response.code==200){
      ElMessage.success(`保存成功`);
      handleConnectorQuery();
    }else{
      ElMessage.error(`获取连接器状态失败`);
    }
  }
)
  closeModal();
};


const isDeleteConfirmVisible = ref(false);
const idToDelete = ref(null);

// 显示删除确认
const showDeleteConfirm = (id) => {
  idToDelete.value = id;
  isDeleteConfirmVisible.value = true;
};

// 关闭删除确认
const closeDeleteConfirm = (isOverlay = false) => {
  if (!isOverlay || isOverlay) {
    isDeleteConfirmVisible.value = false;
    idToDelete.value = null;
  }
};

// 执行删除
const deleteDataSource = () => {
};
const handleConnectorDetail = (item) => {
  let id=item.id;
  debugger;
  request.get('/api/connector/getById?id='+id)
  .then(response => {
    if(response.code==200){
      formData.value.id=response.data.id;
      formData.value.name=response.data.name;
      formData.value.type=response.data.type;
      formData.value.description=response.data.description;
      formData.value.icon=response.data.icon;
      formData.value.status=response.data.status;
      formData.value.attrs=response.data.attrs;
    }else{
      ElMessage.error(`获取连接器状态失败`);
    }
  }
)
};
const handleConnectorTypeQuery = () => {
  request.get('/api/connector/getConnectorType')
  .then(response => {
    if(response.code==200){
      connectorType.value=response.data;
    }else{
      ElMessage.error(`获取连接器类型失败`);
    }
  }
)
};
const handleConnectorStatusQuery = () => {
  request.get('/api/connector/getConnectorStatus')
  .then(response => {
    if(response.code==200){
      connectorStatus.value=response.data;
    }else{
      ElMessage.error(`获取连接器状态失败`);
    }
  }
)
};
const handleConnectorQuery = () => {
  let query=new Object();
  query.pageNum=currentPage.value;
  query.pageSize=pageSize.value;
  request.post('/api/connector/page',query)
  .then(response => {
    if(response.code==200){
      connectors.value=response.data.records;
    }else{
      ElMessage.error(`查询租户失败`);
    }
  }
)

};
onMounted(() => {
  handleConnectorTypeQuery();
  handleConnectorStatusQuery();
  handleConnectorQuery();
  addProperty();
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
.text-align-left {
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

/* 模态框样式 */
.modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
}

.modal-overlay.modal-visible {
  display: flex;
}

.modal {
  width: 700px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px 20px;
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
  cursor: pointer;
  color: #666;
}

.modal-close:hover {
  color: var(--primary-color);
}

/* Tab 样式 */
.modal-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  padding: 12px 20px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

.tab-btn:hover:not(.active) {
  color: var(--primary-color);
  background-color: var(--secondary-color);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

/* 表单样式 */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.2);
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

/* 属性设置样式 */
.property-item {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  align-items: center;
}

.property-item .form-control {
  flex: 1;
}

.remove-property {
  color: #ff4d4f;
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-property:hover {
  background-color: #fff2f0;
}

.add-property {
  color: var(--primary-color);
  background-color: var(--secondary-color);
  border: 1px dashed var(--primary-color);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.add-property:hover {
  background-color: rgba(255, 131, 38, 0.15);
}

/* 模态框底部 */
.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 确认删除模态框 */
.confirm-modal {
  width: 400px;
}

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