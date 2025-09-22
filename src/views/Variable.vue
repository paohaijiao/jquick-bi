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
      <aside class="sidebar">
        <div class="menu-section">
          <div class="menu-section-title">主导航</div>
          <div class="menu-item" :class="{ active: activeMenu === 'home' }" @click="setActiveMenu('home')">
            <i class="fas fa-home"></i>
            <span>首页</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'datasource' }" @click="toggleSubmenu('datasource')">
            <i class="fas fa-database"></i>
            <span>数据源</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;" :class="{ 'rotate-180': submenus.datasource }"></i>
          </div>
          <div class="submenu" :class="{ show: submenus.datasource }">
            <div class="submenu-item" :class="{ active: activeSubMenu === 'datasource-list' }" @click="setActiveSubMenu('datasource-list')">数据源列表</div>
            <div class="submenu-item" :class="{ active: activeSubMenu === 'datasource-add' }" @click="setActiveSubMenu('datasource-add')">新增数据源</div>
            <div class="submenu-item" :class="{ active: activeSubMenu === 'datasource-perm' }" @click="setActiveSubMenu('datasource-perm')">数据源权限</div>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'report' }" @click="setActiveMenu('report')">
            <i class="fas fa-file-alt"></i>
            <span>报表</span>
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
          <div class="menu-item" :class="{ active: activeMenu === 'variable' }" @click="setActiveMenu('variable')">
            <i class="fas fa-code"></i>
            <span>变量管理</span>
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
          <div class="menu-item" :class="{ active: activeMenu === 'service' }" @click="setActiveMenu('service')">
            <i class="fas fa-comment-dots"></i>
            <span>联系客服</span>
          </div>
        </div>
      </aside>
      
      <!-- 右侧变量管理区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title text-align-left">变量管理</h1>
            <p class="page-description">管理系统中所有可用变量，支持增删改查操作</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline">
              <i class="fas fa-download"></i>
              导出变量
            </button>
            <button class="btn btn-primary" @click="openAddModal">
              <i class="fas fa-plus"></i>
              新增变量
            </button>
          </div>
        </div>
        
        <!-- 筛选和搜索区域 -->
        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-item">
              <label>变量类型</label>
              <select v-model="typeFilter">
                <option value="">全部类型</option>
                <option value="string">字符串</option>
                <option value="number">数字</option>
                <option value="boolean">布尔值</option>
                <option value="date">日期</option>
              </select>
            </div>
            <div class="filter-item">
              <label>状态</label>
              <select v-model="statusFilter">
                <option value="">全部状态</option>
                <option value="active">已启用</option>
                <option value="inactive">已禁用</option>
              </select>
            </div>
            <div class="filter-item">
              <label>创建时间</label>
              <select v-model="timeFilter">
                <option value="">全部时间</option>
                <option value="week">近7天</option>
                <option value="month">近30天</option>
                <option value="quarter">近90天</option>
              </select>
            </div>
          </div>
          <div class="search-filter">
            <el-icon><Search /></el-icon>
            <input type="text" v-model="searchKeyword" placeholder="搜索变量名称...">
          </div>
        </div>
        
        <!-- 变量列表 -->
        <div class="variable-list">
          <div class="table-header">
            <div class="text-align-left">变量名称</div>
            <div>类型</div>
            <div>状态</div>
            <div>最后修改时间</div>
            <div>操作</div>
          </div>
          
          <div class="table-row" v-for="variable in filteredVariables" :key="variable.id" :data-id="variable.id">
            <div class="variable-name">
              <div class="variable-icon" :class="variable.type">
                <i class="fas" :class="getTypeIcon(variable.type)"></i>
              </div>
              <div class="variable-info">
                <div class="var-name">{{ variable.name }}</div>
                <div class="var-desc">{{ variable.desc }}</div>
              </div>
            </div>
            <div>{{ getTypeName(variable.type) }}</div>
            <div><span class="status-badge" :class="'status-' + variable.status">{{ variable.status === 'active' ? '已启用' : '已禁用' }}</span></div>
            <div>{{ variable.modifiedTime }}</div>
            <div class="operation-buttons">
              <button class="operation-btn edit" title="编辑" @click="openEditModal(variable.id)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="operation-btn delete" title="删除" @click="openDeleteModal(variable.id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <!-- 分页控件 -->
          <div class="pagination">
            <div class="pagination-info">显示 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalItems) }} 条，共 {{ totalItems }} 条</div>
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
        </div>
      </main>
    </div>
    
    <!-- 新增/编辑变量模态框 -->
    <div class="modal-overlay" :class="{ show: variableModalVisible }" @click="closeModalOutside">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title ">{{ isEditing ? '编辑变量' : '新增变量' }}</h3>
          <button class="modal-close" @click="closeVariableModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveVariable">
            <input type="hidden" v-model="formData.id">
            <div class="form-group">
              <label class="form-label text-align-left" for="varName">变量名称 <span style="color: var(--danger-color)">*</span></label>
              <input type="text" class="form-control" id="varName" v-model="formData.name" required placeholder="请输入变量名称">
              <div class="form-hint">变量名称只能包含字母、数字和下划线，且不能以数字开头</div>
            </div>
            <div class="form-group">
              <label class="form-label text-align-left" for="varKey">变量键名 <span style="color: var(--danger-color)">*</span></label>
              <input type="text" class="form-control" id="varKey" v-model="formData.key" required placeholder="请输入变量键名">
              <div class="form-hint">变量键名用于代码中引用，建议使用大写字母和下划线组合</div>
            </div>
            <div class="form-group">
              <label class="form-label text-align-left" for="varType">变量类型 <span style="color: var(--danger-color)">*</span></label>
              <select class="form-control" id="varType" v-model="formData.type" required>
                <option value="">请选择变量类型</option>
                <option value="string">字符串</option>
                <option value="number">数字</option>
                <option value="boolean">布尔值</option>
                <option value="date">日期</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label text-align-left" for="varValue">变量值 <span style="color: var(--danger-color)">*</span></label>
              <input type="text" class="form-control" id="varValue" v-model="formData.value" required placeholder="请输入变量值">
            </div>
            <div class="form-group">
              <label class="form-label text-align-left" for="varDesc">变量描述</label>
              <textarea class="form-control" id="varDesc" rows="3" v-model="formData.desc" placeholder="请输入变量描述信息"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label text-align-left" for="varStatus">状态</label>
              <select class="form-control" id="varStatus" v-model="formData.status">
                <option value="active">已启用</option>
                <option value="inactive">已禁用</option>
              </select>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" @click="closeVariableModal">取消</button>
              <button type="submit" class="btn btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 确认删除模态框 -->
    <div class="modal-overlay" :class="{ show: deleteModalVisible }" @click="closeModalOutside">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">确认删除</h3>
          <button class="modal-close" @click="closeDeleteModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="confirm-message">
            您确定要删除此变量吗？此操作不可撤销。
          </div>
          <div class="confirm-warning">
            <i class="fas fa-exclamation-triangle"></i>
            警告：删除变量可能会影响依赖它的报表和仪表盘正常运行。
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline" @click="closeDeleteModal">取消</button>
          <button type="button" class="btn btn-danger" @click="confirmDelete">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script >
