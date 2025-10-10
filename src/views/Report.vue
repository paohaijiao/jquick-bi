<template>
  <div class="container">
    <!-- 顶部导航 -->
    <header class="header">
      <button class="mobile-menu-toggle" @click="sidebarActive = !sidebarActive">
        <i class="fas fa-bars"></i>
      </button>
      <div class="logo">
        <i class="fas fa-chart-line"></i>
        <span>JQuick BI 设计器</span>
      </div>
      <div class="header-actions">
        <button class="action-btn" @click="showComponentsModal = true">
          <i class="fas fa-cubes"></i>组件
        </button>
        <button class="action-btn" @click="showFiltersModal = true">
          <i class="fas fa-filter"></i>筛选器
        </button>
        <button class="action-btn" @click="showDataSourceModal = true">
          <i class="fas fa-database"></i>数据源
        </button>
        <button class="action-btn" @click="showSettingsModal = true">
          <i class="fas fa-cog"></i>设置
        </button>
        <!-- 个人中心 -->
        <div class="user-profile" @click="showUserProfileModal = true">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <span>张经理</span>
        </div>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧菜单 -->
      <aside class="sidebar" :class="{ active: sidebarActive }">
        <div class="menu-section">
          <div class="menu-section-title">报表管理</div>
          <div class="menu-item" :class="{ active: activeReport === 'sales' }" @click="activeReport = 'sales'">
            <i class="fas fa-file-alt"></i>
            <span>销售仪表板</span>
          </div>
          <div class="menu-item" :class="{ active: activeReport === 'region' }" @click="activeReport = 'region'">
            <i class="fas fa-file-alt"></i>
            <span>区域分析</span>
          </div>
          <div class="menu-item" :class="{ active: activeReport === 'product' }" @click="activeReport = 'product'">
            <i class="fas fa-file-alt"></i>
            <span>产品业绩</span>
          </div>
          <div class="menu-item" :class="{ active: activeReport === 'customer' }" @click="activeReport = 'customer'">
            <i class="fas fa-file-alt"></i>
            <span>客户分析</span>
          </div>
          <div class="menu-item" @click="newReport">
            <i class="fas fa-plus"></i>
            <span>新建报表</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">资源</div>
          <div class="menu-item">
            <i class="fas fa-image"></i>
            <span>图片库</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-font"></i>
            <span>样式库</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-template"></i>
            <span>模板</span>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">系统</div>
          <div class="menu-item">
            <i class="fas fa-user-cog"></i>
            <span>个人设置</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-users-cog"></i>
            <span>团队管理</span>
          </div>
          <div class="menu-item">
            <i class="fas fa-history"></i>
            <span>操作日志</span>
          </div>
        </div>
      </aside>
      
      <!-- 工作区 -->
      <div class="workspace">
        <div class="workspace-header">
          <div>
            <h1 class="workspace-title">{{ reportInfo.name }}</h1>
            <p class="workspace-description">拖放组件到画布中创建您的报表，使用右侧面板编辑属性</p>
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
          >
            <template #item="{ element }">
              <div 
                class="canvas-component"
                :style="{
                  margin: '15px',
                  padding: '15px',
                  border: element.id === selectedComponentId ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  boxShadow: element.id === selectedComponentId ? '0 0 0 2px rgba(255, 131, 38, 0.2)' : 'none'
                }"
                @click="selectComponent(element.id)"
                @dblclick="editComponent(element.id)"
              >
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <div>
                    <i :class="getComponentIcon(element.type)" style="color: var(--primary-color);"></i>
                    <span> {{ element.name }}</span>
                  </div>
                  <div style="display: flex; gap: 8px;">
                    <div style="color: #999; font-size: 12px;">双击编辑</div>
                    <!-- 删除按钮 -->
                    <button 
                      class="delete-btn" 
                      @click.stop="deleteComponent(element.id)"
                      title="删除组件"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                <div 
                  :style="{
                    height: element.height || (element.type === 'chart' || element.type === 'table' ? '200px' : '100px'),
                    backgroundColor: '#f9f9f9',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666'
                  }"
                >
                  {{ element.content || (getComponentName(element.type) + ' 内容') }}
                </div>
              </div>
            </template>
          </draggable>
          
          <!-- 初始提示 -->
          <div 
            class="drop-zone" 
            v-if="canvasComponents.length === 0"
            style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 400px; border: 2px dashed var(--border-color); border-radius: 8px; color: #999;"
          >
            <i class="fas fa-plus-circle" style="font-size: 36px; margin-bottom: 15px;"></i>
            <p>点击顶部"组件"按钮添加元素到画布</p>
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
            :class="{ active: activeTab === 'style' }" 
            @click="activeTab = 'style'"
          >
            <i class="fas fa-paint-brush"></i>样式
          </div>
          <div 
            class="tab-item" 
            :class="{ active: activeTab === 'data' }" 
            @click="activeTab = 'data'"
          >
            <i class="fas fa-database"></i>数据
          </div>
          <div 
            class="tab-item" 
            :class="{ active: activeTab === 'interaction' }" 
            @click="activeTab = 'interaction'"
          >
            <i class="fas fa-exchange-alt"></i>交互
          </div>
        </div>
        
        <!-- 标签内容区 -->
        <div class="tab-content">
          <!-- 样式标签内容 -->
          <div v-if="activeTab === 'style'">
            <!-- 报表属性设置 -->
            <div class="setting-group" v-if="!selectedComponentId">
              <div class="setting-title">基本信息</div>
              <div class="setting-item">
                <label>名称</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="reportInfo.name"
                  @change="saveReportSettings"
                >
              </div>
              <div class="setting-item">
                <label>描述</label>
                <textarea 
                  class="form-control" 
                  rows="3"
                  v-model="reportInfo.description"
                  @change="saveReportSettings"
                ></textarea>
              </div>
              <div class="setting-item">
                <label>所有者</label>
                <input type="text" class="form-control" value="张经理" readonly>
              </div>
              <div class="setting-item">
                <label>创建时间</label>
                <input type="text" class="form-control" :value="reportInfo.createTime" readonly>
              </div>
            </div>
            
            <!-- 组件属性设置 -->
            <div class="setting-group" v-if="selectedComponentId">
              <div class="setting-title">组件信息</div>
              <div class="setting-item">
                <label>组件名称</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="selectedComponent.name"
                  @change="updateComponentProperty(selectedComponentId, 'name', selectedComponent.name)"
                >
              </div>
              <div class="setting-item">
                <label>组件内容</label>
                <textarea 
                  class="form-control" 
                  rows="3"
                  v-model="selectedComponent.content"
                  @change="updateComponentProperty(selectedComponentId, 'content', selectedComponent.content)"
                ></textarea>
              </div>
              <div class="setting-item">
                <label>高度(px)</label>
                <input 
                  type="number" 
                  class="form-control" 
                  v-model="selectedComponent.height"
                  @change="updateComponentProperty(selectedComponentId, 'height', selectedComponent.height + 'px')"
                >
              </div>
            </div>
            
            <div class="setting-group">
              <div class="setting-title">样式设置</div>
              <div class="setting-item">
                <label>背景颜色</label>
                <div class="color-options">
                  <div 
                    class="color-box" 
                    :class="{ selected: reportStyle.bgColor === '#fff' }"
                    style="background-color: #fff;"
                    @click="changeBgColor('#fff')"
                  ></div>
                  <div 
                    class="color-box" 
                    :class="{ selected: reportStyle.bgColor === '#f5f5f5' }"
                    style="background-color: #f5f5f5;"
                    @click="changeBgColor('#f5f5f5')"
                  ></div>
                  <div 
                    class="color-box" 
                    :class="{ selected: reportStyle.bgColor === '#e8f4f8' }"
                    style="background-color: #e8f4f8;"
                    @click="changeBgColor('#e8f4f8')"
                  ></div>
                </div>
              </div>
              <div class="setting-item">
                <label>画布尺寸</label>
                <select 
                  class="form-control"
                  v-model="reportStyle.size"
                  @change="saveReportSettings"
                >
                  <option>自适应</option>
                  <option>A4 (横向)</option>
                  <option>A4 (纵向)</option>
                  <option>自定义</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- 数据标签内容 -->
          <div v-if="activeTab === 'data'">
            <div class="setting-group">
              <div class="setting-title">数据源设置</div>
              <div class="setting-item" v-if="!selectedComponentId">
                <label>关联数据源</label>
                <select class="form-control" v-model="reportDataSource" @change="saveToLocalStorage">
                  <option value="">无</option>
                  <option v-for="source in dataSources" :value="source.id" :key="source.id">{{ source.name }}</option>
                </select>
              </div>
              
              <div class="setting-item" v-if="selectedComponentId && selectedComponent.type === 'chart'">
                <label>数据字段</label>
                <select 
                  class="form-control" 
                  v-model="selectedComponent.dataField"
                  @change="updateComponentProperty(selectedComponentId, 'dataField', selectedComponent.dataField)"
                >
                  <option value="">请选择字段</option>
                  <option value="sales">销售额</option>
                  <option value="quantity">销售量</option>
                  <option value="profit">利润</option>
                </select>
              </div>
              
              <div class="setting-item" v-if="selectedComponentId && selectedComponent.type === 'table'">
                <label>显示列</label>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="tableColumns" value="name"> 名称
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="tableColumns" value="date"> 日期
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="tableColumns" value="value"> 数值
                  </label>
                </div>
              </div>
            </div>
            
            <div class="setting-group">
              <div class="setting-title">数据筛选</div>
              <div class="setting-item">
                <label>过滤条件</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="例如: 销售额 > 1000" 
                  v-model="dataFilter"
                  @change="saveToLocalStorage"
                >
              </div>
              <div class="setting-item">
                <label>排序方式</label>
                <select 
                  class="form-control" 
                  v-model="dataSort"
                  @change="saveToLocalStorage"
                >
                  <option value="">无</option>
                  <option value="asc">升序</option>
                  <option value="desc">降序</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- 交互标签内容 -->
          <div v-if="activeTab === 'interaction'">
            <div class="setting-group">
              <div class="setting-title">交互设置</div>
              
              <div class="setting-item" v-if="selectedComponentId">
                <label>点击行为</label>
                <select 
                  class="form-control" 
                  v-model="selectedComponent.clickAction"
                  @change="updateComponentProperty(selectedComponentId, 'clickAction', selectedComponent.clickAction)"
                >
                  <option value="">无</option>
                  <option value="drilldown">下钻分析</option>
                  <option value="link">跳转链接</option>
                  <option value="detail">显示详情</option>
                </select>
              </div>
              
              <div class="setting-item" v-if="selectedComponentId && selectedComponent.clickAction === 'link'">
                <label>链接地址</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="selectedComponent.linkUrl"
                  @change="updateComponentProperty(selectedComponentId, 'linkUrl', selectedComponent.linkUrl)"
                >
              </div>
              
              <div class="setting-item">
                <label>联动设置</label>
                <select 
                  class="form-control" 
                  v-model="interactionLinkage"
                  @change="saveToLocalStorage"
                >
                  <option value="none">无联动</option>
                  <option value="cross">交叉联动</option>
                  <option value="parent">父子联动</option>
                </select>
              </div>
            </div>
            
            <div class="setting-group">
              <div class="setting-title">动画效果</div>
              <div class="setting-item">
                <label>加载动画</label>
                <select 
                  class="form-control" 
                  v-model="animationEffect"
                  @change="saveToLocalStorage"
                >
                  <option value="none">无</option>
                  <option value="fade">淡入</option>
                  <option value="slide">滑动</option>
                  <option value="zoom">缩放</option>
                </select>
              </div>
            </div>
            
            <div class="setting-group" v-if="!selectedComponentId">
              <div class="setting-title">权限设置</div>
              <div class="setting-item">
                <label>查看权限</label>
                <select 
                  class="form-control"
                  v-model="reportPermissions.view"
                  @change="saveReportSettings"
                >
                  <option>仅自己可见</option>
                  <option>团队可见</option>
                  <option>公司可见</option>
                  <option>公开</option>
                </select>
              </div>
              <div class="setting-item">
                <label>编辑权限</label>
                <select 
                  class="form-control"
                  v-model="reportPermissions.edit"
                  @change="saveReportSettings"
                >
                  <option>仅自己可编辑</option>
                  <option>指定人员</option>
                  <option>团队可编辑</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 个人中心模态框 -->
    <div class="modal-overlay" :class="{ active: showUserProfileModal }" @click="showUserProfileModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">个人中心</div>
          <button class="modal-close" @click="showUserProfileModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
            <div class="user-avatar" style="width: 60px; height: 60px; font-size: 24px;">
              <i class="fas fa-user"></i>
            </div>
            <div>
              <div style="font-size: 18px; font-weight: 600;">张经理</div>
              <div style="color: #666;">销售部 | 经理</div>
            </div>
          </div>
          
          <div class="setting-group">
            <div class="setting-item">
              <label>姓名</label>
              <input type="text" class="form-control" v-model="userInfo.name">
            </div>
            <div class="setting-item">
              <label>邮箱</label>
              <input type="email" class="form-control" v-model="userInfo.email">
            </div>
            <div class="setting-item">
              <label>电话</label>
              <input type="tel" class="form-control" v-model="userInfo.phone">
            </div>
            <div class="setting-item">
              <label>部门</label>
              <input type="text" class="form-control" value="销售部" readonly>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showUserProfileModal = false">取消</button>
          <button class="btn btn-primary" @click="saveUserInfo">保存修改</button>
        </div>
      </div>
    </div>
    
    <!-- 组件模态框 -->
    <div class="modal-overlay" :class="{ active: showComponentsModal }" @click="showComponentsModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">添加组件</div>
          <button class="modal-close" @click="showComponentsModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <!-- 可拖拽组件列表 -->
          <draggable 
            v-model="availableComponents" 
            :group="{ name: 'components', pull: 'clone', put: false }"
            :clone="cloneComponent"
            class="components-grid"
            :sort="false"
          >
            <template #item="{ element }">
              <div class="component-item">
                <i :class="element.icon"></i>
                <div>{{ element.name }}</div>
              </div>
            </template>
          </draggable>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showComponentsModal = false">取消</button>
        </div>
      </div>
    </div>
    
    <!-- 筛选器模态框 -->
    <div class="modal-overlay" :class="{ active: showFiltersModal }" @click="showFiltersModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">筛选器设置</div>
          <button class="modal-close" @click="showFiltersModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="filter-item">
            <label>时间范围</label>
            <select class="form-control" v-model="filters.timeRange">
              <option>近7天</option>
              <option>近30天</option>
              <option>本月</option>
              <option>上月</option>
              <option>自定义</option>
            </select>
          </div>
          
          <div class="filter-item" style="margin-top: 15px;">
            <label>产品类别</label>
            <select class="form-control" v-model="filters.productType">
              <option>全部</option>
              <option>电子产品</option>
              <option>服装</option>
              <option>食品</option>
            </select>
          </div>
          
          <div class="filter-item" style="margin-top: 15px;">
            <label>销售区域</label>
            <select class="form-control" v-model="filters.region">
              <option>全部</option>
              <option>华东</option>
              <option>华北</option>
              <option>华南</option>
              <option>西部</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showFiltersModal = false">取消</button>
          <button class="btn btn-primary" @click="applyFilters">应用筛选</button>
        </div>
      </div>
    </div>
    
    <!-- 数据源模态框 -->
    <div class="modal-overlay" :class="{ active: showDataSourceModal }" @click="showDataSourceModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">数据源管理</div>
          <button class="modal-close" @click="showDataSourceModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="data-source-item" v-for="source in dataSources" :key="source.id" @click="selectDataSource(source.id)">
            <i class="fas fa-database"></i>
            <div>
              <div>{{ source.name }}</div>
              <div style="font-size: 12px; color: #666;">最后更新: {{ source.lastUpdate }}</div>
            </div>
          </div>
          
          <button class="btn btn-outline" style="margin-top: 20px; width: 100%;" @click="addDataSource">
            <i class="fas fa-plus"></i> 添加数据源
          </button>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showDataSourceModal = false">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 设置模态框 -->
    <div class="modal-overlay" :class="{ active: showSettingsModal }" @click="showSettingsModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">报表设置</div>
          <button class="modal-close" @click="showSettingsModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="setting-item">
            <label>页面尺寸</label>
            <select class="form-control" v-model="reportSettings.pageSize">
              <option>A4</option>
              <option>A3</option>
              <option>自定义</option>
            </select>
          </div>
          
          <div class="setting-item" style="margin-top: 15px;">
            <label>背景设置</label>
            <select class="form-control" v-model="reportSettings.bgSetting">
              <option>白色</option>
              <option>浅色网格</option>
              <option>深色网格</option>
            </select>
          </div>
          
          <div class="setting-item" style="margin-top: 15px;">
            <label>自动刷新</label>
            <select class="form-control" v-model="reportSettings.autoRefresh">
              <option>关闭</option>
              <option>每5分钟</option>
              <option>每30分钟</option>
              <option>每小时</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showSettingsModal = false">取消</button>
          <button class="btn btn-primary" @click="saveReportSettings">保存设置</button>
        </div>
      </div>
    </div>
    
    <!-- 组件编辑模态框 -->
    <div class="modal-overlay" :class="{ active: showComponentEditModal }" @click="showComponentEditModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">编辑{{ editingComponent ? editingComponent.name : '' }}</div>
          <button class="modal-close" @click="showComponentEditModal = false">&times;</button>
        </div>
        <div class="modal-body" v-if="editingComponent">
          <div class="setting-item">
            <label>组件名称</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="editingComponent.name"
            >
          </div>
          <div class="setting-item">
            <label>组件内容</label>
            <textarea 
              class="form-control" 
              rows="5"
              v-model="editingComponent.content"
            ></textarea>
          </div>
          <div class="setting-item">
            <label>高度(px)</label>
            <input 
              type="number" 
              class="form-control" 
              v-model="editingComponent.height"
            >
          </div>
          <div class="setting-item" v-if="editingComponent.type === 'chart'">
            <label>图表类型</label>
            <select class="form-control" v-model="editingComponent.chartType">
              <option>折线图</option>
              <option>柱状图</option>
              <option>饼图</option>
              <option>面积图</option>
            </select>
          </div>
          <!-- 编辑模态框中添加交互属性 -->
          <div class="setting-item">
            <label>点击行为</label>
            <select class="form-control" v-model="editingComponent.clickAction">
              <option value="">无</option>
              <option value="drilldown">下钻分析</option>
              <option value="link">跳转链接</option>
              <option value="detail">显示详情</option>
            </select>
          </div>
          <div class="setting-item" v-if="editingComponent.clickAction === 'link'">
            <label>链接地址</label>
            <input type="text" class="form-control" v-model="editingComponent.linkUrl">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showComponentEditModal = false">取消</button>
          <button class="btn btn-primary" @click="saveComponentEdit">保存修改</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script >
