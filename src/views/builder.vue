<template>
  <div class="container">
    <header class="header">
      <button class="mobile-menu-toggle" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>
      <div class="logo">
        <i class="fas fa-chart-line"></i>
        <span>JQuick BI 设计器</span>
      </div>
      <div class="header-actions">
        <button class="action-btn">
          <i class="fas fa-code"></i>导出JQuikHtml
        </button>
        <button class="action-btn">
          <i class="fas fa-file-import"></i>导入JQuikHtml
        </button>
        <button class="action-btn">
          <i class="fas fa-eye"></i>预览
        </button>
        <button class="action-btn">
          <i class="fas fa-cubes"></i>组件
        </button>
        <button class="action-btn" @click="showHtmlEditor = true">
          <i class="fas fa-code"></i>HTML编辑器
        </button>
        <button class="action-btn">
          <i class="fas fa-cog"></i>设置
        </button>
        <div class="user-profile">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <span>管理员</span>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <div class="main-content">
      <aside class="sidebar" :class="{ active: sidebarActive }">
        <!-- 可拖拽元素列表 -->
        <div class="menu-section">
          <div class="menu-section-title text-align-left">HTML元素</div>
          <div
              class="menu-item"
              v-for="item in htmlElements"
              :key="item.id"
              draggable="true"
              @dragstart="handleDragStart($event, item)"
              @dragend="handleDragEnd"
          >
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">文本元素</div>
          <div
              class="menu-item"
              v-for="item in textElements"
              :key="item.id"
              draggable="true"
              @dragstart="handleDragStart($event, item)"
              @dragend="handleDragEnd"
          >
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">表单元素</div>
          <div
              class="menu-item"
              v-for="item in formElements"
              :key="item.id"
              draggable="true"
              @dragstart="handleDragStart($event, item)"
              @dragend="handleDragEnd"
          >
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </aside>

      <!-- 工作区 - 可放置区域 -->
      <div class="workspace">
        <div class="workspace-header">
          <div>
            <h1 class="workspace-title text-align-left">我的报表</h1>
            <p class="workspace-description">拖放HTML元素到画布中创建您的页面</p>
          </div>
        </div>

        <!-- 可拖拽排序的组件列表 -->
        <div
            class="canvas-container"
            @dragover.prevent="handleDragOver"
            @dragenter.prevent="handleDragEnter"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
            :class="{ 'drag-over': isDraggingOver }"
        >
          <draggable
              :list="components"
              :animation="200"
              :ghost-class="'ghost'"
              :chosen-class="'chosen'"
              :drag-class="'dragging'"
              @start="onDragStart"
              @end="onDragEnd"
          >
            <template #item="{ element }">
              <div
                  class="canvas-component"
                  :class="{ selected: element.id === selectedComponentId }"
                  @click="selectComponent(element.id)"
                  :style="getComponentStyle(element)"
              >
                <div class="component-header">
                  <div class="component-info">
                    <i :class="element.icon"></i>
                    <span>{{ element.name }}</span>
                    <small class="component-id">#{{ element.id }}</small>
                  </div>
                  <div class="component-actions">
                    <button class="edit-btn" title="编辑组件" @click.stop="openEditDialog(element.id)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" title="删除组件" @click.stop="deleteComponent(element.id)">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>

                <div class="component-content" @dblclick="openEditDialog(element.id)">
                  <template v-if="element.type === 'button'">
                    <button class="preview-button">{{ element.content }}</button>
                  </template>
                  <template v-else-if="element.type === 'input'">
                    <input type="text" class="preview-input" :placeholder="element.placeholder || '请输入内容'" disabled>
                  </template>
                  <template v-else>
                    {{ element.content }}
                  </template>
                </div>
              </div>
            </template>
          </draggable>

          <!-- 拖放区域提示 -->
          <div class="drop-zone" v-if="components.length === 0 && !isDraggingOver">
            <i class="fas fa-arrow-down"></i>
            <h3>拖放元素到此处开始设计</h3>
            <p>从左侧选择HTML元素拖放到画布中</p>
          </div>

          <!-- 拖拽中提示 -->
          <div class="drop-zone active" v-if="isDraggingOver">
            <i class="fas fa-arrow-down"></i>
            <h3>释放鼠标添加元素</h3>
            <p>{{ draggedItem?.name || '元素' }}</p>
          </div>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="properties-panel" :class="{ active: propertiesPanelActive }">
        <div class="panel-title">
          <i class="fas fa-sliders-h"></i>属性设置
        </div>

        <!-- 标签切换栏 -->
        <div class="panel-tabs">
          <div class="tab-item" :class="{ active: activeTab === 'properties' }" @click="activeTab = 'properties'">
            <i class="fas fa-tag"></i>属性
          </div>
          <div class="tab-item" :class="{ active: activeTab === 'style' }" @click="activeTab = 'style'">
            <i class="fas fa-paint-brush"></i>样式
          </div>
        </div>

        <!-- 标签内容区 -->
        <div class="tab-content">
          <!-- 属性标签内容 -->
          <div v-if="activeTab === 'properties' && selectedComponent">
            <div class="setting-group">
              <div class="setting-title">元素属性</div>

              <div class="setting-item">
                <label>元素ID</label>
                <input type="text" class="form-control" v-model="selectedComponent.id">
              </div>

              <div class="setting-item">
                <label>元素名称</label>
                <input type="text" class="form-control" v-model="selectedComponent.name">
              </div>

              <div class="setting-item">
                <label>内容文本</label>
                <textarea class="form-control" rows="3" v-model="selectedComponent.content"></textarea>
              </div>

              <div class="setting-item" v-if="selectedComponent.type === 'input'">
                <label>占位符</label>
                <input type="text" class="form-control" v-model="selectedComponent.placeholder">
              </div>
            </div>
          </div>

          <!-- 样式标签内容 -->
          <div v-if="activeTab === 'style' && selectedComponent">
            <div class="setting-group">
              <div class="setting-title">基础样式</div>

              <div class="setting-item">
                <label>字体大小</label>
                <input type="text" class="form-control" v-model="selectedComponent.style.fontSize" placeholder="例如: 14px">
              </div>

              <div class="setting-item">
                <label>字体颜色</label>
                <div class="color-input-group">
                  <input type="text" class="form-control color-value" v-model="selectedComponent.style.color" placeholder="例如: #333">
                  <input type="color" class="color-picker" v-model="selectedComponent.style.color">
                </div>
              </div>

              <div class="setting-item">
                <label>背景颜色</label>
                <div class="color-input-group">
                  <input type="text" class="form-control color-value" v-model="selectedComponent.style.backgroundColor" placeholder="例如: #fff">
                  <input type="color" class="color-picker" v-model="selectedComponent.style.backgroundColor">
                </div>
              </div>
            </div>

            <div class="setting-group">
              <div class="setting-title">尺寸与边距</div>

              <div class="setting-item">
                <label>宽度</label>
                <input type="text" class="form-control" v-model="selectedComponent.style.width" placeholder="例如: 100% 或 200px">
              </div>

              <div class="setting-item">
                <label>高度</label>
                <input type="text" class="form-control" v-model="selectedComponent.style.height" placeholder="例如: auto 或 100px">
              </div>

              <div class="setting-item">
                <label>内边距</label>
                <input type="text" class="form-control" v-model="selectedComponent.style.padding" placeholder="例如: 8px 16px">
              </div>

              <div class="setting-item">
                <label>外边距</label>
                <input type="text" class="form-control" v-model="selectedComponent.style.margin" placeholder="例如: 8px 16px">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 组件编辑对话框 -->
    <div class="modal-overlay" :class="{ active: showEditDialog }" @click="showEditDialog = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">编辑 {{ editingComponent?.name || '组件' }}</div>
          <button class="modal-close" @click="showEditDialog = false">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="editingComponent" class="edit-form">
            <div class="setting-item">
              <label>内容文本</label>
              <textarea class="form-control" rows="4" v-model="editingComponent.content"></textarea>
            </div>

            <div class="setting-item" v-if="editingComponent.type === 'input'">
              <label>占位符</label>
              <input type="text" class="form-control" v-model="editingComponent.placeholder">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showEditDialog = false">取消</button>
          <button class="btn btn-primary" @click="saveEdit">保存</button>
        </div>
      </div>
    </div>

    <!-- HTML编辑器模态框 -->
    <div class="modal-overlay" :class="{ active: showHtmlEditor }" @click="showHtmlEditor = false">
      <div class="modal large-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">JQuikHtml 编辑器</div>
          <button class="modal-close" @click="showHtmlEditor = false">&times;</button>
        </div>
        <div class="modal-body">
          <textarea class="html-editor" placeholder="在此输入JQuikHtml代码..." v-model="htmlEditorContent"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showHtmlEditor = false">取消</button>
          <button class="btn btn-primary">应用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';

