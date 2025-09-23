<!-- DatasetTable.vue -->
<template>
  <div class="dataset-table">
    <!-- 表头 -->
    <div class="table-header" :class="getHeaderClass()">
      <div v-for="column in columns" :key="column.key">
        {{ column.label }} <span class="column-type">{{ column.type }}</span>
      </div>
      <div v-if="showOperations">操作</div>
    </div>
    
    <!-- 数据行 -->
    <div 
      class="table-row" 
      :class="getRowClass()"
      v-for="(item, index) in paginatedData" 
      :key="getRowKey(item, index)"
    >
      <div v-for="column in columns" :key="column.key">
        {{ item[column.key] }}
      </div>
      <div class="operation-buttons" v-if="showOperations">
        <button class="operation-btn edit-btn" title="编辑" @click="handleEdit(item)">
          <i class="fas fa-edit"></i>
        </button>
        <button class="operation-btn delete-btn" title="删除" @click="handleDelete(item)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div class="empty-state" v-if="data.length === 0">
      <i class="fas fa-inbox"></i>
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script setup>
import { computed,defineProps } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  dataType: {
    type: String,
    default: 'users' // 'users', 'orders', 'joined'
  },
  showOperations: {
    type: Boolean,
    default: true
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  }
});


// 分页数据
const paginatedData = computed(() => {
  const start = (props.currentPage - 1) * props.pageSize;
  const end = start + props.pageSize;
  return props.data.slice(start, end);
});

// 获取行唯一键
const getRowKey = (item, index) => {
  if (props.dataType === 'users') return item.id;
  if (props.dataType === 'orders') return item.order_id;
  if (props.dataType === 'joined') return `${item.id}-${item.order_id}`;
  return index;
};

// 获取表头样式类
const getHeaderClass = () => {
  return `${props.dataType}-header`;
};

// 获取行样式类
const getRowClass = () => {
  return `${props.dataType}-row`;
};




</script>

<style scoped>
.dataset-table {
  width: 100%;
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

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}
</style>