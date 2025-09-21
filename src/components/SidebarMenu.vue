<template>
  <aside class="sidebar">
    <div class="menu-section" v-for="(section, sectionIndex) in menus" :key="sectionIndex">
      <div class="menu-section-title text-align-left">{{ section.title }}</div>
      
      <!-- 一级菜单容器 -->
      <div class="level1-container">
        <!-- 一级菜单 -->
        <div 
          class="menu-item text-align-left" 
          v-for="(level1, level1Index) in section.children" 
          :key="level1Index"
          @click.stop="toggleLevel1Menu(level1)"
          :class="{ active: isLevel1Active(level1) }"
        >
          <i :class="level1.icon"></i>
          <span class="text-align-left">{{ level1.title }}</span>
          
          <!-- 一级菜单箭头 -->
          <i 
            class="fas fa-chevron-down" 
            style="font-size: 12px; transition: transform 0.3s;"
            v-if="level1.children && level1.children.length > 0"
            :class="{ 'rotate-180': expandedLevel1.includes(level1.id) }"
          ></i>
        </div>
        <template v-for="(level1, level1Index) in section.children" :key="`container-${level1Index}`">
          <div 
            class="level2-container" 
            v-if="level1.children && expandedLevel1.includes(level1.id)"
          >
            <div 
              class="submenu-item level2-item" 
              v-for="(level2, level2Index) in level1.children" 
              :key="level2Index"
              @click.stop="toggleLevel2Menu(level1, level2)"
              :class="{ active: isLevel2Active(level1, level2) }"
            >
              <span>{{ level2.title }}</span>
              
              <!-- 二级菜单箭头 -->
              <i 
                class="fas fa-chevron-down" 
                style="font-size: 12px; margin-left: auto; transition: transform 0.3s;"
                v-if="level2.children && level2.children.length > 0"
                :class="{ 'rotate-180': expandedLevel2[level1.id]?.includes(level2.id) }"
              ></i>
              
              <!-- 三级菜单 - 显示在对应二级菜单下方 -->
              <div 
                class="level3-container" 
                v-if="level2.children && expandedLevel2[level1.id]?.includes(level2.id)"
              >
                <div 
                  class="submenu-item level3-item" 
                  v-for="(level3, level3Index) in level2.children" 
                  :key="level3Index"
                  @click.stop="handleLevel3Click(level1, level2, level3)"
                  :class="{ active: isLevel3Active(level1, level2, level3) }"
                >
                  {{ level3.title }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits, onMounted } from 'vue';

// 定义组件参数
const props = defineProps({
  activeMenu: {
    type: String,
    default: ''
  },
  activeSubmenu: {
    type: Object,
    default: () => ({})
  },
  unreadCount: {
    type: Number,
    default: 0
  }
});

// 定义事件
const emit = defineEmits(['menu-click', 'submenu-click']);

// 菜单数据
const menus = ref([]);

// 展开状态管理
const expandedLevel1 = ref([]); // 一级菜单展开状态
const expandedLevel2 = ref({}); // 二级菜单展开状态 { level1Id: [level2Id1, level2Id2] }

// 一级菜单展开/折叠
const toggleLevel1Menu = (level1) => {
  if (!level1.children || level1.children.length === 0) {
    // 没有子菜单时直接触发点击事件
    emit('menu-click', level1.id);
    return;
  }

  // 切换展开状态
  if (expandedLevel1.value.includes(level1.id)) {
    expandedLevel1.value = expandedLevel1.value.filter(id => id !== level1.id);
  } else {
    expandedLevel1.value.push(level1.id);
    // 初始化二级菜单展开状态
    if (!expandedLevel2.value[level1.id]) {
      expandedLevel2.value[level1.id] = [];
    }
  }
  
  // 触发菜单点击事件
  emit('menu-click', level1.id);
};

// 二级菜单展开/折叠
const toggleLevel2Menu = (level1, level2) => {
  if (!level2.children || level2.children.length === 0) {
    // 没有子菜单时直接触发点击事件
    emit('submenu-click', level1.id, level2.id);
    return;
  }

  // 确保当前一级菜单的二级状态数组存在
  if (!expandedLevel2.value[level1.id]) {
    expandedLevel2.value[level1.id] = [];
  }

  // 切换展开状态
  const level2Index = expandedLevel2.value[level1.id].indexOf(level2.id);
  if (level2Index > -1) {
    expandedLevel2.value[level1.id].splice(level2Index, 1);
  } else {
    expandedLevel2.value[level1.id].push(level2.id);
  }
  
  // 触发子菜单点击事件
  emit('submenu-click', level1.id, level2.id);
};

