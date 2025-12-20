<template>
  <div class="container" @click="handleCanvasClick">
    <header class="header">
      <button class="mobile-menu-toggle" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>
      <div class="logo">
        <i class="fas fa-chart-line"></i>
        <span>JQuick BI</span>
      </div>
      <div v-if="showCellOperations" class="cell-operations-bar">
        <div class="cell-operations">
          <button 
            class="action-btn" 
            :disabled="!canMerge" 
            @click="mergeCells"
            title="合并选中单元格">
            <i class="fas fa-compress-alt"></i>
            <span>合并</span>
          </button>
          
          <button 
            class="action-btn" 
            :disabled="!canSplit" 
            @click="splitCell"
            title="拆分选中单元格">
            <i class="fas fa-expand-alt"></i>
            <span>拆分</span>
          </button>
          
          <button 
            class="action-btn" 
            :disabled="!canClearMerge" 
            @click="clearMerge"
            title="清除合并">
            <i class="fas fa-times-circle"></i>
            <span>清除</span>
          </button>
          
          <div class="cell-info">
            <span v-if="selectedCells.length === 1">
              选中：{{ getCellAddress(selectedCells[0]) }}
            </span>
            <span v-else-if="selectedCells.length > 1">
              选中 {{ selectedCells.length }} 个单元格
            </span>
            <span v-else>未选中单元格</span>
          </div>
        </div>
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
          <div class="menu-section-title text-align-left">网格设置</div>
          <div class="grid-config-panel">
            <div class="setting-item">
              <label>行数</label>
              <input type="number" v-model.number="gridConfig.rows" min="1" max="12" class="form-control">
            </div>
            <div class="setting-item">
              <label>列数</label>
              <input type="number" v-model.number="gridConfig.columns" min="1" max="12" class="form-control">
            </div>
            <div class="setting-item">
              <label>间距</label>
              <div class="range-input">
                <input type="range" v-model.number="gridConfig.gapValue" min="0" max="50" step="1">
                <input type="text" v-model.number="gridConfig.gapValue" class="form-control">
                <select v-model="gridConfig.gapUnit">
                  <option value="px">px</option>
                  <option value="%">%</option>
                  <option value="rem">rem</option>
                </select>
              </div>
            </div>
            <button class="btn btn-primary" @click="applyGridConfig">
              应用网格配置
            </button>
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
            <!-- 单一网格容器 -->
            <div v-if="gridContainer" class="container-content">
              <div :class="{ 'selected': selectedComponentId === gridContainer.id }"
                   :style="getGridContainerStyle(gridContainer)"
                   class="layout-container grid-container"
                   @click="selectComponent(gridContainer.id)">
                <div :style="getGridTemplateStyle(gridContainer)" class="grid-cells">
                  <!-- 修改：简化合并单元格的显示 -->
                  <div v-for="cell in gridContainer.config.cells"
                       :key="cell.id"
                       :class="{
                         'selected': selectedCells.includes(cell.id),
                         'merged': cell.merged,
                         'main-merged-cell': cell.merged && isMainMergedCell(cell),
                         'sub-merged-cell': cell.merged && !isMainMergedCell(cell),
                         'span-col': cell.colSpan > 1,
                         'span-row': cell.rowSpan > 1
                       }"
                       :style="getGridCellStyle(cell)"
                       class="grid-cell"
                       @dragleave="handleGridCellDragLeave($event, cell.id)"
                       @drop="handleGridCellDrop($event, cell.id)"
                       @click.stop="handleCellClick(gridContainer.id, cell, $event)"
                       @dragover.prevent="handleGridCellDragOver($event, cell.id)"
                       @dblclick.stop="handleGridCellDoubleClick(gridContainer.id, cell)">
                    
                    <div class="cell-content">
                      <!-- 合并单元格：只显示主单元格内容，子单元格为空 -->
                      <div v-if="cell.merged && isMainMergedCell(cell)" 
                           class="merged-cell-content"
                           @dragleave="handleGridCellDragLeave($event, cell.id)"
                           @drop="handleGridCellDrop($event, cell.id)"
                           @dragover.prevent="handleGridCellDragOver($event, cell.id)">
                        <!-- 合并单元格中的组件 -->
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
                        
                        <!-- 合并单元格的拖放提示（当没有组件时显示） -->
                        <div v-if="getComponentsInGridCell(cell.id).length === 0"
                             class="empty-cell-hint"
                             @dragleave="handleGridCellDragLeave($event, cell.id)"
                             @drop="handleGridCellDrop($event, cell.id)"
                             @dragover.prevent="handleGridCellDragOver($event, cell.id)">
                          <i class="fas fa-plus-circle"></i>
                          <p>拖放组件到单元格</p>
                        </div>
                      </div>
                      
                      <!-- 非合并单元格的内容 -->
                      <div v-if="!cell.merged">
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

                        <div v-if="getComponentsInGridCell(cell.id).length === 0"
                             class="empty-cell-hint"
                             @dragleave="handleGridCellDragLeave($event, cell.id)"
                             @drop="handleGridCellDrop($event, cell.id)"
                             @dragover.prevent="handleGridCellDragOver($event, cell.id)">
                          <i class="fas fa-plus-circle"></i>
                          <p>拖放组件到此单元格</p>
                        </div>
                      </div>
                      
                      <!-- 合并单元格的子单元格：完全隐藏内容 -->
                      <div v-if="cell.merged && !isMainMergedCell(cell)" class="sub-merged-cell-content">
                        <!-- 子单元格完全隐藏，不显示任何内容 -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 不在网格中的组件 -->
            <div v-for="component in components.filter(c => !c.gridCellId)"
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

            <div v-if="!gridContainer && components.length === 0" class="empty-canvas-hint">
              <i class="fas fa-magic"></i>
              <h3>开始创建您的报表</h3>
              <p>从左侧设置网格配置，然后拖拽元素到网格中</p>
              <button class="btn btn-primary" @click="createGridContainer">
                创建网格容器
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
          <div v-if="selectedComponent.type === 'grid'" class="setting-panel">
            <!-- 网格容器属性 -->
            <div class="setting-group">
              <h3 class="setting-title">网格设置</h3>
              <div class="setting-item">
                <label>行数</label>
                <input type="number" v-model.number="selectedComponent.config.rows" min="1" max="12" class="form-control" @change="updateGridCells">
              </div>
              <div class="setting-item">
                <label>列数</label>
                <input type="number" v-model.number="selectedComponent.config.columns" min="1" max="12" class="form-control" @change="updateGridCells">
              </div>
              <div class="setting-item">
                <label>间距</label>
                <input type="text" v-model="selectedComponent.config.gap" class="form-control" @change="updateGridStyle">
              </div>
            </div>

            <div class="setting-group">
              <h3 class="setting-title">尺寸设置</h3>
              <div class="setting-item">
                <label>宽度</label>
                <div class="range-input">
                  <input type="range" v-model.number="selectedComponent.config.width.value" min="10" max="2000" step="10">
                  <input type="text" v-model.number="selectedComponent.config.width.value" class="form-control">
                  <select v-model="selectedComponent.config.width.unit">
                    <option value="%">%</option>
                    <option value="px">px</option>
                    <option value="vw">vw</option>
                  </select>
                </div>
              </div>
              <div class="setting-item">
                <label>高度</label>
                <div class="range-input">
                  <input type="range" v-model.number="selectedComponent.config.height.value" min="100" max="2000" step="10">
                  <input type="text" v-model.number="selectedComponent.config.height.value" class="form-control">
                  <select v-model="selectedComponent.config.height.unit">
                    <option value="px">px</option>
                    <option value="%">%</option>
                    <option value="vh">vh</option>
                    <option value="auto">auto</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="setting-group">
              <h3 class="setting-title">边距设置</h3>
              <div class="spacing-controls">
                <div class="spacing-item">
                  <label>上边距</label>
                  <input type="text" v-model="selectedComponent.config.margin.top" class="form-control">
                </div>
                <div class="spacing-item">
                  <label>右边距</label>
                  <input type="text" v-model="selectedComponent.config.margin.right" class="form-control">
                </div>
                <div class="spacing-item">
                  <label>下边距</label>
                  <input type="text" v-model="selectedComponent.config.margin.bottom" class="form-control">
                </div>
                <div class="spacing-item">
                  <label>左边距</label>
                  <input type="text" v-model="selectedComponent.config.margin.left" class="form-control">
                </div>
              </div>
            </div>

            <div class="setting-group">
              <h3 class="setting-title">背景颜色</h3>
              <div class="color-picker">
                <input type="color" v-model="selectedComponent.config.backgroundColor" @change="updateGridStyle">
                <input type="text" v-model="selectedComponent.config.backgroundColor" class="form-control" placeholder="#ffffff">
              </div>
            </div>
          </div>

          <!-- 网格单元格属性 -->
          <div v-else-if="selectedComponent.type === 'grid-cell'" class="setting-panel">
            <div class="setting-group">
              <h3 class="setting-title">单元格设置</h3>
              <div class="setting-item">
                <label>跨行数</label>
                <input type="number" v-model.number="selectedComponent.config.rowSpan" min="1" :max="gridContainer.config.rows" class="form-control" @change="updateCellSpan">
              </div>
              <div class="setting-item">
                <label>跨列数</label>
                <input type="number" v-model.number="selectedComponent.config.colSpan" min="1" :max="gridContainer.config.columns" class="form-control" @change="updateCellSpan">
              </div>
              <div class="setting-item">
                <label>合并状态</label>
                <div class="form-control">
                  <span>{{ selectedComponent.config.merged ? '已合并' : '未合并' }}</span>
                  <button v-if="selectedComponent.config.merged" class="btn btn-outline" @click="splitCell">
                    拆分
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- 普通组件属性 -->
          <div v-else class="setting-panel">
            <!-- 内容保持不变 -->
          </div>
        </div>

        <div v-else class="no-selection">
          <i class="fas fa-mouse-pointer"></i>
          <p>点击画布中的元素进行编辑</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '../api/request';
