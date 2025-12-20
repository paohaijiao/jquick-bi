<template>
  <div class="container">
    <header class="header">
      <button class="mobile-menu-toggle" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>
      <div class="logo">
        <i class="fas fa-chart-line"></i>
        <span>JQuick BI</span>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <el-icon><Search /></el-icon>
          <input placeholder="搜索报表、数据源或文档..." type="text">
        </div>
        <div class="action-buttons">
          <button class="action-btn" @click="exportHtml">
            <i class="fas fa-code"></i>导出HTML
          </button>
          <button class="action-btn" @click="previewHtml">
            <i class="fas fa-eye"></i>预览
          </button>
          <button class="action-btn" @click="openHtmlEditor">
            <i class="fas fa-code"></i>编辑器
          </button>
          <button class="action-btn" @click="saveLayout">
            <i class="fas fa-save"></i>保存
          </button>
          <button class="action-btn" @click="loadLayout">
            <i class="fas fa-folder-open"></i>加载
          </button>
        </div>
        <div class="header-secondary-actions">
          <div class="notification-icon">
            <i class="far fa-bell"></i>
            <span class="notification-badge">3</span>
          </div>
          <button class="action-btn compact" @click="toggleGridLayout">
            <i :class="useGridLayout ? 'fas fa-th' : 'fas fa-th-large'"
               :title="useGridLayout ? '网格布局' : '自由布局'"></i>
          </button>
          <button class="action-btn compact" @click="toggleGridLines">
            <i :class="showGridLines ? 'fas fa-eye-slash' : 'fas fa-eye'"
               :title="showGridLines ? '隐藏网格' : '显示网格'"></i>
          </button>
          <div class="user-info">
            <div class="user-avatar">ZL</div>
            <span class="user-name">张磊</span>
            <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
          </div>
        </div>
      </div>
    </header>

    <div class="main-content">
      <aside class="sidebar" :class="{ active: sidebarActive }">
        <div class="menu-section">
          <div class="menu-section-title text-align-left">布局元素</div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'grid')">
            <i class="fas fa-th"></i>
            <span>网格容器 (Grid)</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">容器元素</div>
          <div v-for="item in containerElements" :key="item.type" class="menu-item" draggable="true" @dragstart="handleDomTypeDragStart($event, item.type)">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">文本元素</div>
          <div v-for="item in textElements" :key="item.type" class="menu-item" draggable="true" @dragstart="handleDomTypeDragStart($event, item.type)">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">表单元素</div>
          <div v-for="item in formElements" :key="item.type" class="menu-item" draggable="true" @dragstart="handleDomTypeDragStart($event, item.type)">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">多媒体元素</div>
          <div v-for="item in mediaElements" :key="item.type" class="menu-item" draggable="true" @dragstart="handleDomTypeDragStart($event, item.type)">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">预设布局</div>
          <div class="layout-presets">
            <div class="layout-preset" @click="applyLayoutPreset('header-sidebar-main')">
              <div class="preset-preview">
                <div class="preset-header"></div>
                <div class="preset-sidebar"></div>
                <div class="preset-main"></div>
              </div>
              <span>头部+侧边栏</span>
            </div>
            <div class="layout-preset" @click="applyLayoutPreset('three-column')">
              <div class="preset-preview">
                <div class="preset-col" style="width:25%"></div>
                <div class="preset-col" style="width:50%"></div>
                <div class="preset-col" style="width:25%"></div>
              </div>
              <span>三栏布局</span>
            </div>
            <div class="layout-preset" @click="applyLayoutPreset('dashboard')">
              <div class="preset-preview">
                <div class="preset-row">
                  <div class="preset-widget" style="width:33%"></div>
                  <div class="preset-widget" style="width:33%"></div>
                  <div class="preset-widget" style="width:33%"></div>
                </div>
                <div class="preset-row">
                  <div class="preset-widget" style="width:50%"></div>
                  <div class="preset-widget" style="width:50%"></div>
                </div>
              </div>
              <span>仪表盘</span>
            </div>
          </div>
        </div>
      </aside>

      <div class="workspace">
        <div class="page-header">
          <div>
            <h1 class="page-title text-align-left">报表设计器</h1>
            <p class="page-description">拖放元素到画布中创建页面，支持响应式布局</p>
          </div>
          <div class="layout-controls">
            <select v-model="currentBreakpoint" class="breakpoint-select">
              <option value="desktop">桌面 (大于等于1200px)</option>
              <option value="tablet">平板 (768px-1199px)</option>
              <option value="mobile">手机 (小于768px)</option>
            </select>
            <button class="action-btn" @click="showGridLines = !showGridLines">
              <i :class="showGridLines ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              {{ showGridLines ? '隐藏网格' : '显示网格' }}
            </button>
            <button class="btn btn-outline" @click="resetLayout">
              <i class="fas fa-redo"></i>
              重置布局
            </button>
          </div>
        </div>

        <div class="canvas-container" id="canvas" @dragover.prevent="handleDragOver" @drop="handleDrop" @dragleave="handleDragLeave">
          <div :class="{ 'grid-layout': useGridLayout,  'dragover': isDraggingOver,   'show-grid': showGridLines }"
               class="canvas-drag-area">
            <!-- 网格容器列表 -->
            <div v-for="container in layoutContainers" :key="container.id"
                 class="container-content">
              <div :class="{ 'selected': selectedComponentId === container.id }"
                   :style="getGridContainerStyle(container)"
                   class="layout-container grid-container"
                   @click="selectComponent(container.id)">
                <div :style="getGridTemplateStyle(container)" class="grid-cells">
                  <div v-for="cell in container.config.cells"
                       :key="cell.id"
                       :class="{
                         'selected': selectedComponentId === cell.id,
                         'merged': cell.merged,
                         'span-col': cell.colSpan > 1,
                         'span-row': cell.rowSpan > 1
                       }"
                       :style="getGridCellStyle(cell, container)"
                       class="grid-cell"
                       @dragleave="handleGridCellDragLeave($event, cell.id)"
                       @drop="handleGridCellDrop($event, cell.id)"
                       @click.stop="selectComponent(cell.id)"
                       @dragover.prevent="handleGridCellDragOver($event, cell.id)"
                       @dblclick.stop="handleGridCellDoubleClick(container.id, cell)">
                    <div v-if="!cell.merged" class="cell-content">
                      <div v-for="component in getComponentsInGridCell(cell.id)"
                           :key="component.id"
                           :class="{
                             'selected': selectedComponentId === component.id,
                             'inline-component': component.config.inline
                           }"
                           :style="getComponentStyle(component)"
                           class="canvas-component"
                           @click.stop="selectComponent(component.id)">
                        <div class="component-content" v-html="renderComponentContent(component)"></div>
                      </div>

                      <div v-if="getComponentsInGridCell(cell.id).length === 0 && !cell.merged"
                           class="empty-cell-hint"
                           @dragleave="handleGridCellDragLeave($event, cell.id)"
                           @drop="handleGridCellDrop($event, cell.id)"
                           @dragover.prevent="handleGridCellDragOver($event, cell.id)">
                        <i class="fas fa-plus-circle"></i>
                        <p>拖放组件到此单元格</p>
                      </div>
                    </div>
                    <div v-else class="cell-content">
                      <div class="merged-cell-indicator">
                        <i class="fas fa-compress"></i>
                        <span>已合并单元格</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-for="component in components.filter(c => !c.containerId && !c.gridCellId)"
                 :key="component.id"
                 :class="{
                   'selected': selectedComponentId === component.id,
                   'inline-component': component.config.inline
                 }"
                 :style="getComponentStyle(component)"
                 class="canvas-component"
                 @click="selectComponent(component.id)">
              <div class="component-header">
                <div class="component-info">
                  <i :class="component.icon"></i>
                  <span>{{ component.name }}</span>
                </div>
                <div class="component-actions">
                  <button class="operation-btn" title="删除组件" @click.stop="deleteComponent(component.id)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
              <div class="component-content" v-html="renderComponentContent(component)"></div>
            </div>

            <div v-if="layoutContainers.length === 0 && components.length === 0" class="empty-canvas-hint">
              <i class="fas fa-magic"></i>
              <h3>开始创建您的报表</h3>
              <p>从左侧拖拽网格容器到此处，或选择预设布局开始</p>
              <button class="btn btn-primary" @click="applyLayoutPreset('dashboard')">
                使用仪表盘模板
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="properties-panel active" :class="{ active: propertiesPanelActive }">
        <div class="panel-header">
          <div class="panel-title">
            <i class="fas fa-sliders-h"></i>
            <span>属性设置</span>
          </div>
          <button v-if="selectedComponent" class="panel-close" @click="deselectComponent">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="panel-tabs">
          <div class="tab-item" :class="{ active: activeTab === 'layout' }" @click="activeTab = 'layout'">
            <i class="fas fa-th"></i>布局
          </div>
          <div class="tab-item" :class="{ active: activeTab === 'style' }" @click="activeTab = 'style'">
            <i class="fas fa-paint-brush"></i>样式
          </div>
          <div class="tab-item" :class="{ active: activeTab === 'content' }" @click="activeTab = 'content'">
            <i class="fas fa-edit"></i>内容
          </div>
          <div class="tab-item" :class="{ active: activeTab === 'advanced' }" @click="activeTab = 'advanced'">
            <i class="fas fa-cog"></i>高级
          </div>
        </div>

        <div v-if="selectedComponent" class="panel-content">
        </div>

        <div v-else class="no-selection">
          <i class="fas fa-mouse-pointer"></i>
          <p>点击画布中的元素进行编辑</p>
        </div>
      </div>
    </div>

    <div class="modal-overlay" :class="{ active: activeModal === 'HTML编辑器' }" @click="closeModal">
      <div class="modal large-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">HTML 编辑器</div>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="editor-container">
            <div class="editor-toolbar">
              <button class="btn btn-primary" @click="parseHtml">
                <i class="fas fa-play"></i> 解析
              </button>
              <button class="btn btn-outline" @click="importHtml">
                <i class="fas fa-file-import"></i> 导入
              </button>
              <button class="btn btn-outline" @click="clearHtml">
                <i class="fas fa-trash"></i> 清空
              </button>
            </div>
            <textarea class="html-editor" v-model="htmlEditorContent" placeholder="在此输入HTML代码..." rows="20"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="applyHtml">应用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, defineComponent, onMounted, ref, watch} from 'vue';
