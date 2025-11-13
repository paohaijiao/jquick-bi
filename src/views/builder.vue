<template>
  <div class="container">
    <header class="header">
      <button class="mobile-menu-toggle" @click="sidebarActive = !sidebarActive">
        <i class="fas fa-bars"></i>
      </button>
      <div class="logo">
        <i class="fas fa-chart-line"></i>
        <span>JQuick BI 设计器</span>
      </div>
      <div class="header-actions">
        <button class="action-btn" @click="exportToJQuikHtml">
          <i class="fas fa-code"></i>导出JQuikHtml
        </button>
        <button class="action-btn" @click="importFromJQuikHtml">
          <i class="fas fa-file-import"></i>导入JQuikHtml
        </button>
        <button 
          class="action-btn" 
          v-preview="{ 
            reportInfo, 
            components: canvasComponents,
            onPrint: handlePrint
          }"
        >
          <i class="fas fa-eye"></i>预览
        </button>
        <button class="action-btn" @click="showComponentsModal = true">
          <i class="fas fa-cubes"></i>组件
        </button>
        <button class="action-btn" @click="showHtmlEditorModal = true">
          <i class="fas fa-code"></i>HTML编辑器
        </button>
        <button class="action-btn" @click="showSettingsModal = true">
          <i class="fas fa-cog"></i>设置
        </button>
        <div class="user-profile" @click="showUserProfileModal = true">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <span>{{currentUserInfo.realName}}</span>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <div class="main-content">
      <aside class="sidebar" :class="{ active: sidebarActive }">
        <div class="menu-section">
          <div class="menu-section-title text-align-left">HTML元素</div>
          <div class="menu-item" @click="addHtmlElement('div')">
            <i class="fas fa-square"></i>
            <span>Div 容器</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('header')">
            <i class="fas fa-heading"></i>
            <span>Header 头部</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('nav')">
            <i class="fas fa-bars"></i>
            <span>Nav 导航</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('main')">
            <i class="fas fa-home"></i>
            <span>Main 主内容</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('aside')">
            <i class="fas fa-columns"></i>
            <span>Aside 侧边栏</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('footer')">
            <i class="fas fa-shoe-prints"></i>
            <span>Footer 页脚</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title text-align-left">文本元素</div>
          <div class="menu-item" @click="addHtmlElement('h1')">
            <i class="fas fa-heading"></i>
            <span>H1 标题</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('h2')">
            <i class="fas fa-heading"></i>
            <span>H2 标题</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('h3')">
            <i class="fas fa-heading"></i>
            <span>H3 标题</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('p')">
            <i class="fas fa-paragraph"></i>
            <span>P 段落</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('span')">
            <i class="fas fa-text-width"></i>
            <span>Span 文本</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">表单元素</div>
          <div class="menu-item" @click="addHtmlElement('input')">
            <i class="fas fa-edit"></i>
            <span>Input 输入框</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('button')">
            <i class="fas fa-hand-pointer"></i>
            <span>Button 按钮</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('select')">
            <i class="fas fa-caret-square-down"></i>
            <span>Select 下拉框</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('label')">
            <i class="fas fa-tag"></i>
            <span>Label 标签</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('textarea')">
            <i class="fas fa-align-left"></i>
            <span>Textarea 文本域</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">媒体元素</div>
          <div class="menu-item" @click="addHtmlElement('img')">
            <i class="fas fa-image"></i>
            <span>Img 图片</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('svg')">
            <i class="fas fa-draw-polygon"></i>
            <span>SVG 矢量图</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('canvas')">
            <i class="fas fa-paint-brush"></i>
            <span>Canvas 画布</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">表格元素</div>
          <div class="menu-item" @click="addHtmlElement('table')">
            <i class="fas fa-table"></i>
            <span>Table 表格</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('thead')">
            <i class="fas fa-table-header"></i>
            <span>Thead 表头</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('tbody')">
            <i class="fas fa-table-body"></i>
            <span>Tbody 表体</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('tr')">
            <i class="fas fa-grip-lines"></i>
            <span>Tr 表格行</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('td')">
            <i class="fas fa-square"></i>
            <span>Td 表格单元格</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">列表元素</div>
          <div class="menu-item" @click="addHtmlElement('ul')">
            <i class="fas fa-list-ul"></i>
            <span>Ul 无序列表</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('ol')">
            <i class="fas fa-list-ol"></i>
            <span>Ol 有序列表</span>
          </div>
          <div class="menu-item" @click="addHtmlElement('li')">
            <i class="fas fa-list"></i>
            <span>Li 列表项</span>
          </div>
        </div>
      </aside>
      
      <!-- 工作区 -->
      <div class="workspace">
        <div class="workspace-header">
          <div>
            <h1 class="workspace-title text-align-left">{{ reportInfo.name }}</h1>
            <p class="workspace-description">拖放HTML元素到画布中创建您的页面，使用右侧面板编辑属性</p>
          </div>
          <div class="workspace-actions">
            <button class="action-btn" @click="showDomRelationsModal = true">
              <i class="fas fa-project-diagram"></i>DOM关系
            </button>
            <button class="action-btn" @click="showHeadSettingsModal = true">
              <i class="fas fa-cog"></i>Head设置
            </button>
          </div>
        </div>

        <div class="canvas-container" id="canvas" ref="canvasContainer">
          <!-- 可拖拽区域 -->
          <draggable 
            v-model="canvasComponents" 
            :group="{ name: 'components', pull: false, put: true }"
            @change="handleCanvasChange"
            class="canvas-drag-area"
            :sort="true"
            item-key="id"
          >
            <template #item="{ element }">
              <div 
                class="canvas-component"
                :class="[element.type, { selected: element.id === selectedComponentId }]"
                :style="getComponentStyle(element)"
                @click="selectComponent(element.id)"
                @dblclick="editComponent(element.id)"
              >
                <div class="component-header">
                  <div class="component-info">
                    <i :class="getComponentIcon(element.type)"></i>
                    <span>{{ element.name }}</span>
                    <small class="component-id">#{{ element.domId }}</small>
                  </div>
                  <div class="component-actions">
                    <div class="component-hint">双击编辑</div>
                    <button 
                      class="delete-btn" 
                      @click.stop="deleteComponent(element.id)"
                      title="删除组件"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                
                <div class="component-content" :style="getContentStyle(element)">
                  <!-- 根据元素类型渲染不同的内容 -->
                  <template v-if="element.type === 'text' || element.type === 'p' || element.type === 'span'">
                    {{ element.content || '文本内容' }}
                  </template>
                  <template v-else-if="element.type === 'button'">
                    <button class="preview-button">{{ element.content || '按钮' }}</button>
                  </template>
                  <template v-else-if="element.type === 'input'">
                    <input 
                      type="text" 
                      class="preview-input" 
                      :placeholder="element.attrs?.placeholder || '输入框'"
                      :disabled="true"
                    >
                  </template>
                  <template v-else-if="element.type === 'select'">
                    <select class="preview-select" disabled>
                      <option>{{ element.content || '下拉选项' }}</option>
                    </select>
                  </template>
                  <template v-else-if="element.type === 'img'">
                    <div class="preview-image">
                      <i class="fas fa-image"></i>
                      <span>图片: {{ element.attrs?.src || '未设置' }}</span>
                    </div>
                  </template>
                  <template v-else-if="element.type === 'table'">
                    <table class="preview-table">
                      <thead>
                        <tr>
                          <th v-for="col in 3" :key="col">标题{{ col }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in 2" :key="row">
                          <td v-for="col in 3" :key="col">数据{{ row }}-{{ col }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </template>
                  <template v-else-if="element.type === 'ul' || element.type === 'ol'">
                    <div class="preview-list">
                      <div v-for="item in 3" :key="item" class="list-item">
                        {{ element.type === 'ol' ? item + '.' : '•' }} 列表项 {{ item }}
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    {{ getComponentName(element.type) + ' 内容区域' }}
                  </template>
                </div>
                
                <!-- 显示子元素 -->
                <div class="component-children" v-if="hasChildren(element.id)">
                  <draggable 
                    :modelValue="getChildren(element.id)"
                    @change="handleChildrenChange($event, element.id)"
                    :group="{ name: 'components', pull: false, put: true }"
                    class="children-container"
                  >
                    <template #item="{ element: child }">
                      <div 
                        class="child-component"
                        :class="{ selected: child.id === selectedComponentId }"
                        @click.stop="selectComponent(child.id)"
                      >
                        <i :class="getComponentIcon(child.type)"></i>
                        <span>{{ child.name }}</span>
                      </div>
                    </template>
                  </draggable>
                </div>
              </div>
            </template>
          </draggable>
          
          <!-- 初始提示 -->
          <div 
            class="drop-zone" 
            v-if="canvasComponents.length === 0"
          >
            <i class="fas fa-plus-circle"></i>
            <p>从左侧选择HTML元素添加到画布，或使用HTML编辑器直接编辑</p>
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
          <div 
            class="tab-item" 
            :class="{ active: activeTab === 'attributes' }" 
            @click="activeTab = 'attributes'"
          >
            <i class="fas fa-tag"></i>属性
          </div>
          <div 
            class="tab-item" 
            :class="{ active: activeTab === 'style' }" 
            @click="activeTab = 'style'"
          >
            <i class="fas fa-paint-brush"></i>样式
          </div>
          <div 
            class="tab-item" 
            :class="{ active: activeTab === 'relations' }" 
            @click="activeTab = 'relations'"
          >
            <i class="fas fa-project-diagram"></i>关系
          </div>
        </div>
        
        <!-- 标签内容区 -->
        <div class="tab-content">
          <!-- 属性标签内容 -->
          <div v-if="activeTab === 'attributes'">
            <div class="setting-group" v-if="selectedComponent">
              <div class="setting-title">元素属性</div>
              
              <div class="setting-item">
                <label>元素ID</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="selectedComponent.domId"
                  @change="updateComponentProperty(selectedComponent.id, 'domId', selectedComponent.domId)"
                >
              </div>
              
              <div class="setting-item">
                <label>元素名称</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="selectedComponent.name"
                  @change="updateComponentProperty(selectedComponent.id, 'name', selectedComponent.name)"
                >
              </div>
              
              <div class="setting-item" v-if="selectedComponent.type === 'input'">
                <label>输入类型</label>
                <select 
                  class="form-control"
                  v-model="selectedComponent.attrs.type"
                  @change="updateComponentAttr(selectedComponent.id, 'type', selectedComponent.attrs.type)"
                >
                  <option value="text">文本</option>
                  <option value="password">密码</option>
                  <option value="email">邮箱</option>
                  <option value="number">数字</option>
                  <option value="date">日期</option>
                </select>
              </div>
              
              <div class="setting-item" v-if="selectedComponent.type === 'input'">
                <label>占位符</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="selectedComponent.attrs.placeholder"
                  @change="updateComponentAttr(selectedComponent.id, 'placeholder', selectedComponent.attrs.placeholder)"
                >
              </div>
              
              <div class="setting-item" v-if="selectedComponent.type === 'img'">
                <label>图片地址</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="selectedComponent.attrs.src"
                  @change="updateComponentAttr(selectedComponent.id, 'src', selectedComponent.attrs.src)"
                >
              </div>
              
              <div class="setting-item" v-if="selectedComponent.type === 'a'">
                <label>链接地址</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="selectedComponent.attrs.href"
                  @change="updateComponentAttr(selectedComponent.id, 'href', selectedComponent.attrs.href)"
                >
              </div>
              
              <div class="setting-item">
                <label>内容文本</label>
                <textarea 
                  class="form-control" 
                  rows="3"
                  v-model="selectedComponent.content"
                  @change="updateComponentProperty(selectedComponent.id, 'content', selectedComponent.content)"
                ></textarea>
              </div>
            </div>
            
            <div class="setting-group" v-if="!selectedComponent">
              <div class="setting-title">页面属性</div>
              
              <div class="setting-item">
                <label>页面标题</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="headSettings.title"
                  @change="saveHeadSettings"
                >
              </div>
              
              <div class="setting-item">
                <label>字符编码</label>
                <select 
                  class="form-control"
                  v-model="headSettings.charset"
                  @change="saveHeadSettings"
                >
                  <option value="UTF-8">UTF-8</option>
                  <option value="GBK">GBK</option>
                  <option value="ISO-8859-1">ISO-8859-1</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- 样式标签内容 -->
          <div v-if="activeTab === 'style'">
            <div class="setting-group" v-if="selectedComponent">
              <div class="setting-title">布局样式</div>
              
              <div class="setting-item">
                <label>宽度</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="selectedComponent.style.width"
                  @change="updateComponentStyle(selectedComponent.id, 'width', selectedComponent.style.width)"
                  placeholder="例如: 100px, 50%"
                >
              </div>
              
              <div class="setting-item">
                <label>高度</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="selectedComponent.style.height"
                  @change="updateComponentStyle(selectedComponent.id, 'height', selectedComponent.style.height)"
                  placeholder="例如: 100px, auto"
                >
              </div>
              
              <div class="setting-item">
                <label>内边距</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="selectedComponent.style.padding"
                  @change="updateComponentStyle(selectedComponent.id, 'padding', selectedComponent.style.padding)"
                  placeholder="例如: 10px"
                >
              </div>
              
              <div class="setting-item">
                <label>外边距</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="selectedComponent.style.margin"
                  @change="updateComponentStyle(selectedComponent.id, 'margin', selectedComponent.style.margin)"
                  placeholder="例如: 10px"
                >
              </div>
            </div>
            
            <div class="setting-group" v-if="selectedComponent">
              <div class="setting-title">外观样式</div>
              
              <div class="setting-item">
                <label>背景颜色</label>
                <el-color-picker
                  v-model="selectedComponent.style.backgroundColor"
                  @change="updateComponentStyle(selectedComponent.id, 'backgroundColor', selectedComponent.style.backgroundColor)"
                  show-alpha
                />
              </div>
              
              <div class="setting-item">
                <label>文字颜色</label>
                <el-color-picker
                  v-model="selectedComponent.style.color"
                  @change="updateComponentStyle(selectedComponent.id, 'color', selectedComponent.style.color)"
                />
              </div>
              
              <div class="setting-item">
                <label>字体大小</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="selectedComponent.style.fontSize"
                  @change="updateComponentStyle(selectedComponent.id, 'fontSize', selectedComponent.style.fontSize)"
                  placeholder="例如: 14px"
                >
              </div>
              
              <div class="setting-item">
                <label>文字对齐</label>
                <select 
                  class="form-control"
                  v-model="selectedComponent.style.textAlign"
                  @change="updateComponentStyle(selectedComponent.id, 'textAlign', selectedComponent.style.textAlign)"
                >
                  <option value="">默认</option>
                  <option value="left">左对齐</option>
                  <option value="center">居中</option>
                  <option value="right">右对齐</option>
                  <option value="justify">两端对齐</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- 关系标签内容 -->
          <div v-if="activeTab === 'relations'">
            <div class="setting-group">
              <div class="setting-title">DOM关系</div>
              
              <div class="setting-item">
                <label>父元素</label>
                <select 
                  class="form-control"
                  v-model="selectedComponentParent"
                  @change="updateParentRelation"
                >
                  <option value="">无父元素</option>
                  <option 
                    v-for="comp in availableParents" 
                    :key="comp.id" 
                    :value="comp.id"
                  >
                    {{ comp.name }} (#{{ comp.domId }})
                  </option>
                </select>
              </div>
              
              <div class="setting-item" v-if="hasChildren(selectedComponent?.id)">
                <label>子元素</label>
                <div class="children-list">
                  <div 
                    v-for="child in getChildren(selectedComponent.id)" 
                    :key="child.id"
                    class="child-item"
                  >
                    <span>{{ child.name }} (#{{ child.domId }})</span>
                    <button 
                      class="remove-btn"
                      @click="removeChildRelation(selectedComponent.id, child.id)"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="setting-group">
              <div class="setting-title">全局关系</div>
              <button class="btn btn-outline" @click="showDomRelationsModal = true">
                <i class="fas fa-project-diagram"></i> 管理DOM关系
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- HTML编辑器模态框 -->
    <div class="modal-overlay" :class="{ active: showHtmlEditorModal }" @click="showHtmlEditorModal = false">
      <div class="modal large-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">JQuikHtml 编辑器</div>
          <button class="modal-close" @click="showHtmlEditorModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="editor-container">
            <div class="editor-toolbar">
              <button class="btn btn-primary" @click="parseJQuikHtml">
                <i class="fas fa-play"></i> 解析
              </button>
              <button class="btn btn-outline" @click="generateJQuikHtml">
                <i class="fas fa-download"></i> 生成
              </button>
              <button class="btn btn-outline" @click="clearEditor">
                <i class="fas fa-trash"></i> 清空
              </button>
            </div>
            <textarea 
              class="html-editor" 
              v-model="jquikHtmlCode"
              placeholder="在此输入JQuikHtml代码..."
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showHtmlEditorModal = false">取消</button>
          <button class="btn btn-primary" @click="applyJQuikHtml">应用</button>
        </div>
      </div>
    </div>

    <!-- DOM关系管理模态框 -->
    <div class="modal-overlay" :class="{ active: showDomRelationsModal }" @click="showDomRelationsModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">DOM关系管理</div>
          <button class="modal-close" @click="showDomRelationsModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="relations-editor">
            <div class="relation-item" v-for="(relation, index) in domRelations" :key="index">
              <input 
                type="text" 
                class="form-control" 
                v-model="relation.srcId"
                placeholder="源元素ID"
              >
              <span class="relation-arrow">-></span>
              <input 
                type="text" 
                class="form-control" 
                v-model="relation.toIds"
                placeholder="目标元素ID（多个用逗号分隔）"
              >
              <button class="remove-btn" @click="removeRelation(index)">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <button class="btn btn-outline" @click="addRelation">
              <i class="fas fa-plus"></i> 添加关系
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showDomRelationsModal = false">取消</button>
          <button class="btn btn-primary" @click="saveDomRelations">保存关系</button>
        </div>
      </div>
    </div>

    <!-- Head设置模态框 -->
    <div class="modal-overlay" :class="{ active: showHeadSettingsModal }" @click="showHeadSettingsModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">Head设置</div>
          <button class="modal-close" @click="showHeadSettingsModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="head-settings">
            <div class="setting-item">
              <label>页面标题</label>
              <input type="text" class="form-control" v-model="headSettings.title">
            </div>
            <div class="setting-item">
              <label>字符编码</label>
              <select class="form-control" v-model="headSettings.charset">
                <option value="UTF-8">UTF-8</option>
                <option value="GBK">GBK</option>
                <option value="ISO-8859-1">ISO-8859-1</option>
              </select>
            </div>
            <div class="setting-item">
              <label>视口设置</label>
              <input type="text" class="form-control" v-model="headSettings.viewport" placeholder="width=device-width, initial-scale=1.0">
            </div>
          </div>
          
          <div class="meta-items">
            <div class="setting-title">Meta标签</div>
            <div class="meta-item" v-for="(meta, index) in headSettings.meta" :key="index">
              <input 
                type="text" 
                class="form-control" 
                v-model="meta.name"
                placeholder="name属性"
              >
              <input 
                type="text" 
                class="form-control" 
                v-model="meta.content"
                placeholder="content属性"
              >
              <button class="remove-btn" @click="removeMeta(index)">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <button class="btn btn-outline" @click="addMeta">
              <i class="fas fa-plus"></i> 添加Meta标签
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showHeadSettingsModal = false">取消</button>
          <button class="btn btn-primary" @click="saveHeadSettings">保存设置</button>
        </div>
      </div>
    </div>

    <!-- 其他模态框保持不变 -->
    <!-- ... 个人中心、设置等模态框 ... -->
  </div>
</template>

<script>
export default {
  name: 'JQuikHtmlDesigner'
}
</script>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import draggable from 'vuedraggable';
import { ElMessage } from 'element-plus';

// 状态管理
const sidebarActive = ref(false);
const propertiesPanelActive = ref(true);
const selectedComponentId = ref(null);
const canvasComponents = ref([]);
const showHtmlEditorModal = ref(false);
const showDomRelationsModal = ref(false);
const showHeadSettingsModal = ref(false);
const activeTab = ref('attributes');
const jquikHtmlCode = ref('');

// DOM关系
const domRelations = ref([]);

// Head设置
const headSettings = reactive({
  title: 'JQuick BI 报表',
  charset: 'UTF-8',
  viewport: 'width=device-width, initial-scale=1.0',
  meta: [
    { name: 'description', content: 'JQuick BI 报表设计' },
    { name: 'keywords', content: 'BI,报表,数据分析' }
  ]
});

// 获取选中的组件
const selectedComponent = computed(() => {
  return canvasComponents.value.find(comp => comp.id === selectedComponentId.value) || null;
});

// 获取可用的父元素
const availableParents = computed(() => {
  return canvasComponents.value.filter(comp => 
    comp.id !== selectedComponentId.value && 
    isContainerElement(comp.type)
  );
});

// 获取选中组件的父元素ID
const selectedComponentParent = computed({
  get: () => {
    if (!selectedComponent.value) return '';
    const parent = canvasComponents.value.find(comp => 
      comp.children?.includes(selectedComponent.value.id)
    );
    return parent ? parent.id : '';
  },
  set: (value) => {
    // 在setter中处理父元素更新
  }
});

// 辅助函数：生成唯一ID
const generateId = () => {
  return 'comp_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
};

// 辅助函数：生成DOM ID
const generateDomId = (type) => {
  return type + '_' + Math.floor(Math.random() * 10000);
};

// 添加HTML元素
const addHtmlElement = (type) => {
  const element = {
    id: generateId(),
    domId: generateDomId(type),
    type: type,
    name: getComponentName(type),
    content: getDefaultContent(type),
    attrs: getDefaultAttrs(type),
    style: getDefaultStyle(type),
    children: []
  };
  
  canvasComponents.value.push(element);
  handleCanvasChange();
  selectComponent(element.id);
};

// 获取组件默认内容
const getDefaultContent = (type) => {
  const contents = {
    'h1': '一级标题',
    'h2': '二级标题',
    'h3': '三级标题',
    'p': '这是一个段落文本',
    'button': '按钮',
    'span': '文本内容'
  };
  return contents[type] || '';
};

// 获取组件默认属性
const getDefaultAttrs = (type) => {
  const attrs = {
    'input': { type: 'text', placeholder: '请输入内容' },
    'img': { src: '', alt: '图片' },
    'a': { href: '#' }
  };
  return attrs[type] || {};
};

// 获取组件默认样式
const getDefaultStyle = (type) => {
  const styles = {
    'div': { padding: '10px', margin: '5px', border: '1px solid #ddd' },
    'button': { padding: '8px 16px', backgroundColor: '#ff8326', color: 'white', border: 'none' },
    'input': { padding: '8px', border: '1px solid #ddd', width: '200px' },
    'table': { width: '100%', borderCollapse: 'collapse' },
    'th': { padding: '8px', border: '1px solid #ddd', backgroundColor: '#f5f5f5' },
    'td': { padding: '8px', border: '1px solid #ddd' }
  };
  return { ...styles[type] };
};

// 判断是否为容器元素
const isContainerElement = (type) => {
  const containers = ['div', 'section', 'main', 'aside', 'header', 'footer', 'nav', 'ul', 'ol', 'table', 'thead', 'tbody'];
  return containers.includes(type);
};

// 获取组件图标
const getComponentIcon = (type) => {
  const icons = {
    'div': 'fas fa-square',
    'header': 'fas fa-heading',
    'nav': 'fas fa-bars',
    'main': 'fas fa-home',
    'aside': 'fas fa-columns',
    'footer': 'fas fa-shoe-prints',
    'h1': 'fas fa-heading',
    'h2': 'fas fa-heading',
    'h3': 'fas fa-heading',
    'p': 'fas fa-paragraph',
    'span': 'fas fa-text-width',
    'button': 'fas fa-hand-pointer',
    'input': 'fas fa-edit',
    'select': 'fas fa-caret-square-down',
    'label': 'fas fa-tag',
    'img': 'fas fa-image',
    'svg': 'fas fa-draw-polygon',
    'canvas': 'fas fa-paint-brush',
    'table': 'fas fa-table',
    'thead': 'fas fa-table-header',
    'tbody': 'fas fa-table-body',
    'tr': 'fas fa-grip-lines',
    'td': 'fas fa-square',
    'ul': 'fas fa-list-ul',
    'ol': 'fas fa-list-ol',
    'li': 'fas fa-list'
  };
  return icons[type] || 'fas fa-cube';
};

// 获取组件名称
const getComponentName = (type) => {
  const names = {
    'div': 'Div 容器',
    'header': 'Header 头部',
    'nav': 'Nav 导航',
    'main': 'Main 主内容',
    'aside': 'Aside 侧边栏',
    'footer': 'Footer 页脚',
    'h1': 'H1 标题',
    'h2': 'H2 标题',
    'h3': 'H3 标题',
    'p': 'P 段落',
    'span': 'Span 文本',
    'button': 'Button 按钮',
    'input': 'Input 输入框',
    'select': 'Select 下拉框',
    'label': 'Label 标签',
    'img': 'Img 图片',
    'svg': 'SVG 矢量图',
    'canvas': 'Canvas 画布',
    'table': 'Table 表格',
    'thead': 'Thead 表头',
    'tbody': 'Tbody 表体',
    'tr': 'Tr 表格行',
    'td': 'Td 表格单元格',
    'ul': 'Ul 无序列表',
    'ol': 'Ol 有序列表',
    'li': 'Li 列表项'
  };
  return names[type] || type;
};

// 获取组件样式
const getComponentStyle = (element) => {
  const baseStyle = {
    margin: '10px',
    padding: element.style.padding || '15px',
    border: element.id === selectedComponentId.value ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: element.id === selectedComponentId.value ? '0 0 0 2px rgba(255, 131, 38, 0.2)' : 'none'
  };
  
  // 合并自定义样式
  return { ...baseStyle, ...element.style };
};

// 获取内容区域样式
const getContentStyle = (element) => {
  const contentStyles = {
    'button': { padding: '8px 16px', backgroundColor: '#ff8326', color: 'white', border: 'none' },
    'input': { padding: '8px', border: '1px solid #ddd', width: '200px' }
  };
  
  return {
    minHeight: '40px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    ...contentStyles[element.type]
  };
};

// 检查是否有子元素
const hasChildren = (componentId) => {
  const component = canvasComponents.value.find(comp => comp.id === componentId);
  return component && component.children && component.children.length > 0;
};

// 获取子元素
const getChildren = (componentId) => {
  const component = canvasComponents.value.find(comp => comp.id === componentId);
  if (!component || !component.children) return [];
  
  return component.children
    .map(childId => canvasComponents.value.find(comp => comp.id === childId))
    .filter(Boolean);
};

// 处理子元素变化
const handleChildrenChange = (event, parentId) => {
  if (event.added) {
    const component = canvasComponents.value.find(comp => comp.id === parentId);
    if (component && !component.children.includes(event.added.element.id)) {
      if (!component.children) component.children = [];
      component.children.push(event.added.element.id);
    }
  }
  handleCanvasChange();
};

// 更新父元素关系
const updateParentRelation = (event) => {
  const newParentId = event.target.value;
  const componentId = selectedComponentId.value;
  
  if (!componentId) return;
  
  // 从当前父元素中移除
  canvasComponents.value.forEach(comp => {
    if (comp.children && comp.children.includes(componentId)) {
      comp.children = comp.children.filter(id => id !== componentId);
    }
  });
  
  // 添加到新父元素
  if (newParentId) {
    const newParent = canvasComponents.value.find(comp => comp.id === newParentId);
    if (newParent) {
      if (!newParent.children) newParent.children = [];
      newParent.children.push(componentId);
    }
  }
  
  handleCanvasChange();
};

// 移除子元素关系
const removeChildRelation = (parentId, childId) => {
  const parent = canvasComponents.value.find(comp => comp.id === parentId);
  if (parent && parent.children) {
    parent.children = parent.children.filter(id => id !== childId);
    handleCanvasChange();
  }
};

// 添加DOM关系
const addRelation = () => {
  domRelations.value.push({ srcId: '', toIds: '' });
};

// 移除DOM关系
const removeRelation = (index) => {
  domRelations.value.splice(index, 1);
};

// 保存DOM关系
const saveDomRelations = () => {
  showDomRelationsModal.value = false;
  saveToLocalStorage();
};

// 添加Meta标签
const addMeta = () => {
  headSettings.meta.push({ name: '', content: '' });
};

// 移除Meta标签
const removeMeta = (index) => {
  headSettings.meta.splice(index, 1);
};

// 保存Head设置
const saveHeadSettings = () => {
  showHeadSettingsModal.value = false;
  saveToLocalStorage();
};

// 生成JQuikHtml代码
const generateJQuikHtml = () => {
  let code = '';
  
  // 生成head部分
  code += `head: {\n`;
  code += `  title: "${headSettings.title}";\n`;
  code += `  meta { charset: "${headSettings.charset}"; }\n`;
  code += `  meta { name: "viewport"; content: "${headSettings.viewport}"; }\n`;
  
  headSettings.meta.forEach(meta => {
    if (meta.name && meta.content) {
      code += `  meta { name: "${meta.name}"; content: "${meta.content}"; }\n`;
    }
  });
  
  code += `};\n\n`;
  
  // 生成DOM定义
  canvasComponents.value.forEach(comp => {
    code += `${comp.type}[${comp.domId}]: { `;
    
    // 添加属性
    if (comp.attrs && Object.keys(comp.attrs).length > 0) {
      Object.entries(comp.attrs).forEach(([key, value]) => {
        if (value) code += `${key}: "${value}"; `;
      });
    }
    
    // 添加样式
    if (comp.style && Object.keys(comp.style).length > 0) {
      Object.entries(comp.style).forEach(([key, value]) => {
        if (value) code += `style-${key}: "${value}"; `;
      });
    }
    
    code += `} `;
    
    // 添加内容
    if (comp.content) {
      code += `:: "${comp.content}"`;
    }
    
    code += `;\n`;
  });
  
  code += `\n`;
  
  // 生成DOM关系
  if (domRelations.value.length > 0) {
    code += `domRels\n`;
    domRelations.value.forEach(relation => {
      if (relation.srcId && relation.toIds) {
        code += `  ${relation.srcId} -> ${relation.toIds};\n`;
      }
    });
    code += `;`;
  }
  
  jquikHtmlCode.value = code;
};

// 解析JQuikHtml代码
const parseJQuikHtml = () => {
  // 这里应该调用ANTLR解析器来解析代码
  // 由于解析器实现较复杂，这里只做简单演示
  ElMessage.info('JQuikHtml解析功能需要集成ANTLR解析器');
};

// 应用JQuikHtml代码
const applyJQuikHtml = () => {
  // 这里应该调用ANTLR解析器来解析并应用代码
  ElMessage.info('JQuikHtml应用功能需要集成ANTLR解析器');
  showHtmlEditorModal.value = false;
};

// 清空编辑器
const clearEditor = () => {
  jquikHtmlCode.value = '';
};

// 导出为JQuikHtml
const exportToJQuikHtml = () => {
  generateJQuikHtml();
  showHtmlEditorModal.value = true;
};

// 从JQuikHtml导入
const importFromJQuikHtml = () => {
  showHtmlEditorModal.value = true;
};

// 其他方法保持不变
// ... selectComponent, handleCanvasChange, updateComponentProperty, deleteComponent, etc.

// 保存到本地存储
const saveToLocalStorage = () => {
  const data = {
    canvasComponents: canvasComponents.value,
    headSettings: headSettings,
    domRelations: domRelations.value
  };
  localStorage.setItem('jquikHtmlDesignerData', JSON.stringify(data));
};

// 组件加载时从本地存储恢复数据
onMounted(() => {
  const savedData = localStorage.getItem('jquikHtmlDesignerData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    canvasComponents.value = parsedData.canvasComponents || [];
    Object.assign(headSettings, parsedData.headSettings || {});
    domRelations.value = parsedData.domRelations || [];
  }
});
</script>

<style scoped>
/* 新增样式 */
.large-modal {
  max-width: 800px;
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

.relations-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.relation-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.relation-arrow {
  color: var(--primary-color);
  font-weight: bold;
}

.head-settings, .meta-items {
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  padding: 5px;
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

.component-children {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.children-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.child-component {
  padding: 8px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.child-component.selected {
  border-color: var(--primary-color);
}

.child-component:hover {
  background-color: var(--secondary-color);
}

.children-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 150px;
  overflow-y: auto;
}

.child-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.preview-button, .preview-input, .preview-select {
  pointer-events: none;
}

.preview-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #666;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
}

.preview-table th,
.preview-table td {
  border: 1px solid #ddd;
  padding: 4px 8px;
  text-align: left;
}

.preview-list {
  width: 100%;
}

.list-item {
  padding: 4px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .component-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .component-actions {
    align-self: flex-end;
  }
}
</style>