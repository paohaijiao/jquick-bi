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
      
      <!-- 右侧角色权限管理区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title text-align-left">角色权限管理</h1>
            <p class="page-description">管理系统角色及对应的权限配置</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline" @click="exportRoles">
              <i class="fas fa-download"></i>
              导出角色
            </button>
            <button class="btn btn-primary" id="addRoleBtn" @click="showAddRoleModal">
              <i class="fas fa-plus"></i>
              新增角色
            </button>
          </div>
        </div>
        
        <!-- 筛选和搜索区域 -->
        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-item">
              <label>角色状态</label>
              <select v-model="roleStatus" @change="handleRole()">
                <option value="">全部状态</option>
                <option :value="c.code" v-for="(c) in status" :key="c.code">{{c.name}}</option>
              </select>
            </div>
            <div class="filter-item">
              <label>角色类型</label>
              <select v-model="roleType" @change="handleRole()">
                <option value="">全部类型</option>
                <option :value="c.code" v-for="(c) in type" :key="c.code">{{c.name}}</option>
              </select>
            </div>
          </div>
          <div class="search-filter">
             <el-icon><Search /></el-icon>
            <input type="text" placeholder="搜索角色名称或描述..." v-model="searchKeyword">
          </div>
        </div>
        
        <!-- 角色列表 -->
        <div class="role-list">
          <div class="table-header">
            <div>角色信息</div>
            <div>角色编码</div>
            <div>状态</div>
            <div>操作</div>
          </div>
          
          <div class="table-row" v-for="role in roles" :key="role.id">
            <div class="role-info">
              <div class="role-icon">
                <i :class="role.icon"></i>
              </div>
              <div class="role-details">
                <div class="role-name text-align-left">{{ role.roleName }}</div>
                <div class="role-desc text-align-left">{{ role.remark }}</div>
              </div>
            </div>
            <div class="role-count">{{ role.roleCode }}</div>
            <div>
              <span class="role-status" :class="role.status === 'active' ? 'status-active' : 'status-inactive'">
                {{ role.status === 'active' ? '已启用' : '已禁用' }}
              </span>
            </div>
            <div class="operation-buttons">
              <button class="operation-btn" title="编辑" 
                      :data-role="role.name" :data-type="role.type"
                      @click="editRole(role)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="operation-btn" title="权限配置" 
                      :data-role="role.name" :data-type="role.type"
                      @click="configurePermission(role)">
                <i class="fas fa-lock"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 分页控件 -->
        <div class="pagination">
          <div class="pagination-info">显示 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalRoles) }} 条，共 {{ totalRoles }} 条</div>
          <div class="pagination-controls">
            <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="page-btn" :class="{ active: currentPage === 1 }" @click="changePage(1)">1</button>
            <button class="page-btn" :class="{ active: currentPage === 2 }" @click="changePage(2)">2</button>
            <button class="page-btn" :class="{ active: currentPage === 3 }" @click="changePage(3)">3</button>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
    
    <!-- 新增/编辑角色模态框 -->
    <div class="modal-overlay" :class="{ show: isAddRoleModalVisible }" @click="closeModal('isAddRoleModalVisible')">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ currentRole.id ? '编辑角色' : '新增角色' }}</h3>
          <button class="modal-close" @click="closeModal('isAddRoleModalVisible')" required>
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label text-align-left">角色名称</label>
            <input type="text" class="form-control" v-model="currentRole.roleName" placeholder="请输入角色名称" required>
            <span class="form-hint text-align-left">角色名称应清晰反映角色职责，不超过20个字符</span>
          </div>
          <div class="form-group">
            <label class="form-label text-align-left">角色代码</label>
            <input class="form-control" v-model="currentRole.roleCode" placeholder="请输入角色代码" required :disabled="currentRole.id">
            <span class="form-hint text-align-left"></span>
          </div>
          <div class="form-group">
            <label class="form-label text-align-left">角色图标</label>
            <input class="form-control" v-model="currentRole.icon" placeholder="请输入角色图标" required>
            <span class="form-hint text-align-left"></span>
          </div>
          <div class="form-group">
            <label class="form-label text-align-left">角色描述</label>
            <textarea class="form-control" v-model="currentRole.remark" placeholder="请输入角色描述" required></textarea>
            <span class="form-hint text-align-left">简要描述该角色的职责和权限范围</span>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label text-align-left">角色状态</label>
              <select class="form-control" v-model="currentRole.status" required>
                <option :value="c.code" v-for="(c) in status" :key="c.code">{{c.name}}</option>
              </select>
            </div>
            <div class="form-group" v-if="!currentRole.id">
              <label class="form-label text-align-left">角色类型</label>
              <select class="form-control" v-model="currentRole.type" required>
                <option value="custom">自定义角色</option>
              </select>
              <span class="form-hint text-align-left">系统角色由系统预设，自定义角色可灵活配置</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal('isAddRoleModalVisible')">取消</button>
          <button class="btn btn-primary" @click="saveOrUpdateRole">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 权限配置模态框 -->
    <div class="modal-overlay permission-config-modal" :class="{ show: isPermissionModalVisible }" @click="closeModal('isPermissionModalVisible')">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ currentRole.roleName }} - 权限配置</h3>
          <button class="modal-close" @click="closeModal('isPermissionModalVisible')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="config-header">
            <div class="config-title">为 {{ currentRole.roleName }} 分配权限</div>
          </div>
         
          <div class="permission-tree-container">
            <!-- 系统权限树形结构 -->
            <el-tree 
                :data="treeData" 
                :props="defaultProps" 
                @node-click="handleNodeClick"
                show-checkbox
                node-key="id"
                :default-checked-keys="defaultCheckedKeys"
                ref="tree"
              ></el-tree>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal('isPermissionModalVisible')">取消</button>
          <button class="btn btn-primary" @click="saveRoleMenus">保存权限</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'rolePage'
}
</script>
<script setup>
import { ref, computed, onMounted } from 'vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import { ElMessage } from 'element-plus';
import request from '../api/request';

