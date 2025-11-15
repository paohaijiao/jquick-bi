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
        <button class="action-btn" @click="showHtmlEditor = true">
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
          <div class="menu-section-title text-align-left">HTML元素</div>
          <div class="menu-item" v-draggable="draggableOptions('div')">
            <i class="fas fa-square"></i>
            <span>Div 容器</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('header')">
            <i class="fas fa-heading"></i>
            <span>Header 头部</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('nav')">
            <i class="fas fa-bars"></i>
            <span>Nav 导航</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('main')">
            <i class="fas fa-home"></i>
            <span>Main 主内容</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title text-align-left">表单元素</div>
          <div class="menu-item" v-draggable="draggableOptions('input')">
            <i class="fas fa-edit"></i>
            <span>Input 输入框</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('button')">
            <i class="fas fa-hand-pointer"></i>
            <span>Button 按钮</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('select')">
            <i class="fas fa-caret-square-down"></i>
            <span>Select 下拉框</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('label')">
            <i class="fas fa-tag"></i>
            <span>Label 标签</span>
          </div>
          <div class="menu-item" v-draggable="draggableOptions('textarea')">
            <i class="fas fa-align-left"></i>
            <span>Textarea 文本域</span>
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
          <div class="menu-item" v-draggable="draggableOptions('canvas')">
            <i class="fas fa-paint-brush"></i>
            <span>Canvas 画布</span>
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
          <div class="menu-item" v-draggable="draggableOptions('td')">
            <i class="fas fa-square"></i>
            <span>Td 表格单元格</span>
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

        <div class="canvas-container" id="canvas" @dragover.prevent @drop="handleDrop">
          <div class="canvas-drag-area">
            <div 
              class="canvas-component" 
              :class="{ selected: selectedComponentId === component.id }"
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
              
              <div class="component-content">
                {{ component.content }}
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

    <!-- 模态框 -->
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

// 自定义拖拽指令
const draggable = {
  mounted(el, binding) {
    el.draggable = true;
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(binding.value));
    });
  }
};

