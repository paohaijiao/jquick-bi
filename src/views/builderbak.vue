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
        <div class="menu-section">
          <div class="menu-section-title text-align-left">HTML元素</div>
          <div class="menu-item" v-for="item in htmlElements" :key="item.id" @click="addElement(item.type, item.name, item.icon)">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">文本元素</div>
          <div class="menu-item" v-for="item in textElements" :key="item.id" @click="addElement(item.type, item.name, item.icon)">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">表单元素</div>
          <div class="menu-item" v-for="item in formElements" :key="item.id" @click="addElement(item.type, item.name, item.icon)">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">媒体元素</div>
          <div class="menu-item" v-for="item in mediaElements" :key="item.id" @click="addElement(item.type, item.name, item.icon)">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">表格元素</div>
          <div class="menu-item" v-for="item in tableElements" :key="item.id" @click="addElement(item.type, item.name, item.icon)">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">列表元素</div>
          <div class="menu-item" v-for="item in listElements" :key="item.id" @click="addElement(item.type, item.name, item.icon)">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </aside>

      <!-- 工作区 -->
      <div class="workspace">
        <div class="workspace-header">
          <div>
            <h1 class="workspace-title text-align-left">我的报表</h1>
            <p class="workspace-description">拖放HTML元素到画布中创建您的页面，使用右侧面板编辑属性</p>
          </div>
          <div class="workspace-actions">
            <button class="action-btn" @click="showDomRelations = true">
              <i class="fas fa-project-diagram"></i>DOM关系
            </button>
            <button class="action-btn" @click="showHeadSettings = true">
              <i class="fas fa-cog"></i>Head设置
            </button>
          </div>
        </div>

        <div class="canvas-container" id="canvas">
          <!-- 画布组件 -->
          <div
              class="canvas-component"
              :class="{ selected: component.id === selectedComponentId }"
              v-for="component in components"
              :key="component.id"
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

            <div class="component-content" @dblclick="editComponentContent(component.id)">
              <template v-if="component.type === 'button'">
                <button class="preview-button">{{ component.content }}</button>
              </template>
              <template v-else-if="component.type === 'input'">
                <input type="text" class="preview-input" :placeholder="component.placeholder || '请输入内容'" disabled>
              </template>
              <template v-else>
                {{ component.content }}
              </template>
            </div>
          </div>

          <!-- 拖放区域提示 -->
          <div class="drop-zone" v-if="components.length === 0">
            <i class="fas fa-arrow-down"></i>
            <h3>拖放元素到此处开始设计</h3>
            <p>从左侧选择HTML元素拖放到画布中，或直接点击添加</p>
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
          <div class="tab-item" :class="{ active: activeTab === 'relation' }" @click="activeTab = 'relation'">
            <i class="fas fa-project-diagram"></i>关系
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
                <input type="text" class="form-control" v-model="selectedComponent.style.color" placeholder="例如: #333">
              </div>

              <div class="setting-item">
                <label>背景颜色</label>
                <input type="text" class="form-control" v-model="selectedComponent.style.backgroundColor" placeholder="例如: #fff">
              </div>
            </div>

            <div class="setting-group">
              <div class="setting-title">边距</div>

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

          <!-- 关系标签内容 -->
          <div v-if="activeTab === 'relation' && selectedComponent">
            <div class="setting-group">
              <div class="setting-title">元素关系</div>

              <div class="setting-item">
                <label>父元素</label>
                <select class="form-control" v-model="selectedComponent.parentId">
                  <option value="">无</option>
                  <option
                      v-for="comp in components.filter(c => c.id !== selectedComponent.id)"
                      :value="comp.id"
                      :key="comp.id"
                  >
                    {{ comp.name }} ({{ comp.id }})
                  </option>
                </select>
              </div>

              <div class="setting-item">
                <label>子元素</label>
                <div class="children-list">
                  <div class="child-item" v-for="childId in selectedComponent.children" :key="childId">
                    <span>{{ getComponentName(childId) }}</span>
                    <button class="remove-btn" @click="removeChild(selectedComponent.id, childId)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          <div class="editor-container">
            <div class="editor-toolbar">
              <button class="btn btn-primary">
                <i class="fas fa-play"></i> 解析
              </button>
              <button class="btn btn-outline">
                <i class="fas fa-download"></i> 生成
              </button>
              <button class="btn btn-outline">
                <i class="fas fa-trash"></i> 清空
              </button>
            </div>
            <textarea class="html-editor" placeholder="在此输入JQuikHtml代码..." v-model="htmlEditorContent"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showHtmlEditor = false">取消</button>
          <button class="btn btn-primary">应用</button>
        </div>
      </div>
    </div>

    <!-- DOM关系管理模态框 -->
    <div class="modal-overlay" :class="{ active: showDomRelations }" @click="showDomRelations = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">DOM关系管理</div>
          <button class="modal-close" @click="showDomRelations = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="relations-editor">
            <div class="relation-item" v-for="(relation, index) in domRelations" :key="index">
              <input type="text" class="form-control" v-model="relation.source" placeholder="源元素ID">
              <span class="relation-arrow">-></span>
              <input type="text" class="form-control" v-model="relation.targets" placeholder="目标元素ID（多个用逗号分隔）">
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
          <button class="btn btn-outline" @click="showDomRelations = false">取消</button>
          <button class="btn btn-primary">保存关系</button>
        </div>
      </div>
    </div>

    <!-- Head设置模态框 -->
    <div class="modal-overlay" :class="{ active: showHeadSettings }" @click="showHeadSettings = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">Head设置</div>
          <button class="modal-close" @click="showHeadSettings = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="head-settings">
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
            <div class="setting-item">
              <label>视口设置</label>
              <input type="text" class="form-control" v-model="viewport" placeholder="例如: width=device-width, initial-scale=1.0">
            </div>
          </div>

          <div class="meta-items">
            <div class="setting-title">Meta标签</div>
            <div class="meta-item" v-for="(meta, index) in metaTags" :key="index">
              <input type="text" class="form-control" v-model="meta.name" placeholder="name">
              <input type="text" class="form-control" v-model="meta.content" placeholder="content">
              <button class="remove-btn" @click="removeMetaTag(index)">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <button class="btn btn-outline" @click="addMetaTag">
              <i class="fas fa-plus"></i> 添加Meta标签
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showHeadSettings = false">取消</button>
          <button class="btn btn-primary">保存设置</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script >
