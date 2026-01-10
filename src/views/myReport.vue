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
        <div class="reports-grid">
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
                {{ report.status === 1 ? '正常' : '已删除' }}
              </span>
              <div class="action-group">
                <button class="action-btn" @click="viewReport(report)" title="查看详情">
                  <i class="fas fa-info-circle"></i>
                  <span>详情</span>
                </button>
                <button class="action-btn" @click="editReport(report)" title="编辑">
                  <i class="fas fa-edit"></i>
                  <span>编辑</span>
                </button>
                <button 
                  class="action-btn" 
                  @click="toggleReportStatus(report)" 
                  :title="report.status === 1 ? '删除' : '恢复'"
                  :style="{ color: report.status === 1 ? '#ff4d4f' : '#52c41a' }"
                >
                  <i :class="report.status === 1 ? 'fas fa-trash' : 'fas fa-redo'"></i>
                  <span>{{ report.status === 1 ? '删除' : '恢复' }}</span>
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
        <el-dialog
          v-model="detailDialogVisible"
          title="报表详情"
          width="800px"
          :before-close="handleDetailClose"
        >
          <div class="report-detail">
            <div class="detail-header">
              <div class="detail-icon">
                <i :class="getIcon(currentReport.icon)" style="font-size: 48px; color: var(--primary-color);"></i>
              </div>
              <div class="detail-title">
                <h2>{{ currentReport.name }}</h2>
                <div class="detail-meta">
                  <span class="detail-code">{{ currentReport.code }}</span>
                  <span class="detail-version">v{{ currentReport.version }}</span>
                  <span class="detail-date">{{ formatDate(currentReport.created_time) }}</span>
                </div>
              </div>
              <div class="detail-status">
                <span :class="getStatusClass(currentReport.status)" class="status-badge">
                  {{ currentReport.status === 1 ? '正常' : '已删除' }}
                </span>
              </div>
            </div>

            <div class="detail-content">
              <div class="detail-section">
                <h3>基本信息</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <label>报表类型</label>
                    <span>{{ getTypeText(currentReport.report_type) }}</span>
                  </div>
                  <div class="info-item">
                    <label>创建人</label>
                    <span>{{ currentReport.creator || '系统管理员' }}</span>
                  </div>
                  <div class="info-item">
                    <label>最近更新</label>
                    <span>{{ formatDate(currentReport.updated_time || currentReport.created_time) }}</span>
                  </div>
                  <div class="info-item">
                    <label>访问次数</label>
                    <span>{{ currentReport.view_count || 0 }} 次</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h3>描述</h3>
                <p class="detail-description">{{ currentReport.description || '暂无描述' }}</p>
              </div>

              <div class="detail-section">
                <h3>配置信息</h3>
                <div class="config-info">
                  <div class="config-item">
                    <label>数据源</label>
                    <span>{{ currentReport.data_source || '默认数据源' }}</span>
                  </div>
                  <div class="config-item">
                    <label>刷新频率</label>
                    <span>{{ currentReport.refresh_rate || '每日' }}</span>
                  </div>
                  <div class="config-item">
                    <label>权限设置</label>
                    <span>{{ currentReport.permission || '部门可见' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-actions">
              <div class="action-buttons-group">
                <button class="detail-action-btn primary" @click="viewReportContent(currentReport)">
                  <i class="fas fa-eye"></i>
                  <span>查看报表</span>
                </button>
                <button class="detail-action-btn" @click="editReport(currentReport)">
                  <i class="fas fa-edit"></i>
                  <span>编辑</span>
                </button>
                <button class="detail-action-btn" @click="copyReport(currentReport)">
                  <i class="fas fa-copy"></i>
                  <span>复制</span>
                </button>
                <button class="detail-action-btn" @click="exportReport(currentReport)">
                  <i class="fas fa-download"></i>
                  <span>导出配置</span>
                </button>
                <button class="detail-action-btn" @click="shareReport(currentReport)">
                  <i class="fas fa-share-alt"></i>
                  <span>分享</span>
                </button>
                <button class="detail-action-btn" @click="viewHistory(currentReport)">
                  <i class="fas fa-history"></i>
                  <span>版本历史</span>
                </button>
                <button 
                  class="detail-action-btn danger" 
                  @click="toggleReportStatus(currentReport)"
                  :style="{ color: currentReport.status === 1 ? '#ff4d4f' : '#52c41a' }"
                >
                  <i :class="currentReport.status === 1 ? 'fas fa-trash' : 'fas fa-redo'"></i>
                  <span>{{ currentReport.status === 1 ? '删除' : '恢复' }}</span>
                </button>
              </div>
            </div>
          </div>
        </el-dialog>
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
const reports = ref([
  {
    id: 1,
    code: 'DATA_REPORT_001',
    name: '数据处理报表',
    description: '业务数据处理统计分析报表',
    icon: 'chart-bar',
    report_type: 'report',
    status: 1,
    version: 1,
    created_time: new Date().toISOString(),
    favorite: false,
    creator: '张三',
    view_count: 124,
    data_source: '业务数据库',
    refresh_rate: '每小时',
    permission: '公开'
  },
  {
    id: 2,
    code: 'SUPPORT_SERVICE_002',
    name: '支持服务报表',
    description: '客户支持服务质量监控报表',
    icon: 'users',
    report_type: 'dashboard',
    status: 1,
    version: 1,
    created_time: new Date().toISOString(),
    favorite: true,
    creator: '李四',
    view_count: 89,
    data_source: '客户服务系统',
    refresh_rate: '每日',
    permission: '部门可见'
  },
  {
    id: 3,
    code: 'SYSTEM_MGMT_003',
    name: '系统管理报表',
    description: '系统运行状态及资源占用分析',
    icon: 'table',
    report_type: 'analysis',
    status: 0,
    version: 2,
    created_time: new Date().toISOString(),
    favorite: false,
    creator: '王五',
    view_count: 256,
    data_source: '系统监控',
    refresh_rate: '实时',
    permission: '管理员可见'
  }
])

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
const detailDialogVisible = ref(false)
const isEditMode = ref(false)
const formRef = ref()
const currentReport = ref({})

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

const activeMenu = ref('report-management')
const unreadCount = ref(3)
const getIcon = (icon) => `fas fa-${icon}`

const getTypeText = (type) => {
  const types = { dashboard: '仪表板', report: '报表', analysis: '分析' }
  return types[type] || type
}

const getTypeClass = (type) => `type-${type}`
const getStatusClass = (status) => {
  return status === 1 ? 'status-normal' : 'status-deleted'
}

const formatDateShort = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  })
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
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
  const filtered = reports.value.filter(report => {
    const matchType = !filter.type || report.report_type === filter.type
    const matchStatus = !filter.status || report.status.toString() === filter.status
    const matchKeyword = !filter.keyword || 
      report.name.includes(filter.keyword) || 
      report.code.includes(filter.keyword)
    return matchType && matchStatus && matchKeyword
  })
  total.value = filtered.length
}