// 三级菜单点击处理
const handleLevel3Click = (level1, level2, level3) => {
  emit('submenu-click', level1.id, level2.id, level3.id);
};

// 检查一级菜单是否激活
const isLevel1Active = (level1) => {
  return props.activeMenu === level1.id;
};

// 检查二级菜单是否激活
const isLevel2Active = (level1, level2) => {
  return props.activeMenu === level1.id && props.activeSubmenu[level1.id] === level2.id;
};

// 检查三级菜单是否激活
const isLevel3Active = (level1, level2, level3) => {
  return props.activeMenu === level1.id && 
         props.activeSubmenu[level1.id] === `${level2.id}-${level3.id}`;
};

// 监听外部激活状态变化
watch(() => [props.activeMenu, props.activeSubmenu], ([newActiveMenu, newActiveSubmenu]) => {
  // 自动展开当前激活菜单的父级
  menus.value.forEach(section => {
    section.children.forEach(level1 => {
      if (level1.id === newActiveMenu) {
        // 展开当前一级菜单
        if (!expandedLevel1.value.includes(level1.id)) {
          expandedLevel1.value.push(level1.id);
        }
        
        // 展开当前二级菜单
        const activeLevel2Id = newActiveSubmenu[level1.id];
        if (activeLevel2Id && level1.children) {
          const level2Id = activeLevel2Id.split('-')[0];
          if (!expandedLevel2.value[level1.id]) {
            expandedLevel2.value[level1.id] = [];
          }
          if (!expandedLevel2.value[level1.id].includes(level2Id)) {
            expandedLevel2.value[level1.id].push(level2Id);
          }
        }
      }
    });
  });
}, { deep: true });

// 初始化菜单数据
const initMenu = () => {
  menus.value = [
    {
      title: '主导航',
      children: [
        {
          id: 'home',
          title: '首页',
          icon: 'fas fa-home'
        },
        {
          id: 'report',
          title: '报表管理',
          icon: 'fas fa-file-alt',
          children: [
            {
              id: 'myReport',
              title: '我的报表'
            },
            {
              id: 'template',
              title: '报表模板'
            }
          ]
        },
        {
          id: 'datasource',
          title: '数据源',
          icon: 'fas fa-database',
          children: [
            { id: 'database', title: '数据库' },
            { id: 'file', title: '文件数据' },
            { id: 'api', title: 'API连接' }
          ]
        }
      ]
    },
    {
      title: '系统设置',
      children: [
        {
          id: 'user',
          title: '用户管理',
          icon: 'fas fa-user'
        },
        {
          id: 'setting',
          title: '系统设置',
          icon: 'fas fa-cog'
        }
      ]
    }
  ];
};

onMounted(() => {
  console.log('初始化菜单');
  initMenu();
});
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  height: 100vh;
}

.text-align-left {
  text-align: left;
}

.menu-section {
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.menu-section-title {
  padding: 0 20px;
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 一级菜单容器 - 确保子菜单能正确显示在下方 */
.level1-container {
  display: flex;
  flex-direction: column;
}

/* 一级菜单项 */
.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.menu-item:hover {
  background-color: #f9fafb;
  color: #f97316; /* 橙色，与JQuick BI品牌色匹配 */
}

.menu-item.active {
  background-color: #fff7ed;
  color: #f97316;
  border-left: 3px solid #f97316;
}

.menu-item i {
  width: 20px;
  margin-right: 12px;
  text-align: center;
}

/* 二级菜单容器 - 显示在对应一级菜单下方 */
.level2-container {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

/* 二级菜单项 */
.submenu-item.level2-item {
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 48px; /* 缩进更多，区分层级 */
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff7ed;
}

.submenu-item.level2-item:hover {
  background-color: #ffedd5;
  color: #f97316;
}

.submenu-item.level2-item.active {
  background-color: #ffedd5;
  color: #f97316;
  font-weight: 500;
}

/* 三级菜单容器 */
.level3-container {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

/* 三级菜单项 */
.submenu-item.level3-item {
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 68px; /* 缩进更多 */
  color: #666;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffedd5;
}

.submenu-item.level3-item:hover {
  background-color: #fed7aa;
  color: #f97316;
}

.submenu-item.level3-item.active {
  background-color: #fed7aa;
  color: #f97316;
  font-weight: 500;
}

/* 箭头旋转动画 */
.rotate-180 {
  transform: rotate(180deg);
}
</style>