export default {
  name: 'builderPage'
}
</script>
<script setup>
import { ref, computed,watch } from 'vue';

// 状态管理
const sidebarActive = ref(false);
const propertiesPanelActive = ref(true);
const activeTab = ref('properties');
const selectedComponentId = ref('h1_1234');
const showHtmlEditor = ref(false);
const showDomRelations = ref(false);
const showHeadSettings = ref(false);

// 页面属性
const pageTitle = ref('JQuick BI 报表');
const charset = ref('UTF-8');
const viewport = ref('width=device-width, initial-scale=1.0');

// HTML编辑器内容
const htmlEditorContent = ref(`head: {
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

// DOM关系
const domRelations = ref([
  { source: 'div_1234', targets: 'h1_1234, p_5678' }
]);

// Meta标签
const metaTags = ref([
  { name: 'description', content: 'JQuick BI 报表设计' },
  { name: 'keywords', content: 'BI,报表,数据分析' }
]);

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
      color: '#333'
    },
    parentId: '',
    children: []
  },
  {
    id: 'p_5678',
    type: 'p',
    name: 'P 段落',
    icon: 'fas fa-paragraph',
    content: '这是一个段落文本',
    style: {
      fontSize: '14px',
      color: '#666'
    },
    parentId: '',
    children: []
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
      color: 'white'
    },
    parentId: '',
    children: []
  },
  {
    id: 'input_3456',
    type: 'input',
    name: 'Input 输入框',
    icon: 'fas fa-edit',
    content: '',
    placeholder: '请输入内容',
    style: {
      padding: '8px',
      border: '1px solid #ddd'
    },
    parentId: '',
    children: []
  }
]);

// 元素类型列表
const htmlElements = ref([
  { id: 'el-div', type: 'div', name: 'Div 容器', icon: 'fas fa-square' },
  { id: 'el-header', type: 'header', name: 'Header 头部', icon: 'fas fa-heading' },
  { id: 'el-nav', type: 'nav', name: 'Nav 导航', icon: 'fas fa-bars' },
  { id: 'el-main', type: 'main', name: 'Main 主内容', icon: 'fas fa-home' },
  { id: 'el-aside', type: 'aside', name: 'Aside 侧边栏', icon: 'fas fa-columns' },
  { id: 'el-footer', type: 'footer', name: 'Footer 页脚', icon: 'fas fa-shoe-prints' }
]);

const textElements = ref([
  { id: 'txt-h1', type: 'h1', name: 'H1 标题', icon: 'fas fa-heading' },
  { id: 'txt-h2', type: 'h2', name: 'H2 标题', icon: 'fas fa-heading' },
  { id: 'txt-h3', type: 'h3', name: 'H3 标题', icon: 'fas fa-heading' },
  { id: 'txt-p', type: 'p', name: 'P 段落', icon: 'fas fa-paragraph' },
  { id: 'txt-span', type: 'span', name: 'Span 文本', icon: 'fas fa-text-width' }
]);

const formElements = ref([
  { id: 'form-input', type: 'input', name: 'Input 输入框', icon: 'fas fa-edit' },
  { id: 'form-button', type: 'button', name: 'Button 按钮', icon: 'fas fa-hand-pointer' },
  { id: 'form-select', type: 'select', name: 'Select 下拉框', icon: 'fas fa-caret-square-down' },
  { id: 'form-label', type: 'label', name: 'Label 标签', icon: 'fas fa-tag' },
  { id: 'form-textarea', type: 'textarea', name: 'Textarea 文本域', icon: 'fas fa-align-left' }
]);

const mediaElements = ref([
  { id: 'media-img', type: 'img', name: 'Img 图片', icon: 'fas fa-image' },
  { id: 'media-svg', type: 'svg', name: 'SVG 矢量图', icon: 'fas fa-draw-polygon' },
  { id: 'media-canvas', type: 'canvas', name: 'Canvas 画布', icon: 'fas fa-paint-brush' }
]);

const tableElements = ref([
  { id: 'table-table', type: 'table', name: 'Table 表格', icon: 'fas fa-table' },
  { id: 'table-thead', type: 'thead', name: 'Thead 表头', icon: 'fas fa-table-header' },
  { id: 'table-tbody', type: 'tbody', name: 'Tbody 表体', icon: 'fas fa-table-body' },
  { id: 'table-tr', type: 'tr', name: 'Tr 表格行', icon: 'fas fa-grip-lines' },
  { id: 'table-td', type: 'td', name: 'Td 表格单元格', icon: 'fas fa-square' }
]);

const listElements = ref([
  { id: 'list-ul', type: 'ul', name: 'Ul 无序列表', icon: 'fas fa-list-ul' },
  { id: 'list-ol', type: 'ol', name: 'Ol 有序列表', icon: 'fas fa-list-ol' },
  { id: 'list-li', type: 'li', name: 'Li 列表项', icon: 'fas fa-list' }
]);

// 计算属性 - 获取选中的组件
const selectedComponent = computed(() => {
  return components.value.find(comp => comp.id === selectedComponentId.value) || null;
});

// 方法
const toggleSidebar = () => {
  sidebarActive.value = !sidebarActive.value;
};

const selectComponent = (id) => {
  selectedComponentId.value = id;
  propertiesPanelActive.value = true;
};

const deleteComponent = (id) => {
  // 移除组件
  components.value = components.value.filter(comp => comp.id !== id);

  // 如果删除的是选中的组件，清除选中状态
  if (selectedComponentId.value === id) {
    selectedComponentId.value = components.value.length > 0 ? components.value[0].id : '';
  }

  // 移除相关的父子关系
  components.value.forEach(comp => {
    // 移除父引用
    if (comp.parentId === id) {
      comp.parentId = '';
    }

    // 移除子引用
    comp.children = comp.children.filter(childId => childId !== id);
  });
};

const editComponentContent = (id) => {
  const component = components.value.find(comp => comp.id === id);
  if (component) {
    const newContent = prompt('编辑内容:', component.content);
    if (newContent !== null) {
      component.content = newContent;
    }
  }
};

const addElement = (type, name, icon) => {
  // 生成唯一ID
  const timestamp = Date.now();
  const id = `${type}_${timestamp}`;

  // 默认内容
  let content = '';
  let placeholder = '';

  switch(type) {
    case 'h1': content = '一级标题'; break;
    case 'h2': content = '二级标题'; break;
    case 'h3': content = '三级标题'; break;
    case 'p': content = '这是一个段落文本'; break;
    case 'button': content = '按钮'; break;
    case 'input': placeholder = '请输入内容'; break;
    default: content = `${name}内容`;
  }

  // 添加新组件
  const newComponent = {
    id,
    type,
    name,
    icon,
    content,
    placeholder,
    style: {},
    parentId: '',
    children: []
  };

  components.value.push(newComponent);

  // 选中新添加的组件
  selectComponent(id);
};

const getComponentName = (id) => {
  const component = components.value.find(comp => comp.id === id);
  return component ? `${component.name} (${id})` : id;
};

const removeChild = (parentId, childId) => {
  const parent = components.value.find(comp => comp.id === parentId);
  if (parent) {
    parent.children = parent.children.filter(id => id !== childId);

    // 同时更新子组件的父ID
    const child = components.value.find(comp => comp.id === childId);
    if (child) {
      child.parentId = '';
    }
  }
};

// 监听父元素变化，更新子元素关系
watch(selectedComponent, (newVal, oldVal) => {
  if (oldVal && oldVal.parentId) {
    // 移除旧的父元素中的子引用
    const oldParent = components.value.find(comp => comp.id === oldVal.parentId);
    if (oldParent) {
      oldParent.children = oldParent.children.filter(id => id !== oldVal.id);
    }
  }

  if (newVal && newVal.parentId) {
    // 添加新的父元素中的子引用
    const newParent = components.value.find(comp => comp.id === newVal.parentId);
    if (newParent && !newParent.children.includes(newVal.id)) {
      newParent.children.push(newVal.id);
    }
  }
}, { deep: true });

// DOM关系管理
const addRelation = () => {
  domRelations.value.push({ source: '', targets: '' });
};

const removeRelation = (index) => {
  domRelations.value.splice(index, 1);
};

// Meta标签管理
const addMetaTag = () => {
  metaTags.value.push({ name: '', content: '' });
};

const removeMetaTag = (index) => {
  metaTags.value.splice(index, 1);
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

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-color);
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
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: var(--secondary-color);
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

.menu-item i {
  width: 20px;
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

/* 画布区域 */
.canvas-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--bg-color);
}

.canvas-drag-area {
  min-height: 100%;
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

.preview-select {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  width: 200px;
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

/* 响应式设计 */
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

  .header-actions {
    display: none;
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
}
</style>