// 状态管理
const sidebarActive = ref(false);
const propertiesPanelActive = ref(true);
const activeTab = ref('properties');
const selectedComponentId = ref('h1_1234');
const showHtmlEditor = ref(false);
const showEditDialog = ref(false);
const editingComponent = ref(null);
const isDraggingOver = ref(false);
const draggedItem = ref(null);
const htmlEditorContent = ref('');

// 组件数据
const components = ref([
  {
    id: 'h1_1234',
    type: 'h1',
    name: 'H1 标题',
    icon: 'fas fa-heading',
    content: '一级标题',
    style: {
      fontSize: '24px',
      color: '#333',
      margin: '16px 0'
    }
  },
  {
    id: 'p_5678',
    type: 'p',
    name: 'P 段落',
    icon: 'fas fa-paragraph',
    content: '这是一个段落文本',
    style: {
      fontSize: '14px',
      color: '#666',
      margin: '8px 0'
    }
  },
  {
    id: 'button_9012',
    type: 'button',
    name: 'Button 按钮',
    icon: 'fas fa-hand-pointer',
    content: '按钮',
    style: {
      padding: '8px 16px',
      backgroundColor: '#ff8326',
      color: 'white',
      border: 'none',
      borderRadius: '4px'
    }
  }
]);

// 元素类型列表
const htmlElements = ref([
  { id: 'el-div', type: 'div', name: 'Div 容器', icon: 'fas fa-square' },
  { id: 'el-header', type: 'header', name: 'Header 头部', icon: 'fas fa-heading' },
  { id: 'el-nav', type: 'nav', name: 'Nav 导航', icon: 'fas fa-bars' }
]);

