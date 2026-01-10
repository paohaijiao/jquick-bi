<template>
  <div class="container">
    <header class="header">
      <Header />
    </header>
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
            <h1 class="page-title text-align-left">报表维护</h1>
            <p class="page-description">管理所有业务报表的创建、编辑和配置</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline" @click="exportReportList">
              <i class="fas fa-download"></i>
              导出列表
            </button>
            <button class="btn btn-primary" @click="openAddDialog">
              <i class="fas fa-plus"></i>
              新建报表
            </button>
          </div>
        </div>

        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-item">
              <label>报表类型</label>
              <select v-model="filter.type">
                <option value="">全部类型</option>
                <option value="dashboard">仪表板</option>
                <option value="report">报表</option>
                <option value="analysis">分析</option>
              </select>
            </div>
            <div class="filter-item">
              <label>状态</label>
              <select v-model="filter.status">
                <option value="">全部状态</option>
                <option value="1">正常</option>
                <option value="0">已删除</option>
              </select>
            </div>
            <div class="filter-item">
              <label>创建时间</label>
              <select v-model="filter.timeRange">
                <option value="">全部时间</option>
                <option value="week">近7天</option>
                <option value="month">近30天</option>
                <option value="quarter">近90天</option>
              </select>
            </div>
          </div>
          <div class="search-filter">
            <el-icon><Search /></el-icon>
            <input type="text" placeholder="搜索报表名称或编码..." v-model="filter.keyword" @input="handleSearch">
          </div>
        </div>
        <div class="reports-grid" >
          <div class="report-card" v-for="report in reports" :key="report.id">
            <div class="report-preview">
              <div class="report-preview-placeholder">
                <i :class="getIcon(report.icon)"></i>
                <span>{{ getTypeText(report.report_type) }}</span>
              </div>
              <div class="report-favorite" :class="{ active: report.favorite }" @click="toggleFavorite(report)">
                <i class="fas fa-star"></i>
              </div>
            </div>
            <div class="report-info">
              <div class="report-name">{{ report.name }}</div>
              <div class="report-meta">
                <span>v{{ report.version }}</span>
                <span>{{ formatDateShort(report.created_time) }}</span>
              </div>
              <p class="report-desc">{{ report.description || '暂无描述' }}</p>
              <div class="report-tags">
                <span class="report-tag" :class="getTypeClass(report.report_type)">
                  {{ getTypeText(report.report_type) }}
                </span>
                <span class="report-tag">
                  {{ report.code }}
                </span>
              </div>
            </div>
            <div class="report-actions">
              <span class="report-status" :class="getStatusClass(report.status)">
                {{ report.statusName }}
              </span>
              <div class="action-dropdown">
                <button class="action-btn" @click="showMoreOptions(report)">
                  <i class="fas fa-ellipsis-h"></i>
                  更多
                </button>
              </div>
            </div>
          </div>
      
        </div>
        
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

        <el-dialog
          v-model="dialogVisible"
          :title="isEditMode ? '编辑报表' : '新建报表'"
          width="600px"
          @close="resetForm"
        >
          <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
            <el-form-item label="报表名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入报表名称" />
            </el-form-item>
            
            <el-form-item label="报表编码" prop="code">
              <el-input v-model="formData.code" placeholder="请输入报表编码" :disabled="isEditMode" />
            </el-form-item>
            
            <el-form-item label="报表类型" prop="report_type">
              <el-select v-model="formData.report_type" placeholder="请选择报表类型">
                <el-option label="仪表板" value="dashboard" />
                <el-option label="报表" value="report" />
                <el-option label="分析" value="analysis" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="图标" prop="icon">
              <div class="icon-selector">
                <div 
                  v-for="iconOption in iconOptions" 
                  :key="iconOption.value"
                  class="icon-option"
                  :class="{ selected: formData.icon === iconOption.value }"
                  @click="formData.icon = iconOption.value"
                >
                  <i :class="iconOption.icon"></i>
                  <span>{{ iconOption.label }}</span>
                </div>
              </div>
            </el-form-item>
            
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="formData.description"
                type="textarea"
                :rows="3"
                placeholder="请输入报表描述"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
            
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitForm">
                {{ isEditMode ? '保存' : '创建' }}
              </el-button>
            </span>
          </template>
        </el-dialog>
        
        <el-dropdown
          v-model="moreMenuVisible"
          :hide-on-click="false"
          placement="bottom-end"
          trigger="click"
        >
          <div style="display: none;"></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="viewReport(currentReport)">
                <i class="fas fa-eye"></i>
                查看
              </el-dropdown-item>
              <el-dropdown-item @click="editReport(currentReport)">
                <i class="fas fa-edit"></i>
                编辑
              </el-dropdown-item>
              <el-dropdown-item @click="copyReport(currentReport)">
                <i class="fas fa-copy"></i>
                复制
              </el-dropdown-item>
              <el-dropdown-item @click="exportReport(currentReport)">
                <i class="fas fa-download"></i>
                导出配置
              </el-dropdown-item>
              <el-dropdown-item @click="shareReport(currentReport)">
                <i class="fas fa-share-alt"></i>
                分享报表
              </el-dropdown-item>
              <el-dropdown-item 
                v-if="currentReport?.status === 1"
                @click="toggleReportStatus(currentReport)"
                style="color: #ff4d4f;"
              >
                <i class="fas fa-trash"></i>
                删除
              </el-dropdown-item>
              <el-dropdown-item 
                v-else
                @click="toggleReportStatus(currentReport)"
                style="color: #52c41a;"
              >
                <i class="fas fa-redo"></i>
                恢复
              </el-dropdown-item>
              <el-dropdown-item divided @click="viewHistory(currentReport)">
                <i class="fas fa-history"></i>
                版本历史
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import Header from '@/components/Header.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SidebarMenu from '@/components/SidebarMenu.vue';
import request from '../api/request';
const reports = ref([])