export default {
  name: 'reportPage'
}
</script>
<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import draggable from 'vuedraggable';

// 状态管理
const sidebarActive = ref(false);
const propertiesPanelActive = ref(true);
const activeReport = ref('sales');
const selectedComponentId = ref(null);
const canvasComponents = ref([]);
const showUserProfileModal = ref(false);
const showComponentsModal = ref(false);
const showFiltersModal = ref(false);
const showDataSourceModal = ref(false);
const showSettingsModal = ref(false);
const showComponentEditModal = ref(false);
const editingComponent = ref(null);
// 新增标签页相关状态
const activeTab = ref('style');
const reportDataSource = ref('');
const dataFilter = ref('');
const dataSort = ref('');
const tableColumns = ref(['name', 'date']);
const interactionLinkage = ref('none');
const animationEffect = ref('fade');

// 可用组件列表
const availableComponents = ref([
  { id: 'comp-chart', type: 'chart', name: '图表', icon: 'fas fa-chart-line' },
  { id: 'comp-table', type: 'table', name: '表格', icon: 'fas fa-table' },
  { id: 'comp-text', type: 'text', name: '文本', icon: 'fas fa-font' },
  { id: 'comp-image', type: 'image', name: '图片', icon: 'fas fa-image' },
  { id: 'comp-section', type: 'section', name: '分区', icon: 'fas fa-border-all' },
  { id: 'comp-pagebreak', type: 'pagebreak', name: '分页符', icon: 'fas fa-file-page-break' }
]);

