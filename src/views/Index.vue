<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">
        <i class="fas fa-chart-line"></i>
        <span>JQuick BI</span>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <el-icon><search /></el-icon>
          <input type="text" placeholder="搜索报表、数据源或文档...">
        </div>
        <div class="notification-icon">
          <i class="far fa-bell"></i>
          <span class="notification-badge">3</span>
        </div>
        <div class="user-info" @click="toggleUserMenu">
          <div class="user-avatar">ZL</div>
          <span class="user-name">张磊</span>
          <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
        </div>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <div class="main-content">
       <SidebarMenu 
        :active-menu="activeMenu" 
        :unread-count="unreadCount"
        @menu-click="setActiveMenu"
        @submenu-click="setActiveSubmenu"
      />
      <main class="content-area">
        <div class="page-header">
          <div>
            <h1 class="page-title text-align-left">数据分析概览</h1>
            <p class="welcome-message">欢迎回来，张磊！这是您的数据分析使用统计</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline" @click="exportReport">
              <i class="fas fa-download"></i>
              导出报告
            </button>
            <button class="btn btn-primary" @click="createReport">
              <i class="fas fa-plus"></i>
              创建报表
            </button>
          </div>
        </div>
        
        <!-- 核心统计卡片 -->
        <div class="stats-cards">
          <div class="stat-card" v-for="stat in stats" :key="stat.id" :class="stat.color">
            <div class="stat-title">
              <i :class="stat.icon"></i>
              {{ stat.title }}
            </div>
            <div class="stat-value text-align-left">{{ stat.value }}</div>
            <div class="stat-change" :class="stat.changeType">
              <i :class="stat.changeIcon"></i>
              {{ stat.changeText }}
            </div>
          </div>
        </div>
        
        <!-- 使用趋势图表 -->
        <div class="usage-trends">
          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">报表创建趋势</div>
            </div>
            <div class="chart-container">
              <div id="line"></div>
            </div>
          </div>
          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">数据访问分布</div>
            </div>
            <div class="chart-container">
               <div id="radar"></div>
            </div>
          </div>
        </div>
        
        <!-- 最近活动 -->
        <div class="recent-activity">
          <div class="activity-header">
            <div class="activity-title">最近操作记录</div>
            <div class="view-all" @click="viewAllActivities">查看全部</div>
          </div>
          <div class="activity-list">
            <div class="activity-item" v-for="activity in activities" :key="activity.id">
              <div class="activity-icon" :class="activity.type">
                <i :class="activity.icon"></i>
              </div>
              <div class="activity-content">
                <div class="activity-desc">{{ activity.description }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 常用资源 -->
        <div class="frequent-resources">
          <div class="resources-header">
            <div class="resources-title">常用资源</div>
            <div class="view-all" @click="manageResources">管理资源</div>
          </div>
          <div class="resource-tabs">
            <div class="resource-tab" :class="{ active: activeResourceTab === 'report' }" @click="setResourceTab('report')">报表</div>
            <div class="resource-tab" :class="{ active: activeResourceTab === 'datasource' }" @click="setResourceTab('datasource')">数据源</div>
            <div class="resource-tab" :class="{ active: activeResourceTab === 'dataset' }" @click="setResourceTab('dataset')">数据集</div>
          </div>
          <div class="resource-list">
            <div class="resource-card" v-for="resource in resources" :key="resource.id" @click="openResource(resource)">
              <div class="resource-card-header">
                <div>
                  <div class="resource-name">{{ resource.name }}</div>
                  <div class="resource-type">{{ resource.type }}</div>
                </div>
                <div class="resource-time">{{ resource.accessTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
export default {
  name: 'IndexPage'
}
</script>
<script setup>
import { ref,onMounted,nextTick } from 'vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import request from '../api/request';
import * as echarts from 'echarts';
const initRadarChart = () => {
 const chartDom = document.getElementById('radar');
 let chartInstance = echarts.init(chartDom);
 let option  = {
  title: {
    text: 'Basic Radar Chart'
  },
  legend: {
    data: ['Allocated Budget', 'Actual Spending']
  },
  radar: {
    // shape: 'circle',
    indicator: [
      { name: 'Sales', max: 6500 },
      { name: 'Administration', max: 16000 },
      { name: 'Information Technology', max: 30000 },
      { name: 'Customer Support', max: 38000 },
      { name: 'Development', max: 52000 },
      { name: 'Marketing', max: 25000 }
    ]
  },
  series: [
    {
      name: 'Budget vs spending',
      type: 'radar',
      data: [
        {
          value: [4200, 3000, 20000, 35000, 50000, 18000],
          name: 'Allocated Budget'
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: 'Actual Spending'
        }
      ]
    }
  ]
};
  chartInstance.setOption(option);
};
const initLineChart = () => {
 const chartDom = document.getElementById('line');
 let chartInstance = echarts.init(chartDom);
const data = [["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135], ["2000-06-08", 86], ["2000-06-09", 73], ["2000-06-10", 85], ["2000-06-11", 73], ["2000-06-12", 68], ["2000-06-13", 92], ["2000-06-14", 130], ["2000-06-15", 245], ["2000-06-16", 139], ["2000-06-17", 115], ["2000-06-18", 111], ["2000-06-19", 309], ["2000-06-20", 206], ["2000-06-21", 137], ["2000-06-22", 128], ["2000-06-23", 85], ["2000-06-24", 94], ["2000-06-25", 71], ["2000-06-26", 106], ["2000-06-27", 84], ["2000-06-28", 93], ["2000-06-29", 85], ["2000-06-30", 73], ["2000-07-01", 83], ["2000-07-02", 125], ["2000-07-03", 107], ["2000-07-04", 82], ["2000-07-05", 44], ["2000-07-06", 72], ["2000-07-07", 106], ["2000-07-08", 107], ["2000-07-09", 66], ["2000-07-10", 91], ["2000-07-11", 92], ["2000-07-12", 113], ["2000-07-13", 107], ["2000-07-14", 131], ["2000-07-15", 111], ["2000-07-16", 64], ["2000-07-17", 69], ["2000-07-18", 88], ["2000-07-19", 77], ["2000-07-20", 83], ["2000-07-21", 111], ["2000-07-22", 57], ["2000-07-23", 55], ["2000-07-24", 60]];
const dateList = data.map(function (item) {
  return item[0];
});
const valueList = data.map(function (item) {
  return item[1];
});
let option = {
  // Make gradient line here
  visualMap: [
    {
      show: false,
      type: 'continuous',
      seriesIndex: 0,
      min: 0,
      max: 400
    },
    {
      show: false,
      type: 'continuous',
      seriesIndex: 1,
      dimension: 0,
      min: 0,
      max: dateList.length - 1
    }
  ],
  title: [
    {
      left: 'center',
      text: 'Gradient along the y axis'
    },
    {
      top: '55%',
      left: 'center',
      text: 'Gradient along the x axis'
    }
  ],
  tooltip: {
    trigger: 'axis'
  },
  xAxis: [
    {
      data: dateList
    },
    {
      data: dateList,
      gridIndex: 1
    }
  ],
  yAxis: [
    {},
    {
      gridIndex: 1
    }
  ],
  grid: [
    {
      bottom: '60%'
    },
    {
      top: '60%'
    }
  ],
  series: [
    {
      type: 'line',
      showSymbol: false,
      data: valueList
    },
    {
      type: 'line',
      showSymbol: false,
      data: valueList,
      xAxisIndex: 1,
      yAxisIndex: 1
    }
  ]
};
  chartInstance.setOption(option);
};

// 资源标签切换
const activeResourceTab = ref('report');
const setResourceTab = (tab) => {
  activeResourceTab.value = tab;
};

// 统计数据
const stats = ref([]);

// 活动记录
const activities = ref([]);

// 资源列表
const resources = ref([]);

// 按钮事件处理
const exportReport = () => {
};

const createReport = () => {
};

const viewAllActivities = () => {
};

const manageResources = () => {
};

const openResource = (resource) => {
  console.log('打开资源:', resource.name);
};
const handleStats= () => {
  request.get('/api/index/stats')
  .then(response => {
    if(response.code==200){
      stats.value=response.data;
    }
  }
)
};
const handleActivity =() => {
  request.get('/api/index/activity')
  .then(response => {
    if(response.code==200){
      activities.value=response.data;
    }
  }
)
};
const handleResource =() => {
  request.get('/api/index/resource')
  .then(response => {
    if(response.code==200){
      resources.value=response.data;
    }
  }
)
};
onMounted(() => {
  handleStats();
  handleActivity();
  handleResource();
  nextTick(() => {
    initRadarChart();
    initLineChart();
  });
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

/* 主内容区 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧BI菜单 */
.sidebar {
  width: var(--sidebar-width);
  background-color: white;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100vh - var(--header-height));
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
}

.menu-item:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.menu-item.active {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border-left: 3px solid var(--primary-color);
}

.menu-item i {
  width: 20px;
  margin-right: 12px;
  text-align: center;
  transition: transform 0.3s;
}

.menu-item .menu-badge {
  margin-left: auto;
  padding: 2px 8px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 10px;
  font-size: 12px;
}

.submenu {
  background-color: #fff9f2;
  padding: 0 0 0 52px;
  display: none;
}

.submenu.show {
  display: block;
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
}

.submenu-item:hover {
  color: var(--primary-color);
}

.submenu-item.active {
  color: var(--primary-color);
  font-weight: 500;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* 右侧用户统计信息区域 */
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: var(--light-bg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
}

.welcome-message {
  font-size: 16px;
  color: #666;
  margin-top: 4px;
}

.action-buttons {
  display: flex;
  gap: 12px;
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
}

.btn i {
  margin-right: 8px;
}

/* 核心统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--card-shadow);
  border-left: 4px solid var(--primary-color);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-card.blue {
  border-left-color: #1890ff;
}

.stat-card.green {
  border-left-color: #52c41a;
}

.stat-card.purple {
  border-left-color: #722ed1;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.stat-title i {
  margin-right: 8px;
  font-size: 16px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-change {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.stat-change.positive {
  color: #52c41a;
}

.stat-change.negative {
  color: #ff4d4f;
}

.stat-change i {
  margin-right: 4px;
}

/* 使用趋势图表区域 */
.usage-trends {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--card-shadow);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
}

.chart-filter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-filter select {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
  color: #666;
}

.chart-container {
  height: 300px; /* 已存在，确认是否生效 */
  position: relative; /* 新增 */
}
#line {
  width: 100%;
  height: 100%;
}
#radar {
  width: 100%;
  height: 100%;
}

.chart-placeholder {
  text-align: center;
}

.chart-placeholder i {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.3;
}

/* 最近活动区域 */
.recent-activity {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--card-shadow);
  margin-bottom: 24px;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
}

.view-all {
  font-size: 13px;
  color: var(--primary-color);
  cursor: pointer;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.create {
  background-color: #f0f9eb;
  color: #52c41a;
}

.activity-icon.edit {
  background-color: #e6f7ff;
  color: #1890ff;
}

.activity-icon.delete {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.activity-content {
  flex: 1;
}

.activity-desc {
  font-size: 14px;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

/* 常用资源区域 */
.frequent-resources {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--card-shadow);
}

.resources-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.resources-title {
  font-size: 16px;
  font-weight: 600;
}

.resource-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.resource-tab {
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.resource-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  font-weight: 500;
}

.resource-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.resource-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;
  cursor: pointer;
}

.resource-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 8px rgba(255, 131, 38, 0.1);
}

.resource-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.resource-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.resource-type {
  font-size: 12px;
  color: #999;
}

.resource-time {
  font-size: 12px;
  color: #999;
}
</style>