// 筛选条件
const roleStatus = ref('');
const roleType = ref('');
const searchKeyword = ref('');
const status = ref([]);
const type = ref([]);

// 分页控制
const currentPage = ref(1);
const pageSize = ref(5);

// 模态框状态
const isAddRoleModalVisible = ref(false);
const isPermissionModalVisible = ref(false);
const currentRole = ref({});


// 角色列表
const roles = ref([]);
const defaultProps = ref({
  children: 'children',
  label: 'title'        
});
const treeData = ref([]);
const defaultCheckedKeys = ref([]);



const filteredRoles = computed(() => {
  return roles.value.filter(role => {
    const matchesStatus = roleStatus.value ? role.status === roleStatus.value : true;
    const matchesType = roleType.value ? role.type === roleType.value : true;
    const matchesSearch = searchKeyword.value 
      ? role.roleName.includes(searchKeyword.value) || role.remark.includes(searchKeyword.value)
      : true;
    return matchesStatus && matchesType && matchesSearch;
  });
});

// 计算属性 - 总角色数
const totalRoles = computed(() => filteredRoles.value.length);

// 计算属性 - 总页数
const totalPages = computed(() => Math.ceil(totalRoles.value / pageSize.value));

// 左侧菜单相关
const activeMenu = ref('role');
const unreadCount = ref(5);

// 角色操作方法
const showAddRoleModal = () => {
  // 重置当前角色对象
  currentRole.value = {
    id: '',
    roleName: '',
    roleCode: '',
    remark: '',
    status: 'active',
    type: 'custom',
    icon: 'fas fa-user-shield'
  };
  isAddRoleModalVisible.value = true;
};

const editRole = (role) => {
  currentRole.value = { ...role };
  isAddRoleModalVisible.value = true;
};