const openAddDialog = () => {
  isEditMode.value = false
  resetForm()
  dialogVisible.value = true
}

const editReport = (report) => {
  isEditMode.value = true
  Object.assign(formData, { ...report })
  dialogVisible.value = true
  detailDialogVisible.value = false
}

const viewReport = (report) => {
  currentReport.value = { ...report }
  detailDialogVisible.value = true
}

const viewReportContent = (report) => {
  ElMessage.info(`正在打开报表：${report.name}`)
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
      id: Date.now(),
      code: `${report.code}_COPY_${Math.floor(Math.random() * 1000)}`,
      name: `${report.name} (副本)`,
      version: 1,
      created_time: new Date().toISOString(),
      favorite: false,
      view_count: 0
    }
    
    reports.value.unshift(newReport)
    total.value = reports.value.length
    ElMessage.success('复制报表成功')
  } catch (error) {
    ElMessage.info('已取消复制')
  }
}
const exportReport = (report) => {
  ElMessage.success(`正在导出报表 "${report.name}" 的配置文件`)
}

const shareReport = (report) => {
  ElMessage.info(`打开报表 "${report.name}" 的分享面板`)
}

const toggleReportStatus = async (report) => {
  const action = report.status === 1 ? '删除' : '恢复'
  const message = report.status === 1 
    ? `确定要删除报表 "${report.name}" 吗？删除后可通过"恢复"功能找回`
    : `确定要恢复报表 "${report.name}" 吗？`
  
  try {
    await ElMessageBox.confirm(
      message,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: report.status === 1 ? 'warning' : 'success'
      }
    )
    
    report.status = report.status === 1 ? 0 : 1
    ElMessage.success(`${action}报表成功`)
    detailDialogVisible.value = false
  } catch (error) {
    ElMessage.info(`已取消${action}`)
  }
}
const viewHistory = (report) => {
  ElMessage.info(`查看报表 "${report.name}" 的版本历史（当前v${report.version}）`)
}