const filter = reactive({
  type: '',
  status: '',
  timeRange: '',
  keyword: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const isEditMode = ref(false)
const formRef = ref()
const moreMenuVisible=ref(false);
const formData = reactive({
  id: null,
  code: '',
  name: '',
  description: '',
  icon: 'chart-pie',
  report_type: 'dashboard',
  status: 1,
  version: 1
})

const formRules = {
  name: [
    { required: true, message: '请输入报表名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入报表编码', trigger: 'blur' },
    { pattern: /^[A-Z_][A-Z0-9_]*$/, message: '编码必须为大写字母、数字和下划线组成', trigger: 'blur' }
  ],
  report_type: [
    { required: true, message: '请选择报表类型', trigger: 'change' }
  ]
}

const iconOptions = [
  { value: 'chart-pie', icon: 'fas fa-chart-pie', label: '仪表板' },
  { value: 'chart-bar', icon: 'fas fa-chart-bar', label: '柱状图' },
  { value: 'chart-line', icon: 'fas fa-chart-line', label: '折线图' },
  { value: 'table', icon: 'fas fa-table', label: '表格' },
  { value: 'map', icon: 'fas fa-map', label: '地图' },
  { value: 'users', icon: 'fas fa-users', label: '用户' },
  { value: 'dollar-sign', icon: 'fas fa-dollar-sign', label: '财务' },
  { value: 'shopping-cart', icon: 'fas fa-shopping-cart', label: '购物' }
]

const currentReport = ref(null)

const getIcon = (icon) => `fas fa-${icon}`
const getIconClass = (icon) => icon
const getTypeText = (type) => {
  const types = { dashboard: '仪表板', report: '报表', analysis: '分析' }
  return types[type] || type
}
const getTypeClass = (type) => `type-${type}`
const getStatusClass = (status) => status === 1 ? 'status-published' : 'status-draft'

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateShort = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  })
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleSearch = () => {
  currentPage.value = 1
}

const openAddDialog = () => {
  isEditMode.value = false
  resetForm()
  dialogVisible.value = true
}

const editReport = (report) => {
  isEditMode.value = true
  Object.assign(formData, report)
  dialogVisible.value = true
}

const viewReport = (report) => {
  ElMessage.info(`查看报表：${report.name}`)
  moreMenuVisible.value = false
}

const copyReport = async (report) => {
  try {
    await ElMessageBox.confirm(
      `确定要复制报表 "${report.name}" 吗？`,
      '复制确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const newReport = {
      ...report,
      id: reports.value.length + 1,
      code: `${report.code}_COPY`,
      name: `${report.name} (副本)`,
      version: 1,
      created_time: new Date().toISOString(),
      updated_time: new Date().toISOString()
    }
    
    reports.value.unshift(newReport)
    ElMessage.success('复制成功')
  } catch (error) {
  }
  moreMenuVisible.value = false
}

const showMoreOptions = (report) => {
  currentReport.value = report
  moreMenuVisible.value = true
}