// 报表信息
const reportInfo = reactive({
  name: '销售仪表板',
  description: '销售数据分析仪表板',
  createTime: '2023-06-15 14:30',
  owner: '张经理'
});

// 报表样式
const reportStyle = reactive({
  bgColor: '#fff',
  size: '自适应'
});

// 报表权限
const reportPermissions = reactive({
  view: '仅自己可见',
  edit: '仅自己可编辑'
});

// 报表设置
const reportSettings = reactive({
  pageSize: 'A4',
  bgSetting: '白色',
  autoRefresh: '关闭'
});

// 筛选器设置
const filters = reactive({
  timeRange: '近30天',
  productType: '全部',
  region: '全部'
});

// 用户信息
const userInfo = reactive({
  name: '张明',
  email: 'zhang.ming@example.com',
  phone: '13800138000'
});

// 数据源
const dataSources = reactive([
  { id: 1, name: '销售订单数据', lastUpdate: '2023-06-15' },
  { id: 2, name: '客户信息表', lastUpdate: '2023-06-14' },
  { id: 3, name: '产品目录', lastUpdate: '2023-06-10' }
]);

// 初始化
onMounted(() => {
  // 尝试从本地存储加载数据
  const savedData = localStorage.getItem('biDesignerData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    Object.assign(reportInfo, parsedData.reportInfo);
    Object.assign(reportStyle, parsedData.reportStyle);
    Object.assign(reportPermissions, parsedData.reportPermissions);
    Object.assign(reportSettings, parsedData.reportSettings);
    Object.assign(filters, parsedData.filters);
    canvasComponents.value = parsedData.canvasComponents || [];
    
    // 加载新增的标签页相关数据
    if (parsedData.reportDataSource) reportDataSource.value = parsedData.reportDataSource;
    if (parsedData.dataFilter) dataFilter.value = parsedData.dataFilter;
    if (parsedData.dataSort) dataSort.value = parsedData.dataSort;
    if (parsedData.tableColumns) tableColumns.value = parsedData.tableColumns;
    if (parsedData.interactionLinkage) interactionLinkage.value = parsedData.interactionLinkage;
    if (parsedData.animationEffect) animationEffect.value = parsedData.animationEffect;
  }
});