const exportReportList = () => {
  ElMessage.success('开始导出报表列表数据')
}

const toggleFavorite = (report) => {
  report.favorite = !report.favorite
  ElMessage.success(report.favorite ? '已添加到收藏' : '已取消收藏')
}

const submitForm = async () => {
  try {
    await formRef.value.validate()
    const param = {
      id: formData.id,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      reportType: formData.report_type,
      status: formData.status,
      version: formData.version
    }
    

    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (isEditMode.value) {
      const index = reports.value.findIndex(item => item.id === formData.id)
      if (index !== -1) {
        reports.value[index] = { ...reports.value[index], ...param }
      }
      ElMessage.success('编辑报表成功')
    } else {
      const newReport = {
        ...param,
        id: Date.now(),
        version: 1,
        created_time: new Date().toISOString(),
        favorite: false,
        creator: '当前用户',
        view_count: 0,
        data_source: '默认数据源',
        refresh_rate: '每日',
        permission: '部门可见'
      }
      reports.value.unshift(newReport)
      total.value = reports.value.length
      ElMessage.success('创建报表成功')
    }
    
    dialogVisible.value = false
    resetForm()
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入内容')
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

const handleDetailClose = (done) => {
  done()
}
const loadReports = async () => {
  try {
    const param = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    const response = await request.post('/api/report/page', param)
    if (response.code === 200) {
      reports.value = response.data.records
      total.value = response.data.total
      ElMessage.success('数据加载完成')
    }
  } catch (error) {
    ElMessage.error('数据加载失败，请重试')
  }
}

onMounted(() => {
  loadReports()
})
</script>

<style scoped>
.report-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

.action-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--primary-color);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--secondary-color);
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.action-btn i {
  font-size: 14px;
}

.report-status {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 12px;
}

.status-normal {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border: 1px solid var(--border-color);
}

.status-deleted {
  background-color: #fef2f2;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.report-tag.type-dashboard,
.report-tag.type-report,
.report-tag.type-analysis {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border: 1px solid var(--border-color);
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
  color: var(--primary-color);
  background-color: var(--secondary-color);
  border: 1px solid var(--border-color);
}

.report-favorite:hover {
  color: var(--primary-color);
  border: 1px solid var(--border-color);
}

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
  color: var(--primary-color);
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
  color: var(--text-color);
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
  border: 1px solid var(--border-color);
}

.pagination {
  padding: 16px 0;
  border-top: 1px solid var(--border-color);
  background-color: transparent;
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

.report-detail {
  padding: 0;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 20px;
}

.detail-icon {
  width: 80px;
  height: 80px;
  background-color: var(--secondary-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
}

.detail-title {
  flex: 1;
}

.detail-title h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.detail-code {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.detail-content {
  margin-bottom: 30px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.info-item span {
  font-size: 14px;
  color: var(--text-color);
  font-weight: 500;
}

.detail-description {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.config-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.config-item {
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.config-item label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.config-item span {
  display: block;
  font-size: 14px;
  color: var(--text-color);
  font-weight: 500;
}

.detail-actions {
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.action-buttons-group {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.detail-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: white;
  color: var(--primary-color);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
  gap: 6px;
}

.detail-action-btn:hover {
  background-color: var(--secondary-color);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.detail-action-btn.primary {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.detail-action-btn.primary:hover {
  background-color: #ff6a00;
}

.detail-action-btn.danger:hover {
  background-color: #fef2f2;
}

.detail-action-btn i {
  font-size: 20px;
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

.el-dialog__header {
  border-bottom: 1px solid var(--border-color);
}

.el-dialog__footer {
  border-top: 1px solid var(--border-color);
}

.el-form-item__label {
  color: var(--text-color);
}

.el-select, .el-input {
  --el-select-border-color: var(--border-color);
  --el-input-border-color: var(--border-color);
}

.el-select:focus-within, .el-input:focus-within {
  --el-select-border-color: var(--primary-color);
  --el-input-border-color: var(--primary-color);
}
.el-radio__input.is-checked .el-radio__inner {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: var(--primary-color);
}
</style>