const textElements = ref([
  { id: 'txt-h1', type: 'h1', name: 'H1 标题', icon: 'fas fa-heading' },
  { id: 'txt-h2', type: 'h2', name: 'H2 标题', icon: 'fas fa-heading' },
  { id: 'txt-p', type: 'p', name: 'P 段落', icon: 'fas fa-paragraph' }
]);

const formElements = ref([
  { id: 'form-input', type: 'input', name: 'Input 输入框', icon: 'fas fa-edit' },
  { id: 'form-button', type: 'button', name: 'Button 按钮', icon: 'fas fa-hand-pointer' }
]);

// 计算属性 - 获取选中的组件
const selectedComponent = computed(() => {
  return components.value.find(comp => comp.id === selectedComponentId.value) || null;
});

// 拖拽相关方法
const handleDragStart = (event, item) => {
  draggedItem.value = item;
  // 设置拖拽数据
  event.dataTransfer.setData('text/plain', JSON.stringify(item));
  // 设置拖拽效果
  event.dataTransfer.effectAllowed = 'copy';

  // 添加拖拽时的视觉效果
  const dragImage = document.createElement('div');
  dragImage.textContent = item.name;
  dragImage.style.position = 'absolute';
  dragImage.style.left = '-1000px';
  document.body.appendChild(dragImage);
  event.dataTransfer.setDragImage(dragImage, 0, 0);
};

const handleDragOver = (event) => {
  event.preventDefault(); // 允许放置
  event.dataTransfer.dropEffect = 'copy';
};

const handleDragEnter = (event) => {
  event.preventDefault();
  isDraggingOver.value = true;
};

const handleDragLeave = () => {
  isDraggingOver.value = false;
};

const handleDragEnd = () => {
  isDraggingOver.value = false;
  draggedItem.value = null;
};

const handleDrop = (event) => {
  event.preventDefault();
  isDraggingOver.value = false;

  // 获取拖拽的数据
  const data = event.dataTransfer.getData('text/plain');
  if (data) {
    const item = JSON.parse(data);
    addElement(item.type, item.name, item.icon);
  }
};

// 组件内部排序拖拽事件
const onDragStart = () => {
  // 组件排序开始
};

const onDragEnd = () => {
  // 组件排序结束
};

// 其他方法
const toggleSidebar = () => {
  sidebarActive.value = !sidebarActive.value;
};

const selectComponent = (id) => {
  selectedComponentId.value = id;
  propertiesPanelActive.value = true;
};

const deleteComponent = (id) => {
  components.value = components.value.filter(comp => comp.id !== id);
  if (selectedComponentId.value === id) {
    selectedComponentId.value = components.value.length > 0 ? components.value[0].id : '';
  }
};

const openEditDialog = (id) => {
  const component = components.value.find(comp => comp.id === id);
  if (component) {
    editingComponent.value = JSON.parse(JSON.stringify(component));
    showEditDialog.value = true;
  }
};

const saveEdit = () => {
  if (editingComponent.value) {
    const index = components.value.findIndex(comp => comp.id === editingComponent.value.id);
    if (index !== -1) {
      components.value[index] = { ...editingComponent.value };
      if (editingComponent.value.id !== selectedComponentId.value) {
        selectedComponentId.value = editingComponent.value.id;
      }
    }
    showEditDialog.value = false;
  }
};