// 辅助函数：生成唯一ID
const generateId = () => {
  return 'comp_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
};

// 组件克隆函数（用于拖拽）
const cloneComponent = (component) => {
  // 创建新组件并确保ID唯一，添加交互相关属性
  const newComponent = {
    id: generateId(),
    type: component.type,
    name: component.name,
    icon: component.icon,
    content: null,
    height: component.type === 'chart' || component.type === 'table' ? 200 : 100,
    chartType: component.type === 'chart' ? '折线图' : null,
    // 新增交互相关属性
    clickAction: '',
    linkUrl: '',
    dataField: ''
  };
  
  // 使用nextTick确保DOM更新后再添加组件
  nextTick(() => {
    canvasComponents.value.push(newComponent);
    handleCanvasChange();
  });
  
  return newComponent;
};

// 获取组件图标
const getComponentIcon = (type) => {
  const icons = {
    'chart': 'fas fa-chart-line',
    'table': 'fas fa-table',
    'text': 'fas fa-font',
    'image': 'fas fa-image',
    'section': 'fas fa-border-all',
    'pagebreak': 'fas fa-file-page-break'
  };
  return icons[type] || 'fas fa-cube';
};

// 获取组件名称
const getComponentName = (type) => {
  const names = {
    'chart': '图表组件',
    'table': '表格组件',
    'text': '文本组件',
    'image': '图片组件',
    'section': '分区组件',
    'pagebreak': '分页符'
  };
  return names[type] || '组件';
};