export default {
  name: 'variablePage'
}
</script>
<script setup>
import { ref, computed } from 'vue';

// 菜单状态管理
const activeMenu = ref('variable');
const activeSubMenu = ref('');
const submenus = ref({
  datasource: false
});

// 筛选条件
const typeFilter = ref('');
const statusFilter = ref('');
const timeFilter = ref('');
const searchKeyword = ref('');

// 分页控制
const currentPage = ref(1);
const pageSize = ref(5);

// 模态框状态
const variableModalVisible = ref(false);
const deleteModalVisible = ref(false);
const isEditing = ref(false);
const currentVariableId = ref(null);

// 表单数据
const formData = ref({
  id: '',
  name: '',
  key: '',
  type: '',
  value: '',
  desc: '',
  status: 'active'
});

// 变量数据
const variables = ref([
  {
    id: 1,
    name: '系统名称',
    key: 'SYSTEM_NAME',
    type: 'string',
    value: 'JQuick BI',
    desc: '系统显示的名称标识',
    status: 'active',
    modifiedTime: '2023-10-15 09:30'
  },
  {
    id: 2,
    name: '默认分页大小',
    key: 'DEFAULT_PAGE_SIZE',
    type: 'number',
    value: '10',
    desc: '表格默认显示的记录条数',
    status: 'active',
    modifiedTime: '2023-10-14 14:20'
  },
  {
    id: 3,
    name: '允许匿名访问',
    key: 'ALLOW_ANONYMOUS',
    type: 'boolean',
    value: 'false',
    desc: '是否允许未登录用户访问公开报表',
    status: 'inactive',
    modifiedTime: '2023-10-12 11:45'
  },
  {
    id: 4,
    name: '数据保留期限',
    key: 'DATA_RETENTION_PERIOD',
    type: 'date',
    value: '2023-12-31',
    desc: '系统数据自动清理的保留时间',
    status: 'active',
    modifiedTime: '2023-10-10 16:10'
  },
  {
    id: 5,
    name: '主题颜色',
    key: 'THEME_COLOR',
    type: 'string',
    value: '#ff8326',
    desc: '系统默认主题颜色配置',
    status: 'active',
    modifiedTime: '2023-10-09 10:50'
  },
  {
    id: 6,
    name: '缓存时间',
    key: 'CACHE_TIME',
    type: 'number',
    value: '300',
    desc: '数据缓存时间(秒)',
    status: 'active',
    modifiedTime: '2023-10-08 15:20'
  },
  {
    id: 7,
    name: '是否开启日志',
    key: 'ENABLE_LOG',
    type: 'boolean',
    value: 'true',
    desc: '是否记录系统操作日志',
    status: 'active',
    modifiedTime: '2023-10-07 09:10'
  },
  {
    id: 8,
    name: '首页地址',
    key: 'HOME_PAGE_URL',
    type: 'string',
    value: '/dashboard',
    desc: '系统默认首页地址',
    status: 'active',
    modifiedTime: '2023-10-06 11:30'
  },
  {
    id: 9,
    name: '超时时间',
    key: 'TIMEOUT',
    type: 'number',
    value: '3600',
    desc: '用户登录超时时间(秒)',
    status: 'active',
    modifiedTime: '2023-10-05 14:40'
  },
  {
    id: 10,
    name: '维护时间',
    key: 'MAINTENANCE_TIME',
    type: 'date',
    value: '2023-11-01',
    desc: '系统定期维护时间',
    status: 'inactive',
    modifiedTime: '2023-10-04 16:50'
  },
  {
    id: 11,
    name: '最大上传大小',
    key: 'MAX_UPLOAD_SIZE',
    type: 'number',
    value: '10',
    desc: '文件最大上传大小(MB)',
    status: 'active',
    modifiedTime: '2023-10-03 10:20'
  },
  {
    id: 12,
    name: '是否允许注册',
    key: 'ALLOW_REGISTRATION',
    type: 'boolean',
    value: 'false',
    desc: '是否允许用户自行注册',
    status: 'inactive',
    modifiedTime: '2023-10-02 13:10'
  },
  {
    id: 13,
    name: '版权信息',
    key: 'COPYRIGHT_INFO',
    type: 'string',
    value: '© 2023 JQuick BI. All rights reserved.',
    desc: '系统底部显示的版权信息',
    status: 'active',
    modifiedTime: '2023-10-01 15:30'
  },
  {
    id: 14,
    name: '更新日期',
    key: 'UPDATE_DATE',
    type: 'date',
    value: '2023-09-30',
    desc: '系统最后更新日期',
    status: 'active',
    modifiedTime: '2023-09-30 17:40'
  },
  {
    id: 15,
    name: '默认语言',
    key: 'DEFAULT_LANGUAGE',
    type: 'string',
    value: 'zh-CN',
    desc: '系统默认显示语言',
    status: 'active',
    modifiedTime: '2023-09-29 09:50'
  },
  {
    id: 16,
    name: '重试次数',
    key: 'RETRY_COUNT',
    type: 'number',
    value: '3',
    desc: '接口调用失败重试次数',
    status: 'active',
    modifiedTime: '2023-09-28 11:10'
  },
  {
    id: 17,
    name: '是否开启SSL',
    key: 'ENABLE_SSL',
    type: 'boolean',
    value: 'true',
    desc: '是否启用SSL加密',
    status: 'active',
    modifiedTime: '2023-09-27 14:20'
  },
  {
    id: 18,
    name: '备份日期',
    key: 'BACKUP_DATE',
    type: 'date',
    value: '2023-09-26',
    desc: '系统数据最后备份日期',
    status: 'active',
    modifiedTime: '2023-09-26 16:30'
  }
]);