const saveOrUpdateRole = () => {
  let param = new Object();
  param.id = currentRole.value.id;
  param.roleName = currentRole.value.roleName;
  param.roleCode = currentRole.value.roleCode;
  param.remark = currentRole.value.remark;
  param.uaaRoleType = currentRole.value.uaaRoleType;
  param.icon = currentRole.value.icon;
  param.status = currentRole.value.status;
  
  request.post('/api/role/saveOrUpdate', param)
    .then(response => {
      if (200 === response.code) {
        ElMessage.success(`保存成功`);
        handleRole(); // 重新加载角色列表
      } else {
        ElMessage.error(`加载数据出错: ${response.message}`);
      }
    })
    .catch(error => {
      ElMessage.error(`请求失败: ${error.message}`);
    });
  
  isAddRoleModalVisible.value = false;
};

const exportRoles = () => {
  console.log('导出角色列表');
  alert('角色列表导出成功');
};

const configurePermission = (role) => {
  currentRole.value = { ...role };
  isPermissionModalVisible.value = true;
  handleRoleMenu(role.id);
};

const saveRoleMenus = () => {
  let param=new Object();
  param.roleId=currentRole.value.id;
  param.menus=defaultCheckedKeys.value;
  request.post('/api/roleMenu/save', param).then(response => {
    if (response.code === 200) {
      ElMessage.success('权限配置已保存');
      isPermissionModalVisible.value = false;
    } else {
      ElMessage.error(`保存失败: ${response.message}`);
    }
  }).catch(error => {
    ElMessage.error(`请求失败: ${error.message}`);
  });
};

// 分页方法
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  handleRole(); // 切换页码时重新加载数据
};

// 关闭模态框
const closeModal = (modalName) => {
  if (modalName === 'isAddRoleModalVisible') {
    isAddRoleModalVisible.value = false;
  } else if (modalName === 'isPermissionModalVisible') {
    isPermissionModalVisible.value = false;
  }
};
const handleNodeClick=(data, node, component) => {
  const idsToAdd = [];
  let currentNode = node;
  while (currentNode) {
    if (currentNode.data?.id && !idsToAdd.includes(currentNode.data.id)) {
      idsToAdd.push(currentNode.data.id);
    }
    currentNode = currentNode.parent;
  }
  const newCheckedKeys = [...new Set([...defaultCheckedKeys.value, ...idsToAdd])];
  defaultCheckedKeys.value = newCheckedKeys;

}
const handleRoleMenu = (roleId) => {
  request.get('/api/roleMenu/roleTreeByRoleId?roleId='+roleId)
    .then(response => {
      if (200 === response.code) {
        treeData.value = response.data.tree;
        defaultCheckedKeys.value=response.data.selected;
      } else {
        ElMessage.error(`加载角色类型出错: ${response.message}`);
      }
    })
    .catch(error => {
      ElMessage.error(`请求失败: ${error.message}`);
    });
};



// 加载角色类型
const handleRoleType = () => {
  request.get('/api/role/getRoleType')
    .then(response => {
      if (200 === response.code) {
        type.value = response.data;
      } else {
        ElMessage.error(`加载角色类型出错: ${response.message}`);
      }
    })
    .catch(error => {
      ElMessage.error(`请求失败: ${error.message}`);
    });
};

// 加载角色状态
const handleRoleStatus = () => {
  request.get('/api/role/getRoleStatus')
    .then(response => {
      if (200 === response.code) {
        status.value = response.data;
      } else {
        ElMessage.error(`加载角色状态出错: ${response.message}`);
      }
    })
    .catch(error => {
      ElMessage.error(`请求失败: ${error.message}`);
    });
};

// 加载角色列表
const handleRole = () => {
  let param = new Object();
  param.pageNum = currentPage.value;
  param.pageSize = pageSize.value;
  param.status = roleStatus.value;
  param.type = roleType.value;
  param.keyword = searchKeyword.value;
  
  request.post('/api/role/page', param)
    .then(response => {
      if (200 === response.code) {
        roles.value = response.data.records;
      } else {
        ElMessage.error(`加载角色列表出错: ${response.message}`);
      }
    })
    .catch(error => {
      ElMessage.error(`请求失败: ${error.message}`);
    });
};