// 选中组件
const selectComponent = (id) => {
  selectedComponentId.value = id;
  propertiesPanelActive.value = true;
};

// 获取选中的组件
const selectedComponent = computed(() => {
  return canvasComponents.value.find(comp => comp.id === selectedComponentId.value) || null;
});

// 处理画布变化
const handleCanvasChange = () => {
  console.log("Canvas components changed:", canvasComponents.value);
  saveToLocalStorage();
};

// 更新组件属性
const updateComponentProperty = (id, property, value) => {
  const component = canvasComponents.value.find(comp => comp.id === id);
  if (component) {
    component[property] = value;
    saveToLocalStorage();
  }
};

// 编辑组件
const editComponent = (id) => {
  const component = canvasComponents.value.find(comp => comp.id === id);
  if (component) {
    // 深拷贝组件数据，避免直接修改原数据
    editingComponent.value = JSON.parse(JSON.stringify(component));
    showComponentEditModal.value = true;
  }
};

// 保存组件编辑
const saveComponentEdit = () => {
  if (editingComponent.value) {
    const index = canvasComponents.value.findIndex(comp => comp.id === editingComponent.value.id);
    if (index !== -1) {
      canvasComponents.value.splice(index, 1, editingComponent.value);
      selectComponent(editingComponent.value.id);
      saveToLocalStorage();
    }
    showComponentEditModal.value = false;
  }
};