import { ElMessage } from "element-plus";

export default {
  name: 'Builder',
  data() {
    return {
      sidebarActive: false,
      propertiesPanelActive: true,
      activeTab: 'layout',
      activeModal: '',
      selectedComponentId: '',
      useGridLayout: true,
      showGridLines: true,
      isDraggingOver: false,
      currentBreakpoint: 'desktop',
      htmlEditorContent: '',
      draggingElementType: '',
      gridContainer: null,
      components: [],
      gridConfig: {
        rows: 3,
        columns: 3,
        gapValue: 10,
        gapUnit: 'px'
      },
      
      containerElements: [],
      textElements: [],
      formElements: [],
      mediaElements: [],
      allDomElements: {},
      selectedCells: []
    };
  },
  computed: {
    selectedComponent() {
      // 查找选中的网格容器
      if (this.gridContainer && this.selectedComponentId === this.gridContainer.id) {
        return this.gridContainer;
      }
      
      // 查找选中的网格单元格
      if (this.gridContainer && this.gridContainer.config.cells) {
        const cell = this.gridContainer.config.cells.find(c => c.id === this.selectedComponentId);
        if (cell) {
          // 如果是合并单元格的子单元格，返回主单元格
          if (cell.merged && !this.isMainMergedCell(cell)) {
            const mainCell = this.findMainMergedCell(cell);
            if (mainCell) {
              return {
                ...mainCell,
                type: 'grid-cell',
                name: `网格单元格 (${this.getCellAddress(mainCell.id)})`,
                icon: 'fas fa-th',
                config: {
                  rowSpan: mainCell.rowSpan || 1,
                  colSpan: mainCell.colSpan || 1,
                  merged: mainCell.merged || false
                }
              };
            }
          }
          
          return {
            ...cell,
            type: 'grid-cell',
            name: `网格单元格 (${this.getCellAddress(cell.id)})`,
            icon: 'fas fa-th',
            config: {
              rowSpan: cell.rowSpan || 1,
              colSpan: cell.colSpan || 1,
              merged: cell.merged || false
            }
          };
        }
      }
      
      // 查找选中的普通组件
      return this.components.find(c => c.id === this.selectedComponentId) || null;
    },
    showCellOperations() {
      return this.selectedCells.length > 0 && this.gridContainer;
    },
    canMerge() {
      if (this.selectedCells.length < 2) return false;
      if (!this.gridContainer) return false;
      
      const cellsToMerge = this.gridContainer.config.cells.filter(cell => 
        this.selectedCells.includes(cell.id)
      );
      
      if (cellsToMerge.length < 2) return false;
      
      const hasMergedCell = cellsToMerge.some(cell => cell.merged);
      if (hasMergedCell) return false;
      
      return this.checkCellsCanFormRectangle(cellsToMerge);
    },
    canSplit() {
      if (this.selectedCells.length !== 1) return false;
      if (!this.gridContainer) return false;
      
      const cell = this.gridContainer.config.cells.find(c => 
        c.id === this.selectedCells[0]
      );
      
      return cell && cell.merged && (cell.rowSpan > 1 || cell.colSpan > 1);
    },
    canClearMerge() {
      if (this.selectedCells.length !== 1) return false;
      if (!this.gridContainer) return false;
      
      const cell = this.gridContainer.config.cells.find(c => 
        c.id === this.selectedCells[0]
      );
      
      return cell && cell.merged;
    }
  },
  methods: {
    // 检查是否为合并单元格的主单元格
    isMainMergedCell(cell) {
      if (!cell.merged) return false;
      
      // 查找跨行跨列范围的主单元格（左上角单元格）
      if (this.gridContainer) {
        const cells = this.gridContainer.config.cells;
        for (let row = cell.row; row >= 1; row--) {
          for (let col = cell.col; col >= 1; col--) {
            const potentialMainCell = cells.find(c => 
              c.row === row && 
              c.col === col && 
              c.merged && 
              c.row === row && 
              c.col === col &&
              c.row + (c.rowSpan || 1) > cell.row &&
              c.col + (c.colSpan || 1) > cell.col
            );
            
            if (potentialMainCell && potentialMainCell.id === cell.id) {
              return true;
            }
          }
        }
      }
      
      // 默认：如果找不到其他主单元格，这个就是主单元格
      return true;
    },
    
    // 查找合并单元格的主单元格
    findMainMergedCell(cell) {
      if (!cell.merged || !this.gridContainer) return cell;
      
      const cells = this.gridContainer.config.cells;
      // 查找跨行跨列范围的主单元格（左上角单元格）
      for (let row = cell.row; row >= 1; row--) {
        for (let col = cell.col; col >= 1; col--) {
          const mainCell = cells.find(c => 
            c.row === row && 
            c.col === col && 
            c.merged && 
            c.row + (c.rowSpan || 1) > cell.row &&
            c.col + (c.colSpan || 1) > cell.col
          );
          
          if (mainCell) {
            return mainCell;
          }
        }
      }
      
      return cell;
    },
    
    // 创建网格容器
    createGridContainer() {
      const gridId = `grid_${Date.now()}`;
      
      this.gridContainer = {
        id: gridId,
        type: 'grid',
        name: '网格容器',
        icon: 'fas fa-th',
        config: {
          width: { value: 100, unit: '%' },
          height: { value: 600, unit: 'px' },
          display: 'grid',
          rows: this.gridConfig.rows,
          columns: this.gridConfig.columns,
          gap: `${this.gridConfig.gapValue}${this.gridConfig.gapUnit}`,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
          padding: { top: '0', right: '0', bottom: '0', left: '0' },
          backgroundColor: 'transparent',
          responsive: {
            desktop: { className: '', css: '' },
            tablet: { className: '', css: 'gap: 8px; width: 100%;' },
            mobile: { className: '', css: 'gap: 5px; width: 100%;' }
          },
          cells: []
        }
      };
      
      this.initializeGridCells();
      this.selectedComponentId = gridId;
      ElMessage.success('网格容器创建成功');
    },
    
    // 应用网格配置
    applyGridConfig() {
      if (this.gridContainer) {
        this.gridContainer.config.rows = this.gridConfig.rows;
        this.gridContainer.config.columns = this.gridConfig.columns;
        this.gridContainer.config.gap = `${this.gridConfig.gapValue}${this.gridConfig.gapUnit}`;
        this.initializeGridCells();
        ElMessage.success('网格配置已应用');
      } else {
        this.createGridContainer();
      }
    },
    
    // 初始化网格单元格
    initializeGridCells() {
      if (!this.gridContainer) return;
      
      const container = this.gridContainer;
      const rows = container.config.rows || 3;
      const columns = container.config.columns || 3;
      
      const cells = [];
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= columns; col++) {
          const cellId = `cell_${row}_${col}`;
          
          // 查找是否已存在该位置的单元格
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
    },
    
    // 更新网格单元格（当行数列数改变时）
    updateGridCells() {
      if (!this.selectedComponent || this.selectedComponent.type !== 'grid') return;
      
      const container = this.selectedComponent;
      const rows = container.config.rows;
      const columns = container.config.columns;
      
      // 创建新的单元格数组
      const newCells = [];
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= columns; col++) {
          const cellId = `cell_${row}_${col}`;
          
          // 查找是否已存在该位置的单元格
          let existingCell = null;
          if (container.config.cells && container.config.cells.length > 0) {
            existingCell = container.config.cells.find(c => c.row === row && c.col === col);
          }
          
          newCells.push({
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
      
      container.config.cells = newCells;
      
      // 更新全局网格容器
      if (this.gridContainer && this.gridContainer.id === container.id) {
        this.gridContainer.config.cells = newCells;
      }
    },
    
    // 更新网格样式
    updateGridStyle() {
      // 样式更新会自动通过响应式更新视图
    },
    
    // 更新单元格跨度
    updateCellSpan() {
      if (!this.selectedComponent || this.selectedComponent.type !== 'grid-cell') return;
      
      const cellConfig = this.selectedComponent.config;
      const rowSpan = cellConfig.rowSpan || 1;
      const colSpan = cellConfig.colSpan || 1;
      
      // 更新网格容器中的对应单元格
      if (this.gridContainer && this.gridContainer.config.cells) {
        const cell = this.gridContainer.config.cells.find(c => c.id === this.selectedComponentId);
        if (cell) {
          cell.rowSpan = rowSpan;
          cell.colSpan = colSpan;
          
          // 如果跨度过大，自动标记为合并
          if (rowSpan > 1 || colSpan > 1) {
            cell.merged = true;
            cellConfig.merged = true;
            
            // 标记其他单元格为合并的子单元格
            this.markSubMergedCells(cell);
          }
        }
      }
    },
    
    // 标记合并单元格的子单元格
    markSubMergedCells(mainCell) {
      if (!mainCell.merged || !this.gridContainer) return;
      
      const rowSpan = mainCell.rowSpan || 1;
      const colSpan = mainCell.colSpan || 1;
      
      for (let row = mainCell.row; row < mainCell.row + rowSpan; row++) {
        for (let col = mainCell.col; col < mainCell.col + colSpan; col++) {
          if (row === mainCell.row && col === mainCell.col) continue;
          
          const targetCell = this.gridContainer.config.cells.find(c => 
            c.row === row && c.col === col
          );
          
          if (targetCell) {
            targetCell.merged = true;
            targetCell.rowSpan = 1;
            targetCell.colSpan = 1;
            targetCell.components = [];
          }
        }
      }
    },
    
    // 获取单元格地址（A1, B2等）
    getCellAddress(cellId) {
      if (!this.gridContainer) return '';
      
      const cell = this.gridContainer.config.cells.find(c => c.id === cellId);
      if (!cell) return '';
      
      const colLetter = String.fromCharCode(64 + cell.col);
      return `${colLetter}${cell.row}`;
    },
    
    // 检查单元格是否能形成矩形
    checkCellsCanFormRectangle(cells) {
      if (cells.length === 0) return false;
      
      const rows = new Set(cells.map(cell => cell.row));
      const cols = new Set(cells.map(cell => cell.col));
      
      const minRow = Math.min(...rows);
      const maxRow = Math.max(...rows);
      const minCol = Math.min(...cols);
      const maxCol = Math.max(...cols);
      
      const expectedCellCount = (maxRow - minRow + 1) * (maxCol - minCol + 1);
      if (expectedCellCount !== cells.length) return false;
      
      const cellSet = new Set(cells.map(cell => `${cell.row}-${cell.col}`));
      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          if (!cellSet.has(`${row}-${col}`)) {
            return false;
          }
        }
      }
      
      return true;
    },
    
    // 处理单元格点击
    handleCellClick(containerId, cell, event) {
      if (event.ctrlKey || event.metaKey) {
        // Ctrl/Cmd 点击：切换选中状态
        const index = this.selectedCells.indexOf(cell.id);
        if (index > -1) {
          this.selectedCells.splice(index, 1);
        } else {
          this.selectedCells.push(cell.id);
        }
      } else if (event.shiftKey && this.selectedCells.length > 0) {
        // Shift 点击：选择区域
        const lastSelected = this.selectedCells[this.selectedCells.length - 1];
        this.selectCellRange(lastSelected, cell.id);
      } else {
        // 普通点击：单选
        this.selectedCells = [cell.id];
      }
      
      // 如果点击的是合并单元格的子单元格，选择主单元格
      if (cell.merged && !this.isMainMergedCell(cell)) {
        const mainCell = this.findMainMergedCell(cell);
        if (mainCell) {
          this.selectComponent(mainCell.id);
          return;
        }
      }
      
      this.selectComponent(cell.id);
    },
    
    // 选择单元格范围
    selectCellRange(startCellId, endCellId) {
      if (!this.gridContainer) return;
      
      const startCell = this.gridContainer.config.cells.find(c => c.id === startCellId);
      const endCell = this.gridContainer.config.cells.find(c => c.id === endCellId);
      if (!startCell || !endCell) return;
      
      const minRow = Math.min(startCell.row, endCell.row);
      const maxRow = Math.max(startCell.row, endCell.row);
      const minCol = Math.min(startCell.col, endCell.col);
      const maxCol = Math.max(startCell.col, endCell.col);
      
      const cellsInRange = this.gridContainer.config.cells.filter(cell => 
        cell.row >= minRow && cell.row <= maxRow &&
        cell.col >= minCol && cell.col <= maxCol
      );
      
      this.selectedCells = cellsInRange.map(cell => cell.id);
    },
    
    // 合并单元格
    mergeCells() {
      if (!this.canMerge || !this.gridContainer) return;
      
      const cellsToMerge = this.gridContainer.config.cells.filter(cell => 
        this.selectedCells.includes(cell.id)
      );
      
      if (cellsToMerge.length < 2) return;
      
      const rows = cellsToMerge.map(cell => cell.row);
      const cols = cellsToMerge.map(cell => cell.col);
      const minRow = Math.min(...rows);
      const maxRow = Math.max(...rows);
      const minCol = Math.min(...cols);
      const maxCol = Math.max(...cols);
      
      const rowSpan = maxRow - minRow + 1;
      const colSpan = maxCol - minCol + 1;
      
      const mainCell = this.gridContainer.config.cells.find(cell => 
        cell.row === minRow && cell.col === minCol
      );
      
      if (!mainCell) return;
      
      // 标记主单元格为合并状态
      mainCell.merged = true;
      mainCell.rowSpan = rowSpan;
      mainCell.colSpan = colSpan;
      
      // 收集所有需要合并的单元格中的组件
      const allComponentsInMergedCells = [];
      cellsToMerge.forEach(cell => {
        if (cell.components && cell.components.length > 0) {
          allComponentsInMergedCells.push(...cell.components);
        }
      });
      
      // 将组件转移到主单元格
      if (allComponentsInMergedCells.length > 0) {
        mainCell.components = allComponentsInMergedCells;
        
        allComponentsInMergedCells.forEach(componentId => {
          const component = this.components.find(c => c.id === componentId);
          if (component) {
            component.gridCellId = mainCell.id;
          }
        });
      }
      
      // 标记其他单元格为合并的子单元格
      cellsToMerge.forEach(cell => {
        if (cell.id !== mainCell.id) {
          cell.merged = true;
          cell.rowSpan = 1;
          cell.colSpan = 1;
          cell.components = [];
        }
      });
      
      ElMessage.success(`成功合并 ${cellsToMerge.length} 个单元格`);
      this.selectedCells = [mainCell.id];
      this.selectComponent(mainCell.id);
    },
    
    // 拆分单元格
    splitCell() {
      if (!this.canSplit || !this.gridContainer) return;
      
      const cell = this.gridContainer.config.cells.find(c => 
        c.id === this.selectedCells[0]
      );
      
      if (!cell || !cell.merged) return;
      
      const rowSpan = cell.rowSpan || 1;
      const colSpan = cell.colSpan || 1;
      
      // 重置主单元格
      cell.merged = false;
      cell.rowSpan = 1;
      cell.colSpan = 1;
      
      // 重置其他单元格
      for (let row = cell.row; row < cell.row + rowSpan; row++) {
        for (let col = cell.col; col < cell.col + colSpan; col++) {
          const targetCell = this.gridContainer.config.cells.find(c => 
            c.row === row && c.col === col
          );
          
          if (targetCell && targetCell.id !== cell.id) {
            targetCell.merged = false;
            targetCell.rowSpan = 1;
            targetCell.colSpan = 1;
          }
        }
      }
      
      ElMessage.success('单元格已拆分');
      this.selectedCells = [cell.id];
    },
    
    // 清除合并
    clearMerge() {
      if (!this.canClearMerge || !this.gridContainer) return;
      
      const cell = this.gridContainer.config.cells.find(c => 
        c.id === this.selectedCells[0]
      );
      
      if (!cell || !cell.merged) return;
      
      const rowSpan = cell.rowSpan || 1;
      const colSpan = cell.colSpan || 1;
      
      cell.merged = false;
      cell.rowSpan = 1;
      cell.colSpan = 1;
      
      for (let row = cell.row; row < cell.row + rowSpan; row++) {
        for (let col = cell.col; col < cell.col + colSpan; col++) {
          const targetCell = this.gridContainer.config.cells.find(c => 
            c.row === row && c.col === col
          );
          
          if (targetCell && targetCell.id !== cell.id) {
            targetCell.merged = false;
            targetCell.rowSpan = 1;
            targetCell.colSpan = 1;
          }
        }
      }
      
      ElMessage.success('已清除合并');
      this.selectedCells = [cell.id];
    },
    
    // 画布点击事件
    handleCanvasClick(event) {
      if (!event.target.closest('.grid-cell') && !event.target.closest('.layout-container')) {
        this.selectedCells = [];
      }
    },
    
    // 获取网格单元格中的组件
    getComponentsInGridCell(cellId) {
      return this.components.filter(component => component.gridCellId === cellId);
    },
    
    // 获取网格容器样式
    getGridContainerStyle(container) {
      if (!container || !container.config) return {};
      const config = container.config;
      
      return {
        width: (config.width?.value || 100) + (config.width?.unit || '%'),
        height: (config.height?.value || 600) + (config.height?.unit || 'px'),
        margin: `${config.margin?.top || '0'} ${config.margin?.right || '0'} ${config.margin?.bottom || '0'} ${config.margin?.left || '0'}`,
        padding: '0',
        'background-color': config.backgroundColor || 'transparent',
        'overflow': 'visible',
        'box-sizing': 'border-box'
      };
    },
    
    // 获取网格模板样式
    getGridTemplateStyle(container) {
      if (!container || !container.config) return {};
      const config = container.config;
      
      return {
        display: 'grid',
        'grid-template-rows': `repeat(${config.rows || 3}, minmax(80px, 1fr))`,
        'grid-template-columns': `repeat(${config.columns || 3}, minmax(100px, 1fr))`,
        gap: config.gap || '10px',
        'min-height': '200px',
        'flex': '1',
        'width': '100%',
        'height': '100%',
        'box-sizing': 'border-box'
      };
    },
    
    // 获取网格单元格样式
    getGridCellStyle(cell) {
      if (!cell) return {};
      
      const style = {
        'grid-row': `${cell.row || 1} / span ${cell.rowSpan || 1}`,
        'grid-column': `${cell.col || 1} / span ${cell.colSpan || 1}`,
        'min-height': '80px',
        'min-width': '100px',
        'box-sizing': 'border-box',
        'overflow': 'hidden'
      };

      if (cell.merged) {
        // 主合并单元格显示边框
        if (this.isMainMergedCell(cell)) {
          style.border = '1px solid var(--border-color)';
          style.backgroundColor = 'white';
        } else {
          // 子合并单元格隐藏边框和背景
          style.border = 'none';
          style.backgroundColor = 'transparent';
          style.minHeight = '0';
          style.minWidth = '0';
        }
      }

      return style;
    },
    
    // 获取组件样式
    getComponentStyle(component) {
      if (!component || !component.config) return {};
      const config = component.config;
      
      return {
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
        'border-width': config.borderWidth || '0',
        'border-style': config.borderStyle || 'solid',
        'border-color': config.borderColor || '#dddddd',
        'border-radius': (config.borderRadius || '0') + 'px'
      };
    },
    
    // 渲染组件内容
    renderComponentContent(component) {
      if (!component) return '';
      
      if (component.content) {
        return component.content;
      }
      
      // 默认内容
      const defaults = {
        'div': '<div style="padding: 8px; background: #f0f0f0; border-radius: 4px;">容器</div>',
        'span': '<span style="padding: 4px 8px; background: #e6f7ff; border-radius: 4px;">文本内容</span>',
        'p': '<p>段落文本</p>',
        'h1': '<h1>标题1</h1>',
        'h2': '<h2>标题2</h2>',
        'button': '<button style="padding: 6px 12px; background: var(--primary-color); color: white; border: none; border-radius: 4px;">按钮</button>',
        'input': '<input type="text" placeholder="输入文本" style="padding: 6px; border: 1px solid #ddd; border-radius: 4px; width: 100%;">',
        'img': '<img src="https://via.placeholder.com/100x60?text=图片" alt="图片" style="max-width: 100%; height: auto; display: block;">'
      };
      
      return defaults[component.type] || `<div style="color: #666; padding: 8px;">${component.name || '组件'}</div>`;
    },
    
    // 拖拽相关方法
    handleDomTypeDragStart(event, domType) {
      this.draggingElementType = domType;
      event.dataTransfer.setData('text/plain', domType);
      event.target.classList.add('dragging');
      setTimeout(() => {
        event.target.classList.remove('dragging');
      }, 0);
    },
    
    handleGridCellDragOver(e, cellId) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      
      const cellElement = e.target.closest('.grid-cell');
      if (cellElement) {
        // 获取单元格对象
        const cell = this.gridContainer?.config.cells.find(c => c.id === cellId);
        if (cell) {
          // 如果是合并单元格的子单元格，找到主单元格
          const targetCell = cell.merged && !this.isMainMergedCell(cell) ? 
            this.findMainMergedCell(cell) : cell;
          
          if (targetCell) {
            // 只对主单元格或非合并单元格显示拖放效果
            const targetElement = document.querySelector(`[data-cell-id="${targetCell.id}"]`) || cellElement;
            targetElement.style.borderColor = 'var(--primary-color)';
            targetElement.style.backgroundColor = 'rgba(255, 131, 38, 0.1)';
          }
        } else {
          cellElement.style.borderColor = 'var(--primary-color)';
          cellElement.style.backgroundColor = 'rgba(255, 131, 38, 0.1)';
        }
      }
    },
    
    handleGridCellDragLeave(e, cellId) {
      e.preventDefault();
      e.stopPropagation();
      
      const cellElement = e.target.closest('.grid-cell');
      if (cellElement) {
        const cell = this.gridContainer?.config.cells.find(c => c.id === cellId);
        if (cell) {
          // 如果是合并单元格的子单元格，找到主单元格
          const targetCell = cell.merged && !this.isMainMergedCell(cell) ? 
            this.findMainMergedCell(cell) : cell;
          
          if (targetCell) {
            const targetElement = document.querySelector(`[data-cell-id="${targetCell.id}"]`) || cellElement;
            targetElement.style.borderColor = '';
            targetElement.style.backgroundColor = '';
          }
        } else {
          cellElement.style.borderColor = '';
          cellElement.style.backgroundColor = '';
        }
      }
    },
    
    // 修改：允许向合并单元格拖放组件
    handleGridCellDrop(e, cellId) {
      e.preventDefault();
      e.stopPropagation();

      const cellElement = e.target.closest('.grid-cell');
      if (cellElement) {
        cellElement.style.borderColor = '';
        cellElement.style.backgroundColor = '';
      }

      let elementType = this.draggingElementType;
      if (!elementType && e.dataTransfer.types.includes('text/plain')) {
        elementType = e.dataTransfer.getData('text/plain');
      }

      if (!elementType) {
        console.warn('未获取到拖拽元素类型');
        return;
      }
      
      // 检查单元格是否存在
      if (this.gridContainer) {
        const cell = this.gridContainer.config.cells.find(c => c.id === cellId);
        if (!cell) {
          ElMessage.warning('目标单元格不存在');
          return;
        }
        
        // 如果是合并单元格的子单元格，找到主单元格
        const targetCell = cell.merged && !this.isMainMergedCell(cell) ? 
          this.findMainMergedCell(cell) : cell;
        
        this.createComponent(elementType, targetCell.id);
      } else {
        ElMessage.warning('请先创建网格容器');
      }
    },
    
    // 创建组件
    createComponent(elementType, gridCellId = null) {
      if (!this.gridContainer && !gridCellId) {
        ElMessage.warning('请先创建网格容器');
        return;
      }
      
      const newId = `${elementType}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const elementInfo = this.allDomElements[elementType] || {
        name: `${elementType}元素`,
        icon: 'fas fa-cube',
        isContainer: false,
        inline: false
      };

      const componentConfig = {
        width: { value: 100, unit: '%' },
        height: { value: 'auto', unit: 'auto' },
        display: 'block',
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        padding: { top: '8px', right: '8px', bottom: '8px', left: '8px' },
        backgroundColor: 'white',
        fontSize: '14',
        fontWeight: 'normal',
        color: '#333333',
        textAlign: 'left',
        borderWidth: '0',
        borderStyle: 'solid',
        borderColor: '#dddddd',
        borderRadius: '0'
      };

      const newComponent = {
        id: newId,
        type: elementType,
        name: elementInfo.name,
        icon: elementInfo.icon,
        config: componentConfig,
        gridCellId: gridCellId,
        content: this.getDefaultContentForElement(elementType)
      };

      this.components.push(newComponent);
      
      // 如果拖放到了网格单元格中，更新单元格的组件列表
      if (gridCellId && this.gridContainer) {
        const cell = this.gridContainer.config.cells.find(c => c.id === gridCellId);
        if (cell) {
          if (!cell.components) {
            cell.components = [];
          }
          cell.components.push(newId);
        }
      }

      this.selectComponent(newId);
      this.draggingElementType = '';
      
      ElMessage.success(`已添加 ${elementInfo.name}`);
    },
    
    getDefaultContentForElement(elementType) {
      const defaults = {
        'div': '容器内容',
        'span': '文本内容',
        'p': '段落文本',
        'h1': '标题1',
        'h2': '标题2',
        'h3': '标题3',
        'button': '按钮',
        'input': '',
        'textarea': '多行文本',
        'img': '图片',
        'video': '视频',
        'audio': '音频',
        'ul': '无序列表',
        'ol': '有序列表',
        'table': '表格'
      };
      return defaults[elementType] || '组件内容';
    },
    
    // 双击网格单元格
    handleGridCellDoubleClick(containerId, cell) {
      // 如果是合并单元格的子单元格，找到主单元格
      if (cell.merged && !this.isMainMergedCell(cell)) {
        const mainCell = this.findMainMergedCell(cell);
        if (mainCell) {
          this.selectComponent(mainCell.id);
          this.activeTab = 'content';
          return;
        }
      }
      
      this.selectComponent(cell.id);
      this.activeTab = 'content';
    },
    
    // 选择组件
    selectComponent(id) {
      this.selectedComponentId = id;
      this.activeTab = 'layout';
    },
    
    // 取消选择组件
    deselectComponent() {
      this.selectedComponentId = '';
      this.selectedCells = [];
    },
    
    // 删除组件
    deleteComponent(id) {
      // 从单元格中移除组件引用
      if (this.gridContainer && this.gridContainer.config.cells) {
        this.gridContainer.config.cells.forEach(cell => {
          if (cell.components) {
            const index = cell.components.indexOf(id);
            if (index > -1) {
              cell.components.splice(index, 1);
            }
          }
        });
      }
      
      // 从组件列表中移除
      this.components = this.components.filter(c => c.id !== id);
      if (this.selectedComponentId === id) {
        this.selectedComponentId = '';
      }
      
      ElMessage.success('组件已删除');
    },
    
    // 删除网格容器
    deleteGridContainer() {
      if (this.gridContainer) {
        // 删除所有在网格中的组件
        if (this.gridContainer.config.cells) {
          this.gridContainer.config.cells.forEach(cell => {
            if (cell.components && cell.components.length > 0) {
              cell.components.forEach(componentId => {
                this.deleteComponent(componentId);
              });
            }
          });
        }
        
        this.gridContainer = null;
        this.selectedComponentId = '';
        this.selectedCells = [];
        ElMessage.success('网格容器已删除');
      }
    },
    
    // 侧边栏切换
    toggleSidebar() {
      this.sidebarActive = !this.sidebarActive;
    },
    
    // 切换网格线显示
    toggleGridLines() {
      this.showGridLines = !this.showGridLines;
    },
    
    // 切换网格布局
    toggleGridLayout() {
      this.useGridLayout = !this.useGridLayout;
    },
    
    // 重置布局
    resetLayout() {
      if (confirm('确定要重置布局吗？这将清除所有内容。')) {
        this.gridContainer = null;
        this.components = [];
        this.selectedComponentId = '';
        this.selectedCells = [];
        ElMessage.success('布局已重置');
      }
    },
    
    // 导出HTML
    exportHtml() {
      const htmlContent = this.generateHtml();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'jquick-bi-report.html';
      a.click();
      URL.revokeObjectURL(url);
      ElMessage.success('HTML已导出');
    },
    
    // 预览HTML
    previewHtml() {
      const htmlContent = this.generateHtml();
      const previewWindow = window.open();
      previewWindow.document.write(htmlContent);
      previewWindow.document.close();
      ElMessage.success('预览已打开');
    },
    
    // 生成HTML
    generateHtml() {
      let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JQuick BI 报表</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3e50; background-color: #f9f9f9; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">`;
      
      // 生成网格容器HTML
      if (this.gridContainer) {
        const container = this.gridContainer;
        html += `
        <div class="grid-container" style="
            display: grid;
            grid-template-rows: repeat(${container.config.rows || 3}, 1fr);
            grid-template-columns: repeat(${container.config.columns || 3}, 1fr);
            gap: ${container.config.gap || '10px'};
            margin: ${container.config.margin?.top || '0'} ${container.config.margin?.right || '0'} ${container.config.margin?.bottom || '0'} ${container.config.margin?.left || '0'};
            padding: 0;
            background-color: ${container.config.backgroundColor || 'transparent'};
            width: ${container.config.width?.value || '100'}${container.config.width?.unit || '%'};
            min-height: ${container.config.height?.value || '600'}${container.config.height?.unit || 'px'};
        ">`;
        
        // 只生成非合并单元格和合并单元格的主单元格
        container.config.cells.forEach(cell => {
          // 跳过合并单元格的子单元格
          if (cell.merged && !this.isMainMergedCell(cell)) {
            return;
          }
          
          html += `
            <div class="grid-cell" style="
                grid-row: ${cell.row} / span ${cell.rowSpan || 1};
                grid-column: ${cell.col} / span ${cell.colSpan || 1};
                border: 1px solid #ddd;
                border-radius: 6px;
                background: white;
                padding: 10px;
                min-height: 80px;
            ">`;
          
          // 添加单元格内的组件
          if (cell.components && cell.components.length > 0) {
            cell.components.forEach(componentId => {
              const component = this.components.find(c => c.id === componentId);
              if (component) {
                html += this.generateComponentHtml(component);
              }
            });
          }
          
          html += `</div>`;
        });
        
        html += `</div>`;
      }
      
      // 生成不在网格中的组件
      this.components
        .filter(c => !c.gridCellId)
        .forEach(component => {
          html += this.generateComponentHtml(component);
        });
      
      html += `
    </div>
</body>
</html>`;
      
      return html;
    },
    
    // 生成组件HTML
    generateComponentHtml(component) {
      const style = this.getComponentStyle(component);
      const styleString = Object.entries(style)
        .filter(([key, value]) => value && value !== '' && value !== '0')
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ');
      
      let content = component.content || '';
      if (!content && component.type === 'img') {
        content = '<img src="https://via.placeholder.com/100x60?text=图片" alt="图片" style="max-width: 100%; height: auto;">';
      } else if (!content && component.type === 'button') {
        content = '按钮';
      }
      
      return `
        <div class="component ${component.type}" style="${styleString}">
            ${content}
        </div>`;
    },
    
    // 拖放相关方法
    handleDragOver(e) {
      e.preventDefault();
      this.isDraggingOver = true;
      e.dataTransfer.dropEffect = 'copy';
    },
    
    handleDragLeave() {
      this.isDraggingOver = false;
    },
    
    handleDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      this.isDraggingOver = false;
      const elementType = this.draggingElementType || e.dataTransfer.getData('text/plain');
      if (!elementType) return;
      
      // 如果还没有网格容器，先创建
      if (!this.gridContainer) {
        this.createGridContainer();
      }
      
      // 创建不在网格中的组件
      this.createComponent(elementType);
    },
    
    // 保存布局
    saveLayout() {
      const layoutData = {
        gridContainer: this.gridContainer,
        components: this.components,
        gridConfig: this.gridConfig,
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
      ElMessage.success('布局已保存！');
    },
    
    // 加载布局
    loadLayout() {
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
            this.gridContainer = layoutData.gridContainer || null;
            this.components = layoutData.components || [];
            this.gridConfig = layoutData.gridConfig || { rows: 3, columns: 3, gapValue: 10, gapUnit: 'px' };
            this.selectedComponentId = '';
            this.selectedCells = [];
            ElMessage.success('布局加载成功！');
          } catch (error) {
            console.error('加载布局失败:', error);
            ElMessage.error('加载布局失败，请检查文件格式是否正确');
          }
        };
        reader.readAsText(file);
      };
      input.click();
    },
    
    // 初始化DOM元素
    async initializeDomElements() {
      try {
        // 这里可以调用API获取元素数据
        // 暂时使用模拟数据
        this.containerElements = [
          { type: 'div', name: '容器', icon: 'fas fa-square' },
          { type: 'section', name: '区块', icon: 'fas fa-columns' }
        ];
        this.textElements = [
          { type: 'span', name: '文本', icon: 'fas fa-font' },
          { type: 'p', name: '段落', icon: 'fas fa-paragraph' },
          { type: 'h1', name: '标题1', icon: 'fas fa-heading' },
          { type: 'h2', name: '标题2', icon: 'fas fa-heading' }
        ];
        this.formElements = [
          { type: 'button', name: '按钮', icon: 'fas fa-hand-pointer' },
          { type: 'input', name: '输入框', icon: 'fas fa-edit' },
          { type: 'textarea', name: '多行文本', icon: 'fas fa-text-height' }
        ];
        this.mediaElements = [
          { type: 'img', name: '图片', icon: 'fas fa-image' }
        ];
        
        this.allDomElements = {
          'div': { name: '容器', icon: 'fas fa-square', isContainer: true, inline: false },
          'span': { name: '文本', icon: 'fas fa-font', isContainer: false, inline: true },
          'p': { name: '段落', icon: 'fas fa-paragraph', isContainer: false, inline: false },
          'h1': { name: '标题1', icon: 'fas fa-heading', isContainer: false, inline: false },
          'button': { name: '按钮', icon: 'fas fa-hand-pointer', isContainer: false, inline: false },
          'img': { name: '图片', icon: 'fas fa-image', isContainer: false, inline: false },
          'input': { name: '输入框', icon: 'fas fa-edit', isContainer: false, inline: false }
        };
        
        console.log('DOM元素数据加载完成');
      } catch (error) {
        console.error('加载DOM元素数据失败:', error);
      }
    },
    
    // HTML编辑器相关方法
    openHtmlEditor() {
      this.htmlEditorContent = this.generateHtml();
      this.activeModal = 'HTML编辑器';
    },
    
    closeModal() {
      this.activeModal = '';
    },
    
    parseHtml() {
      console.log('解析HTML:', this.htmlEditorContent);
      ElMessage.info('HTML解析功能待实现');
    },
    
    importHtml() {
      this.htmlEditorContent = this.generateHtml();
      ElMessage.success('已导入当前布局');
    },
    
    clearHtml() {
      this.htmlEditorContent = '';
      ElMessage.info('编辑器已清空');
    },
    
    applyHtml() {
      console.log('应用HTML:', this.htmlEditorContent);
      this.closeModal();
      ElMessage.info('应用HTML功能待实现');
    }
  },
  mounted() {
    this.initializeDomElements();
    
    // 添加点击事件监听器
    document.addEventListener('click', this.handleCanvasClick.bind(this));
    
    // 测试：默认创建网格容器
    setTimeout(() => {
      if (!this.gridContainer) {
        this.createGridContainer();
      }
    }, 100);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleCanvasClick);
  },
  watch: {
    currentBreakpoint(newValue) {
      console.log('切换到断点:', newValue);
    }
  }
};
</script>


