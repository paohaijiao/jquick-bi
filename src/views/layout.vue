<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <button class="mobile-menu-toggle" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>
      <div class="logo">
        <i class="fas fa-chart-line"></i>
        <span>JQuick BI</span>
      </div>

      <div class="header-actions">
        <button class="action-btn" @click="loadLayout">
          <i class="fas fa-download"></i>加载
        </button>
        <button class="action-btn" @click="saveLayout">
          <i class="fas fa-save"></i>保存
        </button>
        <button class="action-btn">
          <i class="fas fa-file-import"></i>导入
        </button>
        <button class="action-btn" @click="previewReport">
          <i class="fas fa-eye"></i>预览
        </button>
        <button class="action-btn" @click="openModal('HTML编辑器')">
          <i class="fas fa-code"></i>编辑器
        </button>

        <div class="user-profile">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <span class="username">管理员</span>
        </div>
      </div>
    </header>

    <div class="main-content">
      <!-- 左侧组件面板 -->
      <aside class="sidebar" :class="{ collapsed: !sidebarActive }">
        <div class="sidebar-title">HTML元素</div>
        <div class="component-list">
          <div class="menu-item" v-draggable="draggableOptions('div')">
            <i class="fas fa-square"></i>
            <span>Div 容器</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('header')">
            <i class="fas fa-heading"></i>
            <span>标题</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('paragraph')">
            <i class="fas fa-paragraph"></i>
            <span>段落</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('table')">
            <i class="fas fa-table"></i>
            <span>表格</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('chart')">
            <i class="fas fa-chart-bar"></i>
            <span>图表</span>
          </div>
        </div>
      </aside>

      <!-- 中间工作区 -->
      <div class="workspace">
        <div class="workspace-header">
          <div class="workspace-info">
            <h1 class="workspace-title">报表布局设计</h1>
            <p class="workspace-description">设计行列布局，拖放元素到单元格中，使用右侧面板编辑属性</p>
          </div>

          <div class="workspace-controls">
            <div class="storage-option">
              <label>
                <input type="radio" v-model="storageType" value="local" checked> 本地存储
              </label>
              <label>
                <input type="radio" v-model="storageType" value="server"> 服务器存储
              </label>
            </div>
            <button class="control-btn primary" @click="addRow">
              <i class="fas fa-plus"></i>添加行
            </button>
            <button class="control-btn primary" @click="addColumnToSelectedRow" :disabled="!selectedRowId">
              <i class="fas fa-columns"></i>添加列
            </button>
            <button class="control-btn danger" @click="clearLayout">
              <i class="fas fa-trash"></i>清空布局
            </button>
          </div>
        </div>

        <!-- 布局设计画布 -->
        <div class="canvas-wrapper">
          <div class="canvas-container" id="canvas">
            <div class="layout-grid">
              <!-- 行 -->
              <div
                  class="layout-row"
                  v-for="(row, rowIndex) in layout.rows"
                  :key="row.id"
                  :class="{ 'selected': selectedRowId === row.id }"
                  :style="{ height: row.height + 'px', backgroundColor: row.bgColor, border: row.border }"
                  @click="selectRow(row.id)"
              >
                <div class="row-handle">
                  <button class="row-action delete" @click.stop="removeRow(rowIndex)">
                    <i class="fas fa-times"></i>
                  </button>
                  <div class="row-property">
                    <input
                        type="number"
                        v-model="row.height"
                        @change="updateRowHeight(rowIndex, row.height)"
                        placeholder="高"
                        min="50"
                    >
                  </div>
                </div>

                <!-- 列 -->
                <div class="row-columns">
                  <div
                      class="layout-column"
                      v-for="(column, colIndex) in row.columns"
                      :key="column.id"
                      :style="{
                      width: column.width + '%',
                      backgroundColor: column.bgColor,
                      border: column.border
                    }"
                      :class="{ 'selected': selectedColumnId === column.id }"
                      @click.stop="selectColumn(column.id, rowIndex)"
                      @dragover.prevent="handleColumnDragOver(rowIndex, colIndex)"
                      @drop="handleColumnDrop(rowIndex, colIndex, $event)"
                  >
                    <div class="column-handle">
                      <button class="column-action delete" @click.stop="removeColumn(rowIndex, colIndex)">
                        <i class="fas fa-times"></i>
                      </button>
                      <div class="column-property">
                        <input
                            type="number"
                            v-model="column.width"
                            @change="updateColumnWidth(rowIndex, colIndex, column.width)"
                            placeholder="宽(%)"
                            min="5"
                            max="90"
                        >
                      </div>
                    </div>

                    <!-- 单元格内容 -->
                    <div class="column-content">
                      <div
                          class="canvas-component"
                          v-for="component in column.components"
                          :key="component.id"
                          :style="getComponentStyle(component)"
                          @click.stop="selectComponent(component.id)"
                      >
                        <div class="component-header">
                          <div class="component-info">
                            <i :class="component.icon"></i>
                            <span>{{ component.name }}</span>
                          </div>
                          <button class="component-action delete" @click.stop="removeComponentFromCell(rowIndex, colIndex, component.id)">
                            <i class="fas fa-trash-alt"></i>
                          </button>
                        </div>
                        <div class="component-body" v-html="component.content"></div>
                      </div>

                      <!-- 空单元格提示 -->
                      <div class="empty-cell-hint" v-if="column.components.length === 0">
                        <i class="fas fa-arrow-down"></i>
                        <p>拖放元素到此处</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 空布局提示 -->
              <div class="empty-layout-hint" v-if="layout.rows.length === 0">
                <i class="fas fa-table"></i>
                <p>点击"添加行"开始设计布局</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="properties-panel" :class="{ collapsed: !propertiesPanelActive }">
        <div class="panel-header">
          <h3 class="panel-title">属性设置</h3>
          <button class="panel-toggle" @click="togglePropertiesPanel">
            <i class="fas" :class="propertiesPanelActive ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
          </button>
        </div>

        <div class="panel-content">
          <div class="panel-tabs">
            <button class="tab-btn" :class="{ active: activeTab === 'layout' }" @click="activeTab = 'layout'">
              <i class="fas fa-th"></i>布局
            </button>
            <button class="tab-btn" :class="{ active: activeTab === 'element' }" @click="activeTab = 'element'">
              <i class="fas fa-tag"></i>元素
            </button>
            <button class="tab-btn" :class="{ active: activeTab === 'style' }" @click="activeTab = 'style'">
              <i class="fas fa-paint-brush"></i>样式
            </button>
          </div>

          <div class="tab-content">
            <!-- 布局设置面板 -->
            <div v-if="activeTab === 'layout'">
              <div class="setting-group" v-if="selectedRow">
                <h4 class="setting-title">行设置</h4>
                <div class="setting-item">
                  <label>行高度 (px)</label>
                  <input
                      type="number"
                      class="form-control"
                      v-model="selectedRow.height"
                      @change="updateRowHeight(selectedRowIndex, selectedRow.height)"
                      min="50"
                  >
                </div>
                <div class="setting-item">
                  <label>背景色</label>
                  <input
                      type="text"
                      class="form-control"
                      v-model="selectedRow.bgColor"
                      @change="updateRowStyle(selectedRowIndex)"
                      placeholder="#ffffff"
                  >
                </div>
                <div class="setting-item">
                  <label>边框</label>
                  <input
                      type="text"
                      class="form-control"
                      v-model="selectedRow.border"
                      @change="updateRowStyle(selectedRowIndex)"
                      placeholder="1px solid #ccc"
                  >
                </div>
              </div>

              <div class="setting-group" v-if="selectedColumn">
                <h4 class="setting-title">列设置</h4>
                <div class="setting-item">
                  <label>列宽度 (%)</label>
                  <input
                      type="number"
                      class="form-control"
                      v-model="selectedColumn.width"
                      @change="updateColumnWidth(selectedRowIndex, selectedColumnIndex, selectedColumn.width)"
                      min="5"
                      max="90"
                  >
                </div>
                <div class="setting-item">
                  <label>背景色</label>
                  <input
                      type="text"
                      class="form-control"
                      v-model="selectedColumn.bgColor"
                      @change="updateColumnStyle(selectedRowIndex, selectedColumnIndex)"
                      placeholder="#ffffff"
                  >
                </div>
                <div class="setting-item">
                  <label>边框</label>
                  <input
                      type="text"
                      class="form-control"
                      v-model="selectedColumn.border"
                      @change="updateColumnStyle(selectedRowIndex, selectedColumnIndex)"
                      placeholder="1px solid #ccc"
                  >
                </div>
              </div>
            </div>

            <!-- 元素设置面板 -->
            <div v-if="activeTab === 'element' && selectedComponent">
              <div class="setting-group">
                <h4 class="setting-title">元素属性</h4>
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
              </div>
            </div>

            <!-- 样式设置面板 -->
            <div v-if="activeTab === 'style' && selectedComponent">
              <div class="setting-group">
                <h4 class="setting-title">样式设置</h4>
                <div class="setting-item">
                  <label>字体大小</label>
                  <input type="text" class="form-control" v-model="selectedComponent.style.fontSize" placeholder="14px">
                </div>
                <div class="setting-item">
                  <label>颜色</label>
                  <input type="text" class="form-control" v-model="selectedComponent.style.color" placeholder="#333333">
                </div>
                <div class="setting-item">
                  <label>背景色</label>
                  <input type="text" class="form-control" v-model="selectedComponent.style.backgroundColor" placeholder="#ffffff">
                </div>
                <div class="setting-item">
                  <label>内边距</label>
                  <input type="text" class="form-control" v-model="selectedComponent.style.padding" placeholder="10px">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模态框 -->
    <div class="modal-overlay" :class="{ active: activeModal === 'HTML编辑器' }" @click="closeModal">
      <div class="modal-dialog" @click.stop>
        <div class="modal-header">
          <h3>HTML编辑器</h3>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <textarea class="html-editor" rows="15" placeholder="在此输入HTML代码..."></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn cancel" @click="closeModal">取消</button>
          <button class="btn confirm">应用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';

