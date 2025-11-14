<template>
  <div class="designer-container">
    <!-- 顶部导航 -->
    <header class="header">
      <h1>拖拽设计器</h1>
      <div class="header-actions">
        <button @click="clearCanvas">清空画布</button>
      </div>
    </header>
    <div class="main-content">
      <aside class="elements-panel">
        <h2>可拖拽元素</h2>
        <!-- 左侧可拖拽元素列表 -->
        <draggable 
          v-model="elements" 
          :group="{ name: 'components', pull: 'clone', put: false }"
          :clone="cloneElement"
          class="elements-list"
          :sort="false"
        >
          <template #item="{ element }">
            <div class="element-item">
              <i :class="element.icon"></i>
              <span>{{ element.name }}</span>
            </div>
          </template>
        </draggable>
      </aside>

      <!-- 中间画布区域 -->
      <div class="canvas-area">
        <h2>画布</h2>
        <!-- 画布拖拽区域 -->
        <draggable 
          v-model="components" 
          :group="{ name: 'components', pull: false, put: true }"
          @change="handleCanvasChange"
          class="canvas canvas-drag-area"
          :sort="true"
        >
          <!-- 已添加的组件 -->
          <template #item="{ element }">
            <div class="canvas-component"
                 :key="element.id"
                 :style="getComponentStyle(element)"
                 :class="{ 'selected': element.id === selectedComponentId }"
                 @click="selectComponent(element.id)">
              
              <!-- 组件头部 -->
              <div class="component-header">
                <span>{{ element.name }}</span>
                <div class="component-actions">
                  <button @click.stop="openEditDialog(element.id)" title="编辑">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click.stop="deleteComponent(element.id)" title="删除">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <!-- 组件内容 -->
              <div class="component-content">
                {{ element.content }}
              </div>
            </div>
          </template>
          
          <!-- 空画布提示 -->
          <div class="empty-canvas" v-if="components.length === 0">
            <i class="fas fa-arrow-down"></i>
            <p>从左侧拖拽元素到此处</p>
          </div>
        </draggable>
      </div>

      <!-- 右侧属性面板 -->
      <aside class="properties-panel">
        <h2>属性设置</h2>
        <div v-if="selectedComponent" class="properties-form">
          <!-- 基本属性 -->
          <div class="property-group">
            <h3>基本属性</h3>
            <div class="property-item">
              <label>名称</label>
              <input type="text" v-model="selectedComponent.name" 
                @change="updateComponentProperty(selectedComponent.id, 'name', selectedComponent.name)">
            </div>
            <div class="property-item">
              <label>内容</label>
              <textarea v-model="selectedComponent.content"
                @change="updateComponentProperty(selectedComponent.id, 'content', selectedComponent.content)"></textarea>
            </div>
          </div>
          
          <!-- 样式属性 -->
          <div class="property-group">
            <h3>样式设置</h3>
            <div class="property-item">
              <label>宽度</label>
              <input type="text" v-model="selectedComponent.style.width" placeholder="例如: 100% 或 200px"
                @change="updateComponentStyle(selectedComponent.id, 'width', selectedComponent.style.width)">
            </div>
            <div class="property-item">
              <label>高度</label>
              <input type="text" v-model="selectedComponent.style.height" placeholder="例如: auto 或 100px"
                @change="updateComponentStyle(selectedComponent.id, 'height', selectedComponent.style.height)">
            </div>
            <div class="property-item">
              <label>背景色</label>
              <div class="color-input">
                <input type="text" v-model="selectedComponent.style.backgroundColor" placeholder="例如: #ffffff"
                  @change="updateComponentStyle(selectedComponent.id, 'backgroundColor', selectedComponent.style.backgroundColor)">
                <input type="color" v-model="selectedComponent.style.backgroundColor"
                  @change="updateComponentStyle(selectedComponent.id, 'backgroundColor', selectedComponent.style.backgroundColor)">
              </div>
            </div>
            <div class="property-item">
              <label>文字颜色</label>
              <div class="color-input">
                <input type="text" v-model="selectedComponent.style.color" placeholder="例如: #333333"
                  @change="updateComponentStyle(selectedComponent.id, 'color', selectedComponent.style.color)">
                <input type="color" v-model="selectedComponent.style.color"
                  @change="updateComponentStyle(selectedComponent.id, 'color', selectedComponent.style.color)">
              </div>
            </div>
            <div class="property-item">
              <label>内边距</label>
              <input type="text" v-model="selectedComponent.style.padding" placeholder="例如: 10px"
                @change="updateComponentStyle(selectedComponent.id, 'padding', selectedComponent.style.padding)">
            </div>
            <div class="property-item">
              <label>外边距</label>
              <input type="text" v-model="selectedComponent.style.margin" placeholder="例如: 10px"
                @change="updateComponentStyle(selectedComponent.id, 'margin', selectedComponent.style.margin)">
            </div>
          </div>
        </div>
        <div v-else class="no-selection">
          <p>请选择一个组件进行编辑</p>
        </div>
      </aside>
    </div>

    <!-- 编辑对话框 -->
    <div class="modal-overlay" v-if="showEditModal" @click="showEditModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>编辑 {{ editingComponent?.name }}</h3>
          <button @click="showEditModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>内容</label>
            <textarea v-model="editingComponent.content" rows="5"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showEditModal = false">取消</button>
          <button @click="saveEdit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import draggable from 'vuedraggable';