export default defineComponent({
  directives: {
    draggable
  },
  setup() {
    // 状态管理
    const sidebarActive = ref(false);
    const propertiesPanelActive = ref(true);
    const activeTab = ref('properties');
    const activeModal = ref('');
    const selectedComponentId = ref('h1_1234');
    
    // 页面设置
    const pageTitle = ref('JQuick BI 报表');
    const charset = ref('UTF-8');
    const viewport = ref('width=device-width, initial-scale=1.0');
    const metaTags = ref([
      { name: 'description', content: 'JQuick BI 报表设计' },
      { name: 'keywords', content: 'BI,报表,数据分析' }
    ]);
    
    // 组件数据
    const components = ref([
      {
        id: 'h1_1234',
        name: 'H1 标题',
        icon: 'fas fa-heading',
        content: '一级标题',
        style: {
          fontSize: '24px',
          color: '#333',
          backgroundColor: ''
        },
        relations: ''
      },
      {
        id: 'p_5678',
        name: 'P 段落',
        icon: 'fas fa-paragraph',
        content: '这是一个段落文本',
        style: {
          fontSize: '14px',
          color: '#666',
          backgroundColor: ''
        },
        relations: ''
      },
      {
        id: 'button_9012',
        name: 'Button 按钮',
        icon: 'fas fa-hand-pointer',
        content: '按钮',
        style: {
          fontSize: '14px',
          color: 'white',
          backgroundColor: '#ff8326'
        },
        relations: ''
      },
      {
        id: 'input_3456',
        name: 'Input 输入框',
        icon: 'fas fa-edit',
        content: '<input type="text" class="preview-input" placeholder="请输入内容" disabled>',
        style: {
          padding: '8px',
          border: '1px solid #ddd'
        },
        relations: ''
      }
    ]);
    
    // DOM关系
    const domRelations = ref([
      { source: 'div_1234', target: 'h1_1234, p_5678' }
    ]);
    
    // HTML编辑器内容
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
    
    // 计算属性
    const selectedComponent = computed(() => {
      return components.value.find(c => c.id === selectedComponentId.value) || null;
    });
    
    // 方法
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
      // 实际应用中可以在这里保存设置
    };
    
    const addRelation = () => {
      domRelations.value.push({ source: '', target: '' });
    };
    
    const removeRelation = (index) => {
      domRelations.value.splice(index, 1);
    };
    
    const saveRelations = () => {
      closeModal();
      // 实际应用中可以在这里保存关系
    };
    
    const parseHtml = () => {
      // 解析HTML代码的逻辑
      console.log('解析HTML:', htmlCode.value);
    };
    
    const generateHtml = () => {
      // 生成HTML代码的逻辑
      console.log('生成HTML');
    };
    
    const clearHtml = () => {
      htmlCode.value = '';
    };
    
    const applyHtml = () => {
      // 应用HTML代码的逻辑
      console.log('应用HTML:', htmlCode.value);
      closeModal();
    };
    
    const draggableOptions = (type) => {
      const icons = {
        div: 'fas fa-square',
        header: 'fas fa-heading',
        nav: 'fas fa-bars',
        main: 'fas fa-home',
        input: 'fas fa-edit',
        button: 'fas fa-hand-pointer',
        select: 'fas fa-caret-square-down',
        label: 'fas fa-tag',
        textarea: 'fas fa-align-left',
        img: 'fas fa-image',
        svg: 'fas fa-draw-polygon',
        canvas: 'fas fa-paint-brush',
        table: 'fas fa-table',
        thead: 'fas fa-table-header',
        tbody: 'fas fa-table-body',
        tr: 'fas fa-grip-lines',
        td: 'fas fa-square',
        ul: 'fas fa-list-ul',
        ol: 'fas fa-list-ol',
        li: 'fas fa-list'
      };
      
      return {
        type,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${type === 'div' ? '容器' : ''}`,
        icon: icons[type] || 'fas fa-cube',
        content: type === 'input' ? 
          '<input type="text" class="preview-input" placeholder="请输入内容" disabled>' : 
          type === 'button' ? '按钮' : 
          type === 'img' ? '<img src="..." alt="图片">' : 
          `${type.charAt(0).toUpperCase() + type.slice(1)} 内容`
      };
    };
    
    const handleDrop = (e) => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const newId = `${data.type}_${Math.floor(Math.random() * 10000)}`;
      
      components.value.push({
        id: newId,
        name: data.name,
        icon: data.icon,
        content: data.content,
        style: {},
        relations: ''
      });
      
      selectComponent(newId);
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
      selectedComponent,
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
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  gap: 12px;
  min-height: 56px;
}

/* Logo 样式 */
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--primary-color);
  flex-shrink: 0;
}

/* 主要操作按钮组 */
.header-main-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;
  max-width: 400px;
}

/* 次要操作按钮组 */
.header-secondary-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

/* 操作按钮优化 */
.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
  white-space: nowrap;
}

.action-btn.compact {
  padding: 6px 8px;
}

.action-btn:hover {
  background-color: var(--secondary-color);
  border-color: var(--primary-color);
}

/* 用户信息优化 */
.user-profile {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-profile.compact .username {
  display: none;
}

.user-profile:hover {
  background-color: var(--secondary-color);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
}

/* 移动端菜单 */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--text-color);
  padding: 6px;
}

.mobile-more-menu {
  display: none;
  position: relative;
}

.mobile-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 101;
  min-width: 120px;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s;
}

.mobile-menu-item:hover {
  background-color: var(--secondary-color);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header {
    padding: 8px 12px;
    gap: 8px;
  }
  
  .action-btn {
    padding: 5px 8px;
    font-size: 0.8rem;
  }
  
  .action-btn span {
    display: none;
  }
  
  .action-btn.compact {
    padding: 5px 7px;
  }
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }
  
  .header-main-actions {
    max-width: none;
    justify-content: flex-start;
    overflow-x: auto;
    padding: 0 8px;
  }
  
  .header-secondary-actions {
    display: none;
  }
  
  .mobile-more-menu {
    display: block;
  }
  
  .logo span {
    display: none;
  }
  
  .action-btn {
    padding: 6px 8px;
  }
  
  .action-btn i {
    margin: 0;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 6px 8px;
  }
  
  .header-main-actions {
    gap: 4px;
  }
  
  .action-btn {
    padding: 5px 6px;
    font-size: 0.75rem;
  }
  
  .logo {
    font-size: 1rem;
  }
}

/* 滚动条样式用于移动端水平滚动 */
.header-main-actions::-webkit-scrollbar {
  display: none;
}

.header-main-actions {
  -ms-overflow-style: none;
  scrollbar-width: none;
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
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.logo i {
  font-size: 1.5rem;
}

.action-btn {
  background: none;
  border: none;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: var(--secondary-color);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
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