const addElement = (type, name, icon) => {
  const timestamp = Date.now();
  const id = `${type}_${timestamp}`;

  let content = '';
  let placeholder = '';

  switch(type) {
    case 'h1': content = '一级标题'; break;
    case 'h2': content = '二级标题'; break;
    case 'p': content = '这是一个段落文本'; break;
    case 'button': content = '按钮'; break;
    case 'input': placeholder = '请输入内容'; break;
    default: content = `${name}内容`;
  }

  const newComponent = {
    id,
    type,
    name,
    icon,
    content,
    placeholder,
    style: {
      fontSize: '14px',
      color: '#333',
      margin: '8px',
      padding: '8px'
    }
  };

  components.value.push(newComponent);
  selectComponent(id);
};

const getComponentStyle = (component) => {
  return { ...component.style };
};
</script>

<style>
:root {
  --primary-color: #ff8326;
  --secondary-color: #f5f5f5;
  --border-color: #ddd;
  --text-color: #333;
  --bg-color: #f9f9f9;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
}

body {
  background-color: #f0f2f5;
  color: var(--text-color);
  height: 100vh;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 头部样式 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.action-btn:hover {
  background-color: var(--secondary-color);
  border-color: var(--primary-color);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* 主内容区 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  width: 250px;
  background-color: white;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.menu-section {
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
}

.menu-section-title {
  padding: 0 15px 10px;
  font-weight: bold;
  color: #666;
  font-size: 0.9rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: var(--secondary-color);
}

.menu-item i {
  color: var(--primary-color);
}

/* 工作区 */
.workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.workspace-header {
  padding: 15px 20px;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
}

.workspace-title {
  margin-bottom: 5px;
}

.workspace-description {
  color: #666;
  font-size: 0.9rem;
}

/* 画布区域与拖拽样式 */
.canvas-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--bg-color);
  min-height: 200px;
  transition: background-color 0.2s;
}

.canvas-container.drag-over {
  background-color: rgba(255, 131, 38, 0.05);
}

/* 拖拽相关样式 */
.ghost {
  opacity: 0.5;
  background-color: #e0e0e0;
}

.chosen {
  background-color: #f0f0f0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.dragging {
  opacity: 0.8;
  transform: scale(1.01);
}

.canvas-component {
  margin: 10px;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: white;
  transition: all 0.2s;
}

.canvas-component.selected {
  border: 2px solid var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.2);
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.component-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.component-id {
  color: #999;
  font-size: 12px;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  font-size: 14px;
}

.edit-btn {
  color: #4096ff;
}

.delete-btn {
  color: #ff4d4f;
}

.component-content {
  min-height: 40px;
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 10px;
  color: #666;
}

.preview-button {
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.preview-input {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  width: 200px;
}

.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  color: #999;
  text-align: center;
  padding: 20px;
  margin: 10px;
}

.drop-zone.active {
  border-color: var(--primary-color);
  background-color: rgba(255, 131, 38, 0.1);
  color: var(--primary-color);
}

.drop-zone i {
  font-size: 2rem;
  margin-bottom: 10px;
}

/* 属性面板 */
.properties-panel {
  width: 300px;
  background-color: white;
  border-left: 1px solid var(--border-color);
  overflow-y: auto;
}

.panel-title {
  padding: 15px;
  font-weight: bold;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.tab-item {
  flex: 1;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.tab-item.active {
  background-color: var(--secondary-color);
  border-bottom: 2px solid var(--primary-color);
}

.tab-content {
  padding: 15px;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-title {
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--border-color);
}

.setting-item {
  margin-bottom: 15px;
}

.setting-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #666;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
}

/* 颜色选择器样式 */
.color-input-group {
  display: flex;
  gap: 8px;
}

.color-value {
  flex: 1;
}

.color-picker {
  width: 40px;
  height: 34px;
  padding: 2px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-outline {
  background-color: white;
  border: 1px solid var(--border-color);
  color: var(--text-color);
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

.modal-overlay.active {
  display: flex;
}

.modal {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
}

.large-modal {
  width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-weight: bold;
  font-size: 1.1rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.html-editor {
  width: 100%;
  height: 400px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: monospace;
  resize: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    height: calc(100% - 60px);
    z-index: 10;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .mobile-menu-toggle {
    display: block;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    margin-right: 10px;
  }

  .properties-panel {
    width: 100%;
    position: absolute;
    height: calc(100% - 60px);
    right: 0;
    top: 60px;
    transform: translateX(100%);
    transition: transform 0.3s;
    z-index: 10;
  }

  .properties-panel.active {
    transform: translateX(0);
  }
}
</style>