<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <Header 
      />
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
      
      <!-- 右侧列表内容区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title text-align-left">管道管理</h1>
            <p class="page-description">管理所有管道连接，包括查看、编辑和删除操作</p>
          </div>
          <button class="btn btn-primary" @click="openModal(false)">
            <i class="fas fa-plus"></i>
            <span>新增管道</span>
          </button>
        </div>
        
        <div class="list-card">
          <div class="list-header">
            <div class="list-search">
              <el-icon><Search /></el-icon>
              <input 
                type="text" 
                placeholder="搜索管道名称..."
                v-model="name"
                @keyup.enter="handlePipLineQuery"
              >
            </div>
          </div>
          
          <table class="data-table">
            <thead>
              <tr>
                <th>管道名称</th>
                <th>管道编码</th>
                <th>关联连接器</th>
                <th>字段数量</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="pipeline in pipelines" 
                :key="pipeline.id"
                :data-id="pipeline.id"
              >
                <td>{{ pipeline.name }}</td>
                <td>{{ pipeline.code }}</td>
                <td>{{ pipeline.connectorName }}</td>
                <td>{{ pipeline.count }}</td>
                <td>{{ pipeline.createdTime }}</td>
                <td>
                  <div class="table-actions">
                    <button 
                      class="table-action-btn edit-btn" 
                      title="编辑"
                      @click="openModal(true, pipeline.id)"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="table-action-btn delete-btn" 
                      title="删除"
                      @click="deletePipeline(pipeline.id)"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="pagination">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[5, 10, 20, 50]"  
                :total="total"          
                layout="total, sizes, prev, pager, next, jumper" 
                @size-change="handleSizeChange"  
                @current-change="handlePipLineQuery"  
            />
          </div>
        </div>
      </main>
    </div>
    
    <!-- 编辑/新增连接器模态框 -->
    <div 
      class="modal-overlay" 
      :class="{ active: isModalActive }"
      @click="closeModal"
    >
      <div 
        class="modal-container"
        @click.stop
      >
        <div class="modal-header">
          <h3 class="modal-title">{{ modalTitle }}</h3>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-card">
            <h2 class="form-section-title text-align-left">基本信息</h2>
            <div class="form-group">
              <label class="text-align-left">管道名称 <span class="required-mark">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="formData.name" 
                placeholder="请输入管道名称"
              >
            </div>
            <div class="form-group">
              <label class="text-align-left">管道编码 <span class="required-mark">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                v-model="formData.code" 
                placeholder="请输入管道编码"
              >
            </div>
                        <div class="form-group">
              <label class="text-align-left">图标选择</label>
              <div class="icon-selector">
                <div 
                  class="icon-option" 
                  :class="{ 'selected': formData.icon === icon }"
                  v-for="icon in $iconList" 
                  :key="icon"
                  @click="formData.icon = icon"
                >
                  <i :class="['fas', icon]"></i>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="text-align-left">关联连接器 <span class="required-mark">*</span></label>
              <select 
                class="form-control" 
                v-model="formData.connectorId"
              >
                <option value="">请选择连接器</option>
                <option v-for="c in connectors" :key="c.id" :value="c.id">{{c.name}} ({{c.type}})</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="text-align-left">加载语句 <span class="required-mark">*</span></label>
              <textarea 
                type="text" 
                class="form-control" 
                v-model="formData.sqlQuery" 
                placeholder="请输入加载语句"
              >
              <span class="help-text text-align-left">请输入加载语句</span>
            </div>
            
            <div class="form-group">
              <label class="text-align-left">描述信息</label>
              <textarea 
                class="form-control" 
                v-model="formData.description" 
                placeholder="请输入管道描述信息"
              ></textarea>
            </div>
          </div>
          
          <div class="form-card">
            <h2 class="form-section-title text-align-left">字段配置</h2>
            <p class="help-text" style="margin-bottom: 16px;">配置表字段信息，包括字段名称、数据类型、长度等属性</p>
        
            <div class="fields-container">
              <div class="fields-header">
                <div>字段名称 <span class="required-mark">*</span></div>
                <div>数据类型 <span class="required-mark">*</span></div>
                <div>映射器</div>
                <div>操作</div>
              </div>
              <!-- 字段行 -->
              <div 
                class="field-row" 
                v-for="(field, index) in formData.fields" 
                :key="index"
                :data-index="index"
              >
                <input 
                  type="text" 
                  class="form-control field-name" 
                  v-model="field.columnName"
                  placeholder="请输入字段名称"
                >
                <select 
                  class="form-control field-type" 
                  v-model="field.columnType"
                >
                  <option value="">请选择</option>
                  <option   v-for="item in columnType" :key="item.code" :value="item.code">{{item.name}} ({{item.code}})</option>
                </select>
                <input 
                  type="text" 
                  class="form-control field-length" 
                  v-model="field.handler"
                  placeholder=""
                >
                <div class="field-actions">
                  <button 
                    class="field-btn delete-field" 
                    title="删除"
                    @click="removeField(index)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              class="add-field-btn" 
              @click="addField"
            >
              <i class="fas fa-plus"></i>
              <span>添加字段</span>
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveForm">确认保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import request from '../api/request';
import { ElMessage } from 'element-plus';
// 状态管理
const activeMenu = ref('pipeline-list');
const isModalActive = ref(false);
const modalTitle = ref('');
const currentEditingId = ref(null);
const name = ref('');
const pipelines = ref([]);
const columnType = ref([]);
const connectors = ref([]);

