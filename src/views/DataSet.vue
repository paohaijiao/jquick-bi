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
          <el-icon><Search /></el-icon>
          <input type="text" placeholder="搜索数据集、字段或查询..." v-model="searchQuery">
        </div>
        <div class="notification-icon" @click="handleNotificationClick">
          <i class="far fa-bell"></i>
          <span class="notification-badge">2</span>
        </div>
        <div class="user-info" @click="toggleUserMenu">
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
          <div class="menu-section-title text-align-left">数据集管理</div>
          <div 
            class="menu-item" 
            :class="{ active: activeMenu === 'dataset-list' }"
            @click="activeMenu = 'dataset-list'"
          >
            <i class="fas fa-table"></i>
            <span>数据集列表</span>
          </div>
          <div 
            class="menu-item" 
            :class="{ active: activeMenu === 'relationships' }"
            @click="activeMenu = 'relationships'"
          >
            <i class="fas fa-code-branch"></i>
            <span>关联关系</span>
          </div>
          <div 
            class="menu-item" 
            :class="{ active: activeMenu === 'query-history' }"
            @click="activeMenu = 'query-history'"
          >
            <i class="fas fa-history"></i>
            <span>查询历史</span>
          </div>
          <div 
            class="menu-item" 
            :class="{ active: activeMenu === 'settings' }"
            @click="activeMenu = 'settings'"
          >
            <i class="fas fa-cog"></i>
            <span>设置</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">数据集分类</div>
          <div 
            class="menu-item" 
            @click="switchTab('users')"
          >
            <i class="fas fa-users"></i>
            <span>用户数据集</span>
            <span class="menu-badge">{{ users.length }}</span>
          </div>
          <div 
            class="menu-item" 
            @click="switchTab('orders')"
          >
            <i class="fas fa-shopping-cart"></i>
            <span>订单数据集</span>
            <span class="menu-badge">{{ orders.length }}</span>
          </div>
          <div 
            class="menu-item" 
            @click="switchTab('joined')"
          >
            <i class="fas fa-code-branch"></i>
            <span>关联数据集</span>
            <span class="menu-badge">{{ joinedData.length }}</span>
          </div>
        </div>
      </aside>
      
      <!-- 右侧数据集内容区域 -->
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title text-align-left">数据集管理</h1>
            <p class="page-description">管理用户数据集、订单数据集及其关联关系</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline" @click="exportResults">
              <i class="fas fa-download"></i>
              <span>导出结果</span>
            </button>
            <button class="btn btn-primary" id="addDatasetBtn" @click="openAddModal">
              <i class="fas fa-plus"></i>
              <span>新建数据集</span>
            </button>
          </div>
        </div>
        
        <!-- SQL查询区域 -->
        <div class="query-section">
          <div class="query-header">
            <div class="query-title">
              <i class="fas fa-code"></i>
              <span>数据集查询</span>
            </div>
          </div>
          <textarea class="sql-editor" id="sqlQuery" v-model="sqlQuery"></textarea>
          <div class="query-actions">
            <button class="btn btn-outline" id="formatBtn" @click="formatSql">
              <i class="fas fa-indent"></i>
              <span>格式化</span>
            </button>
            <button class="btn btn-primary" id="executeBtn" @click="executeQuery">
              <i class="fas fa-play"></i>
              <span>执行查询</span>
            </button>
          </div>
        </div>
        
        <!-- 数据集关系可视化 -->
        <div class="relationship-visualization">
          <div class="relationship-title">
            <i class="fas fa-project-diagram"></i>
            <span>数据集关系图</span>
          </div>
          <div class="relationship-diagram">
            <div class="dataset-box users-box">
              <div class="dataset-box-title">users</div>
              <div class="dataset-fields">
                <div class="dataset-field">
                  <span class="foreign-key">id</span>
                  <span class="column-type">Integer</span>
                </div>
                <div class="dataset-field">
                  <span>name</span>
                  <span class="column-type">String</span>
                </div>
                <div class="dataset-field">
                  <span>age</span>
                  <span class="column-type">Integer</span>
                </div>
                <div class="dataset-field">
                  <span>city</span>
                  <span class="column-type">String</span>
                </div>
                <div class="dataset-field">
                  <span>salary</span>
                  <span class="column-type">Double</span>
                </div>
              </div>
            </div>
            <div class="join-line"></div>
            <div class="join-label">id = user_id</div>
            <div class="dataset-box orders-box">
              <div class="dataset-box-title">orders</div>
              <div class="dataset-fields">
                <div class="dataset-field">
                  <span>order_id</span>
                  <span class="column-type">Integer</span>
                </div>
                <div class="dataset-field">
                  <span class="foreign-key">user_id</span>
                  <span class="column-type">Integer</span>
                </div>
                <div class="dataset-field">
                  <span>product</span>
                  <span class="column-type">String</span>
                </div>
                <div class="dataset-field">
                  <span>quantity</span>
                  <span class="column-type">Integer</span>
                </div>
                <div class="dataset-field">
                  <span>price</span>
                  <span class="column-type">Double</span>
                </div>
                <div class="dataset-field">
                  <span>order_date</span>
                  <span class="column-type">String</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 数据集列表 -->
        <div class="dataset-list">
          <div class="dataset-tabs">
            <div 
              class="dataset-tab" 
              :class="{ active: activeTab === 'users' }" 
              @click="switchTab('users')"
            >
              用户数据集 (users)
            </div>
            <div 
              class="dataset-tab" 
              :class="{ active: activeTab === 'orders' }" 
              @click="switchTab('orders')"
            >
              订单数据集 (orders)
            </div>
            <div 
              class="dataset-tab" 
              :class="{ active: activeTab === 'joined' }" 
              @click="switchTab('joined')"
            >
              关联结果集
            </div>
          </div>
          
          <!-- 用户数据集表头 -->
          <div class="table-header users-header" v-if="activeTab === 'users'">
            <div>id <span class="column-type">Integer</span></div>
            <div>name <span class="column-type">String</span></div>
            <div>age <span class="column-type">Integer</span></div>
            <div>city <span class="column-type">String</span></div>
            <div>salary <span class="column-type">Double</span></div>
            <div>操作</div>
          </div>
          
          <!-- 订单数据集表头 -->
          <div class="table-header orders-header" v-if="activeTab === 'orders'">
            <div>order_id <span class="column-type">Integer</span></div>
            <div>user_id <span class="column-type">Integer</span></div>
            <div>product <span class="column-type">String</span></div>
            <div>quantity <span class="column-type">Integer</span></div>
            <div>price <span class="column-type">Double</span></div>
            <div>order_date <span class="column-type">String</span></div>
            <div>操作</div>
          </div>
          
          <!-- 关联结果集表头 -->
          <div class="table-header joined-header" v-if="activeTab === 'joined'">
            <div>id <span class="column-type">Integer</span></div>
            <div>name <span class="column-type">String</span></div>
            <div>age <span class="column-type">Integer</span></div>
            <div>city <span class="column-type">String</span></div>
            <div>salary <span class="column-type">Double</span></div>
            <div>order_id <span class="column-type">Integer</span></div>
            <div>product <span class="column-type">String</span></div>
            <div>quantity <span class="column-type">Integer</span></div>
            <div>price <span class="column-type">Double</span></div>
            <div>order_date <span class="column-type">String</span></div>
            <div>操作</div>
          </div>
          
          <!-- 用户数据行 -->
          <div 
            class="table-row users-row" 
            :data-id="user.id" 
            v-for="user in users" 
            :key="user.id"
          >
            <div>{{ user.id }}</div>
            <div>{{ user.name }}</div>
            <div>{{ user.age }}</div>
            <div>{{ user.city }}</div>
            <div>{{ user.salary }}</div>
            <div class="operation-buttons">
              <button class="operation-btn edit-btn" title="编辑" @click="editUser(user)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="operation-btn delete-btn" title="删除" @click="deleteUser(user.id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <!-- 订单数据行 -->
          <div 
            class="table-row orders-row" 
            :data-id="order.order_id" 
            v-for="order in orders" 
            :key="order.order_id"
          >
            <div>{{ order.order_id }}</div>
            <div>{{ order.user_id }}</div>
            <div>{{ order.product }}</div>
            <div>{{ order.quantity }}</div>
            <div>{{ order.price }}</div>
            <div>{{ order.order_date }}</div>
            <div class="operation-buttons">
              <button class="operation-btn edit-btn" title="编辑" @click="editOrder(order)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="operation-btn delete-btn" title="删除" @click="deleteOrder(order.order_id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <!-- 关联数据行 -->
          <div 
            class="table-row joined-row" 
            :data-id="item.id + '-' + item.order_id" 
            v-for="item in joinedData" 
            :key="item.id + '-' + item.order_id"
          >
            <div>{{ item.id }}</div>
            <div>{{ item.name }}</div>
            <div>{{ item.age }}</div>
            <div>{{ item.city }}</div>
            <div>{{ item.salary }}</div>
            <div>{{ item.order_id }}</div>
            <div>{{ item.product }}</div>
            <div>{{ item.quantity }}</div>
            <div>{{ item.price }}</div>
            <div>{{ item.order_date }}</div>
            <div class="operation-buttons">
              <button class="operation-btn edit-btn" title="编辑" @click="editJoinedItem(item)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="operation-btn delete-btn" title="删除" @click="deleteJoinedItem(item.id, item.order_id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 分页控件 -->
        <div class="pagination">
          <div class="pagination-info">
            显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalItems) }} 条，共 {{ totalItems }} 条
          </div>
          <div class="pagination-controls">
            <button 
              class="page-btn" 
              :disabled="currentPage === 1" 
              @click="currentPage = currentPage - 1"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button 
              class="page-btn" 
              :class="{ active: currentPage === 1 }" 
              @click="currentPage = 1"
            >
              1
            </button>
            <button 
              class="page-btn" 
              :class="{ active: currentPage === 2 }" 
              @click="currentPage = 2"
              v-if="totalPages >= 2"
            >
              2
            </button>
            <button 
              class="page-btn" 
              :class="{ active: currentPage === 3 }" 
              @click="currentPage = 3"
              v-if="totalPages >= 3"
            >
              3
            </button>
            <button 
              class="page-btn" 
              :disabled="currentPage === totalPages" 
              @click="currentPage = currentPage + 1"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
    
    <!-- 新建/编辑数据集模态框 -->
    <div class="modal-overlay" :class="{ 'd-flex': isModalOpen }" @click="closeModal($event)">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">{{ isEditing ? '编辑数据集' : '新建数据集' }}</div>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: modalTab === 'user' }" 
            @click="modalTab = 'user'"
          >
            用户数据
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: modalTab === 'order' }" 
            @click="modalTab = 'order'"
          >
            订单数据
          </button>
        </div>
        
        <div class="modal-body">
          <!-- 用户数据表单 -->
          <div class="tab-content" :class="{ active: modalTab === 'user' }">
            <div class="form-group">
              <label for="userId">ID</label>
              <input type="number" id="userId" class="form-control" v-model="formData.id" :readonly="isEditing">
            </div>
            <div class="form-group">
              <label for="userName">姓名</label>
              <input type="text" id="userName" class="form-control" v-model="formData.name">
            </div>
            <div class="form-group">
              <label for="userAge">年龄</label>
              <input type="number" id="userAge" class="form-control" v-model="formData.age">
            </div>
            <div class="form-group">
              <label for="userCity">城市</label>
              <input type="text" id="userCity" class="form-control" v-model="formData.city">
            </div>
            <div class="form-group">
              <label for="userSalary">薪资</label>
              <input type="number" id="userSalary" class="form-control" v-model="formData.salary" step="0.01">
            </div>
          </div>
          
          <!-- 订单数据表单 -->
          <div class="tab-content" :class="{ active: modalTab === 'order' }">
            <div class="form-group">
              <label for="orderId">订单ID</label>
              <input type="number" id="orderId" class="form-control" v-model="formData.order_id" :readonly="isEditing">
            </div>
            <div class="form-group">
              <label for="orderUserId">用户ID</label>
              <input type="number" id="orderUserId" class="form-control" v-model="formData.user_id">
            </div>
            <div class="form-group">
              <label for="orderProduct">产品</label>
              <input type="text" id="orderProduct" class="form-control" v-model="formData.product">
            </div>
            <div class="form-group">
              <label for="orderQuantity">数量</label>
              <input type="number" id="orderQuantity" class="form-control" v-model="formData.quantity">
            </div>
            <div class="form-group">
              <label for="orderPrice">价格</label>
              <input type="number" id="orderPrice" class="form-control" v-model="formData.price" step="0.01">
            </div>
            <div class="form-group">
              <label for="orderDate">订单日期</label>
              <input type="date" id="orderDate" class="form-control" v-model="formData.order_date">
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveData">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 确认删除模态框 -->
    <div class="modal-overlay" :class="{ 'd-flex': isConfirmOpen }" @click="closeConfirmModal($event)">
      <div class="modal confirm-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">确认删除</div>
          <button class="modal-close" @click="closeConfirmModal">&times;</button>
        </div>
        
        <div class="confirm-content">
          <div class="confirm-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="confirm-message">您确定要删除这条数据吗？此操作不可撤销。</div>
          
          <div class="modal-footer">
            <button class="btn btn-outline" @click="closeConfirmModal">取消</button>
            <button class="btn btn-primary" @click="confirmDelete">确认删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 状态管理