// 页面加载时初始化数据
onMounted(() => {
  handleRole();
  handleRoleType();
  handleRoleStatus();
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

/* 右侧角色权限管理区域 */
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

/* 角色列表 */
.role-list {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  margin-bottom: 24px;
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

.table-row {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 120px;
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

.role-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.role-details {
  display: flex;
  flex-direction: column;
}

.role-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.role-desc {
  font-size: 12px;
  color: #666;
}

.role-count {
  color: #666;
  font-size: 14px;
}

.role-status {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
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

.operation-btn:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
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
  max-width: 1100px;
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

/* 权限配置模态框样式 */
.permission-config-modal .modal-body {
  padding: 0;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
}

.config-title {
  font-size: 18px;
  font-weight: 600;
}

.permission-tabs {
  display: flex;
  gap: 2px;
  border-bottom: 1px solid var(--border-color);
}

.permission-tab {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  font-weight: 500;
}

.permission-tab.active {
  border-bottom-color: var(--primary-color);
  color: var(--primary-color);
}

.permission-tree-container {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
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

/* 响应式调整 */
@media (max-width: 1200px) {
  .permission-groups {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .table-header, .table-row {
    grid-template-columns: 2fr 1fr 80px;
  }
  
  .table-header div:last-child, .table-row div:last-child {
    display: none;
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
  
  .permission-groups {
    grid-template-columns: 1fr;
  }
}

/* 旋转动画 */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
/* 权限树美化样式 */
.el-tree {
  --tree-node-padding: 12px 0;
  --tree-line-color: #e5e7eb;
  --tree-hover-bg: #fff5eb;
  --tree-active-color: #ff8326;
  --tree-text-color: #2d3e50;
  --tree-depth-indent: 24px;
}

/* 节点整体样式 */
.el-tree-node {
  padding: var(--tree-node-padding);
  transition: background-color 0.2s;
}

.el-tree-node:hover {
  background-color: var(--tree-hover-bg);
}

/* 节点内容样式 */
.el-tree-node__content {
  height: auto !important;
  padding: 4px 0 !important;
  align-items: center;
}

/* 复选框样式优化 */
.el-tree .el-checkbox {
  margin-right: 10px;
}

.el-tree .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: var(--tree-active-color);
  border-color: var(--tree-active-color);
}

.el-tree .el-checkbox__input.is-checked + .el-checkbox__label {
  color: var(--tree-active-color);
  font-weight: 500;
}

/* 节点文本样式 */
.el-tree-node__label {
  font-size: 14px;
  color: var(--tree-text-color);
  transition: color 0.2s;
  padding: 2px 4px;
  border-radius: 4px;
}

.el-tree-node__label:hover {
  color: var(--tree-active-color);
}

/* 连接线样式 */
.el-tree-node__children {
  padding-left: var(--tree-depth-indent) !important;
}

.el-tree--indent .el-tree-node__children {
  position: relative;
}

.el-tree--indent .el-tree-node__children::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: var(--tree-line-color);
}

/* 展开/折叠图标样式 */
.el-tree-node__expand-icon {
  color: #9ca3af;
  width: 20px;
  height: 20px;
  margin-right: 6px;
  transition: color 0.2s;
}

.el-tree-node__expand-icon:hover {
  color: var(--tree-active-color);
}

.el-tree-node__expand-icon.is-expanded {
  color: var(--tree-active-color);
}
.el-tree-node__expand-icon.is-leaf {
  visibility: hidden;
}

/* 选中节点样式 */
.el-tree-node.is-current > .el-tree-node__content {
  background-color: rgba(255, 131, 38, 0.1);
}

.el-tree-node.is-current > .el-tree-node__content .el-tree-node__label {
  color: var(--tree-active-color);
  font-weight: 500;
}

.el-tree-node.is-disabled .el-tree-node__label {
  color: #c5c8ce;
  cursor: not-allowed;
}

.permission-tree-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.permission-tree-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.permission-tree-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.permission-tree-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>