// 拖拽指令
const draggable = {
  mounted(el, binding) {
    el.draggable = true;
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(binding.value));
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
    });
  }
};

// 模拟后端接口
const mockApi = {
  // 保存布局
  saveLayout: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 实际项目中这里会调用真实接口
        console.log('后端保存布局数据:', data);
        resolve({ success: true, message: '保存成功' });
      }, 500);
    });
  },

  // 获取布局
  getLayout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 实际项目中这里会调用真实接口获取数据
        const saved = localStorage.getItem('serverLayout');
        resolve({
          success: true,
          data: saved ? JSON.parse(saved) : null
        });
      }, 500);
    });
  }
};

export default defineComponent({
  directives: {
    draggable
  },
  setup() {
    // 状态管理
    const sidebarActive = ref(true);
    const propertiesPanelActive = ref(true);
    const activeTab = ref('layout');
    const activeModal = ref('');
    const selectedRowId = ref('');
    const selectedColumnId = ref('');
    const selectedComponentId = ref('');
    const selectedRowIndex = ref(-1);
    const selectedColumnIndex = ref(-1);
    const storageType = ref('local'); // 存储方式：local-本地存储，server-服务器存储

    // 布局数据结构
    const layout = ref({
      rows: []
    });

    // 初始化布局
    const initLayout = () => {
      // 优先从存储加载
      loadLayout().then(() => {
        // 如果没有加载到数据，使用默认布局
        if (layout.value.rows.length === 0) {
          layout.value = {
            rows: [
              {
                id: `row_${Date.now()}`,
                height: 120,
                bgColor: '',
                border: '1px solid #eee',
                columns: [
                  {
                    id: `col_${Date.now()}`,
                    width: 100,
                    bgColor: '',
                    border: '1px solid #eee',
                    components: []
                  }
                ]
              }
            ]
          };
        }
      });
    };

    // 保存布局
    const saveLayout = async () => {
      try {
        if (storageType.value === 'local') {
          // 本地存储
          localStorage.setItem('reportLayout', JSON.stringify(layout.value));
          alert('本地存储保存成功！');
        } else {
          // 服务器存储（模拟）
          const response = await mockApi.saveLayout(layout.value);
          if (response.success) {
            // 模拟服务器存储，实际项目中不需要这行
            localStorage.setItem('serverLayout', JSON.stringify(layout.value));
            alert('服务器保存成功！');
          } else {
            alert('保存失败：' + response.message);
          }
        }
      } catch (error) {
        console.error('保存失败：', error);
        alert('保存失败，请重试');
      }
    };

    // 加载布局
    const loadLayout = async () => {
      try {
        let loadedData = null;
        if (storageType.value === 'local') {
          // 从本地存储加载
          const saved = localStorage.getItem('reportLayout');
          loadedData = saved ? JSON.parse(saved) : null;
        } else {
          // 从服务器加载（模拟）
          const response = await mockApi.getLayout();
          if (response.success) {
            loadedData = response.data;
          }
        }

        if (loadedData && loadedData.rows) {
          layout.value = loadedData;
          resetSelection();
          alert('布局加载成功！');
          return true;
        } else {
          alert('没有找到保存的布局数据');
          return false;
        }
      } catch (error) {
        console.error('加载失败：', error);
        alert('加载失败，请重试');
        return false;
      }
    };

    // 行操作
    const addRow = () => {
      const newRow = {
        id: `row_${Date.now()}`,
        height: 120,
        bgColor: '',
        border: '1px solid #eee',
        columns: [
          {
            id: `col_${Date.now()}_1`,
            width: 100,
            bgColor: '',
            border: '1px solid #eee',
            components: []
          }
        ]
      };
      layout.value.rows.push(newRow);
      selectRow(newRow.id);
    };

    const removeRow = (index) => {
      if (confirm('确定要删除这一行吗？')) {
        layout.value.rows.splice(index, 1);
        resetSelection();
      }
    };

    const selectRow = (rowId) => {
      const index = layout.value.rows.findIndex(row => row.id === rowId);
      if (index !== -1) {
        selectedRowId.value = rowId;
        selectedRowIndex.value = index;
        selectedColumnId.value = '';
        selectedColumnIndex.value = -1;
        selectedComponentId.value = '';
      }
    };

    const updateRowHeight = (rowIndex, height) => {
      if (layout.value.rows[rowIndex]) {
        layout.value.rows[rowIndex].height = Math.max(50, parseInt(height) || 120);
      }
    };

    const updateRowStyle = (rowIndex) => {
      layout.value.rows = [...layout.value.rows];
    };

    // 列操作
    const addColumnToSelectedRow = () => {
      if (selectedRowIndex.value === -1) return;

      const row = layout.value.rows[selectedRowIndex.value];
      const columnCount = row.columns.length;
      const newWidth = 100 / (columnCount + 1);

      // 调整现有列宽度
      row.columns.forEach(col => {
        col.width = newWidth;
      });

      // 添加新列
      const newColumn = {
        id: `col_${Date.now()}_${columnCount + 1}`,
        width: newWidth,
        bgColor: '',
        border: '1px solid #eee',
        components: []
      };

      row.columns.push(newColumn);
      selectColumn(newColumn.id, selectedRowIndex.value);
    };

    const removeColumn = (rowIndex, colIndex) => {
      if (confirm('确定要删除这一列吗？')) {
        const row = layout.value.rows[rowIndex];
        row.columns.splice(colIndex, 1);

        // 重新分配宽度
        const columnCount = row.columns.length;
        if (columnCount > 0) {
          const newWidth = 100 / columnCount;
          row.columns.forEach(col => {
            col.width = newWidth;
          });
        }

        resetSelection();
      }
    };

    const selectColumn = (columnId, rowIndex) => {
      const row = layout.value.rows[rowIndex];
      const colIndex = row.columns.findIndex(col => col.id === columnId);

      if (colIndex !== -1) {
        selectedRowId.value = row.id;
        selectedRowIndex.value = rowIndex;
        selectedColumnId.value = columnId;
        selectedColumnIndex.value = colIndex;
        selectedComponentId.value = '';
      }
    };

    const updateColumnWidth = (rowIndex, colIndex, width) => {
      if (!layout.value.rows[rowIndex] || !layout.value.rows[rowIndex].columns[colIndex]) return;

      const row = layout.value.rows[rowIndex];
      const newWidth = Math.min(90, Math.max(5, parseInt(width) || 0));
      const oldWidth = row.columns[colIndex].width;
      const widthDiff = newWidth - oldWidth;

      // 更新当前列宽度
      row.columns[colIndex].width = newWidth;

      // 重新分配剩余宽度
      const totalColumns = row.columns.length;
      if (totalColumns > 1 && widthDiff !== 0) {
        const remainingWidth = -widthDiff;
        const distributePerColumn = remainingWidth / (totalColumns - 1);

        row.columns.forEach((col, idx) => {
          if (idx !== colIndex) {
            col.width = Math.max(5, Math.min(90, col.width + distributePerColumn));
          }
        });
      }
    };

    const updateColumnStyle = (rowIndex, colIndex) => {
      layout.value.rows[rowIndex].columns = [...layout.value.rows[rowIndex].columns];
    };

    // 组件操作
    const draggableOptions = (type) => {
      const icons = {
        div: 'fas fa-square',
        header: 'fas fa-heading',
        paragraph: 'fas fa-paragraph',
        table: 'fas fa-table',
        chart: 'fas fa-chart-bar'
      };

      const contentMap = {
        div: '容器',
        header: '<h3>标题</h3>',
        paragraph: '<p>这是一段文本内容</p>',
        table: '<table><tr><th>表头1</th><th>表头2</th></tr><tr><td>数据1</td><td>数据2</td></tr></table>',
        chart: '<div style="height:80px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;">图表</div>'
      };

      return {
        type,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
        icon: icons[type] || 'fas fa-cube',
        content: contentMap[type] || type
      };
    };

    const handleColumnDragOver = (rowIndex, colIndex) => {
      const column = document.querySelector(`.layout-row:nth-child(${rowIndex + 1}) .layout-column:nth-child(${colIndex + 1})`);
      if (column) {
        column.classList.add('dragover');
        setTimeout(() => column.classList.remove('dragover'), 200);
      }
    };

    const handleColumnDrop = (rowIndex, colIndex, e) => {
      e.preventDefault();
      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const newComponent = {
          id: `${data.type}_${Math.floor(Math.random() * 10000)}`,
          name: data.name,
          icon: data.icon,
          content: data.content,
          style: {
            fontSize: '14px',
            color: '#333',
            backgroundColor: '',
            padding: '10px',
            width: '100%'
          }
        };

        layout.value.rows[rowIndex].columns[colIndex].components.push(newComponent);
        selectComponent(newComponent.id);
      } catch (error) {
        console.error('解析拖拽数据失败:', error);
      }
    };

    const removeComponentFromCell = (rowIndex, colIndex, componentId) => {
      if (confirm('确定要删除这个元素吗？')) {
        const column = layout.value.rows[rowIndex].columns[colIndex];
        column.components = column.components.filter(c => c.id !== componentId);

        if (selectedComponentId.value === componentId) {
          selectedComponentId.value = '';
        }
      }
    };

    const selectComponent = (componentId) => {
      selectedComponentId.value = componentId;
    };

    // 辅助方法
    const resetSelection = () => {
      selectedRowId.value = '';
      selectedRowIndex.value = -1;
      selectedColumnId.value = '';
      selectedColumnIndex.value = -1;
      selectedComponentId.value = '';
    };

    // 计算属性 - 获取选中的行、列、组件
    const selectedRow = computed(() => {
      return layout.value.rows.find(row => row.id === selectedRowId.value) || null;
    });

    const selectedColumn = computed(() => {
      if (selectedRow.value) {
        return selectedRow.value.columns.find(col => col.id === selectedColumnId.value) || null;
      }
      return null;
    });

    const selectedComponent = computed(() => {
      if (selectedRow.value && selectedColumn.value) {
        return selectedColumn.value.components.find(c => c.id === selectedComponentId.value) || null;
      }
      return null;
    });

    const getComponentStyle = (component) => {
      return {
        fontSize: component.style.fontSize,
        color: component.style.color,
        backgroundColor: component.style.backgroundColor,
        padding: component.style.padding,
        width: component.style.width
      };
    };

    // 其他方法
    const toggleSidebar = () => {
      sidebarActive.value = !sidebarActive.value;
    };

    const togglePropertiesPanel = () => {
      propertiesPanelActive.value = !propertiesPanelActive.value;
    };

    const clearLayout = () => {
      if (confirm('确定要清空当前布局吗？此操作不可恢复！')) {
        layout.value.rows = [];
        resetSelection();
      }
    };

    const openModal = (type) => {
      activeModal.value = type;
    };
    const closeModal = () => {
      activeModal.value = '';
    };

    const previewReport = () => {
      // 预览报表逻辑
      alert('报表预览功能即将上线');
    };

    // 页面挂载时初始化布局
    onMounted(() => {
      initLayout();
    });

    return {
      sidebarActive,
      propertiesPanelActive,
      activeTab,
      activeModal,
      layout,
      selectedRowId,
      selectedColumnId,
      selectedComponentId,
      selectedRowIndex,
      selectedColumnIndex,
      selectedRow,
      selectedColumn,
      selectedComponent,
      storageType,

      // 方法
      addRow,
      removeRow,
      selectRow,
      updateRowHeight,
      updateRowStyle,
      addColumnToSelectedRow,
      removeColumn,
      selectColumn,
      updateColumnWidth,
      updateColumnStyle,
      draggableOptions,
      handleColumnDragOver,
      handleColumnDrop,
      removeComponentFromCell,
      selectComponent,
      getComponentStyle,
      toggleSidebar,
      togglePropertiesPanel,
      clearLayout,
      openModal,
      closeModal,
      previewReport,
      saveLayout,
      loadLayout
    };
  }
});
</script>

