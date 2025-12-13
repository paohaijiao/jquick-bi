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
      <div class="header-main-actions">
        <button class="action-btn" @click="exportHtml">
          <i class="fas fa-code"></i>导出HTML
        </button>
        <button class="action-btn" @click="previewHtml">
          <i class="fas fa-eye"></i>预览
        </button>
        <button class="action-btn" @click="openHtmlEditor">
          <i class="fas fa-code"></i>编辑器
        </button>
        <button class="action-btn" @click="resetLayout">
          <i class="fas fa-redo"></i>重置布局
        </button>
      </div>
      <div class="header-secondary-actions">
        <button class="action-btn compact" @click="toggleGridLayout">
          <i :class="useGridLayout ? 'fas fa-th' : 'fas fa-th-large'" :title="useGridLayout ? '网格布局' : '自由布局'"></i>
        </button>
        <button class="action-btn compact" @click="toggleGridLines">
          <i :class="showGridLines ? 'fas fa-eye-slash' : 'fas fa-eye'" :title="showGridLines ? '隐藏网格' : '显示网格'"></i>
        </button>
        <div class="user-profile compact">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <span class="username">管理员</span>
        </div>
      </div>
    </header>

    <div class="main-content">
      <aside class="sidebar" :class="{ active: sidebarActive }">
        <div class="menu-section">
          <div class="menu-section-title text-align-left">布局元素</div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'row')">
            <i class="fas fa-grip-horizontal"></i>
            <span>行容器 (Row)</span>
          </div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'col')">
            <i class="fas fa-columns"></i>
            <span>列容器 (Col)</span>
          </div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'grid')">
            <i class="fas fa-th"></i>
            <span>网格容器 (Grid)</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">内容元素</div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'card')">
            <i class="fas fa-square"></i>
            <span>卡片 (Card)</span>
          </div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'panel')">
            <i class="fas fa-window-maximize"></i>
            <span>面板 (Panel)</span>
          </div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'widget')">
            <i class="fas fa-cube"></i>
            <span>组件 (Widget)</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">基础元素</div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'text')">
            <i class="fas fa-font"></i>
            <span>文本 (Text)</span>
          </div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'button')">
            <i class="fas fa-hand-pointer"></i>
            <span>按钮 (Button)</span>
          </div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'input')">
            <i class="fas fa-edit"></i>
            <span>输入框 (Input)</span>
          </div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'select')">
            <i class="fas fa-caret-square-down"></i>
            <span>下拉框 (Select)</span>
          </div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'table')">
            <i class="fas fa-table"></i>
            <span>表格 (Table)</span>
          </div>
          <div class="menu-item" draggable="true" @dragstart="handleDragStart($event, 'chart')">
            <i class="fas fa-chart-bar"></i>
            <span>图表 (Chart)</span>
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
        <div class="workspace-header">
          <div>
            <h1 class="workspace-title text-align-left">我的报表</h1>
            <p class="workspace-description">拖放元素到画布中创建页面，支持响应式布局</p>
          </div>
          <div class="workspace-actions">
            <div class="layout-controls">
              <select v-model="currentBreakpoint" class="breakpoint-select">
                <option value="desktop">桌面 (≥1200px)</option>
                <option value="tablet">平板 (768px-1199px)</option>
                <option value="mobile">手机 (<768px)</option>
              </select>
              <button class="action-btn" @click="showGridLines = !showGridLines">
                <i :class="showGridLines ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                {{ showGridLines ? '隐藏网格' : '显示网格' }}
              </button>
            </div>
          </div>
        </div>

        <div class="canvas-container" id="canvas"
             @dragover.prevent="handleDragOver"
             @drop="handleDrop"
             @dragleave="handleDragLeave">
          <div class="canvas-drag-area" :class="{
            'grid-layout': useGridLayout,
            'dragover': isDraggingOver,
            'show-grid': showGridLines
          }">
            <template v-if="layoutContainers.length > 0">
              <div
                  v-for="container in layoutContainers"
                  :key="container.id"
                  class="layout-container"
                  :class="[
                  container.type,
                  { 'selected': selectedComponentId === container.id },
                  container.config.responsive[currentBreakpoint]?.className || ''
                ]"
                  :style="getContainerStyle(container)"
                  @click="selectComponent(container.id)"
              >
                <div class="container-header">
                  <div class="container-info">
                    <i :class="container.icon"></i>
                    <span>{{ container.name }}</span>
                    <small class="container-id">#{{ container.id }}</small>
                  </div>
                  <div class="container-actions">
                    <div class="container-hint">
                      <span v-if="container.config.width">{{ container.config.width.value }}{{ container.config.width.unit }}</span>
                      <span v-if="container.config.columns">×{{ container.config.columns }}</span>
                    </div>
                    <button class="delete-btn" title="删除容器" @click.stop="deleteContainer(container.id)">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>

                <div class="container-content" :class="container.config.display">
                  <div
                      v-for="component in getComponentsInContainer(container.id)"
                      :key="component.id"
                      class="canvas-component"
                      :class="{
                      'selected': selectedComponentId === component.id,
                      'inline-component': component.inline
                    }"
                      :style="getComponentStyle(component)"
                      @click.stop="selectComponent(component.id)"
                  >
                    <div class="component-header">
                      <div class="component-info">
                        <i :class="component.icon"></i>
                        <span>{{ component.name }}</span>
                        <small class="component-id">#{{ component.id }}</small>
                      </div>
                      <div class="component-actions">
                        <button class="delete-btn" title="删除组件" @click.stop="deleteComponent(component.id)">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>

                    <div class="component-content" v-html="renderComponentContent(component)"></div>
                  </div>

                  <div v-if="getComponentsInContainer(container.id).length === 0"
                       class="empty-container-hint"
                       @dragover.prevent="handleContainerDragOver($event, container.id)"
                       @drop="handleContainerDrop($event, container.id)"
                       @dragleave="handleContainerDragLeave($event, container.id)">
                    <i class="fas fa-plus-circle"></i>
                    <p>拖放组件到此区域</p>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                  v-for="component in components.filter(c => !c.containerId)"
                  :key="component.id"
                  class="canvas-component"
                  :class="{
                  'selected': selectedComponentId === component.id,
                  'inline-component': component.inline
                }"
                  :style="getComponentStyle(component)"
                  @click="selectComponent(component.id)"
              >
                <div class="component-header">
                  <div class="component-info">
                    <i :class="component.icon"></i>
                    <span>{{ component.name }}</span>
                    <small class="component-id">#{{ component.id }}</small>
                  </div>
                  <div class="component-actions">
                    <div class="component-hint">双击编辑</div>
                    <button class="delete-btn" title="删除组件" @click.stop="deleteComponent(component.id)">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>

                <div class="component-content" v-html="renderComponentContent(component)"></div>
              </div>
            </template>
            <div v-if="layoutContainers.length === 0 && components.length === 0" class="empty-canvas-hint">
              <i class="fas fa-magic"></i>
              <h3>开始创建您的报表</h3>
              <p>从左侧拖拽元素到此处，或选择预设布局开始</p>
              <button class="btn btn-primary" @click="applyLayoutPreset('dashboard')">
                使用仪表盘模板
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="properties-panel active" :class="{ active: propertiesPanelActive }">
        <div class="panel-title">
          <i class="fas fa-sliders-h"></i>
          <span>属性设置</span>
          <button v-if="selectedComponent" class="close-panel" @click="deselectComponent">
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

        <div class="tab-content" v-if="selectedComponent">
          <div v-if="activeTab === 'layout'">
            <div class="setting-group">
              <div class="setting-title">尺寸设置</div>

              <div class="setting-item">
                <label>宽度</label>
                <div class="range-input">
                  <input type="range" min="0" max="100" step="1" v-model="selectedComponent.config.width.value">
                  <input type="text" class="form-control" v-model="selectedComponent.config.width.value">
                  <select v-model="selectedComponent.config.width.unit">
                    <option value="%">%</option>
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="vw">vw</option>
                  </select>
                </div>
              </div>

              <div class="setting-item">
                <label>高度</label>
                <div class="range-input">
                  <input type="range" min="0" max="1000" step="10" v-model="selectedComponent.config.height.value">
                  <input type="text" class="form-control" v-model="selectedComponent.config.height.value">
                  <select v-model="selectedComponent.config.height.unit">
                    <option value="px">px</option>
                    <option value="%">%</option>
                    <option value="rem">rem</option>
                    <option value="vh">vh</option>
                    <option value="auto">auto</option>
                  </select>
                </div>
              </div>

              <div class="setting-item">
                <label>显示方式</label>
                <select class="form-control" v-model="selectedComponent.config.display">
                  <option value="block">块级 (block)</option>
                  <option value="inline-block">内联块 (inline-block)</option>
                  <option value="inline">内联 (inline)</option>
                  <option value="flex">弹性盒子 (flex)</option>
                  <option value="grid">网格 (grid)</option>
                </select>
              </div>

              <div v-if="selectedComponent.config.display === 'flex'" class="setting-item">
                <label>Flex 方向</label>
                <select class="form-control" v-model="selectedComponent.config.flexDirection">
                  <option value="row">水平 (row)</option>
                  <option value="column">垂直 (column)</option>
                  <option value="row-reverse">水平反向</option>
                  <option value="column-reverse">垂直反向</option>
                </select>
              </div>

              <div v-if="selectedComponent.type === 'grid'" class="setting-item">
                <label>网格列数</label>
                <input type="number" class="form-control" v-model="selectedComponent.config.columns" min="1" max="12">
              </div>
            </div>

            <div class="setting-group">
              <div class="setting-title">边距与填充</div>

              <div class="spacing-controls">
                <div class="spacing-item">
                  <label>上边距</label>
                  <input type="text" class="form-control" v-model="selectedComponent.config.margin.top">
                </div>
                <div class="spacing-item">
                  <label>右边距</label>
                  <input type="text" class="form-control" v-model="selectedComponent.config.margin.right">
                </div>
                <div class="spacing-item">
                  <label>下边距</label>
                  <input type="text" class="form-control" v-model="selectedComponent.config.margin.bottom">
                </div>
                <div class="spacing-item">
                  <label>左边距</label>
                  <input type="text" class="form-control" v-model="selectedComponent.config.margin.left">
                </div>
              </div>

              <div class="spacing-controls">
                <div class="spacing-item">
                  <label>上填充</label>
                  <input type="text" class="form-control" v-model="selectedComponent.config.padding.top">
                </div>
                <div class="spacing-item">
                  <label>右填充</label>
                  <input type="text" class="form-control" v-model="selectedComponent.config.padding.right">
                </div>
                <div class="spacing-item">
                  <label>下填充</label>
                  <input type="text" class="form-control" v-model="selectedComponent.config.padding.bottom">
                </div>
                <div class="spacing-item">
                  <label>左填充</label>
                  <input type="text" class="form-control" v-model="selectedComponent.config.padding.left">
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'style'">
            <div class="setting-group">
              <div class="setting-title">文字样式</div>

              <div class="setting-item">
                <label>字体</label>
                <select class="form-control" v-model="selectedComponent.config.fontFamily">
                  <option value="">默认字体</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Microsoft YaHei', sans-serif">微软雅黑</option>
                  <option value="'SimSun', serif">宋体</option>
                  <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                  <option value="Georgia, serif">Georgia</option>
                </select>
              </div>

              <div class="setting-item">
                <label>字号</label>
                <div class="range-input">
                  <input type="range" min="8" max="72" step="1" v-model="selectedComponent.config.fontSize">
                  <input type="text" class="form-control" v-model="selectedComponent.config.fontSize">
                  <span>px</span>
                </div>
              </div>

              <div class="setting-item">
                <label>字重</label>
                <select class="form-control" v-model="selectedComponent.config.fontWeight">
                  <option value="normal">正常</option>
                  <option value="bold">粗体</option>
                  <option value="lighter">细体</option>
                  <option value="bolder">特粗</option>
                  <option value="100">100</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="700">700</option>
                  <option value="900">900</option>
                </select>
              </div>

              <div class="setting-item">
                <label>行高</label>
                <input type="text" class="form-control" v-model="selectedComponent.config.lineHeight">
              </div>

              <div class="setting-item">
                <label>对齐方式</label>
                <div class="align-buttons">
                  <button class="align-btn" :class="{ active: selectedComponent.config.textAlign === 'left' }"
                          @click="selectedComponent.config.textAlign = 'left'">
                    <i class="fas fa-align-left"></i>
                  </button>
                  <button class="align-btn" :class="{ active: selectedComponent.config.textAlign === 'center' }"
                          @click="selectedComponent.config.textAlign = 'center'">
                    <i class="fas fa-align-center"></i>
                  </button>
                  <button class="align-btn" :class="{ active: selectedComponent.config.textAlign === 'right' }"
                          @click="selectedComponent.config.textAlign = 'right'">
                    <i class="fas fa-align-right"></i>
                  </button>
                  <button class="align-btn" :class="{ active: selectedComponent.config.textAlign === 'justify' }"
                          @click="selectedComponent.config.textAlign = 'justify'">
                    <i class="fas fa-align-justify"></i>
                  </button>
                </div>
              </div>

              <div class="setting-item">
                <label>文字颜色</label>
                <div class="color-picker">
                  <input type="color" v-model="selectedComponent.config.color">
                  <input type="text" class="form-control" v-model="selectedComponent.config.color">
                </div>
              </div>
            </div>

            <div class="setting-group">
              <div class="setting-title">背景样式</div>

              <div class="setting-item">
                <label>背景颜色</label>
                <div class="color-picker">
                  <input type="color" v-model="selectedComponent.config.backgroundColor">
                  <input type="text" class="form-control" v-model="selectedComponent.config.backgroundColor">
                </div>
              </div>

              <div class="setting-item">
                <label>背景图片</label>
                <input type="text" class="form-control" v-model="selectedComponent.config.backgroundImage"
                       placeholder="输入图片URL">
              </div>

              <div v-if="selectedComponent.config.backgroundImage" class="setting-item">
                <label>背景尺寸</label>
                <select class="form-control" v-model="selectedComponent.config.backgroundSize">
                  <option value="cover">覆盖 (cover)</option>
                  <option value="contain">包含 (contain)</option>
                  <option value="auto">自动 (auto)</option>
                  <option value="100% 100%">拉伸</option>
                </select>
              </div>

              <div class="setting-item">
                <label>圆角</label>
                <div class="range-input">
                  <input type="range" min="0" max="50" step="1" v-model="selectedComponent.config.borderRadius">
                  <input type="text" class="form-control" v-model="selectedComponent.config.borderRadius">
                  <span>px</span>
                </div>
              </div>
            </div>

            <div class="setting-group">
              <div class="setting-title">边框样式</div>

              <div class="setting-item">
                <label>边框宽度</label>
                <input type="text" class="form-control" v-model="selectedComponent.config.borderWidth" placeholder="1px">
              </div>

              <div class="setting-item">
                <label>边框样式</label>
                <select class="form-control" v-model="selectedComponent.config.borderStyle">
                  <option value="none">无</option>
                  <option value="solid">实线</option>
                  <option value="dashed">虚线</option>
                  <option value="dotted">点线</option>
                  <option value="double">双线</option>
                </select>
              </div>

              <div class="setting-item">
                <label>边框颜色</label>
                <div class="color-picker">
                  <input type="color" v-model="selectedComponent.config.borderColor">
                  <input type="text" class="form-control" v-model="selectedComponent.config.borderColor">
                </div>
              </div>

              <div class="setting-item">
                <label>阴影</label>
                <input type="text" class="form-control" v-model="selectedComponent.config.boxShadow"
                       placeholder="e.g. 0 2px 8px rgba(0,0,0,0.1)">
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'content'">
            <div class="setting-group">
              <div class="setting-title">内容编辑</div>

              <div class="setting-item">
                <label>文本内容</label>
                <textarea class="form-control" rows="4" v-model="selectedComponent.content"></textarea>
              </div>

              <div class="setting-item">
                <label>占位文本</label>
                <input type="text" class="form-control" v-model="selectedComponent.config.placeholder">
              </div>

              <div v-if="selectedComponent.type === 'button'" class="setting-item">
                <label>按钮类型</label>
                <select class="form-control" v-model="selectedComponent.config.buttonType">
                  <option value="button">普通按钮</option>
                  <option value="submit">提交按钮</option>
                  <option value="reset">重置按钮</option>
                </select>
              </div>

              <div v-if="selectedComponent.type === 'input'" class="setting-item">
                <label>输入类型</label>
                <select class="form-control" v-model="selectedComponent.config.inputType">
                  <option value="text">文本</option>
                  <option value="number">数字</option>
                  <option value="email">邮箱</option>
                  <option value="password">密码</option>
                  <option value="date">日期</option>
                  <option value="tel">电话</option>
                </select>
              </div>

              <div v-if="selectedComponent.type === 'chart'" class="setting-item">
                <label>图表类型</label>
                <select class="form-control" v-model="selectedComponent.config.chartType">
                  <option value="bar">柱状图</option>
                  <option value="line">折线图</option>
                  <option value="pie">饼图</option>
                  <option value="area">面积图</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'advanced'">
            <div class="setting-group">
              <div class="setting-title">响应式设置</div>

              <div class="setting-item">
                <label>桌面版样式 (≥1200px)</label>
                <textarea class="form-control" rows="3"
                          v-model="selectedComponent.config.responsive.desktop.css"
                          placeholder="例如: width: 25%; margin: 10px;"></textarea>
              </div>

              <div class="setting-item">
                <label>平板版样式 (768px-1199px)</label>
                <textarea class="form-control" rows="3"
                          v-model="selectedComponent.config.responsive.tablet.css"
                          placeholder="例如: width: 50%; margin: 8px;"></textarea>
              </div>

              <div class="setting-item">
                <label>手机版样式 (<768px)</label>
                <textarea class="form-control" rows="3"
                          v-model="selectedComponent.config.responsive.mobile.css"
                          placeholder="例如: width: 100%; margin: 5px;"></textarea>
              </div>
            </div>

            <div class="setting-group">
              <div class="setting-title">自定义CSS</div>

              <div class="setting-item">
                <label>自定义样式</label>
                <textarea class="form-control" rows="6" v-model="selectedComponent.config.customCss" placeholder="输入自定义CSS样式"></textarea>
              </div>
            </div>
          </div>
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
import { defineComponent, ref, computed, watch } from 'vue';

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

    // 添加容器拖拽状态跟踪
    const containerDragStates = ref({});

    const layoutContainers = ref([
      {
        id: 'row_1',
        type: 'row',
        name: '行容器',
        icon: 'fas fa-grip-horizontal',
        config: {
          width: { value: 100, unit: '%' },
          height: { value: 200, unit: 'px' },
          display: 'flex',
          flexDirection: 'row',
          margin: { top: '10px', right: '0', bottom: '10px', left: '0' },
          padding: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
          backgroundColor: '#ffffff',
          columns: 2,
          responsive: {
            desktop: { className: 'desktop-layout', css: '' },
            tablet: { className: 'tablet-layout', css: 'flex-direction: column;' },
            mobile: { className: 'mobile-layout', css: 'flex-direction: column; width: 100%;' }
          }
        }
      },
      {
        id: 'col_1',
        type: 'col',
        name: '列容器',
        icon: 'fas fa-columns',
        parentId: 'row_1',
        config: {
          width: { value: 50, unit: '%' },
          height: { value: 'auto', unit: 'auto' },
          display: 'block',
          margin: { top: '0', right: '10px', bottom: '0', left: '0' },
          padding: { top: '15px', right: '15px', bottom: '15px', left: '15px' },
          backgroundColor: '#f8f9fa',
          responsive: {
            desktop: { className: '', css: '' },
            tablet: { className: '', css: 'width: 100%; margin: 10px 0;' },
            mobile: { className: '', css: 'width: 100%; margin: 10px 0;' }
          }
        }
      }
    ]);

    const components = ref([
      {
        id: 'text_1',
        type: 'text',
        name: '标题文本',
        icon: 'fas fa-font',
        content: '欢迎使用JQuick BI',
        containerId: 'col_1',
        inline: false,
        config: {
          width: { value: 100, unit: '%' },
          height: { value: 'auto', unit: 'auto' },
          display: 'block',
          fontSize: '24px',
          fontWeight: 'bold',
          fontFamily: "'Microsoft YaHei', sans-serif",
          color: '#333333',
          textAlign: 'left',
          lineHeight: '1.5',
          margin: { top: '0', right: '0', bottom: '15px', left: '0' },
          padding: { top: '0', right: '0', bottom: '0', left: '0' },
          backgroundColor: 'transparent',
          backgroundImage: '',
          backgroundSize: 'cover',
          borderWidth: '0',
          borderStyle: 'solid',
          borderColor: '#dddddd',
          borderRadius: '0',
          boxShadow: 'none',
          customCss: '',
          responsive: {
            desktop: { className: '', css: '' },
            tablet: { className: '', css: 'font-size: 20px;' },
            mobile: { className: '', css: 'font-size: 18px;' }
          }
        }
      },
      {
        id: 'button_1',
        type: 'button',
        name: '主要按钮',
        icon: 'fas fa-hand-pointer',
        content: '点击我',
        containerId: 'col_1',
        inline: true,
        config: {
          width: { value: 'auto', unit: 'auto' },
          height: { value: 40, unit: 'px' },
          display: 'inline-block',
          fontSize: '14px',
          fontWeight: 'normal',
          fontFamily: '',
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: '40px',
          margin: { top: '0', right: '10px', bottom: '0', left: '0' },
          padding: { top: '0', right: '20px', bottom: '0', left: '20px' },
          backgroundColor: '#ff8326',
          backgroundImage: '',
          backgroundSize: 'cover',
          borderWidth: '0',
          borderStyle: 'solid',
          borderColor: '#ff8326',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(255,131,38,0.3)',
          buttonType: 'button',
          customCss: '',
          responsive: {
            desktop: { className: '', css: '' },
            tablet: { className: '', css: 'width: 100%; margin: 10px 0;' },
            mobile: { className: '', css: 'width: 100%; margin: 10px 0;' }
          }
        }
      }
    ]);

    const selectedComponent = computed(() => {
      const allItems = [...layoutContainers.value, ...components.value];
      return allItems.find(item => item.id === selectedComponentId.value) || null;
    });

    const getComponentsInContainer = (containerId) => {
      return components.value.filter(component => component.containerId === containerId);
    };

    const getContainerStyle = (container) => {
      const config = container.config;
      const responsiveConfig = config.responsive[currentBreakpoint.value];
      let style = {
        width: config.width.value + config.width.unit,
        height: config.height.value + (config.height.unit === 'auto' ? '' : config.height.unit),
        display: config.display,
        'margin-top': config.margin.top,
        'margin-right': config.margin.right,
        'margin-bottom': config.margin.bottom,
        'margin-left': config.margin.left,
        'padding-top': config.padding.top,
        'padding-right': config.padding.right,
        'padding-bottom': config.padding.bottom,
        'padding-left': config.padding.left,
        'background-color': config.backgroundColor,
        'flex-direction': config.flexDirection || 'row'
      };

      // 添加响应式样式
      if (responsiveConfig && responsiveConfig.css) {
        const responsiveStyles = responsiveConfig.css.split(';').reduce((acc, rule) => {
          const [prop, value] = rule.split(':').map(s => s.trim());
          if (prop && value) {
            acc[prop] = value;
          }
          return acc;
        }, {});

        style = { ...style, ...responsiveStyles };
      }

      return style;
    };

    const getComponentStyle = (component) => {
      const config = component.config;
      const responsiveConfig = config.responsive[currentBreakpoint.value];

      let style = {
        width: config.width.value + (config.width.unit === 'auto' ? '' : config.width.unit),
        height: config.height.value + (config.height.unit === 'auto' ? '' : config.height.unit),
        display: config.display,
        'font-size': config.fontSize + 'px',
        'font-weight': config.fontWeight,
        'font-family': config.fontFamily,
        color: config.color,
        'text-align': config.textAlign,
        'line-height': config.lineHeight,
        'margin-top': config.margin.top,
        'margin-right': config.margin.right,
        'margin-bottom': config.margin.bottom,
        'margin-left': config.margin.left,
        'padding-top': config.padding.top,
        'padding-right': config.padding.right,
        'padding-bottom': config.padding.bottom,
        'padding-left': config.padding.left,
        'background-color': config.backgroundColor,
        'background-image': config.backgroundImage ? `url(${config.backgroundImage})` : '',
        'background-size': config.backgroundSize,
        'border-width': config.borderWidth,
        'border-style': config.borderStyle,
        'border-color': config.borderColor,
        'border-radius': config.borderRadius + 'px',
        'box-shadow': config.boxShadow
      };

      if (responsiveConfig && responsiveConfig.css) {
        const responsiveStyles = responsiveConfig.css.split(';').reduce((acc, rule) => {
          const [prop, value] = rule.split(':').map(s => s.trim());
          if (prop && value) {
            acc[prop] = value;
          }
          return acc;
        }, {});
        style = { ...style, ...responsiveStyles };
      }

      if (config.customCss) {
        const customStyles = config.customCss.split(';').reduce((acc, rule) => {
          const [prop, value] = rule.split(':').map(s => s.trim());
          if (prop && value) {
            acc[prop] = value;
          }
          return acc;
        }, {});

        style = { ...style, ...customStyles };
      }

      return style;
    };

    const renderComponentContent = (component) => {
      if (component.type === 'button') {
        return `<button type="${component.config.buttonType}"
                style="width:100%; height:100%; border:none; background:transparent; color:inherit; font:inherit;">
                ${component.content}</button>`;
      } else if (component.type === 'input') {
        return `<input type="${component.config.inputType || 'text'}"
                placeholder="${component.config.placeholder || ''}"
                style="width:100%; height:100%; border:none; background:transparent; color:inherit; font:inherit;">`;
      } else if (component.type === 'chart') {
        return `<div class="chart-placeholder">
                  <i class="fas fa-chart-${component.config.chartType || 'bar'}"></i>
                  <span>${component.content}</span>
                </div>`;
      } else if (component.type === 'select') {
        return `<select style="width:100%; height:100%; border:none; background:transparent; color:inherit; font:inherit;">
                  <option>选项1</option>
                  <option>选项2</option>
                </select>`;
      } else if (component.type === 'table') {
        return `<div class="table-placeholder">
                  <i class="fas fa-table"></i>
                  <span>${component.content}</span>
                </div>`;
      }
      return component.content;
    };

    // 处理容器区域的 dragover
    const handleContainerDragOver = (e, containerId) => {
      e.preventDefault();
      e.stopPropagation();

      // 设置容器拖拽状态
      containerDragStates.value[containerId] = true;

      // 设置拖放效果
      e.dataTransfer.dropEffect = 'copy';

      // 添加视觉反馈
      const hintElement = e.target.closest('.empty-container-hint');
      if (hintElement) {
        hintElement.style.borderColor = 'var(--primary-color)';
        hintElement.style.backgroundColor = 'rgba(255, 131, 38, 0.1)';
      }
    };

    // 处理容器区域的 dragleave
    const handleContainerDragLeave = (e, containerId) => {
      e.preventDefault();
      e.stopPropagation();

      // 清除容器拖拽状态
      if (containerDragStates.value[containerId]) {
        containerDragStates.value[containerId] = false;
      }

      // 移除视觉反馈
      const hintElement = e.target.closest('.empty-container-hint');
      if (hintElement) {
        hintElement.style.borderColor = '';
        hintElement.style.backgroundColor = '';
      }
    };

    // 处理容器区域的 drop
    const handleContainerDrop = (e, containerId) => {
      e.preventDefault();
      e.stopPropagation();

      // 清除容器拖拽状态
      containerDragStates.value[containerId] = false;

      // 移除视觉反馈
      const hintElement = e.target.closest('.empty-container-hint');
      if (hintElement) {
        hintElement.style.borderColor = '';
        hintElement.style.backgroundColor = '';
      }

      // 获取拖拽元素类型
      let elementType = draggingElementType.value;
      if (!elementType && e.dataTransfer.types.includes('text/plain')) {
        elementType = e.dataTransfer.getData('text/plain');
      }

      if (!elementType) {
        console.warn('未获取到拖拽元素类型');
        return;
      }

      // 创建新的组件并放入指定容器
      createComponent(elementType, containerId);
    };

    const handleDragStart = (event, elementType) => {
      draggingElementType.value = elementType;
      event.dataTransfer.setData('text/plain', elementType);
      event.dataTransfer.effectAllowed = 'copy';

      // 添加视觉反馈
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

    // 创建组件的通用函数
    const createComponent = (elementType, containerId = null) => {
      const newId = `${elementType}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const elementTypes = {
        row: { name: '行容器', icon: 'fas fa-grip-horizontal', isContainer: true },
        col: { name: '列容器', icon: 'fas fa-columns', isContainer: true },
        grid: { name: '网格容器', icon: 'fas fa-th', isContainer: true },
        card: { name: '卡片', icon: 'fas fa-square', isContainer: true },
        panel: { name: '面板', icon: 'fas fa-window-maximize', isContainer: true },
        widget: { name: '组件', icon: 'fas fa-cube', isContainer: false },
        text: { name: '文本', icon: 'fas fa-font', isContainer: false },
        button: { name: '按钮', icon: 'fas fa-hand-pointer', isContainer: false },
        input: { name: '输入框', icon: 'fas fa-edit', isContainer: false },
        select: { name: '下拉框', icon: 'fas fa-caret-square-down', isContainer: false },
        table: { name: '表格', icon: 'fas fa-table', isContainer: false },
        chart: { name: '图表', icon: 'fas fa-chart-bar', isContainer: false }
      };

      const elementInfo = elementTypes[elementType] || {
        name: `${elementType}元素`,
        icon: 'fas fa-cube',
        isContainer: false
      };

      const isInline = ['button', 'input'].includes(elementType);

      if (elementInfo.isContainer) {
        const containerConfig = {
          width: { value: elementType === 'col' ? 50 : 100, unit: '%' },
          height: { value: elementType === 'col' ? 'auto' : 200, unit: elementType === 'col' ? 'auto' : 'px' },
          display: elementType === 'row' ? 'flex' : elementType === 'grid' ? 'grid' : 'block',
          flexDirection: 'row',
          margin: { top: '10px', right: '0', bottom: '10px', left: '0' },
          padding: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
          backgroundColor: elementType === 'col' ? '#f8f9fa' : '#ffffff',
          columns: elementType === 'grid' ? 3 : 2,
          responsive: {
            desktop: { className: '', css: '' },
            tablet: { className: '', css: '' },
            mobile: { className: '', css: '' }
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
          text: '文本内容',
          button: '按钮',
          input: '输入框',
          select: '下拉框',
          table: '表格数据',
          chart: '图表'
        };

        const componentConfig = {
          width: { value: isInline ? 'auto' : 100, unit: isInline ? 'auto' : '%' },
          height: { value: elementType === 'button' ? 40 : elementType === 'input' ? 35 : 'auto', unit: 'px' },
          display: isInline ? 'inline-block' : 'block',
          fontSize: elementType === 'text' ? '16px' : '14px',
          fontWeight: 'normal',
          fontFamily: '',
          color: elementType === 'button' ? '#ffffff' : '#333333',
          textAlign: 'left',
          lineHeight: elementType === 'button' ? '40px' : '1.5',
          margin: { top: '0', right: isInline ? '10px' : '0', bottom: '0', left: '0' },
          padding: { top: elementType === 'button' ? '0' : elementType === 'input' ? '8px' : '10px',
            right: elementType === 'button' ? '20px' : elementType === 'input' ? '12px' : '10px',
            bottom: elementType === 'button' ? '0' : elementType === 'input' ? '8px' : '10px',
            left: elementType === 'button' ? '20px' : elementType === 'input' ? '12px' : '10px' },
          backgroundColor: elementType === 'button' ? '#ff8326' : 'transparent',
          backgroundImage: '',
          backgroundSize: 'cover',
          borderWidth: elementType === 'input' ? '1px' : '0',
          borderStyle: 'solid',
          borderColor: elementType === 'input' ? '#dddddd' : '#ff8326',
          borderRadius: elementType === 'button' ? '4px' : elementType === 'input' ? '4px' : '0',
          boxShadow: elementType === 'button' ? '0 2px 4px rgba(255,131,38,0.3)' : 'none',
          placeholder: elementType === 'input' ? '请输入内容' : '',
          buttonType: 'button',
          inputType: 'text',
          chartType: 'bar',
          customCss: '',
          responsive: {
            desktop: { className: '', css: '' },
            tablet: { className: '', css: '' },
            mobile: { className: '', css: '' }
          }
        };

        components.value.push({
          id: newId,
          type: elementType,
          name: elementInfo.name,
          icon: elementInfo.icon,
          content: contentMap[elementType] || elementInfo.name,
          containerId: containerId,
          inline: isInline,
          config: componentConfig
        });

        console.log('创建组件:', elementType, newId, '放入容器:', containerId);
      }

      selectComponent(newId);
      draggingElementType.value = '';
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingOver.value = false;

      const elementType = draggingElementType.value || e.dataTransfer.getData('text/plain');

      if (!elementType) return;

      // 创建组件，不指定容器（直接放入画布）
      createComponent(elementType);
    };

    const applyLayoutPreset = (presetType) => {
      layoutContainers.value = [];
      components.value = [];

      switch (presetType) {
        case 'header-sidebar-main':
          layoutContainers.value = [
            {
              id: 'header_1',
              type: 'row',
              name: '头部区域',
              icon: 'fas fa-grip-horizontal',
              config: {
                width: { value: 100, unit: '%' },
                height: { value: 80, unit: 'px' },
                display: 'flex',
                flexDirection: 'row',
                margin: { top: '0', right: '0', bottom: '10px', left: '0' },
                padding: { top: '0', right: '20px', bottom: '0', left: '20px' },
                backgroundColor: '#ffffff',
                columns: 2,
                responsive: {
                  desktop: { className: '', css: '' },
                  tablet: { className: '', css: 'height: 60px;' },
                  mobile: { className: '', css: 'height: 50px; padding: 0 10px;' }
                }
              }
            },
            {
              id: 'main_row',
              type: 'row',
              name: '主要内容区',
              icon: 'fas fa-grip-horizontal',
              config: {
                width: { value: 100, unit: '%' },
                height: { value: 500, unit: 'px' },
                display: 'flex',
                flexDirection: 'row',
                margin: { top: '0', right: '0', bottom: '0', left: '0' },
                padding: { top: '0', right: '0', bottom: '0', left: '0' },
                backgroundColor: '#f8f9fa',
                columns: 2,
                responsive: {
                  desktop: { className: '', css: '' },
                  tablet: { className: '', css: 'flex-direction: column;' },
                  mobile: { className: '', css: 'flex-direction: column; height: auto;' }
                }
              }
            }
          ];
          break;

        case 'three-column':
          layoutContainers.value = [
            {
              id: 'row_3col',
              type: 'row',
              name: '三栏布局',
              icon: 'fas fa-grip-horizontal',
              config: {
                width: { value: 100, unit: '%' },
                height: { value: 400, unit: 'px' },
                display: 'flex',
                flexDirection: 'row',
                margin: { top: '10px', right: '0', bottom: '10px', left: '0' },
                padding: { top: '0', right: '0', bottom: '0', left: '0' },
                backgroundColor: '#f8f9fa',
                columns: 3,
                responsive: {
                  desktop: { className: '', css: '' },
                  tablet: { className: '', css: 'flex-wrap: wrap;' },
                  mobile: { className: '', css: 'flex-direction: column; height: auto;' }
                }
              }
            }
          ];
          break;

        case 'dashboard':
          layoutContainers.value = [
            {
              id: 'dashboard_row1',
              type: 'row',
              name: '仪表盘第一行',
              icon: 'fas fa-grip-horizontal',
              config: {
                width: { value: 100, unit: '%' },
                height: { value: 200, unit: 'px' },
                display: 'flex',
                flexDirection: 'row',
                margin: { top: '10px', right: '0', bottom: '10px', left: '0' },
                padding: { top: '0', right: '0', bottom: '0', left: '0' },
                backgroundColor: '#f8f9fa',
                columns: 3,
                responsive: {
                  desktop: { className: '', css: '' },
                  tablet: { className: '', css: 'flex-wrap: wrap; height: auto;' },
                  mobile: { className: '', css: 'flex-direction: column; height: auto;' }
                }
              }
            },
            {
              id: 'dashboard_row2',
              type: 'row',
              name: '仪表盘第二行',
              icon: 'fas fa-grip-horizontal',
              config: {
                width: { value: 100, unit: '%' },
                height: { value: 300, unit: 'px' },
                display: 'flex',
                flexDirection: 'row',
                margin: { top: '0', right: '0', bottom: '10px', left: '0' },
                padding: { top: '0', right: '0', bottom: '0', left: '0' },
                backgroundColor: '#f8f9fa',
                columns: 2,
                responsive: {
                  desktop: { className: '', css: '' },
                  tablet: { className: '', css: 'flex-direction: column; height: auto;' },
                  mobile: { className: '', css: 'flex-direction: column; height: auto;' }
                }
              }
            }
          ];
          break;
      }

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
      components.value = components.value.filter(c => c.id !== id);
      if (selectedComponentId.value === id) {
        selectedComponentId.value = components.value.length > 0 ? components.value[0].id : '';
      }
    };

    const deleteContainer = (id) => {
      components.value = components.value.filter(c => c.containerId !== id);
      layoutContainers.value = layoutContainers.value.filter(c => c.id !== id);

      if (selectedComponentId.value === id) {
        selectedComponentId.value = layoutContainers.value.length > 0 ? layoutContainers.value[0].id : components.value.length > 0 ? components.value[0].id : '';
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
      return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JQuick BI 报表</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        ${layoutContainers.value.map(container => `
        .${container.id} {
            width: ${container.config.width.value}${container.config.width.unit};
            height: ${container.config.height.value}${container.config.height.unit};
            display: ${container.config.display};
            margin: ${container.config.margin.top} ${container.config.margin.right} ${container.config.margin.bottom} ${container.config.margin.left};
            padding: ${container.config.padding.top} ${container.config.padding.right} ${container.config.padding.bottom} ${container.config.padding.left};
            background-color: ${container.config.backgroundColor};
            flex-direction: ${container.config.flexDirection || 'row'};
        }
        `).join('\n')}

        ${components.value.map(component => `
        .${component.id} {
            width: ${component.config.width.value}${component.config.width.unit};
            height: ${component.config.height.value}${component.config.height.unit};
            display: ${component.config.display};
            font-size: ${component.config.fontSize}px;
            color: ${component.config.color};
            background-color: ${component.config.backgroundColor};
            margin: ${component.config.margin.top} ${component.config.margin.right} ${component.config.margin.bottom} ${component.config.margin.left};
            padding: ${component.config.padding.top} ${component.config.padding.right} ${component.config.padding.bottom} ${component.config.padding.left};
            border-radius: ${component.config.borderRadius}px;
            ${component.config.customCss}
        }
        `).join('\n')}

        @media (max-width: 1199px) {
        }

        @media (max-width: 767px) {
        }
    </style>
</head>
<body>
    <div class="container">
        ${layoutContainers.value.map(container => `
        <div class="${container.id}">
            ${getComponentsInContainer(container.id).map(component => `
            <div class="${component.id}">${component.content}</div>
            `).join('')}
        </div>
        `).join('')}
    </div>
</body>
</html>`;
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
      alert('解析功能待实现');
    };

    const importHtml = () => {
      htmlEditorContent.value = generateHtml();
    };

    const clearHtml = () => {
      htmlEditorContent.value = '';
    };

    const applyHtml = () => {
      console.log('应用HTML:', htmlEditorContent.value);
      alert('应用功能待实现');
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
      handleDragStart,
      toggleSidebar,
      toggleGridLines,
      selectComponent,
      deselectComponent,
      deleteComponent,
      deleteContainer,
      getComponentsInContainer,
      getContainerStyle,
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
      handleContainerDragOver,
      handleContainerDragLeave,
      handleContainerDrop,
      createComponent
    };
  }
});
</script>