const activeMenu = ref('dataset-list');
const activeTab = ref('users');
const searchQuery = ref('');
const sqlQuery = ref("select * from user a inner join user_order b on a.id = b.user_id order by b.user_id");
const currentPage = ref(1);
const pageSize = ref(10);

// 数据管理
const users = ref([
  { id: 1, name: '张三', age: 25, city: '北京', salary: 8000.0 },
  { id: 2, name: '李四', age: 30, city: '上海', salary: 12000.0 }
]);

const orders = ref([
  { order_id: 101, user_id: 1, product: '笔记本电脑', quantity: 1, price: 5999.0, order_date: '2024-01-15' },
  { order_id: 102, user_id: 1, product: '鼠标', quantity: 2, price: 199.0, order_date: '2024-01-16' },
  { order_id: 103, user_id: 2, product: '手机', quantity: 1, price: 3999.0, order_date: '2024-01-17' },
  { order_id: 104, user_id: 3, product: '耳机', quantity: 3, price: 299.0, order_date: '2024-01-18' }
]);

const joinedData = ref([]);

// 模态框状态
const isModalOpen = ref(false);
const isConfirmOpen = ref(false);
const isEditing = ref(false);
const modalTab = ref('user');
const formData = ref({});
const itemToDelete = ref(null);
const deleteType = ref('');