import request from '../api/request';
import {ElMessage} from "element-plus";

export default defineComponent({
  setup() {
    const sidebarActive = ref(false);
    const propertiesPanelActive = ref(true);
    const activeTab = ref('layout');
    const activeModal = ref('');
    const selectedComponentId = ref('');
    const useGridLayout = ref(true);
    const showGridLines = ref(true);
    const isDraggingOver = ref(false);
    const currentBreakpoint = ref('desktop');
    const htmlEditorContent = ref('');
    const draggingElementType = ref('');
    const layoutContainers = ref([]);
    const components = ref([]);
    const containerDragStates = ref({});
    const containerElements = ref([]);
    const textElements = ref([]);
    const formElements = ref([]);
    const mediaElements = ref([]);
    const allDomElements = ref({});

    const initializeDomElements = async () => {
      try {
        request.get('/api/elements/all')
            .then(response => {
              if (response.code == 200) {
                const allElements = response.data;
                const elementMap = {};
                allElements.forEach(element => {
                  elementMap[element.type] = {
                    name: element.name,
                    icon: element.icon,
                    isContainer: element.container,
                    inline: element.inline || false
                  };
                });
                allDomElements.value = elementMap;
              } else {
                ElMessage.error(`获取该连接器属性失败`);
              }
            });
        request.get('/api/elements/containers')
            .then(response => {
              if (response.code == 200) {
                containerElements.value = response.data;
              } else {
                ElMessage.error(`获取该连接器属性失败`);
              }
            });
        request.get('/api/elements/text')
            .then(response => {
              if (response.code == 200) {
                textElements.value = response.data;
              } else {
                ElMessage.error(`获取该连接器属性失败`);
              }
            });
        request.get('/api/elements/form')
            .then(response => {
              if (response.code == 200) {
                formElements.value = response.data;
              } else {
                ElMessage.error(`获取该连接器属性失败`);
              }
            });

        request.get('/api/elements/media')
            .then(response => {
              if (response.code == 200) {
                mediaElements.value = response.data;
              } else {
                ElMessage.error(`获取该连接器属性失败`);
              }
            });
        console.log('DOM元素数据加载完成');
      } catch (error) {
        console.error('加载DOM元素数据失败:', error);
      }
    };

    const initializeData = () => {
      layoutContainers.value = [];
      components.value = [];
    };

    const initializeGridCells = (containerId, rows = 3, columns = 3) => {
      const container = layoutContainers.value.find(c => c.id === containerId);
      if (!container || container.type !== 'grid') return;

      container.config.rows = rows;
      container.config.columns = columns;

      const cells = [];
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= columns; col++) {
          const cellId = `cell_${containerId}_${row}_${col}`;

          let existingCell = null;
          if (container.config.cells && container.config.cells.length > 0) {
            existingCell = container.config.cells.find(c => c.row === row && c.col === col);
          }

          cells.push({
            id: cellId,
            row,
            col,
            rowSpan: existingCell?.rowSpan || 1,
            colSpan: existingCell?.colSpan || 1,
            merged: existingCell?.merged || false,
            components: existingCell?.components || []
          });
        }
      }
      container.config.cells = cells;
    };

    const initializeExistingGrids = () => {
      layoutContainers.value
          .filter(c => c.type === 'grid')
          .forEach(container => {
            if (!container.config.cells || container.config.cells.length === 0) {
              initializeGridCells(container.id, container.config.rows || 3, container.config.columns || 3);
            }
          });
    };

    onMounted(async () => {
      await initializeDomElements();
      initializeData();
      initializeExistingGrids();
    });

    const selectedComponent = computed(() => {
      const allItems = [...layoutContainers.value, ...components.value];
      let selectedItem = allItems.find(item => item.id === selectedComponentId.value);
      if (!selectedItem) {
        layoutContainers.value.forEach(container => {
          if (container.type === 'grid' && container.config.cells) {
            const cell = container.config.cells.find(c => c.id === selectedComponentId.value);
            if (cell) {
              selectedItem = {
                ...cell,
                type: 'grid-cell',
                name: `网格单元格`,
                icon: 'fas fa-th',
                config: {
                  width: { value: 100, unit: '%' },
                  height: { value: 'auto', unit: 'auto' },
                  display: 'block',
                  margin: { top: '0', right: '0', bottom: '0', left: '0' },
                  padding: { top: '0', right: '0', bottom: '0', left: '0' },
                  backgroundColor: 'transparent',
                  rowSpan: cell.rowSpan || 1,
                  colSpan: cell.colSpan || 1,
                  responsive: {
                    desktop: { className: '', css: '' },
                    tablet: { className: '', css: '' },
                    mobile: { className: '', css: '' }
                  }
                }
              };
            }
          }
        });
      }

      return selectedItem || null;
    });

    const getComponentsInGridCell = (cellId) => {
      if (!components.value) return [];
      return components.value.filter(component => component.gridCellId === cellId);
    };
    
    const getContainerWrapperStyle = (container) => {
      return {
        marginBottom: '20px'
      };
    };

    const getGridContainerStyle = (container) => {
      if (!container || !container.config) return {};
      const config = container.config;
      const responsiveConfig = config.responsive && config.responsive[currentBreakpoint.value];
      
      let width = '100%';
      if (config.width?.unit === '%' && config.width?.value) {
        width = Math.min(config.width.value, 100) + '%';
      } else if (config.width?.unit === 'px' && config.width?.value) {
        width = config.width.value + 'px';
      }

      const rows = config.rows || 3;
      const cellHeight = 100;
      const containerPadding = 0;
      const suggestedHeight = rows * cellHeight + containerPadding;
      let height = suggestedHeight + 'px';
      if (config.height?.unit && config.height?.value) {
        if (config.height.unit === 'auto') {
          height = 'auto';
        } else {
          height = config.height.value + config.height.unit;
        }
      }

      let style = {
        width: width,
        height: height,
        margin: `${config.margin?.top || '0'} ${config.margin?.right || '0'} ${config.margin?.bottom || '0'} ${config.margin?.left || '0'}`,
        padding: '0',
        'background-color': config.backgroundColor || 'transparent',
        'overflow': 'visible',
        'box-sizing': 'border-box',
        'display': 'flex',
        'flex-direction': 'column',
        'border': 'none',
        'border-radius': '0',
        'box-shadow': 'none'
      };

      if (responsiveConfig && responsiveConfig.css) {
        try {
          const responsiveStyles = responsiveConfig.css.split(';').reduce((acc, rule) => {
            const [prop, value] = rule.split(':').map(s => s.trim());
            if (prop && value) {
              acc[prop] = value;
            }
            return acc;
          }, {});

          style = {...style, ...responsiveStyles};
        } catch (e) {
          console.warn('解析响应式CSS失败:', e);
        }
      }

      return style;
    };

    const getGridTemplateStyle = (container) => {
      if (!container || !container.config) return {};
      const config = container.config;
      const responsiveConfig = config.responsive && config.responsive[currentBreakpoint.value];
      let style = {
        display: 'grid',
        'grid-template-rows': `repeat(${config.rows || 3}, minmax(80px, 1fr))`,
        'grid-template-columns': `repeat(${config.columns || 3}, minmax(100px, 1fr))`,
        gap: config.gap || '10px',
        'min-height': '200px',
        'flex': '1',
        'width': '100%',
        'height': '100%'
      };
      if (responsiveConfig && responsiveConfig.css) {
        try {
          const responsiveStyles = responsiveConfig.css.split(';').reduce((acc, rule) => {
            const [prop, value] = rule.split(':').map(s => s.trim());
            if (prop && value) {
              acc[prop] = value;
            }
            return acc;
          }, {});
          style = {...style, ...responsiveStyles};
        } catch (e) {
          console.warn('解析响应式CSS失败:', e);
        }
      }

      return style;
    };

    const getGridCellStyle = (cell, container) => {
      if (!cell || !container) return {};
      const style = {
        'grid-row': `${cell.row || 1} / span ${cell.rowSpan || 1}`,
        'grid-column': `${cell.col || 1} / span ${cell.colSpan || 1}`,
        'min-height': '80px',
        'min-width': '100px',
      };

      if (cell.merged) {
        style.backgroundColor = '#f5f5f5';
        style.border = '2px dashed #ddd';
      }

      return style;
    };

    const getComponentStyle = (component) => {
      if (!component || !component.config) return {};
      const config = component.config;
      const responsiveConfig = config.responsive && config.responsive[currentBreakpoint.value];
      let style = {
        width: (config.width?.value || 100) + (config.width?.unit === 'auto' ? '' : config.width?.unit || '%'),
        height: (config.height?.value || 'auto') + (config.height?.unit === 'auto' ? '' : config.height?.unit || 'px'),
        display: config.display || 'block',
        'font-size': (config.fontSize || '14') + 'px',
        'font-weight': config.fontWeight || 'normal',
        'font-family': config.fontFamily || '',
        color: config.color || '#333333',
        'text-align': config.textAlign || 'left',
        'line-height': config.lineHeight || '1.5',
        'margin-top': config.margin?.top || '0',
        'margin-right': config.margin?.right || '0',
        'margin-bottom': config.margin?.bottom || '0',
        'margin-left': config.margin?.left || '0',
        'padding-top': config.padding?.top || '0',
        'padding-right': config.padding?.right || '0',
        'padding-bottom': config.padding?.bottom || '0',
        'padding-left': config.padding?.left || '0',
        'background-color': config.backgroundColor || 'transparent',
        'background-image': config.backgroundImage ? `url(${config.backgroundImage})` : '',
        'background-size': config.backgroundSize || 'cover',
        'border-width': config.borderWidth || '0',
        'border-style': config.borderStyle || 'solid',
        'border-color': config.borderColor || '#dddddd',
        'border-radius': (config.borderRadius || '0') + 'px',
        'box-shadow': config.boxShadow || 'none'
      };

      if (responsiveConfig && responsiveConfig.css) {
        try {
          const responsiveStyles = responsiveConfig.css.split(';').reduce((acc, rule) => {
            const [prop, value] = rule.split(':').map(s => s.trim());
            if (prop && value) {
              acc[prop] = value;
            }
            return acc;
          }, {});
          style = {...style, ...responsiveStyles};
        } catch (e) {
          console.warn('解析响应式CSS失败:', e);
        }
      }

      if (config.customCss) {
        try {
          const customStyles = config.customCss.split(';').reduce((acc, rule) => {
            const [prop, value] = rule.split(':').map(s => s.trim());
            if (prop && value) {
              acc[prop] = value;
            }
            return acc;
          }, {});

          style = {...style, ...customStyles};
        } catch (e) {
          console.warn('解析自定义CSS失败:', e);
        }
      }

      return style;
    };

    const renderComponentContent = (component) => {
      if (!component) return '';
      if (component.type === 'button') {
        return `<button type="${component.config.buttonType || 'button'}"
                style="width:100%; height:100%; border:none; background:transparent; color:inherit; font:inherit;">
                ${component.content || '按钮'}</button>`;
      } else if (component.type === 'input') {
        return `<input type="${component.config.inputType || 'text'}"
                placeholder="${component.config.placeholder || ''}"
                style="width:100%; height:100%; border:none; background:transparent; color:inherit; font:inherit;">`;
      } else if (component.type === 'chart') {
        return `<div class="chart-placeholder">
                  <i class="fas fa-chart-${component.config.chartType || 'bar'}"></i>
                  <span>${component.content || '图表'}</span>
                </div>`;
      } else if (component.type === 'select') {
        return `<select style="width:100%; height:100%; border:none; background:transparent; color:inherit; font:inherit;">
                  <option>选项1</option>
                  <option>选项2</option>
                </select>`;
      } else if (component.type === 'table') {
        return `<div class="table-placeholder">
                  <i class="fas fa-table"></i>
                  <span>${component.content || '表格'}</span>
                </div>`;
      } else if (component.type === 'img') {
        return `<img src="${component.config.src || ''}"
                alt="${component.content || ''}"
                style="max-width:100%; max-height:100%; object-fit: contain;">`;
      } else if (component.type === 'audio') {
        return `<audio controls style="width:100%;">
                  <source src="${component.config.src || ''}" type="audio/mpeg">
                  您的浏览器不支持音频元素
                </audio>`;
      } else if (component.type === 'video') {
        return `<video controls style="width:100%;">
                  <source src="${component.config.src || ''}" type="video/mp4">
                  您的浏览器不支持视频元素
                </video>`;
      }
      return component.content || '';
    };

    const handleDomTypeDragStart = (event, domType) => {
      draggingElementType.value = domType;
      event.dataTransfer.setData('text/plain', domType);
      event.dataTransfer.effectAllowed = 'copy';
      event.target.classList.add('dragging');
      setTimeout(() => {
        event.target.classList.remove('dragging');
      }, 0);
    };

    const handleGridCellDragOver = (e, cellId) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      const cellElement = e.target.closest('.grid-cell');
      if (cellElement && !cellElement.classList.contains('merged')) {
        cellElement.style.borderColor = 'var(--primary-color)';
        cellElement.style.backgroundColor = 'rgba(255, 131, 38, 0.1)';
      }
    };

    const handleGridCellDragLeave = (e, cellId) => {
      e.preventDefault();
      e.stopPropagation();

      const cellElement = e.target.closest('.grid-cell');
      if (cellElement) {
        cellElement.style.borderColor = '';
        cellElement.style.backgroundColor = '';
      }
    };

    const handleGridCellDrop = (e, cellId) => {
      e.preventDefault();
      e.stopPropagation();

      const cellElement = e.target.closest('.grid-cell');
      if (cellElement) {
        cellElement.style.borderColor = '';
        cellElement.style.backgroundColor = '';
      }

      let elementType = draggingElementType.value;
      if (!elementType && e.dataTransfer.types.includes('text/plain')) {
        elementType = e.dataTransfer.getData('text/plain');
      }

      if (!elementType) {
        console.warn('未获取到拖拽元素类型');
        return;
      }
      createComponent(elementType, null, cellId);
    };

    const createComponent = (elementType, containerId = null, gridCellId = null) => {
      const newId = `${elementType}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const elementInfo = allDomElements.value[elementType] || {
        name: `${elementType}元素`,
        icon: 'fas fa-cube',
        isContainer: false,
        inline: false
      };

      if (elementType === 'grid') {
        const containerConfig = {
          width: {value: 100, unit: '%'},
          height: {value: 300, unit: 'px'},
          display: 'grid',
          rows: 3,
          columns: 3,
          gap: '10px',
          margin: {top: '10px', right: '0', bottom: '10px', left: '0'},
          padding: {top: '0', right: '0', bottom: '0', left: '0'},
          backgroundColor: 'transparent',
          responsive: {
            desktop: {className: '', css: ''},
            tablet: {className: '', css: 'gap: 8px; width: 100%;'},
            mobile: {className: '', css: 'gap: 5px; width: 100%;'}
          },
          cells: []
        };

        const newContainer = {
          id: newId,
          type: elementType,
          name: '网格容器',
          icon: elementInfo.icon,
          config: containerConfig
        };

        layoutContainers.value.push(newContainer);
        initializeGridCells(newId, 3, 3);
        console.log('创建网格容器:', newId);
      } else if (elementInfo.isContainer) {
        const containerConfig = {
          width: {value: 100, unit: '%'},
          height: {value: 200, unit: 'px'},
          display: 'block',
          margin: {top: '10px', right: '0', bottom: '10px', left: '0'},
          padding: {top: '0', right: '0', bottom: '0', left: '0'},
          backgroundColor: 'transparent',
          responsive: {
            desktop: {className: '', css: ''},
            tablet: {className: '', css: 'width: 100%;'},
            mobile: {className: '', css: 'width: 100%;'}
          }
        };
        layoutContainers.value.push({
          id: newId,
          type: elementType,
          name: elementInfo.name,
          icon: elementInfo.icon,
          config: containerConfig
        });
        console.log('创建容器:', elementType, newId);
      } else {
        const contentMap = {
          h1: '一级标题',
          h2: '二级标题',
          h3: '三级标题',
          p: '段落文本',
          span: '行内文本',
          a: '链接文本',
          button: '按钮',
          input: '输入框',
          textarea: '多行文本',
          select: '下拉选择',
          img: '图片',
          audio: '音频',
          video: '视频',
          iframe: '内嵌内容',
          li: '列表项',
          tr: '表格行',
          th: '表头',
          td: '表格数据',
          br: '换行',
          hr: '水平线',
          progress: '进度条',
          strong: '加粗文本',
          em: '强调文本',
          i: '斜体文本',
          b: '粗体文本',
          u: '下划线文本',
          label: '标签',
        };

        const componentConfig = {
          width: {value: elementInfo.inline ? 'auto' : 100, unit: elementInfo.inline ? 'auto' : '%'},
          height: {value: 'auto', unit: 'auto'},
          display: elementInfo.inline ? 'inline-block' : 'block',
          fontSize: ['h1', 'h2', 'h3'].includes(elementType) ? (elementType === 'h1' ? '32px' : elementType === 'h2' ? '24px' : '18px') : '14px',
          fontWeight: ['h1', 'h2', 'h3', 'strong', 'b'].includes(elementType) ? 'bold' : 'normal',
          fontFamily: '',
          color: '#333333',
          textAlign: 'left',
          lineHeight: '1.5',
          margin: {top: '0', right: elementInfo.inline ? '5px' : '0', bottom: '0', left: '0'},
          padding: {top: '8px', right: '8px', bottom: '8px', left: '8px'},
          backgroundColor: 'transparent',
          backgroundImage: '',
          backgroundSize: 'cover',
          borderWidth: ['input', 'textarea', 'select'].includes(elementType) ? '1px' : '0',
          borderStyle: 'solid',
          borderColor: '#dddddd',
          borderRadius: ['button', 'input', 'textarea', 'select'].includes(elementType) ? '4px' : '0',
          boxShadow: 'none',
          placeholder: ['input', 'textarea'].includes(elementType) ? '请输入内容' : '',
          buttonType: 'button',
          inputType: 'text',
          src: ['img', 'audio', 'video', 'iframe'].includes(elementType) ? '' : undefined,
          inline: elementInfo.inline || false,
          customCss: '',
          responsive: {
            desktop: {className: '', css: ''},
            tablet: {className: '', css: ''},
            mobile: {className: '', css: ''}
          }
        };

        const newComponent = {
          id: newId,
          type: elementType,
          name: elementInfo.name,
          icon: elementInfo.icon,
          content: contentMap[elementType] || elementInfo.name,
          containerId: containerId,
          gridCellId: gridCellId,
          config: componentConfig
        };

        components.value.push(newComponent);

        if (gridCellId) {
          const container = layoutContainers.value.find(c =>
              c.type === 'grid' && c.config.cells && c.config.cells.some(cell => cell.id === gridCellId)
          );
          if (container) {
            const cell = container.config.cells.find(c => c.id === gridCellId);
            if (cell && !cell.merged) {
              if (!cell.components) cell.components = [];
              if (!cell.components.includes(newId)) {
                cell.components.push(newId);
              }
            }
          }
        }

        console.log('创建组件:', elementType, newId, '容器:', containerId, '网格单元格:', gridCellId);
      }

      selectComponent(newId);
      draggingElementType.value = '';
    };

    const handleGridCellDoubleClick = (containerId, cell) => {
      selectComponent(cell.id);
      activeTab.value = 'content';
    };

    const deleteGridCellComponent = (containerId, cellId) => {
      const container = layoutContainers.value.find(c => c.id === containerId);
      if (!container || container.type !== 'grid') return;
      const cell = container.config.cells.find(c => c.id === cellId);
      if (!cell) return;
      if (cell.components && cell.components.length > 0) {
        cell.components.forEach(componentId => {
          deleteComponent(componentId);
        });
        cell.components = [];
      }
    };

    const saveLayout = () => {
      const layoutData = {
        layoutContainers: layoutContainers.value,
        components: components.value,
        timestamp: new Date().toISOString()
      };
      const jsonStr = JSON.stringify(layoutData, null, 2);
      const blob = new Blob([jsonStr], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jquick-bi-layout-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      alert('布局已保存！');
    };

    const loadLayout = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const layoutData = JSON.parse(e.target.result);
            if (!layoutData.layoutContainers || !layoutData.components) {
              throw new Error('无效的布局文件格式');
            }
            layoutContainers.value = layoutData.layoutContainers;
            components.value = layoutData.components;
            selectedComponentId.value = '';
            initializeExistingGrids();
            alert('布局加载成功！');
          } catch (error) {
            console.error('加载布局失败:', error);
            alert('加载布局失败，请检查文件格式是否正确');
          }
        };
        reader.readAsText(file);
      };
      input.click();
    };

    const handleDragStart = (event, elementType) => {
      draggingElementType.value = elementType;
      event.dataTransfer.setData('text/plain', elementType);
      event.dataTransfer.effectAllowed = 'copy';
      event.target.classList.add('dragging');
      setTimeout(() => {
        event.target.classList.remove('dragging');
      }, 0);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      isDraggingOver.value = true;
      e.dataTransfer.dropEffect = 'copy';
    };

    const handleDragLeave = () => {
      isDraggingOver.value = false;
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingOver.value = false;
      const elementType = draggingElementType.value || e.dataTransfer.getData('text/plain');
      if (!elementType) return;
      createComponent(elementType);
    };

    const applyLayoutPreset = (presetType) => {
      layoutContainers.value = [];
      components.value = [];
      selectedComponentId.value = '';

      switch (presetType) {
        case 'header-sidebar-main':
          layoutContainers.value = [
            {
              id: 'header_grid',
              type: 'grid',
              name: '网格容器',
              icon: 'fas fa-th',
              config: {
                width: { value: 100, unit: '%' },
                height: { value: 80, unit: 'px' },
                display: 'grid',
                rows: 1,
                columns: 3,
                gap: '10px',
                margin: { top: '0', right: '0', bottom: '10px', left: '0' },
                padding: {top: '0', right: '0', bottom: '0', left: '0'},
                backgroundColor: 'transparent',
                responsive: {
                  desktop: { className: '', css: '' },
                  tablet: {className: '', css: 'gap: 8px; width: 100%;'},
                  mobile: {className: '', css: 'gap: 5px; width: 100%;'}
                },
                cells: []
              }
            },
            {
              id: 'main_grid',
              type: 'grid',
              name: '网格容器',
              icon: 'fas fa-th',
              config: {
                width: { value: 100, unit: '%' },
                height: { value: 500, unit: 'px' },
                display: 'grid',
                rows: 2,
                columns: 3,
                gap: '15px',
                margin: { top: '0', right: '0', bottom: '0', left: '0' },
                padding: {top: '0', right: '0', bottom: '0', left: '0'},
                backgroundColor: 'transparent',
                responsive: {
                  desktop: { className: '', css: '' },
                  tablet: {className: '', css: 'grid-template-columns: 1fr 2fr; gap: 10px;'},
                  mobile: {className: '', css: 'grid-template-columns: 1fr; gap: 8px;'}
                },
                cells: []
              }
            }
          ];
          break;

        case 'three-column':
          layoutContainers.value = [
            {
              id: 'three_col_grid',
              type: 'grid',
              name: '网格容器',
              icon: 'fas fa-th',
              config: {
                width: { value: 100, unit: '%' },
                height: { value: 400, unit: 'px' },
                display: 'grid',
                rows: 1,
                columns: 3,
                gap: '20px',
                margin: { top: '10px', right: '0', bottom: '10px', left: '0' },
                padding: {top: '0', right: '0', bottom: '0', left: '0'},
                backgroundColor: 'transparent',
                responsive: {
                  desktop: { className: '', css: '' },
                  tablet: {className: '', css: 'grid-template-columns: 1fr 1fr;'},
                  mobile: {className: '', css: 'grid-template-columns: 1fr;'}
                },
                cells: []
              }
            }
          ];
          break;

        case 'dashboard':
          layoutContainers.value = [
            {
              id: 'dashboard_grid',
              type: 'grid',
              name: '网格容器',
              icon: 'fas fa-th',
              config: {
                width: { value: 100, unit: '%' },
                height: {value: 600, unit: 'px'},
                display: 'grid',
                rows: 3,
                columns: 3,
                gap: '15px',
                margin: { top: '10px', right: '0', bottom: '10px', left: '0' },
                padding: {top: '0', right: '0', bottom: '0', left: '0'},
                backgroundColor: 'transparent',
                responsive: {
                  desktop: { className: '', css: '' },
                  tablet: {className: '', css: 'grid-template-columns: repeat(2, 1fr); gap: 12px;'},
                  mobile: {className: '', css: 'grid-template-columns: 1fr; gap: 10px;'}
                },
                cells: []
              }
            }
          ];
          break;
      }
      layoutContainers.value.forEach(container => {
        initializeGridCells(container.id, container.config.rows, container.config.columns);
      });
      selectedComponentId.value = layoutContainers.value.length > 0 ? layoutContainers.value[0].id : '';
    };

    const toggleSidebar = () => {
      sidebarActive.value = !sidebarActive.value;
    };

    const toggleGridLines = () => {
      showGridLines.value = !showGridLines.value;
    };
    const selectComponent = (id) => {
      selectedComponentId.value = id;
      activeTab.value = 'layout';
    };
    const deselectComponent = () => {
      selectedComponentId.value = '';
    };

    const deleteComponent = (id) => {
      layoutContainers.value.forEach(container => {
        if (container.type === 'grid' && container.config.cells) {
          container.config.cells.forEach(cell => {
            if (cell.components) {
              const index = cell.components.indexOf(id);
              if (index > -1) {
                cell.components.splice(index, 1);
              }
            }
          });
        }
      });
      components.value = components.value.filter(c => c.id !== id);
      if (selectedComponentId.value === id) {
        selectedComponentId.value = '';
      }
    };

    const deleteContainer = (id) => {
      const container = layoutContainers.value.find(c => c.id === id);
      if (container && container.type === 'grid' && container.config.cells) {
        container.config.cells.forEach(cell => {
          if (cell.components && cell.components.length > 0) {
            cell.components.forEach(componentId => {
              deleteComponent(componentId);
            });
          }
        });
      }

      layoutContainers.value = layoutContainers.value.filter(c => c.id !== id);
      if (selectedComponentId.value === id) {
        selectedComponentId.value = '';
      }
    };

    const toggleGridLayout = () => {
      useGridLayout.value = !useGridLayout.value;
    };

    const resetLayout = () => {
      if (confirm('确定要重置布局吗？这将清除所有内容。')) {
        layoutContainers.value = [];
        components.value = [];
        selectedComponentId.value = '';
      }
    };

    const exportHtml = () => {
      const htmlContent = generateHtml();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'jquick-bi-report.html';
      a.click();
      URL.revokeObjectURL(url);
    };

    const previewHtml = () => {
      const htmlContent = generateHtml();
      const previewWindow = window.open();
      previewWindow.document.write(htmlContent);
      previewWindow.document.close();
    };

    const generateHtml = () => {
      return `template html`;
    };

    const openHtmlEditor = () => {
      htmlEditorContent.value = generateHtml();
      activeModal.value = 'HTML编辑器';
    };

    const closeModal = () => {
      activeModal.value = '';
    };

    const parseHtml = () => {
      console.log('解析HTML:', htmlEditorContent.value);
    };

    const importHtml = () => {
      htmlEditorContent.value = generateHtml();
    };

    const clearHtml = () => {
      htmlEditorContent.value = '';
    };

    const applyHtml = () => {
      console.log('应用HTML:', htmlEditorContent.value);
      closeModal();
    };

    watch(currentBreakpoint, (newValue) => {
      console.log('切换到断点:', newValue);
    });

    return {
      sidebarActive,
      propertiesPanelActive,
      activeTab,
      activeModal,
      selectedComponentId,
      useGridLayout,
      showGridLines,
      isDraggingOver,
      currentBreakpoint,
      htmlEditorContent,
      layoutContainers,
      components,
      selectedComponent,
      containerDragStates,
      containerElements,
      textElements,
      formElements,
      mediaElements,
      handleDragStart,
      handleDomTypeDragStart,
      toggleSidebar,
      toggleGridLines,
      selectComponent,
      deselectComponent,
      deleteComponent,
      deleteContainer,
      getComponentsInGridCell,
      getContainerWrapperStyle,
      getGridContainerStyle,
      getGridTemplateStyle,
      getGridCellStyle,
      getComponentStyle,
      renderComponentContent,
      toggleGridLayout,
      resetLayout,
      applyLayoutPreset,
      exportHtml,
      previewHtml,
      generateHtml,
      openHtmlEditor,
      closeModal,
      parseHtml,
      importHtml,
      clearHtml,
      applyHtml,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleGridCellDragOver,
      handleGridCellDragLeave,
      handleGridCellDrop,
      handleGridCellDoubleClick,
      createComponent,
      deleteGridCellComponent,
      saveLayout,
      loadLayout
    };
  }
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
  --properties-panel-width: 300px;
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
  padding: 0 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.container-content {
  width: 100%;
  margin-bottom: 20px;
}

.grid-container {
  width: 100% !important;
  max-width: 100%;
}

.canvas-drag-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.logo {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: var(--primary-color);
  font-size: 22px;
  margin-right: 40px;
}

.logo i {
  margin-right: 10px;
  font-size: 26px;
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: var(--text-color);
  margin-right: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
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

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.action-btn:hover {
  background-color: var(--secondary-color);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-btn.compact {
  padding: 6px;
  width: 36px;
  height: 36px;
  justify-content: center;
}

.header-secondary-actions {
  display: flex;
  align-items: center;
  gap: 12px;
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
  transition: transform 0.3s;
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
  user-select: none;
}

.menu-item:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.menu-item.dragging {
  opacity: 0.5;
  background-color: rgba(255, 131, 38, 0.1);
}

.menu-item i {
  width: 20px;
  margin-right: 12px;
  text-align: center;
  color: var(--primary-color);
}

.workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--light-bg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
}

.page-description {
  font-size: 14px;
  color: #666;
}

.layout-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.breakpoint-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: var(--text-color);
  cursor: pointer;
}

.breakpoint-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.canvas-container {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.canvas-drag-area {
  min-height: calc(100% - 48px);
  padding: 24px;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  transition: all 0.2s;
  background-color: white;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.canvas-drag-area.dragover {
  border-color: var(--primary-color);
  background-color: rgba(255, 131, 38, 0.1);
}

.canvas-drag-area.grid-layout {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px;
}

.canvas-drag-area.show-grid {
  background-image: linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.layout-container {
  margin-bottom: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100% !important;
  box-sizing: border-box;
}

.layout-container.selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 131, 38, 0.1);
}

.layout-container.grid {
  border-color: #9C27B0;
  display: grid !important;
}

.grid-container {
  border-color: #9C27B0;
  width: 100% !important;
  max-height: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.grid-cells {
  min-height: 200px;
  padding: 16px;
  background: #fafafa;
  border-radius: 0 0 10px 10px;
  width: 100%;
  box-sizing: border-box;
  display: grid !important;
  overflow-y: auto;
  flex: 1;
  max-height: calc(100% - 60px);
}

.grid-cell {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: white;
  min-height: 80px;
  min-width: 100px;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.grid-cell.selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.2);
}

.grid-cell.merged {
  background-color: #f5f5f5;
  border-style: dashed;
  border-color: #ccc;
}

.grid-cell.span-col {
  background-color: rgba(255, 131, 38, 0.05);
}

.grid-cell.span-row {
  background-color: rgba(76, 175, 80, 0.05);
}

.cell-content {
  padding: 10px;
  min-height: 50px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.empty-cell-hint {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 12px;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
  min-height: 60px;
  width: 100%;
}

.empty-cell-hint:hover {
  border-color: var(--primary-color);
  background-color: rgba(255, 131, 38, 0.05);
}

.empty-cell-hint i {
  font-size: 20px;
  margin-bottom: 6px;
  color: var(--primary-color);
}

.empty-cell-hint p {
  font-size: 12px;
  margin: 0;
}

.merged-cell-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 12px;
}

.merged-cell-indicator i {
  font-size: 20px;
  margin-bottom: 5px;
  color: #aaa;
}

.empty-canvas-hint {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.empty-canvas-hint i {
  font-size: 64px;
  color: var(--primary-color);
  margin-bottom: 24px;
  opacity: 0.8;
}

.empty-canvas-hint h3 {
  margin-bottom: 12px;
  font-size: 24px;
  color: var(--text-color);
}

.empty-canvas-hint p {
  margin-bottom: 24px;
  color: #999;
  font-size: 16px;
}

.properties-panel {
  width: var(--properties-panel-width);
  background-color: white;
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.panel-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-close:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background: #fafafa;
  flex-wrap: nowrap;
}

.panel-tabs > * {
  flex-shrink: 0;
  min-width: fit-content;
}

.tab-item {
  flex: 1;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
}

.tab-item:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.tab-item.active {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.setting-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-title {
  font-weight: 600;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 15px;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-color);
  transition: all 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.range-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.range-input input[type="range"] {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #f0f0f0;
  outline: none;
  -webkit-appearance: none;
}

.range-input input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}

.range-input .form-control {
  width: 70px;
}

.range-input select {
  width: 60px;
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: white;
  font-size: 13px;
  color: var(--text-color);
}

.spacing-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.spacing-item {
  margin-bottom: 8px;
}

.spacing-item label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.align-buttons {
  display: flex;
  gap: 6px;
}

.align-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-color);
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 6px;
  color: #666;
}

.align-btn:hover {
  background: #f5f5f5;
  border-color: var(--border-color);
}

.align-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.color-picker {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-picker input[type="color"] {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
}

.color-picker input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker input[type="color"]::-webkit-color-swatch {
  border: 1px solid #ddd;
  border-radius: 4px;
}

.no-selection {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.no-selection i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #e0e0e0;
}

.no-selection p {
  font-size: 14px;
  color: #999;
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
  gap: 6px;
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
  border-color: var(--primary-color);
}

.layout-presets {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
}

.layout-preset {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.layout-preset:hover {
  border-color: var(--primary-color);
  background-color: rgba(255, 131, 38, 0.05);
  transform: translateY(-2px);
  box-shadow: var(--card-shadow);
}

.preset-preview {
  width: 100%;
  height: 60px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
  overflow: hidden;
  position: relative;
}

.preset-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: var(--primary-color);
}

.preset-sidebar {
  position: absolute;
  top: 15px;
  left: 0;
  width: 20px;
  bottom: 0;
  background: #e0e0e0;
}

.preset-main {
  position: absolute;
  top: 15px;
  left: 25px;
  right: 0;
  bottom: 0;
  background: white;
}

.preset-col, .preset-widget {
  height: 100%;
  background: #e0e0e0;
  border-right: 1px solid white;
}

.preset-row {
  display: flex;
  height: 50%;
}

.layout-preset span {
  font-size: 12px;
  color: var(--text-color);
  font-weight: 500;
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
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-overlay.active {
  display: flex;
}

.modal {
  background-color: white;
  border-radius: 12px;
  width: 600px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.large-modal {
  width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background: #fafafa;
  border-radius: 12px 12px 0 0;
}

.modal-title {
  font-weight: 600;
  font-size: 18px;
  color: var(--text-color);
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.modal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #fafafa;
  border-radius: 0 0 12px 12px;
}

.editor-container {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.editor-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.html-editor {
  flex: 1;
  width: 100%;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: none;
  line-height: 1.5;
  color: var(--text-color);
}

.html-editor:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.1);
}

.canvas-component {
  margin: 8px 0;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: white;
  transition: all 0.2s;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.canvas-component.selected {
  border: 2px solid var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 131, 38, 0.1);
}

.canvas-component.inline-component {
  display: inline-block;
  vertical-align: top;
  min-width: 100px;
  margin-right: 8px;
}

.canvas-component:not(.inline-component) {
  width: 100%;
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.component-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.component-actions {
  display: flex;
  align-items: center;
  gap: 8px;
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

.component-hint {
  color: #999;
  font-size: 12px;
  margin-right: 8px;
}

.component-content {
  min-height: 40px;
  background-color: #f9f9f9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  overflow: hidden;
  padding: 12px;
}

@media (max-width: 1200px) {
  .sidebar {
    width: 240px;
  }

  .properties-panel {
    width: 280px;
  }

  .header-actions {
    flex-wrap: wrap;
    gap: 12px;
  }

  .search-box {
    width: 200px;
  }
}

@media (max-width: 992px) {
  .sidebar {
    position: fixed;
    top: var(--header-height);
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
    z-index: 100;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .properties-panel {
    position: fixed;
    top: var(--header-height);
    right: 0;
    bottom: 0;
    transform: translateX(100%);
    z-index: 100;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .properties-panel.active {
    transform: translateX(0);
  }

  .mobile-menu-toggle {
    display: block;
  }

  .search-box {
    width: 180px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }

  .header-actions {
    justify-content: flex-end;
  }

  .search-box {
    display: none;
  }

  .action-buttons {
    display: none;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .layout-controls {
    width: 100%;
    justify-content: space-between;
  }

  .layout-presets {
    grid-template-columns: 1fr;
  }

  .canvas-container {
    padding: 16px;
  }

  .canvas-drag-area {
    padding: 16px;
  }

  .modal {
    width: 95vw;
  }

  .large-modal {
    width: 95vw;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
  }

}

@media (max-width: 576px) {
  :root {
    --header-height: 56px;
  }

  .logo {
    font-size: 18px;
  }

  .logo i {
    font-size: 22px;
  }

  .user-name {
    display: none;
  }

  .notification-icon {
    display: none;
  }

  .canvas-component {
    padding: 12px;
  }

  .component-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .component-actions {
    align-self: flex-end;
  }

  .layout-presets {
    grid-template-columns: 1fr;
  }

  .spacing-controls {
    grid-template-columns: 1fr;
  }

  .range-input {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .range-input .form-control {
    width: 100%;
  }

  .range-input select {
    width: 100%;
  }

}
</style>