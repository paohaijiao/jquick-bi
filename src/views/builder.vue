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
        <button class="action-btn">
          <i class="fas fa-code"></i>导出
        </button>
        <button class="action-btn">
          <i class="fas fa-file-import"></i>导入
        </button>
        <button class="action-btn">
          <i class="fas fa-eye"></i>预览
        </button>
        <button class="action-btn" @click="openModal('HTML编辑器')">
          <i class="fas fa-code"></i>编辑器
        </button>
      </div>
      <div class="header-secondary-actions">
        <button class="action-btn compact">
          <i class="fas fa-cubes" title="组件"></i>
        </button>
        <button class="action-btn compact">
          <i class="fas fa-cog" title="设置"></i>
        </button>
        <div class="user-profile compact">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <span class="username">管理员</span>
        </div>
      </div>

      <div class="mobile-more-menu">
        <button class="action-btn" @click="showMobileMenu = !showMobileMenu">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <div class="mobile-menu-dropdown" v-if="showMobileMenu">
          <button class="mobile-menu-item">
            <i class="fas fa-cubes"></i>组件
          </button>
          <button class="mobile-menu-item">
            <i class="fas fa-cog"></i>设置
          </button>
        </div>
      </div>
    </header>
    <div class="main-content">
      <aside class="sidebar" :class="{ active: sidebarActive }">
        <div class="menu-section">
          <div class="menu-section-title text-align-left">容器元素</div>
          <div class="menu-item" v-draggable="draggableOptions('div')">
            <i class="fas fa-square"></i>
            <span>Div 容器</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('section')">
            <i class="fas fa-square-full"></i>
            <span>Section 分区</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('article')">
            <i class="fas fa-newspaper"></i>
            <span>Article 文章</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('header')">
            <i class="fas fa-heading"></i>
            <span>Header 头部</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('footer')">
            <i class="fas fa-window-minimize"></i>
            <span>Footer 页脚</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('nav')">
            <i class="fas fa-bars"></i>
            <span>Nav 导航</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('aside')">
            <i class="fas fa-columns"></i>
            <span>Aside 侧边栏</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('main')">
            <i class="fas fa-home"></i>
            <span>Main 主内容</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('details')">
            <i class="fas fa-info-circle"></i>
            <span>Details 详情</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('summary')">
            <i class="fas fa-list-alt"></i>
            <span>Summary 摘要</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('dialog')">
            <i class="fas fa-window-restore"></i>
            <span>Dialog 对话框</span>
          </div>
        </div>
        <div class="menu-section">
          <div class="menu-section-title text-align-left">标题元素</div>
          <div class="menu-item" v-draggable="draggableOptions('h1')">
            <i class="fas fa-heading"></i>
            <span>H1 一级标题</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('h2')">
            <i class="fas fa-heading"></i>
            <span>H2 二级标题</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('h3')">
            <i class="fas fa-heading"></i>
            <span>H3 三级标题</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('h4')">
            <i class="fas fa-heading"></i>
            <span>H4 四级标题</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('h5')">
            <i class="fas fa-heading"></i>
            <span>H5 五级标题</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('h6')">
            <i class="fas fa-heading"></i>
            <span>H6 六级标题</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('heading')">
            <i class="fas fa-heading"></i>
            <span>Heading 标题</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">文本内容元素</div>
          <div class="menu-item" v-draggable="draggableOptions('p')">
            <i class="fas fa-paragraph"></i>
            <span>P 段落</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('span')">
            <i class="fas fa-square"></i>
            <span>Span 内联容器</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('a')">
            <i class="fas fa-link"></i>
            <span>A 链接</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('strong')">
            <i class="fas fa-bold"></i>
            <span>Strong 强调</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('em')">
            <i class="fas fa-italic"></i>
            <span>Em 强调</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('i')">
            <i class="fas fa-italic"></i>
            <span>I 斜体</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('b')">
            <i class="fas fa-bold"></i>
            <span>B 粗体</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('u')">
            <i class="fas fa-underline"></i>
            <span>U 下划线</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('pre')">
            <i class="fas fa-code"></i>
            <span>Pre 预格式文本</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('blockquote')">
            <i class="fas fa-quote-right"></i>
            <span>Blockquote 引用</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('mark')">
            <i class="fas fa-highlighter"></i>
            <span>Mark 标记</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('small')">
            <i class="fas fa-text-height"></i>
            <span>Small 小文本</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('time')">
            <i class="fas fa-clock"></i>
            <span>Time 时间</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">列表元素</div>
          <div class="menu-item" v-draggable="draggableOptions('ul')">
            <i class="fas fa-list-ul"></i>
            <span>Ul 无序列表</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('ol')">
            <i class="fas fa-list-ol"></i>
            <span>Ol 有序列表</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('li')">
            <i class="fas fa-list"></i>
            <span>Li 列表项</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">表格元素</div>
          <div class="menu-item" v-draggable="draggableOptions('table')">
            <i class="fas fa-table"></i>
            <span>Table 表格</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('thead')">
            <i class="fas fa-table-header"></i>
            <span>Thead 表头</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('tbody')">
            <i class="fas fa-table-body"></i>
            <span>Tbody 表体</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('tr')">
            <i class="fas fa-grip-lines"></i>
            <span>Tr 表格行</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('th')">
            <i class="fas fa-th"></i>
            <span>Th 表头单元格</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('td')">
            <i class="fas fa-square"></i>
            <span>Td 表格单元格</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">表单元素</div>
          <div class="menu-item" v-draggable="draggableOptions('form')">
            <i class="fas fa-window-restore"></i>
            <span>Form 表单</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('input')">
            <i class="fas fa-edit"></i>
            <span>Input 输入框</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('textarea')">
            <i class="fas fa-align-left"></i>
            <span>Textarea 文本域</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('button')">
            <i class="fas fa-hand-pointer"></i>
            <span>Button 按钮</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('select')">
            <i class="fas fa-caret-square-down"></i>
            <span>Select 下拉框</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('option')">
            <i class="fas fa-caret-right"></i>
            <span>Option 选项</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('label')">
            <i class="fas fa-tag"></i>
            <span>Label 标签</span>
          </div>
        </div>
        <div class="menu-section">
          <div class="menu-section-title text-align-left">媒体元素</div>
          <div class="menu-item" v-draggable="draggableOptions('img')">
            <i class="fas fa-image"></i>
            <span>Img 图片</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('svg')">
            <i class="fas fa-draw-polygon"></i>
            <span>SVG 矢量图</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('audio')">
            <i class="fas fa-volume-up"></i>
            <span>Audio 音频</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('video')">
            <i class="fas fa-video"></i>
            <span>Video 视频</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('iframe')">
            <i class="fas fa-external-link-alt"></i>
            <span>Iframe 内联框架</span>
          </div>
        </div>

        <!-- 其他元素 -->
        <div class="menu-section">
          <div class="menu-section-title text-align-left">其他元素</div>
          <div class="menu-item" v-draggable="draggableOptions('progress')">
            <i class="fas fa-spinner"></i>
            <span>Progress 进度条</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('br')">
            <i class="fas fa-level-down-alt"></i>
            <span>Br 换行</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('hr')">
            <i class="fas fa-minus"></i>
            <span>Hr 水平线</span>
          </div>
        </div>
      </aside>

      <div class="workspace">
        <div class="workspace-header">
          <div>
            <h1 class="workspace-title text-align-left">我的报表</h1>
            <p class="workspace-description">拖放HTML元素到画布中创建您的页面，使用右侧面板编辑属性</p>
          </div>
          <div class="workspace-actions">
            <button class="action-btn" @click="openModal('DOM关系')">
              <i class="fas fa-project-diagram"></i>DOM关系
            </button>
            <button class="action-btn" @click="openModal('Head设置')">
              <i class="fas fa-cog"></i>Head设置
            </button>
          </div>
        </div>

        <div class="canvas-container" id="canvas"
             @dragover.prevent="handleDragOver"
             @drop="handleDrop"
             @dragleave="handleDragLeave">
          <div class="canvas-drag-area" :class="{ 'grid-layout': useGridLayout, 'dragover': isDraggingOver }">
            <div
                class="canvas-component"
                :class="{
                selected: selectedComponentId === component.id,
                'inline-component': component.inline
              }"
                v-for="component in components"
                :key="component.id"
                @click="selectComponent(component.id)"
                :style="getComponentStyle(component)"
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

              <div class="component-content">
                <div v-html="component.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="properties-panel active" :class="{ active: propertiesPanelActive }">
        <div class="panel-title">
          <i class="fas fa-sliders-h"></i>属性设置
        </div>

        <div class="panel-tabs">
          <div class="tab-item" :class="{ active: activeTab === 'properties' }" @click="activeTab = 'properties'">
            <i class="fas fa-tag"></i>属性
          </div>
          <div class="tab-item" :class="{ active: activeTab === 'style' }" @click="activeTab = 'style'">
            <i class="fas fa-paint-brush"></i>样式
          </div>
          <div class="tab-item" :class="{ active: activeTab === 'relation' }" @click="activeTab = 'relation'">
            <i class="fas fa-project-diagram"></i>关系
          </div>
        </div>

        <div class="tab-content" v-if="selectedComponent">
          <div v-if="activeTab === 'properties'">
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
            </div>

            <div class="setting-group">
              <div class="setting-title">页面属性</div>

              <div class="setting-item">
                <label>页面标题</label>
                <input type="text" class="form-control" v-model="pageTitle">
              </div>

              <div class="setting-item">
                <label>字符编码</label>
                <select class="form-control" v-model="charset">
                  <option value="UTF-8">UTF-8</option>
                  <option value="GBK">GBK</option>
                  <option value="ISO-8859-1">ISO-8859-1</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'style'">
            <div class="setting-group">
              <div class="setting-title">样式设置</div>

              <div class="setting-item">
                <label>字体大小</label>
                <input type="text" class="form-control" v-model="selectedComponent.style.fontSize">
              </div>

              <div class="setting-item">
                <label>颜色</label>
                <input type="text" class="form-control" v-model="selectedComponent.style.color">
              </div>

              <div class="setting-item">
                <label>背景色</label>
                <input type="text" class="form-control" v-model="selectedComponent.style.backgroundColor">
              </div>

              <div class="setting-item">
                <label>宽度</label>
                <input type="text" class="form-control" v-model="selectedComponent.style.width">
              </div>

              <div class="setting-item">
                <label>显示方式</label>
                <select class="form-control" v-model="selectedComponent.style.display">
                  <option value="block">块级显示</option>
                  <option value="inline-block">内联块</option>
                  <option value="inline">内联</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'relation'">
            <div class="setting-group">
              <div class="setting-title">元素关系</div>

              <div class="relation-item">
                <input type="text" class="form-control" v-model="selectedComponent.id" readonly>
                <span class="relation-arrow">-></span>
                <input type="text" class="form-control" v-model="selectedComponent.relations" placeholder="目标元素ID（多个用逗号分隔）">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-overlay" :class="{ active: activeModal === 'Head设置' }" @click="closeModal">
      <div class="modal large-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">Head 设置</div>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="head-settings">
            <div class="setting-item">
              <label>页面标题</label>
              <input type="text" class="form-control" v-model="pageTitle">
            </div>

            <div class="setting-item">
              <label>页面编码</label>
              <select class="form-control" v-model="charset">
                <option value="UTF-8">UTF-8</option>
                <option value="GBK">GBK</option>
                <option value="ISO-8859-1">ISO-8859-1</option>
              </select>
            </div>

            <div class="setting-item">
              <label>视口设置</label>
              <input type="text" class="form-control" v-model="viewport" placeholder="width=device-width, initial-scale=1.0">
            </div>
          </div>

          <div class="meta-items">
            <div class="setting-title">Meta标签</div>
            <div class="meta-item" v-for="(meta, index) in metaTags" :key="index">
              <input type="text" class="form-control" v-model="meta.name" placeholder="name属性">
              <input type="text" class="form-control" v-model="meta.content" placeholder="content属性">
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
          <button class="btn btn-outline" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveHeadSettings">保存设置</button>
        </div>
      </div>
    </div>

    <div class="modal-overlay" :class="{ active: activeModal === 'HTML编辑器' }" @click="closeModal">
      <div class="modal large-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">JQuikHtml 编辑器</div>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="editor-container">
            <div class="editor-toolbar">
              <button class="btn btn-primary" @click="parseHtml">
                <i class="fas fa-play"></i> 解析
              </button>
              <button class="btn btn-outline" @click="generateHtml">
                <i class="fas fa-download"></i> 生成
              </button>
              <button class="btn btn-outline" @click="clearHtml">
                <i class="fas fa-trash"></i> 清空
              </button>
            </div>
            <textarea class="html-editor" v-model="htmlCode" placeholder="在此输入JQuikHtml代码..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="applyHtml">应用</button>
        </div>
      </div>
    </div>

    <div class="modal-overlay" :class="{ active: activeModal === 'DOM关系' }" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">DOM关系管理</div>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="relations-editor">
            <div class="relation-item" v-for="(relation, index) in domRelations" :key="index">
              <input type="text" class="form-control" v-model="relation.source" placeholder="源元素ID">
              <span class="relation-arrow">-></span>
              <input type="text" class="form-control" v-model="relation.target" placeholder="目标元素ID（多个用逗号分隔）">
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
          <button class="btn btn-outline" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveRelations">保存关系</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';

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