// 计算属性
const totalItems = computed(() => {
  if (activeTab.value === 'users') return users.value.length;
  if (activeTab.value === 'orders') return orders.value.length;
  return joinedData.value.length;
});

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// 生命周期钩子
onMounted(() => {
  executeQuery();
});

// 方法
const switchTab = (tab) => {
  activeTab.value = tab;
  currentPage.value = 1;
};

const formatSql = () => {
  // 简单的SQL格式化实现
  let formatted = sqlQuery.value
    .replace(/select /gi, 'SELECT ')
    .replace(/from /gi, '\nFROM ')
    .replace(/where /gi, '\nWHERE ')
    .replace(/inner join /gi, '\nINNER JOIN ')
    .replace(/on /gi, ' ON ')
    .replace(/order by /gi, '\nORDER BY ');
  sqlQuery.value = formatted;
};

const executeQuery = () => {
  // 模拟SQL查询执行，实际项目中会替换为真实的API调用
  joinedData.value = [];
  
  users.value.forEach(user => {
    const userOrders = orders.value.filter(order => order.user_id === user.id);
    userOrders.forEach(order => {
      joinedData.value.push({
        ...user,
        ...order
      });
    });
  });
  
  // 按user_id排序
  joinedData.value.sort((a, b) => a.user_id - b.user_id);
};

