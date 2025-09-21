<template>
  <aside class="sidebar">
    <!-- 第一级：menu-section（可展开/折叠） -->
    <div 
      class="menu-section" 
      v-for="(section, sectionIndex) in menus" 
      :key="sectionIndex"
      :class="{ 'active': isSectionActive(section) }"
    >
      <!-- 第一级标题（点击展开/折叠） -->
      <div class="menu-section-title text-align-left" @click.stop="toggleSection(section)">
        {{ section.title }}
        <!-- 第一级箭头 -->
        <i 
          class="fas fa-chevron-down" 
          style="font-size: 12px; transition: transform 0.3s; margin-left: 8px;"
          v-if="section.children && section.children.length > 0"
          :class="{ 'rotate-180': expandedSections.includes(section.id) }"
        ></i>
      </div>
      
      <!-- 第二级容器（原一级菜单，放在section内） -->
      <div 
        class="level2-container" 
        v-if="section.children && expandedSections.includes(section.id)"
      >
        <div 
          class="menu-item text-align-left level2-item" 
          v-for="(level2, level2Index) in section.children" 
          :key="level2Index"
          @click.stop="toggleLevel2(section, level2)"
          :class="{ 'active': isLevel2Active(section, level2) }"
        >
          <i :class="level2.icon"></i>
          <span class="text-align-left">{{ level2.title }}</span>
          
          <!-- 第二级箭头 -->
          <i 
            class="fas fa-chevron-down" 
            style="font-size: 12px; transition: transform 0.3s;"
            v-if="level2.children && level2.children.length > 0"
            :class="{ 'rotate-180': expandedLevel2[section.id]?.includes(level2.id) }"
          ></i>
          
          <!-- 第三级容器（原二级菜单，放在level2内） -->
          <div 
            class="level3-container" 
            v-if="level2.children && expandedLevel2[section.id]?.includes(level2.id)"
          >
            <div 
              class="submenu-item level3-item" 
              v-for="(level3, level3Index) in level2.children" 
              :key="level3Index"
              @click.stop="handleLevel3Click(section, level2, level3)"
              :class="{ 'active': isLevel3Active(section, level2, level3) }"
            >
              {{ level3.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits, onMounted } from 'vue';
import request from '../api/request';
// 定义组件参数
const props = defineProps({
  activeSection: {
    type: String,
    default: ''
  },
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
const emit = defineEmits(['section-click', 'menu-click', 'submenu-click']);

// 菜单数据
const menus = ref([]);

// 展开状态管理
const expandedSections = ref([]); // 第一级（section）展开状态
const expandedLevel2 = ref({}); // 第二级展开状态 { sectionId: [level2Id1, level2Id2] }

// 第一级（section）展开/折叠
const toggleSection = (section) => {
  // 触发section点击事件
  emit('section-click', section.id);
  
  // 没有子菜单时不需要展开/折叠
  if (!section.children || section.children.length === 0) {
    return;
  }

  // 切换展开状态
  if (expandedSections.value.includes(section.id)) {
    expandedSections.value = expandedSections.value.filter(id => id !== section.id);
  } else {
    expandedSections.value.push(section.id);
    // 初始化二级菜单展开状态
    if (!expandedLevel2.value[section.id]) {
      expandedLevel2.value[section.id] = [];
    }
  }
};

// 第二级展开/折叠
const toggleLevel2 = (section, level2) => {
  // 触发菜单点击事件
  emit('menu-click', section.id, level2.id);
  
  // 没有子菜单时不需要展开/折叠
  if (!level2.children || level2.children.length === 0) {
    return;
  }

  // 确保当前section的二级状态数组存在
  if (!expandedLevel2.value[section.id]) {
    expandedLevel2.value[section.id] = [];
  }

  // 切换展开状态
  const level2Index = expandedLevel2.value[section.id].indexOf(level2.id);
  if (level2Index > -1) {
    expandedLevel2.value[section.id].splice(level2Index, 1);
  } else {
    expandedLevel2.value[section.id].push(level2.id);
  }
};

// 第三级点击处理
const handleLevel3Click = (section, level2, level3) => {
  emit('submenu-click', section.id, level2.id, level3.id);
};

// 检查第一级（section）是否激活
const isSectionActive = (section) => {
  return props.activeSection === section.id;
};

// 检查第二级是否激活
const isLevel2Active = (section, level2) => {
  return props.activeSection === section.id && props.activeMenu === level2.id;
};

// 检查第三级是否激活
const isLevel3Active = (section, level2, level3) => {
  return props.activeSection === section.id && 
         props.activeMenu === level2.id &&
         props.activeSubmenu[level2.id] === level3.id;
};

// 监听外部激活状态变化
watch(() => [props.activeSection, props.activeMenu, props.activeSubmenu], 
  ([newActiveSection, newActiveMenu, newActiveSubmenu]) => {
    console.log(newActiveSubmenu)
    // 自动展开当前激活菜单的父级
    menus.value.forEach(section => {
      if (section.id === newActiveSection) {
        // 展开当前section
        if (!expandedSections.value.includes(section.id)) {
          expandedSections.value.push(section.id);
        }
        
        // 展开当前二级菜单
        if (newActiveMenu && section.children) {
          const targetLevel2 = section.children.find(item => item.id === newActiveMenu);
          if (targetLevel2 && targetLevel2.children) {
            if (!expandedLevel2.value[section.id]) {
              expandedLevel2.value[section.id] = [];
            }
            if (!expandedLevel2.value[section.id].includes(targetLevel2.id)) {
              expandedLevel2.value[section.id].push(targetLevel2.id);
            }
          }
        }
      }
    });
  }, { deep: true });

// 初始化菜单数据（为section添加id）
const initMenu = () => {
request.get('/api/menus/getMenus')
  .then(response => {
    console.log(response)
    if(response.code==200){
      menus.value=response.data;
       // 初始化展开所有section和二级菜单
        menus.value.forEach(section => {
          // 展开所有第一级菜单
          if (!expandedSections.value.includes(section.id)) {
            expandedSections.value.push(section.id);
          }
          
          // 初始化当前section的二级菜单展开状态数组
          if (!expandedLevel2.value[section.id]) {
            expandedLevel2.value[section.id] = [];
          }
          
          // 展开所有二级菜单
          if (section.children && section.children.length > 0) {
            section.children.forEach(level2 => {
              if (!expandedLevel2.value[section.id].includes(level2.id)) {
                expandedLevel2.value[section.id].push(level2.id);
              }
            });
          }
        });
      }
    
  }
)
  .catch(error => {
    console.error('获取行业失败:', error);
  });

};

onMounted(() => {
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

/* 第一级：menu-section */
.menu-section {
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s;
}

.menu-section.active {
  background-color: #fff7ed;
}

.menu-section-title {
  padding: 12px 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.menu-section:hover .menu-section-title,
.menu-section.active .menu-section-title {
  color: #f97316;
}

/* 第二级容器 */
.level2-container {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}
.menu-item {
  display: block ;
}
/* 第二级菜单项 */
.menu-item.level2-item {
  align-items: center;
  padding: 12px 20px 12px 36px; /* 缩进区分层级 */
  color: #666;
  cursor: pointer;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s;
}

.menu-item.level2-item:hover {
  background-color: #f9fafb;
  color: #f97316;
}

.menu-item.level2-item.active {
  background-color: #fff7ed;
  color: #f97316;
  border-left: 3px solid #f97316;
}

.menu-item.level2-item i {
  width: 20px;
  margin-right: 12px;
  text-align: center;
}

/* 第三级容器 */
.level3-container {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

/* 第三级菜单项 */
.submenu-item.level3-item {
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 20px; /* 更深缩进 */
  color: #666;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff7ed;
}

.submenu-item.level3-item:hover {
  background-color: #ffedd5;
  color: #f97316;
}

.submenu-item.level3-item.active {
  background-color: #ffedd5;
  color: #f97316;
  font-weight: 500;
}

/* 箭头旋转动画 */
.rotate-180 {
  transform: rotate(180deg);
}
</style>