// 更改背景颜色
const changeBgColor = (color) => {
  reportStyle.bgColor = color;
  document.querySelector('.canvas-container').style.backgroundColor = color;
  saveReportSettings();
};

// 应用筛选器
const applyFilters = () => {
  showFiltersModal.value = false;
  saveToLocalStorage();
  // 筛选器应用逻辑
};

// 保存用户信息
const saveUserInfo = () => {
  showUserProfileModal.value = false;
  saveToLocalStorage();
};

// 选择数据源
const selectDataSource = (id) => {
  reportDataSource.value = id;
  saveToLocalStorage();
};

// 添加数据源
const addDataSource = () => {
  const newId = Math.max(...dataSources.map(s => s.id), 0) + 1;
  dataSources.push({
    id: newId,
    name: '新数据源',
    lastUpdate: new Date().toLocaleDateString().replace(/\//g, '-')
  });
  saveToLocalStorage();
};

// 保存报表设置
const saveReportSettings = () => {
  showSettingsModal.value = false;
  saveToLocalStorage();
};

// 新建报表
const newReport = () => {
  if (confirm('确定要新建报表吗？当前报表将被清空。')) {
    reportInfo.name = '新报表';
    reportInfo.description = '';
    canvasComponents.value = [];
    selectedComponentId.value = null;
    // 重置标签页相关状态
    reportDataSource.value = '';
    dataFilter.value = '';
    dataSort.value = '';
    tableColumns.value = ['name', 'date'];
    interactionLinkage.value = 'none';
    animationEffect.value = 'fade';
    saveToLocalStorage();
  }
};

// 保存数据到本地存储
const saveToLocalStorage = () => {
  const data = {
    reportInfo: { ...reportInfo },
    reportStyle: { ...reportStyle },
    reportPermissions: { ...reportPermissions },
    reportSettings: { ...reportSettings },
    filters: { ...filters },
    userInfo: { ...userInfo },
    canvasComponents: [...canvasComponents.value],
    // 保存新增的标签页相关数据
    reportDataSource: reportDataSource.value,
    dataFilter: dataFilter.value,
    dataSort: dataSort.value,
    tableColumns: [...tableColumns.value],
    interactionLinkage: interactionLinkage.value,
    animationEffect: animationEffect.value
  };
  localStorage.setItem('biDesignerData', JSON.stringify(data));
};

// 删除组件
const deleteComponent = (id) => {
  if (confirm('确定要删除此组件吗？')) {
    const index = canvasComponents.value.findIndex(comp => comp.id === id);
    if (index !== -1) {
      canvasComponents.value.splice(index, 1);
      // 如果删除的是当前选中的组件，清除选中状态
      if (id === selectedComponentId.value) {
        selectedComponentId.value = null;
      }
      saveToLocalStorage();
    }
  }
};
</script>

<style>
/* 添加标签页相关样式 */
.panel-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 15px;
}