const exportResults = () => {
  alert('导出功能将在这里实现');
};

const openAddModal = () => {
  isModalOpen.value = true;
  isEditing.value = false;
  modalTab.value = 'user';
  formData.value = {};
};

const editUser = (user) => {
  isModalOpen.value = true;
  isEditing.value = true;
  modalTab.value = 'user';
  formData.value = { ...user };
};

const editOrder = (order) => {
  isModalOpen.value = true;
  isEditing.value = true;
  modalTab.value = 'order';
  formData.value = { ...order };
};

const editJoinedItem = (item) => {
    console.log(item)
  alert('关联数据编辑功能将在这里实现');
};

const closeModal = (e) => {
  if (!e || e.target.classList.contains('modal-overlay')) {
    isModalOpen.value = false;
  }
};

const saveData = () => {
  if (modalTab.value === 'user') {
    if (isEditing.value) {
      const index = users.value.findIndex(u => u.id === formData.value.id);
      if (index !== -1) {
        users.value[index] = { ...formData.value };
      }
    } else {
      const newId = Math.max(...users.value.map(u => u.id), 0) + 1;
      users.value.push({ ...formData.value, id: newId });
    }
  } else {
    if (isEditing.value) {
      const index = orders.value.findIndex(o => o.order_id === formData.value.order_id);
      if (index !== -1) {
        orders.value[index] = { ...formData.value };
      }
    } else {
      const newOrderId = Math.max(...orders.value.map(o => o.order_id), 0) + 1;
      orders.value.push({ ...formData.value, order_id: newOrderId });
    }
  }
  
  executeQuery(); // 更新关联数据
  isModalOpen.value = false;
};