// 状态管理
const components = ref([]);
const selectedComponentId = ref('');
const showEditModal = ref(false);
const editingComponent = ref(null);

// 可拖拽元素列表
const elements = ref([
  { id: 'h1', name: '标题1', type: 'h1', icon: 'fas fa-heading', defaultContent: '标题文本' },
  { id: 'h2', name: '标题2', type: 'h2', icon: 'fas fa-heading', defaultContent: '子标题文本' },
  { id: 'p', name: '段落', type: 'p', icon: 'fas fa-paragraph', defaultContent: '这是一段文本内容...' },
  { id: 'btn', name: '按钮', type: 'button', icon: 'fas fa-square', defaultContent: '点击按钮' },
  { id: 'div', name: '容器', type: 'div', icon: 'fas fa-box', defaultContent: '容器内容' }
]);

// 获取选中的组件
const selectedComponent = computed(() => {
  return components.value.find(c => c.id === selectedComponentId.value) || null;
});

// 生成唯一ID
const generateId = () => {
  return 'comp_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
};

// 元素克隆函数（用于拖拽）
const cloneElement = (element) => {
  // 创建新组件并确保ID唯一
  const newComponent = {
    id: generateId(),
    type: element.type,
    name: element.name,
    icon: element.icon,
    content: element.defaultContent,
    style: {
      width: '100%',
      height: 'auto',
      backgroundColor: '#ffffff',
      color: '#333333',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #dddddd',
      borderRadius: '4px'
    }
  };
  
  // 使用nextTick确保DOM更新后再添加组件
  nextTick(() => {
    components.value.push(newComponent);
    handleCanvasChange();
  });
  
  return newComponent;
};

// 画布变化处理
function handleCanvasChange() {
  saveToLocalStorage();
}

// 选择组件
function selectComponent(id) {
  selectedComponentId.value = id;
}

// 更新组件属性
const updateComponentProperty = (id, property, value) => {
  const component = components.value.find(comp => comp.id === id);
  if (component) {
    component[property] = value;
    saveToLocalStorage();
  }
};

// 更新组件样式
const updateComponentStyle = (id, property, value) => {
  const component = components.value.find(comp => comp.id === id);
  if (component) {
    component.style[property] = value;
    saveToLocalStorage();
  }
};

// 删除组件
function deleteComponent(id) {
  if (confirm('确定要删除此组件吗？')) {
    const index = components.value.findIndex(c => c.id === id);
    if (index !== -1) {
      components.value.splice(index, 1);
      if (selectedComponentId.value === id) {
        selectedComponentId.value = components.value.length > 0 ? components.value[0].id : '';
      }
      saveToLocalStorage();
    }
  }
}

// 清空画布
function clearCanvas() {
  if (confirm('确定要清空画布吗？')) {
    components.value = [];
    selectedComponentId.value = '';
    saveToLocalStorage();
  }
}

// 打开编辑对话框
function openEditDialog(id) {
  const comp = components.value.find(c => c.id === id);
  if (comp) {
    // 深拷贝组件数据
    editingComponent.value = JSON.parse(JSON.stringify(comp));
    showEditModal.value = true;
  }
}

// 保存编辑内容
function saveEdit() {
  if (editingComponent.value) {
    const index = components.value.findIndex(c => c.id === editingComponent.value.id);
    if (index !== -1) {
      components.value[index] = { ...editingComponent.value };
      saveToLocalStorage();
    }
    showEditModal.value = false;
  }
}

// 获取组件样式
function getComponentStyle(component) {
  return { ...component.style };
}

// 保存数据到本地存储
const saveToLocalStorage = () => {
  const data = {
    components: [...components.value]
  };
  localStorage.setItem('builderData', JSON.stringify(data));
};

// 初始化 - 从本地存储加载数据
onMounted(() => {
  const savedData = localStorage.getItem('builderData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    components.value = parsedData.components || [];
  }
});
</script>

<style>
/* 基础样式 */
.designer-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.elements-panel, .properties-panel {
  width: 250px;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  padding: 15px;
  overflow-y: auto;
}

.canvas-area {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f0f0f0;
}

.canvas {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  min-height: 500px;
}

/* 元素列表样式 */
.elements-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 15px;
}

.element-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: move;
}

/* 画布组件样式 */
.canvas-component {
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: move;
}

.canvas-component.selected {
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.component-actions button {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  margin-left: 5px;
}

.component-actions button:hover {
  color: #333;
}

.component-content {
  padding: 12px;
}

/* 空画布样式 */
.empty-canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  color: #999;
}

/* 属性面板样式 */
.properties-form {
  margin-top: 15px;
}

.property-group {
  margin-bottom: 20px;
}

.property-group h3 {
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.property-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.property-item label {
  width: 80px;
}

.property-item input,
.property-item textarea,
.property-item select {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
}

.modal {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.modal-body {
  padding: 15px;
}

.modal-footer {
  padding: 10px 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-footer button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.modal-footer button:last-child {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

/* 拖拽过程中的样式提示 */
.dragging {
  opacity: 0.7;
  border-style: dashed;
}

.no-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #999;
}

.color-input {
  display: flex;
  flex: 1;
  gap: 5px;
}

.color-input input:first-child {
  flex: 1;
}

.color-input input:last-child {
  width: 40px;
  padding: 0;
  padding: 0;
  border: none;
}
</style>