const exportReport = (report) => {
  ElMessage.success(`开始导出报表：${report.name}`)
  moreMenuVisible.value = false
}

const shareReport = (report) => {
  ElMessage.info(`分享报表：${report.name}`)
  moreMenuVisible.value = false
}

const toggleReportStatus = async (report) => {
  const action = report.status === 1 ? '删除' : '恢复'
  const message = report.status === 1 
    ? `确定要删除报表 "${report.name}" 吗？删除后可在回收站恢复。`
    : `确定要恢复报表 "${report.name}" 吗？`
  
  try {
    await ElMessageBox.confirm(
      message,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: report.status === 1 ? 'warning' : 'info'
      }
    )
    
    report.status = report.status === 1 ? 0 : 1
    report.updated_time = new Date().toISOString()
    ElMessage.success(`${action}成功`)
  } catch (error) {
  }
  
  moreMenuVisible.value = false
}

const viewHistory = (report) => {
  ElMessage.info(`查看报表历史：${report.name}`)
  moreMenuVisible.value = false
}

const exportReportList = () => {
  ElMessage.success('开始导出报表列表')
}

const toggleFavorite = (report) => {
  report.favorite = !report.favorite
  ElMessage.success(report.favorite ? '已添加到收藏' : '已取消收藏')
}

const submitForm = async () => {
  debugger;
  try {
    await formRef.value.validate()
    let param=new Object();
    param.id=formData.id;
    param.code=formData.code;
    param.name=formData.name;
    param.description=formData.description;
    param.icon=formData.icon;
    param.reportType=formData.reportType;
    request.post('/api/report/createOrUpdate',param)
    .then(response => {
      if(response.code==200){
        ElMessage.success('保存成功');
      }
    }
  )
    
    dialogVisible.value = false
    resetForm()
  } catch (error) {
  }
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(formData, {
    id: null,
    code: '',
    name: '',
    description: '',
    icon: 'chart-pie',
    report_type: 'dashboard',
    status: 1,
    version: 1
  })
}

const loadReports = async () => {
    let param=new Object();
    param.pageNum=currentPage.value;
    param.pageSize=pageSize.value;
    request.post('/api/report/page',param)
    .then(response => {
      if(response.code==200){
        total.value=response.data.total;
        reports.value=response.data.records;
        debugger;
        ElMessage.success('保存成功');
      }
    }
  )
  ElMessage.success('数据加载完成')
}

onMounted(() => {
  loadReports()
})
</script>

<style scoped>
.report-list {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  min-height: 400px;
}

.table-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1.5fr 180px;
  padding: 16px 20px;
  background-color: var(--light-bg);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1.5fr 180px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: var(--secondary-color);
}

.report-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.report-icon {
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

.report-icon.chart-pie {
  background-color: #f0f9eb;
  color: #67c23a;
}

.report-icon.chart-bar {
  background-color: #ecf5ff;
  color: #409eff;
}

.report-icon.chart-line {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.report-icon.table {
  background-color: #f0f9ff;
  color: #409eff;
}

.report-icon.map {
  background-color: #f4f4f5;
  color: #909399;
}

.report-icon.users {
  background-color: #f0f9eb;
  color: #67c23a;
}

.report-info {
  display: flex;
  flex-direction: column;
}

.report-info .name {
  font-weight: 500;
  margin-bottom: 4px;
}

.report-info .desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-code {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  color: #666;
  background-color: #f6f6f7;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.type-dashboard {
  background-color: #f0f9eb;
  color: #67c23a;
}

.type-report {
  background-color: #ecf5ff;
  color: #409eff;
}

.type-analysis {
  background-color: #fdf6ec;
  color: #e6a23c;
}

/* 卡片视图样式 */
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
  font-size: 48px;
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
  -webkit-line-clamp: 2;
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

.report-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

.report-status {
  font-size: 12px;
  padding: 3px 10px;
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

/* 视图切换控件 */
.view-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
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

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 16px;
}

.icon-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.icon-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-option:hover {
  border-color: var(--primary-color);
  background-color: var(--secondary-color);
}

.icon-option.selected {
  border-color: var(--primary-color);
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.icon-option i {
  font-size: 24px;
  margin-bottom: 8px;
}

.icon-option span {
  font-size: 12px;
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

.pagination {
  padding: 16px 0;
  border-top: 1px solid var(--border-color);
  background-color: transparent;
}
</style>

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
</style>