const deleteUser = (id) => {
  isConfirmOpen.value = true;
  itemToDelete.value = id;
  deleteType.value = 'user';
};

const deleteOrder = (id) => {
  isConfirmOpen.value = true;
  itemToDelete.value = id;
  deleteType.value = 'order';
};

const deleteJoinedItem = (userId, orderId) => {
  isConfirmOpen.value = true;
  itemToDelete.value = { userId, orderId };
  deleteType.value = 'joined';
};

const closeConfirmModal = (e) => {
  if (!e || e.target.classList.contains('modal-overlay')) {
    isConfirmOpen.value = false;
    itemToDelete.value = null;
    deleteType.value = '';
  }
};

const confirmDelete = () => {
  if (deleteType.value === 'user') {
    users.value = users.value.filter(u => u.id !== itemToDelete.value);
    // 同时删除相关订单
    orders.value = orders.value.filter(o => o.user_id !== itemToDelete.value);
  } else if (deleteType.value === 'order') {
    orders.value = orders.value.filter(o => o.order_id !== itemToDelete.value);
  } else if (deleteType.value === 'joined') {
    // 从订单中删除
    orders.value = orders.value.filter(
      o => o.order_id !== itemToDelete.value.orderId
    );
  }
  
  executeQuery(); // 更新关联数据
  isConfirmOpen.value = false;
  itemToDelete.value = null;
  deleteType.value = '';
};