<style>
.layout-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.breakpoint-select {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.layout-presets {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 0 15px;
}

.layout-preset {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.layout-preset:hover {
  border-color: var(--primary-color);
  background-color: rgba(255, 131, 38, 0.05);
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
  background: #ff8326;
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

.layout-container {
  margin-bottom: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  transition: all 0.2s;
}

.layout-container.selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 131, 38, 0.1);
}

.layout-container.row {
  border-color: #4CAF50;
}

.layout-container.col {
  border-color: #2196F3;
}

.layout-container.grid {
  border-color: #9C27B0;
}

.container-header {
  background: #f8f9fa;
  padding: 10px 15px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.container-id {
  color: #999;
  font-size: 12px;
}

.container-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.container-hint {
  color: #666;
  font-size: 12px;
  background: white;
  padding: 2px 8px;
  border-radius: 3px;
  border: 1px solid #ddd;
}

.container-content {
  min-height: 100px;
  padding: 15px;
}

.empty-container-hint {
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  border: 2px dashed #ddd;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
}

.empty-container-hint:hover {
  border-color: var(--primary-color);
  background-color: rgba(255, 131, 38, 0.05);
}

.empty-container-hint.dragover {
  border-color: var(--primary-color);
  background-color: rgba(255, 131, 38, 0.1);
  box-shadow: 0 0 10px rgba(255, 131, 38, 0.2);
}

.empty-container-hint i {
  font-size: 24px;
  margin-bottom: 8px;
}

.empty-canvas-hint {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-canvas-hint i {
  font-size: 48px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.empty-canvas-hint h3 {
  margin-bottom: 10px;
  font-size: 20px;
}

.empty-canvas-hint p {
  margin-bottom: 20px;
  color: #999;
}
.range-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.range-input input[type="range"] {
  flex: 1;
}

.range-input .form-control {
  width: 70px;
}

.range-input select {
  width: 60px;
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.spacing-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
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
  gap: 4px;
}

.align-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.align-btn:hover {
  background: #f5f5f5;
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
  border-radius: 4px;
  cursor: pointer;
}

.close-panel {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
}

.no-selection {
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.no-selection i {
  font-size: 36px;
  margin-bottom: 15px;
  color: #ddd;
}
.canvas-drag-area.show-grid {
  background-image:
      linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
.menu-item.dragging {
  opacity: 0.5;
  background-color: rgba(255, 131, 38, 0.1);
}
@media (max-width: 768px) {
  .layout-presets {
    grid-template-columns: 1fr;
  }

  .spacing-controls {
    grid-template-columns: 1fr;
  }

  .range-input {
    flex-direction: column;
    align-items: stretch;
  }
}

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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #f0f2f5;
  color: var(--text-color);
  line-height: 1.6;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-height: 48px;
  max-height: 48px;
  flex-shrink: 0;
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: var(--text-color);
  padding: 4px;
  margin-right: 8px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 1rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.logo i {
  font-size: 1.5rem;
}

.header-main-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
  max-width: 400px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 0 8px;
}

.header-secondary-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
  white-space: nowrap;
  flex-shrink: 0;
  height: 28px;
}

.action-btn.compact {
  padding: 4px 6px;
  width: 28px;
  justify-content: center;
}

.action-btn:hover {
  background-color: var(--secondary-color);
  border-color: var(--primary-color);
}

.action-btn i {
  font-size: 0.9rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;
  height: 28px;
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
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background-color: white;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  transition: transform 0.3s;
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
  user-select: none;
}

.menu-item:hover {
  background-color: var(--secondary-color);
}

.menu-item.dragging {
  opacity: 0.5;
  background-color: rgba(255, 131, 38, 0.1);
}

.menu-item i {
  width: 20px;
  color: var(--primary-color);
}

.workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.workspace-actions {
  display: flex;
  gap: 10px;
}

.canvas-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--bg-color);
}

.canvas-drag-area {
  min-height: 100%;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  transition: all 0.2s;
}

.canvas-drag-area.dragover {
  border-color: var(--primary-color);
  background-color: rgba(255, 131, 38, 0.1);
}

.canvas-drag-area.grid-layout {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 10px;
}

.canvas-component {
  margin: 0;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: white;
  transition: all 0.2s;
  box-sizing: border-box;
}

.canvas-component.selected {
  border: 2px solid var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.2);
}

.canvas-component.inline-component {
  display: inline-block;
  vertical-align: top;
  min-width: 100px;
}

.canvas-component:not(.inline-component) {
  width: 100%;
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

.component-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.component-hint {
  color: #999;
  font-size: 12px;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  padding: 5px;
}

.component-content {
  min-height: 40px;
  background-color: #f9f9f9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  overflow: hidden;
}

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
  white-space: nowrap;
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

.tab-item:hover {
  background-color: var(--secondary-color);
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

.btn-primary:hover {
  background-color: #e6731f;
}

.btn-outline {
  background-color: white;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.btn-outline:hover {
  background-color: var(--secondary-color);
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
  display: flex;
  flex-direction: column;
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
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.editor-container {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.editor-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.html-editor {
  flex: 1;
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: none;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  .sidebar {
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
    z-index: 99;
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .properties-panel {
    position: fixed;
    top: 60px;
    right: 0;
    bottom: 0;
    transform: translateX(100%);
    z-index: 99;
  }

  .properties-panel.active {
    transform: translateX(0);
  }

  .component-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .component-actions {
    align-self: flex-end;
  }

  .workspace-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .workspace-actions {
    width: 100%;
    justify-content: space-between;
  }

  .canvas-drag-area.grid-layout {
    gap: 8px;
  }

  .canvas-component {
    padding: 12px;
  }

  .canvas-component.inline-component {
    min-width: 80px;
  }
}
</style>