export default defineComponent({
  directives: {
    draggable
  },
  setup() {
    const sidebarActive = ref(false);
    const propertiesPanelActive = ref(true);
    const activeTab = ref('properties');
    const activeModal = ref('');
    const selectedComponentId = ref('h1_1234');
    const useGridLayout = ref(true);
    const showMobileMenu = ref(false);
    const isDraggingOver = ref(false);
    const pageTitle = ref('JQuick BI 报表');
    const charset = ref('UTF-8');
    const viewport = ref('width=device-width, initial-scale=1.0');
    const metaTags = ref([
      { name: 'description', content: 'JQuick BI 报表设计' },
      { name: 'keywords', content: 'BI,报表,数据分析' }
    ]);
    const domRelations = ref([
      { source: 'div_1234', target: 'h1_1234, p_5678' }
    ]);
    const htmlCode = ref(`head: {
  title: "JQuick BI 报表";
  meta { charset: "UTF-8"; }
  meta { name: "viewport"; content: "width=device-width, initial-scale=1.0"; }
  meta { name: "description"; content: "JQuick BI 报表设计"; }
  meta { name: "keywords"; content: "BI,报表,数据分析"; }
};

h1[h1_1234]: { style-fontSize: "24px"; style-color: "#333"; } :: "一级标题";
p[p_5678]: { style-fontSize: "14px"; style-color: "#666"; } :: "这是一个段落文本";
button[button_9012]: { style-padding: "8px 16px"; style-backgroundColor: "#ff8326"; style-color: "white"; } :: "按钮";
input[input_3456]: { type: "text"; placeholder: "请输入内容"; style-padding: "8px"; style-border: "1px solid #ddd"; };`);

    const inlineElements = ['span', 'a', 'strong', 'em', 'i', 'b', 'u', 'mark', 'small', 'time',
      'input', 'button', 'label', 'img', 'br'];

    const components = ref([
      {
        id: 'h1_1234',
        name: 'H1 标题',
        icon: 'fas fa-heading',
        content: '一级标题',
        inline: false,
        style: {
          fontSize: '24px',
          color: '#333',
          backgroundColor: '',
          width: '100%',
          display: 'block'
        },
        relations: ''
      },
      {
        id: 'p_5678',
        name: 'P 段落',
        icon: 'fas fa-paragraph',
        content: '这是一个段落文本',
        inline: false,
        style: {
          fontSize: '14px',
          color: '#666',
          backgroundColor: '',
          width: '100%',
          display: 'block'
        },
        relations: ''
      },
      {
        id: 'button_9012',
        name: 'Button 按钮',
        icon: 'fas fa-hand-pointer',
        content: '按钮',
        inline: true,
        style: {
          fontSize: '14px',
          color: 'white',
          backgroundColor: '#ff8326',
          width: 'auto',
          display: 'inline-block',
          padding: '8px 16px',
          margin: '4px'
        },
        relations: ''
      },
      {
        id: 'input_3456',
        name: 'Input 输入框',
        icon: 'fas fa-edit',
        content: '<input type="text" class="preview-input" placeholder="请输入内容" disabled>',
        inline: true,
        style: {
          padding: '8px',
          border: '1px solid #ddd',
          width: '200px',
          display: 'inline-block',
          margin: '4px'
        },
        relations: ''
      }
    ]);

    const selectedComponent = computed(() => {
      return components.value.find(c => c.id === selectedComponentId.value) || null;
    });

    const getComponentStyle = (component) => {
      return {
        fontSize: component.style.fontSize,
        color: component.style.color,
        backgroundColor: component.style.backgroundColor,
        width: component.style.width,
        display: component.style.display,
        padding: component.style.padding,
        margin: component.style.margin,
        border: component.style.border
      };
    };

    const toggleSidebar = () => {
      sidebarActive.value = !sidebarActive.value;
    };

    const selectComponent = (id) => {
      selectedComponentId.value = id;
    };

    const deleteComponent = (id) => {
      components.value = components.value.filter(c => c.id !== id);
      if (selectedComponentId.value === id) {
        selectedComponentId.value = components.value.length > 0 ? components.value[0].id : '';
      }
    };

    const openModal = (type) => {
      activeModal.value = type;
    };

    const closeModal = () => {
      activeModal.value = '';
    };

    const addMeta = () => {
      metaTags.value.push({ name: '', content: '' });
    };

    const removeMeta = (index) => {
      metaTags.value.splice(index, 1);
    };

    const saveHeadSettings = () => {
      closeModal();
    };

    const addRelation = () => {
      domRelations.value.push({ source: '', target: '' });
    };

    const removeRelation = (index) => {
      domRelations.value.splice(index, 1);
    };

    const saveRelations = () => {
      closeModal();
    };

    const parseHtml = () => {
      console.log('解析HTML:', htmlCode.value);
    };

    const generateHtml = () => {
      console.log('生成HTML');
    };

    const clearHtml = () => {
      htmlCode.value = '';
    };

    const applyHtml = () => {
      console.log('应用HTML:', htmlCode.value);
      closeModal();
    };
    // 图标映射
    const draggableOptions = (type) => {
      const icons = {
        // 容器元素
        div: 'fas fa-square',
        section: 'fas fa-square-full',
        article: 'fas fa-newspaper',
        header: 'fas fa-heading',
        footer: 'fas fa-window-minimize',
        nav: 'fas fa-bars',
        aside: 'fas fa-columns',
        main: 'fas fa-home',
        details: 'fas fa-info-circle',
        summary: 'fas fa-list-alt',
        dialog: 'fas fa-window-restore',
        // 标题元素
        h1: 'fas fa-heading',
        h2: 'fas fa-heading',
        h3: 'fas fa-heading',
        h4: 'fas fa-heading',
        h5: 'fas fa-heading',
        h6: 'fas fa-heading',
        heading: 'fas fa-heading',
        // 文本内容元素
        p: 'fas fa-paragraph',
        span: 'fas fa-square',
        a: 'fas fa-link',
        strong: 'fas fa-bold',
        em: 'fas fa-italic',
        i: 'fas fa-italic',
        b: 'fas fa-bold',
        u: 'fas fa-underline',
        pre: 'fas fa-code',
        blockquote: 'fas fa-quote-right',
        mark: 'fas fa-highlighter',
        small: 'fas fa-text-height',
        time: 'fas fa-clock',
        // 列表元素
        ul: 'fas fa-list-ul',
        ol: 'fas fa-list-ol',
        li: 'fas fa-list',
        // 表格元素
        table: 'fas fa-table',
        thead: 'fas fa-table-header',
        tbody: 'fas fa-table-body',
        tr: 'fas fa-grip-lines',
        th: 'fas fa-th',
        td: 'fas fa-square',
        // 表单元素
        form: 'fas fa-window-restore',
        input: 'fas fa-edit',
        textarea: 'fas fa-align-left',
        button: 'fas fa-hand-pointer',
        select: 'fas fa-caret-square-down',
        option: 'fas fa-caret-right',
        label: 'fas fa-tag',
        // 媒体元素
        img: 'fas fa-image',
        svg: 'fas fa-draw-polygon',
        audio: 'fas fa-volume-up',
        video: 'fas fa-video',
        iframe: 'fas fa-external-link-alt',
        // 其他元素
        progress: 'fas fa-spinner',
        br: 'fas fa-level-down-alt',
        hr: 'fas fa-minus'
      };

      // 名称映射
      const names = {
        div: 'Div 容器',
        section: 'Section 分区',
        article: 'Article 文章',
        header: 'Header 头部',
        footer: 'Footer 页脚',
        nav: 'Nav 导航',
        aside: 'Aside 侧边栏',
        main: 'Main 主内容',
        details: 'Details 详情',
        summary: 'Summary 摘要',
        dialog: 'Dialog 对话框',
        h1: 'H1 一级标题',
        h2: 'H2 二级标题',
        h3: 'H3 三级标题',
        h4: 'H4 四级标题',
        h5: 'H5 五级标题',
        h6: 'H6 六级标题',
        heading: 'Heading 标题',
        p: 'P 段落',
        span: 'Span 内联容器',
        a: 'A 链接',
        strong: 'Strong 强调',
        em: 'Em 强调',
        i: 'I 斜体',
        b: 'B 粗体',
        u: 'U 下划线',
        pre: 'Pre 预格式文本',
        blockquote: 'Blockquote 引用',
        mark: 'Mark 标记',
        small: 'Small 小文本',
        time: 'Time 时间',
        ul: 'Ul 无序列表',
        ol: 'Ol 有序列表',
        li: 'Li 列表项',
        table: 'Table 表格',
        thead: 'Thead 表头',
        tbody: 'Tbody 表体',
        tr: 'Tr 表格行',
        th: 'Th 表头单元格',
        td: 'Td 表格单元格',
        form: 'Form 表单',
        input: 'Input 输入框',
        textarea: 'Textarea 文本域',
        button: 'Button 按钮',
        select: 'Select 下拉框',
        option: 'Option 选项',
        label: 'Label 标签',
        img: 'Img 图片',
        svg: 'SVG 矢量图',
        audio: 'Audio 音频',
        video: 'Video 视频',
        iframe: 'Iframe 内联框架',
        progress: 'Progress 进度条',
        br: 'Br 换行',
        hr: 'Hr 水平线'
      };
      const defaultContent = {
        input: '<input type="text" class="preview-input" placeholder="请输入内容" disabled>',
        button: '按钮',
        img: '<img src="..." alt="图片" class="preview-image">',
        select: '<select class="preview-select" disabled><option>选项1</option></select>',
        textarea: '<textarea class="preview-textarea" placeholder="请输入内容" disabled></textarea>',
        a: '<a href="#" class="preview-link">链接</a>',
        audio: '<audio controls class="preview-audio"><source src="..." type="audio/mpeg"></audio>',
        video: '<video controls class="preview-video"><source src="..." type="video/mp4"></video>',
        iframe: '<iframe src="..." class="preview-iframe" frameborder="0"></iframe>'
      };

      const isInline = inlineElements.includes(type);
      const name = names[type] || `${type.charAt(0).toUpperCase() + type.slice(1)} 元素`;
      const icon = icons[type] || 'fas fa-cube';
      const content = defaultContent[type] || `${name} 内容`;

      return {
        type,
        name,
        icon,
        inline: isInline,
        content
      };
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

      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const newId = `${data.type}_${Math.floor(Math.random() * 10000)}`;
        const defaultStyle = data.inline ? {
          width: 'auto',
          display: 'inline-block',
          padding: '8px 16px',
          margin: '4px',
          fontSize: '14px'
        } : {
          width: '100%',
          display: 'block',
          margin: '10px 0',
          fontSize: '14px'
        };

        components.value.push({
          id: newId,
          name: data.name,
          icon: data.icon,
          content: data.content,
          inline: data.inline,
          style: { ...defaultStyle },
          relations: ''
        });

        selectComponent(newId);
      } catch (error) {
        console.error('拖拽数据解析失败:', error);
      }
    };

    return {
      sidebarActive,
      propertiesPanelActive,
      activeTab,
      activeModal,
      selectedComponentId,
      pageTitle,
      charset,
      viewport,
      metaTags,
      components,
      domRelations,
      htmlCode,
      useGridLayout,
      showMobileMenu,
      isDraggingOver,
      selectedComponent,
      getComponentStyle,
      toggleSidebar,
      selectComponent,
      deleteComponent,
      openModal,
      closeModal,
      addMeta,
      removeMeta,
      saveHeadSettings,
      addRelation,
      removeRelation,
      saveRelations,
      parseHtml,
      generateHtml,
      clearHtml,
      applyHtml,
      draggableOptions,
      handleDragOver,
      handleDragLeave,
      handleDrop
    };
  }
});
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

@media (max-width: 1024px) {
  .properties-panel {
    width: 250px;
  }
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