<style>
/* 全局样式重置与基础设置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  color: #333;
  background-color: #f5f5f5;
  overflow: hidden;
  height: 100vh;
}

button {
  cursor: pointer;
  outline: none;
}

input, textarea {
  outline: none;
}

/* 主题颜色变量 - 与builder.vue保持一致 */
:root {
  --primary-color: #ff8326; /* 主色调：橙色 */
  --primary-dark: #e07010;  /* 主色调深色 */
  --primary-light: #fff0e0; /* 主色调浅色 */
  --danger-color: #ff4d4f;  /* 危险色 */
  --danger-light: #fff2f0;  /* 危险色浅色 */
  --text-primary: #333333;  /* 主要文本色 */
  --text-secondary: #666666; /* 次要文本色 */
  --text-tertiary: #999999; /* 第三文本色 */
  --border-color: #e0e0e0;  /* 边框色 */
  --bg-color: #f5f5f5;      /* 背景色 */
  --card-bg: #ffffff;       /* 卡片背景色 */
}

/* 容器样式 */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 顶部导航栏 - 与builder.vue风格一致 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--primary-color);
  color: white;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
}

.logo i {
  font-size: 22px;
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 18px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.action-btn {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: white;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  font-size: 14px;
}

/* 主内容区 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧组件面板 - 与builder.vue风格一致 */
.sidebar {
  width: 220px;
  background-color: var(--card-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 0;
}

.sidebar-title {
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  background-color: #f9f9f9;
}

.component-list {
  padding: 10px 0;
  overflow-y: auto;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  cursor: move;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.menu-item i {
  color: var(--primary-color);
  width: 20px;
  text-align: center;
}

/* 中间工作区 */
.workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
  background-color: var(--bg-color);
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.workspace-info .workspace-title {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.workspace-info .workspace-description {
  color: var(--text-secondary);
  font-size: 14px;
}

.workspace-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.storage-option {
  display: flex;
  gap: 10px;
  padding: 0 10px;
  color: var(--text-secondary);
}

.control-btn {
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

/* 主按钮样式 - 与builder.vue一致的橙色 */
.control-btn.primary {
  background-color: var(--primary-color);
  color: white;
}

.control-btn.primary:hover {
  background-color: var(--primary-dark);
}

.control-btn.danger {
  background-color: var(--danger-color);
  color: white;
}

.control-btn.danger:hover {
  background-color: #e04343;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f5f5;
  color: var(--text-tertiary);
}

.canvas-wrapper {
  flex: 1;
  overflow-y: auto;
  background-color: var(--card-bg);
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.canvas-container {
  max-width: 1200px;
  margin: 0 auto;
}

.layout-grid {
  width: 100%;
  border: 1px dashed #ccc;
  border-radius: 6px;
  overflow: hidden;
}

/* 行样式 */
.layout-row {
  width: 100%;
  display: flex;
  border-bottom: 1px dashed #ccc;
  transition: background-color 0.2s;
}

.layout-row:last-child {
  border-bottom: none;
}

.layout-row.selected {
  background-color: var(--primary-light);
}

.row-handle {
  width: 60px;
  border-right: 1px dashed #ccc;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 5px;
  gap: 8px;
}

.row-action {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.row-action.delete {
  color: var(--danger-color);
}

.row-action.delete:hover {
  background-color: var(--danger-light);
}

.row-property input {
  width: 40px;
  padding: 4px;
  font-size: 12px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.row-columns {
  flex: 1;
  display: flex;
  height: 100%;
}

/* 列样式 */
.layout-column {
  min-height: 100px;
  border-right: 1px dashed #ccc;
  transition: all 0.2s;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.layout-column:last-child {
  border-right: none;
}

.layout-column.selected {
  background-color: var(--primary-light);
  outline: 2px solid var(--primary-color);
  z-index: 2;
}

.layout-column.dragover {
  background-color: rgba(46, 204, 113, 0.08);
}

.column-handle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-bottom: 1px dashed #ccc;
  background-color: #f9f9f9;
}

.column-action {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.column-action.delete {
  color: var(--danger-color);
}

.column-action.delete:hover {
  background-color: var(--danger-light);
}

.column-property input {
  width: 50px;
  padding: 4px;
  font-size: 12px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.column-content {
  flex: 1;
  padding: 15px;
  min-height: 80px;
  overflow: auto;
}

/* 组件样式 */
.canvas-component {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 10px;
  overflow: hidden;
  transition: all 0.2s;
}

.canvas-component:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background-color: #f9f9f9;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
}

.component-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.component-info i {
  color: var(--primary-color);
  font-size: 14px;
}

.component-action {
  background: none;
  border: none;
  color: var(--text-tertiary);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.component-action.delete:hover {
  color: var(--danger-color);
  background-color: var(--danger-light);
}

.component-body {
  padding: 10px;
}

/* 空状态提示 */
.empty-cell-hint {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  font-size: 12px;
  padding: 20px;
  text-align: center;
  border: 1px dashed #ddd;
  border-radius: 4px;
  background-color: #fafafa;
}

.empty-cell-hint i {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.5;
  color: var(--primary-color);
}

.empty-layout-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
  text-align: center;
}

.empty-layout-hint i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
  color: var(--primary-color);
}

/* 右侧属性面板 - 与builder.vue风格一致 */
.properties-panel {
  width: 300px;
  background-color: var(--card-bg);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  overflow: hidden;
}

.properties-panel.collapsed {
  width: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  background-color: #f9f9f9;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.panel-toggle {
  background: none;
  border: none;
  color: var(--text-tertiary);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.panel-toggle:hover {
  background-color: #f5f5f5;
  color: var(--primary-color);
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-btn:hover {
  background-color: #f5f5f5;
  color: var(--primary-color);
}

.tab-content {
  padding: 20px;
}

.setting-group {
  margin-bottom: 25px;
}

.setting-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.setting-item {
  margin-bottom: 15px;
}

.setting-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  color: var(--text-secondary);
}

.form-control {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.1);
}

textarea.form-control {
  resize: vertical;
}

/* 模态框样式 - 与builder.vue风格一致 */
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

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

.modal-dialog {
  background-color: var(--card-bg);
  border-radius: 6px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-20px);
  transition: transform 0.3s;
}

.modal-overlay.active .modal-dialog {
  transform: translateY(0);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  background-color: #f9f9f9;
}

.modal-header h3 {
  font-size: 18px;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--text-tertiary);
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f5f5f5;
  color: var(--primary-color);
}

.modal-body {
  padding: 20px;
}

.html-editor {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  font-family: monospace;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
}

.btn.cancel {
  background-color: white;
  border: 1px solid #ddd;
  color: var(--text-secondary);
}

.btn.cancel:hover {
  background-color: #f5f5f5;
}

.btn.confirm {
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  color: white;
}

.btn.confirm:hover {
  background-color: var(--primary-dark);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .sidebar {
    width: 200px;
  }

  .properties-panel {
    width: 260px;
  }
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  .sidebar {
    position: absolute;
    height: calc(100% - 60px);
    z-index: 100;
  }

  .properties-panel {
    position: absolute;
    right: 0;
    height: calc(100% - 60px);
    z-index: 100;
  }

  .workspace {
    padding: 10px;
  }

  .workspace-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .workspace-controls {
    width: 100%;
    flex-wrap: wrap;
  }

  .row-handle {
    width: 50px;
  }
}

@media (max-width: 576px) {
  .header-actions {
    gap: 5px;
  }

  .action-btn span {
    display: none;
  }

  .action-btn {
    padding: 6px;
  }

  .tab-btn span {
    display: none;
  }

  .tab-btn {
    padding: 12px 5px;
  }
}
</style>