const currentPage = ref(1);
const pageSize = ref(10);
const total= ref(0);
const formData = ref({
  id: '',
  name: '',
  code:'',
  icon:'',
  connectorId: '',
  query: '',
  description: '',
  fields: []
});
const openModal = (isEdit = false, id ) => {
  console.log('当前的主键是:'+id);
  debugger;
  isModalActive.value = true;
  currentEditingId.value = id;
  if (isEdit && id) {
    modalTitle.value = '编辑连接器表字段';
    getById(id);
  } else {
    modalTitle.value = '新增连接器表字段';
    resetForm();
  }
  document.body.style.overflow = 'hidden';// 阻止背景滚动
};
const closeModal = () => {
  isModalActive.value = false;
  document.body.style.overflow = 'auto';// 恢复背景滚动
};

const resetForm = () => {
  formData.value = {
    id: '',
    name: '',
    code:'',
    icon:'',
    connectorId: '',
    query: '',
    description: '',
    fields: [
      { columnName: '', columnType: '', handler: '' }
    ]
  };
};
const addField = () => {
  formData.value.fields.push({
    columnName: '',
    columnType: '',
    handler: ''
  });
};
const removeField = (index) => {
  if (formData.value.fields.length <= 1) return; 
  formData.value.fields.splice(index, 1);
};
const getById = (id) => {
  request.get('/api/pipline/getById?id='+id)
  .then(response => {
    if(response.code==200){
     formData.value.id=response.data.id;
     formData.value.name=response.data.name;
     formData.value.code=response.data.code;
     formData.value.icon=response.data.icon;
     formData.value.connectorId=response.data.connectorId;
     formData.value.sqlQuery=response.data.sqlQuery;
     formData.value.description=response.data.description;
     formData.value.fields=response.data.fields;
     isModalActive.value = true;
    }else{
      ElMessage.error(`操作失败`);
    }
  });
};
// 保存表单
const saveForm = () => {
  if (!formData.value.name) {
    ElMessage.error('请填写管道名称！');
    return;
  }
  if (!formData.value.code) {
    ElMessage.error('请填写管道编码！');
    return;
  }
  if (!formData.value.icon) {
    ElMessage.error('请填写管道图标！');
    return;
  }
  if (!formData.value.sqlQuery) {
    ElMessage.error('请填写管道查询语句！');
    return;
  }
  const hasValidField = formData.value.fields.some(field => field.columnName && field.columnType);
  if (!hasValidField) {
    ElMessage.error('请至少添加一个有效的字段');
    return;
  }
  let query=new Object();
  query.id=formData.value.id;
  query.name=formData.value.name;
  query.code=formData.value.code;
  query.icon=formData.value.icon;
  query.connectorId=formData.value.connectorId;
  query.sqlQuery=formData.value.sqlQuery;
  query.description=formData.value.description;
  query.fields=formData.value.fields;
  request.post('/api/pipline/saveOrUpdate',query)
  .then(response => {
    if(response.code==200){
        handlePipLineQuery();
    }else{
      ElMessage.error(`操作失败`);
    }
  });
  closeModal();
  ElMessage.success(`保存成功`);
};