// 计算属性 - 筛选后的变量
const filteredVariables = computed(() => {
  return variables.value
    .filter(variable => {
      if (typeFilter.value && variable.type !== typeFilter.value) return false;
      if (statusFilter.value && variable.status !== statusFilter.value) return false;
      if (searchKeyword.value && !variable.name.includes(searchKeyword.value)) return false;
      return true;
    })
    .slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

// 计算属性 - 总记录数
const totalItems = computed(() => {
  return variables.value.filter(variable => {
    if (typeFilter.value && variable.type !== typeFilter.value) return false;
    if (statusFilter.value && variable.status !== statusFilter.value) return false;
    if (searchKeyword.value && !variable.name.includes(searchKeyword.value)) return false;
    return true;
  }).length;
});

// 计算属性 - 总页数
const pageCount = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value);
});

// 菜单相关方法
const setActiveMenu = (menu) => {
  activeMenu.value = menu;
  activeSubMenu.value = '';
  // 关闭所有子菜单
  Object.keys(submenus.value).forEach(key => {
    submenus.value[key] = false;
  });
};

const toggleSubmenu = (menu) => {
  activeMenu.value = menu;
  submenus.value[menu] = !submenus.value[menu];
};

const setActiveSubMenu = (subMenu) => {
  activeSubMenu.value = subMenu;
};