const handleNotificationClick = () => {
  alert('通知功能将在这里实现');
};

const toggleUserMenu = () => {
  alert('用户菜单将在这里实现');
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
.text-align-left {
  text-align: left;
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
  overflow-y: auto;
}

.menu-section {
  padding: 16px 0;
}

.menu-section-title {
  padding: 0 20px 10px;
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
}

.menu-item:hover {
  background-color: var(--secondary-color);
}

.menu-item.active {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  font-weight: 500;
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
  background-color: #f0f7ff;
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

/* 右侧数据集列表区域 */
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

/* SQL查询区域 */
.query-section {
  background-color: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: var(--card-shadow);
  margin-bottom: 24px;
}

.query-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.query-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.query-title i {
  color: var(--primary-color);
}

.sql-editor {
  width: 100%;
  min-height: 100px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  font-size: 14px;
  margin-bottom: 16px;
  resize: vertical;
}

.query-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 数据集列表 */
.dataset-list {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  margin-bottom: 24px;
}

.dataset-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.dataset-tab {
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
}

.dataset-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.dataset-tab:hover:not(.active) {
  background-color: var(--secondary-color);
}

.table-header {
  display: grid;
  padding: 16px 20px;
  background-color: var(--light-bg);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 14px;
}

.users-header {
  grid-template-columns: 80px 120px 80px 120px 120px 100px;
}

.orders-header {
  grid-template-columns: 80px 80px 180px 100px 100px 120px 100px;
}

.joined-header {
  grid-template-columns: 80px 120px 80px 120px 120px 80px 180px 100px 100px 120px 100px;
}

.table-row {
  display: grid;
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

.users-row {
  grid-template-columns: 80px 120px 80px 120px 120px 100px;
}

.orders-row {
  grid-template-columns: 80px 80px 180px 100px 100px 120px 100px;
}

.joined-row {
  grid-template-columns: 80px 120px 80px 120px 120px 80px 180px 100px 100px 120px 100px;
}

.column-type {
  font-size: 12px;
  color: #666;
  background-color: var(--secondary-color);
  padding: 2px 6px;
  border-radius: 4px;
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

/* 数据集关系图 */
.relationship-visualization {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--card-shadow);
  margin-bottom: 24px;
}

.relationship-title {
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.relationship-title i {
  color: var(--primary-color);
}

.relationship-diagram {
  min-height: 200px;
  background-color: var(--light-bg);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.dataset-box {
  background-color: white;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  padding: 16px;
  min-width: 200px;
  box-shadow: var(--card-shadow);
}

.dataset-box-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--primary-color);
  text-align: center;
}

.dataset-fields {
  font-size: 13px;
}

.dataset-field {
  padding: 4px 0;
  display: flex;
  justify-content: space-between;
}

.foreign-key {
  color: #f5222d;
  font-weight: 500;
}

.join-line {
  position: absolute;
  height: 2px;
  background-color: #999;
  width: 100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.join-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 2;
}

.users-box {
  position: absolute;
  left: 20%;
  top: 50%;
  transform: translateY(-50%);
}

.orders-box {
  position: absolute;
  right: 20%;
  top: 50%;
  transform: translateY(-50%);
}

/* 结果预览区 */
.results-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.results-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.results-title i {
  color: var(--primary-color);
}

.results-info {
  font-size: 13px;
  color: #666;
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
  background-color: var(--secondary-color);
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
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-overlay.d-flex {
  display: flex;
}

.modal {
  background-color: white;
  border-radius: 12px;
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
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

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 确认对话框样式 */
.confirm-modal {
  width: 400px;
  max-width: 90%;
}

.confirm-content {
  padding: 24px 20px;
  text-align: center;
}

.confirm-icon {
  font-size: 48px;
  color: #faad14;
  margin-bottom: 16px;
}

.confirm-message {
  font-size: 16px;
  margin-bottom: 24px;
}
</style>