<style>
:root {
  --primary-color: #ff8326;
  --secondary-color: #fff5eb;
  --border-color: #ffd5b8;
  --text-color: #2d3e50;
  --light-bg: #f9f9f9;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  --sidebar-width: 280px;
  --header-height: 60px;
  --properties-panel-width: 320px;
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

/* 合并单元格样式 */
.grid-cell.main-merged-cell {
  border: 1px solid var(--border-color) !important;
  background-color: white !important;
  z-index: 2;
}

.grid-cell.sub-merged-cell {
  border: none !important;
  background-color: transparent !important;
  min-height: 0 !important;
  min-width: 0 !important;
  pointer-events: none; /* 子单元格不接受鼠标事件 */
}

/* 子单元格内容完全隐藏 */
.sub-merged-cell-content {
  display: none !important;
}





/* 头部样式 */
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

.cell-operations-bar {
  flex: 1;
  margin: 0 20px;
  display: flex;
  align-items: center;
}

.cell-operations {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background-color: var(--secondary-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.cell-operations .action-btn {
  background-color: white;
  border: 1px solid var(--border-color);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
}

.cell-operations .action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cell-operations .action-btn:not(:disabled):hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.cell-info {
  margin-left: 10px;
  padding-left: 10px;
  border-left: 1px solid var(--border-color);
  font-size: 12px;
  color: #666;
  white-space: nowrap;
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

.search-box .el-icon {
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

/* 主要内容区域 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 侧边栏样式 */
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
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.menu-section-title {
  padding: 0 20px;
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 网格配置面板 */
.grid-config-panel {
  padding: 0 20px;
}

.grid-config-panel .setting-item {
  margin-bottom: 16px;
}

.grid-config-panel label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.grid-config-panel .form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-color);
  transition: all 0.3s;
}

.grid-config-panel .form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.1);
}

.grid-config-panel .range-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.grid-config-panel .range-input input[type="range"] {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #f0f0f0;
  outline: none;
  -webkit-appearance: none;
}

.grid-config-panel .range-input input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}

.grid-config-panel .range-input select {
  width: 60px;
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: white;
  font-size: 13px;
  color: var(--text-color);
}

.grid-config-panel .btn-primary {
  width: 100%;
  margin-top: 10px;
}

/* 菜单项样式 */
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

/* 工作区样式 */
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

/* 画布区域 */
.canvas-container {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  width: 100%;
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

/* 网格容器样式 */
.container-content {
  width: 100%;
  margin-bottom: 20px;
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

.grid-container {
  border-color: #9C27B0;
  width: 100% !important;
  min-height: 300px;
  overflow: hidden;
  display: flex !important;
  flex-direction: column !important;
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

/* 网格单元格样式 */
.grid-cell {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: white;
  min-height: 80px;
  min-width: 100px;
  transition: all 0.2s;
  position: relative;
  overflow: visible;
  box-sizing: border-box;
  cursor: pointer;
}

.grid-cell.selected {
  border: 2px solid var(--primary-color) !important;
  background-color: rgba(255, 131, 38, 0.1);
  position: relative;
  z-index: 2;
}

.grid-cell.selected::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid var(--primary-color);
  pointer-events: none;
  z-index: 1;
  border-radius: 6px;
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

/* 单元格内容样式 */
.cell-content {
  padding: 10px;
  min-height: 50px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 合并单元格内容样式 */
.merged-cell-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.merged-cell-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  border: 1px dashed #ddd;
  margin-bottom: 10px;
}

.merged-cell-indicator i {
  font-size: 20px;
  margin-bottom: 5px;
  color: #aaa;
}

/* 空单元格提示样式 */
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
  flex: 1;
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

/* 合并单元格的空提示样式 */
.merged-empty-hint {
  margin-top: 10px;
  background-color: rgba(255, 131, 38, 0.03);
  border-color: rgba(255, 131, 38, 0.3);
}

.merged-empty-hint:hover {
  background-color: rgba(255, 131, 38, 0.08);
}

/* 空画布提示 */
.empty-canvas-hint {
  text-align: center;
  padding: 80px 20px;
  color: #666;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.empty-canvas-hint .btn-primary {
  margin-top: 10px;
}

/* 属性面板样式 */
.properties-panel {
  width: var(--properties-panel-width);
  background-color: white;
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.properties-panel.active {
  display: flex;
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
  white-space: nowrap;
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

/* 设置面板通用样式 */
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

/* 范围输入样式 */
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
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.range-input .form-control {
  width: 80px;
  text-align: center;
}

.range-input select {
  width: 70px;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: white;
  font-size: 13px;
  color: var(--text-color);
  cursor: pointer;
}

.range-input span {
  font-size: 13px;
  color: #666;
  min-width: 30px;
}

/* 间距控制样式 */
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

/* 对齐按钮样式 */
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
  display: flex;
  align-items: center;
  justify-content: center;
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

.align-btn i {
  font-size: 14px;
}

/* 颜色选择器样式 */
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
  padding: 0;
}

.color-picker input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker input[type="color"]::-webkit-color-swatch {
  border: 1px solid #ddd;
  border-radius: 4px;
}

.color-picker .form-control {
  flex: 1;
}

/* 无选中状态提示 */
.no-selection {
  padding: 60px 20px;
  text-align: center;
  color: #999;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

/* 按钮样式 */
.btn {
  display: inline-flex;
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
  text-decoration: none;
  white-space: nowrap;
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

/* 画布组件样式 */
.canvas-component {
  margin: 8px 0;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: white;
  transition: all 0.2s;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
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

.component-content img {
  max-width: 100%;
  height: auto;
}

.component-content button {
  padding: 6px 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.component-content input {
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

.component-hint {
  color: #999;
  font-size: 12px;
  margin-right: 8px;
}

.text-align-left {
  text-align: left;
}

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

/* 响应式调整 */
@media (max-width: 1200px) {
  .sidebar {
    width: 240px;
  }

  .properties-panel {
    width: 300px;
  }

  .header-actions {
    flex-wrap: wrap;
    gap: 12px;
  }

  .search-box {
    width: 200px;
  }
  
  .cell-operations-bar {
    margin: 0 10px;
  }
  
  .cell-operations {
    flex-wrap: wrap;
    justify-content: center;
  }
}
@media (max-width: 768px) {
  .grid-cell.sub-merged-cell {
    display: none !important;
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
  
  .cell-operations-bar {
    order: 3;
    width: 100%;
    margin: 10px 0;
  }
  
  .header-actions {
    flex-wrap: wrap;
  }

  .spacing-controls {
    grid-template-columns: 1fr;
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
    flex-wrap: wrap;
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
  
  .cell-operations-bar {
    display: none;
  }
  
  .cell-info {
    display: none;
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

@media (max-width: 576px) {
  :root {
    --header-height: 56px;
    --sidebar-width: 260px;
    --properties-panel-width: 280px;
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

  .page-title {
    font-size: 20px;
  }

  .page-description {
    font-size: 12px;
  }

  .panel-tabs {
    overflow-x: auto;
  }
  .tab-item {
    min-width: 80px;
    font-size: 12px;
  }

  .setting-group {
    margin-bottom: 16px;
  }

  .setting-title {
    font-size: 14px;
  }
}
</style>