const deletePipeline = (id) => {
  if (confirm('确定要删除这个管道吗？')) {
    const index = pipelines.value.findIndex(p => p.id === id);
    if (index !== -1) {
      pipelines.value.splice(index, 1);
    }
  }
};
const handlePipLineQuery = () => {
  let query=new Object();
  query.pageNum=currentPage.value;
  query.pageSize=pageSize.value;
  query.name=name.value;
  request.post('/api/pipline/page',query)
  .then(response => {
    if(response.code==200){
      pipelines.value=response.data.records;
      total.value=response.data.total;
    }else{
      ElMessage.error(`查询管道失败`);
    }
  }
)
};
const handlePipLineColumnQuery = () => {
  request.get('/api/pipline/getColumnType')
  .then(response => {
    if(response.code==200){
      columnType.value=response.data;
    }else{
      ElMessage.error(`查询字段名称失败`);
    }
  }
)
};
const handleConnectorQuery = () => {
  request.get('/api/connector/list')
  .then(response => {
    if(response.code==200){
      connectors.value=response.data;
    }else{
      ElMessage.error(`查询连接器失败`);
    }
  }
)
};
onMounted(() => {
  handleConnectorQuery();
  handlePipLineQuery();
  handlePipLineColumnQuery();
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

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

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

/* 右侧内容区域 */
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

.list-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  margin-bottom: 24px;
}

.list-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-search {
  position: relative;
  width: 300px;
}

.list-search input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
}

.list-search i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

/* 表格样式 */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 24px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  font-weight: 600;
  background-color: var(--light-bg);
}

.data-table tr:hover {
  background-color: var(--secondary-color);
}

.table-actions {
  display: flex;
  gap: 8px;
}

.table-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.table-action-btn.edit-btn:hover {
  color: var(--primary-color);
  background-color: rgba(255, 131, 38, 0.15);
}

.table-action-btn.delete-btn:hover {
  color: #ff4d4f;
  background-color: #fff2f0;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
}

.pagination-info {
  font-size: 14px;
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
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover {
  background-color: var(--secondary-color);
  border-color: var(--primary-color);
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  transform: translateY(-20px);
  transition: all 0.3s;
}

.modal-overlay.active .modal-container {
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
  cursor: pointer;
  color: #666;
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
.form-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 24px;
  margin-bottom: 24px;
}

.form-section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

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

/* 字段列表样式 */
.fields-container {
  margin-top: 24px;
}

.fields-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 80px;
  padding: 12px 16px;
  background-color: var(--light-bg);
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid var(--border-color);
  border-bottom: none;
}

.field-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 80px;
  padding: 12px 16px;
  align-items: center;
  border: 1px solid var(--border-color);
  border-top: none;
  gap: 12px;
}

.field-row:last-child {
  border-radius: 0 0 8px 8px;
}

.field-row:hover {
  background-color: var(--secondary-color);
}

.field-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.field-btn {
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

.field-btn:hover {
  background-color: rgba(255, 131, 38, 0.15);
  color: var(--primary-color);
}

.delete-field:hover {
  color: #ff4d4f;
  background-color: #fff2f0;
}

.add-field-btn {
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  background-color: var(--secondary-color);
  border: 1px dashed var(--primary-color);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.add-field-btn:hover {
  background-color: rgba(255, 131, 38, 0.15);
}

.required-mark {
  color: #ff4d4f;
}

.help-text {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  text-align: left !important;
}


.el-pagination {
  margin-top: 16px;
}

.el-pager li {
  color: #666;
  border: 1px solid #ffd5b8; 
  background-color: white; 
}

.el-pager li:not(.disabled):hover {
  color:  var(--primary-color); 
  border-color:  var(--primary-color); 
  background-color: #fff5eb; 
}

.el-pager li.active {
  color: white; 
  background-color:  var(--primary-color); 
  border-color:  var(--primary-color);
}

.el-pager li.disabled {
  color: #ccc; 
  border-color: #eee; 
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.el-pagination button:enabled:not(.disabled):hover {
  color:  var(--primary-color);
  border-color:  var(--primary-color);
}
.el-pager li.is-active, .el-pager li:hover {
    color:  var(--primary-color);
}

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

</style>