const toggleUserMenu = () => {
  // 这里可以实现用户菜单的展开/收起逻辑
  console.log('用户菜单被点击');
};

// 分页方法
const changePage = (page) => {
  if (page < 1 || page > pageCount.value) return;
  currentPage.value = page;
};

// 模态框相关方法
const openAddModal = () => {
  isEditing.value = false;
  formData.value = {
    id: '',
    name: '',
    key: '',
    type: '',
    value: '',
    desc: '',
    status: 'active'
  };
  variableModalVisible.value = true;
};

const openEditModal = (id) => {
  const variable = variables.value.find(v => v.id === id);
  if (variable) {
    isEditing.value = true;
    formData.value = { ...variable };
    currentVariableId.value = id;
    variableModalVisible.value = true;
  }
};

const closeVariableModal = () => {
  variableModalVisible.value = false;
};

const openDeleteModal = (id) => {
  currentVariableId.value = id;
  deleteModalVisible.value = true;
};

const closeDeleteModal = () => {
  deleteModalVisible.value = false;
};

const closeModalOutside = (e) => {
  // 点击模态框外部关闭
  if (e.target === e.currentTarget) {
    variableModalVisible.value = false;
    deleteModalVisible.value = false;
  }
};

// 保存变量
const saveVariable = () => {
  if (isEditing.value) {
    // 编辑现有变量
    const index = variables.value.findIndex(v => v.id === currentVariableId.value);
    if (index !== -1) {
      variables.value[index] = {
        ...formData.value,
        modifiedTime: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(',', '')
      };
    }
  } else {
    // 添加新变量
    const newId = Math.max(...variables.value.map(v => v.id), 0) + 1;
    variables.value.push({
      ...formData.value,
      id: newId,
      modifiedTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', '')
    });
  }
  variableModalVisible.value = false;
};

// 确认删除
const confirmDelete = () => {
  variables.value = variables.value.filter(v => v.id !== currentVariableId.value);
  deleteModalVisible.value = false;
};

// 辅助方法 - 获取类型名称
const getTypeName = (type) => {
  const typeMap = {
    'string': '字符串',
    'number': '数字',
    'boolean': '布尔值',
    'date': '日期'
  };
  return typeMap[type] || type;
};

// 辅助方法 - 获取类型图标
const getTypeIcon = (type) => {
  const iconMap = {
    'string': 'fa-font',
    'number': 'fa-hashtag',
    'boolean': 'fa-check-circle',
    'date': 'fa-calendar'
  };
  return iconMap[type] || 'fa-question';
};
</script>

<style>
.text-align-left {
  text-align:left;
}
:root {
  --primary-color: #ff8326;
  --secondary-color: #fff5eb;
  --border-color: #ffd5b8;
  --text-color: #2d3e50;
  --light-bg: #f9f9f9;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  --sidebar-width: 260px;
  --header-height: 60px;
  --success-color: #52c41a;
  --danger-color: #ff4d4f;
  --warning-color: #faad14;
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

/* 变量管理区域 */
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

.btn-danger {
  background-color: white;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
}

.btn-danger:hover {
  background-color: #fff2f0;
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

/* 变量列表 */
.variable-list {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 120px;
  padding: 16px 20px;
  background-color: var(--light-bg);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 120px;
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

.variable-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.variable-icon {
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

.variable-icon.string {
  background-color: #e6f7ff;
  color: #1890ff;
}

.variable-icon.number {
  background-color: #f6ffed;
  color: #52c41a;
}

.variable-icon.boolean {
  background-color: #fff7e6;
  color: #faad14;
}

.variable-icon.date {
  background-color: #fff0f6;
  color: #eb2f96;
}

.variable-info {
  display: flex;
  flex-direction: column;
}

.var-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.var-desc {
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

.status-active {
  background-color: #f0f9eb;
  color: #52c41a;
}

.status-inactive {
  background-color: #f5f5f5;
  color: #8c8c8c;
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

.operation-btn.edit:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.operation-btn.delete:hover {
  background-color: #fff2f0;
  color: var(--danger-color);
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.modal-overlay.show {
  opacity: 1;
  visibility: visible;
}

.modal {
  background-color: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-20px);
  transition: transform 0.3s;
}

.modal-overlay.show .modal {
  transform: translateY(0);
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
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--danger-color);
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
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

.form-hint {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 确认删除模态框 */
.confirm-message {
  padding: 10px 0;
  line-height: 1.5;
}

.confirm-warning {
  color: var(--warning-color);
  margin-top: 10px;
  padding: 10px;
  background-color: #fff7e6;
  border-radius: 6px;
  font-size: 14px;
}

/* 旋转动画 */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s;
}
</style>