.tab-item {
  flex: 1;
  padding: 10px 0;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: var(--transition);
}

.tab-item.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  font-weight: 500;
}

.tab-item:hover {
  background-color: var(--secondary-color);
}

.tab-content {
  padding-bottom: 20px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 5px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

/* 删除按钮样式 */
.delete-btn {
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  font-size: 14px;
  padding: 2px;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #d93025;
}

/* 基础样式 */
:root {
  --primary-color: #ff8326;
  --secondary-color: #fff5eb;
  --border-color: #ffd5b8;
  --text-color: #2d3e50;
  --light-bg: #f9f9f9;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  --sidebar-width: 260px;
  --header-height: 60px;
  --transition: all 0.3s ease;
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

/* 顶部导航栏 */
.header {
  height: var(--header-height);
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: var(--primary-color);
  font-size: 22px;
}

.logo i {
  margin-right: 10px;
  font-size: 26px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.action-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: var(--transition);
}

.action-btn:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

/* 个人中心样式 */
.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: var(--transition);
}

.user-profile:hover {
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

/* 主内容区 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧菜单 */
.sidebar {
  width: var(--sidebar-width);
  background-color: white;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100vh - var(--header-height));
  transition: var(--transition);
  z-index: 5;
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
  cursor: pointer;
  transition: var(--transition);
}

.menu-item:hover, .menu-item.active {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.menu-item i {
  width: 20px;
  margin-right: 12px;
  text-align: center;
}

/* 工作区 */
.workspace {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: var(--light-bg);
}

.workspace-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.workspace-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.workspace-description {
  color: #666;
  font-size: 14px;
}

.canvas-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 24px;
  min-height: 500px;
}

.canvas-drag-area {
  min-height: 400px;
}

/* 右侧属性面板 */
.properties-panel {
  width: 300px;
  background-color: white;
  border-left: 1px solid var(--border-color);
  padding: 15px;
  overflow-y: auto;
  height: calc(100vh - var(--header-height));
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: none;
  align-items: center;
  justify-content: center;
}

.modal-overlay.active {
  display: flex;
}

.modal {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  transform: translateY(-20px);
  opacity: 0;
  transition: var(--transition);
}

.modal-overlay.active .modal {
  transform: translateY(0);
  opacity: 1;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn-outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

/* 组件列表样式 */
.components-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.component-item {
  padding: 15px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}

.component-item:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
}

.component-item i {
  font-size: 24px;
  color: var(--primary-color);
  margin-bottom: 8px;
}

/* 表单控件样式 */
.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  transition: var(--transition);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.2);
}

.setting-group {
  margin-bottom: 25px;
}

.setting-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-color);
}

.setting-item {
  margin-bottom: 15px;
}

.setting-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #666;
}

.color-options {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.color-box {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: var(--transition);
}

.color-box.selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.2);
}

.filter-item {
  margin-bottom: 15px;
}

.filter-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #666;
}

.data-source-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: var(--transition);
}

.data-source-item:hover {
  background-color: var(--secondary-color);
}

/* 响应式调整 */
@media (max-width: 1100px) {
  .sidebar {
    width: 240px;
  }
  
  .properties-panel {
    width: 260px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.3s;
    width: 80%;
    max-width: 300px;
  }
  
  .sidebar.active {
    transform: translateX(0);
  }
  
  .properties-panel {
    position: absolute;
    right: 0;
    left: auto;
    transform: translateX(100%);
    transition: transform 0.3s;
    width: 80%;
    max-width: 300px;
    z-index: 100;
  }
  
  .properties-panel.active {
    transform: translateX(0);
  }
  
  .mobile-menu-toggle {
    display: block !important;
  }
}

/* 移动端菜单切换按钮 */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 20px;
  color: var(--primary-color);
  cursor: pointer;
  margin-right: 15px;
}
</style>