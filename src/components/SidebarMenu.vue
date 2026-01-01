<template>
  <aside class="sidebar">

    <div class="sidebar-header">
      <span class="sidebar-logo">JQuick BI</span>
    </div>

    <div class="menu-wrapper">
      <div 
        class="menu-section" 
        v-for="(section, sectionIndex) in menus" 
        :key="sectionIndex"
        :class="{ 'active': isSectionActive(section) }"
      >
        <div 
          class="menu-section-title" 
          @click.stop="toggleSection(section)"
        >
          <span class="section-title-text">{{ section.title }}</span>
          <i 
            class="fas fa-chevron-down section-expand-icon"
            v-if="section.children && section.children.length > 0"
            :class="{ 'rotate-180': expandedSections.includes(section.id) }"
          ></i>
        </div>

        <div 
          class="level2-container" 
          v-if="section.children && expandedSections.includes(section.id)"
        >
          <div 
            class="menu-item level2-item" 
            v-for="(level2, level2Index) in section.children" 
            :key="level2Index"
            @click.stop="toggleLevel2(section, level2)"
            :class="{ 'active': isLevel2Active(section, level2) }"
          >
            <div class="level2-item-content">
              <div class="level2-icon-wrapper" v-if="level2.icon">
                <i :class="level2.icon" class="level2-item-icon"></i>
              </div>
              <span class="level2-item-text">{{ level2.title }}</span>
            </div>
            
            <i 
              class="fas fa-chevron-right level2-expand-icon"
              v-if="level2.children && level2.children.length > 0"
              :class="{ 'rotate-90': expandedLevel2[section.id]?.includes(level2.id) }"
            ></i>

            <div 
              class="level3-container" 
              v-if="level2.children && expandedLevel2[section.id]?.includes(level2.id)"
            >
              <div 
                class="submenu-item level3-item" 
                v-for="(level3, level3Index) in level2.children" 
                :key="level3Index"
                @click.stop="handleRoute(level3)"
                :class="{ 'active': isLevel3Active(section, level2, level3) }"
              >
                <div class="level3-icon-wrapper">
                  <i class="fas fa-angle-right level3-item-prefix"></i>
                </div>
                <span class="level3-item-text">{{ level3.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import request from '../api/request';
const router = useRouter();
const props = defineProps({
  activeSection: {
    type: [String, Number],
    default: ''
  },
  activeMenu: {
    type: [String, Number],
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
const emit = defineEmits(['section-click', 'menu-click', 'submenu-click']);
const menus = ref([]);
const expandedSections = ref([]); 
const expandedLevel2 = ref({});   
const toggleSection = (section) => {
  emit('section-click', section.id);
  if (!section.children || section.children.length === 0) return;
  const idx = expandedSections.value.indexOf(section.id);
  if (idx > -1) {
    expandedSections.value.splice(idx, 1);
  } else {
    expandedSections.value.push(section.id);
    if (!expandedLevel2.value[section.id]) {
      expandedLevel2.value[section.id] = [];
    }
  }
};
const handleRoute = (menu) => {
  if (menu?.route) {
    router.push(menu.route);
  } else {
    ElMessage.warning('该菜单暂无访问路径');
  }
};

const toggleLevel2 = (section, level2) => {
  emit('menu-click', section.id, level2.id);
  if (level2?.route) {
    router.push(level2.route);
  }
  if (!level2.children || level2.children.length === 0) return;
  if (!expandedLevel2.value[section.id]) {
    expandedLevel2.value[section.id] = [];
  }
  
  const idx = expandedLevel2.value[section.id].indexOf(level2.id);
  if (idx > -1) {
    expandedLevel2.value[section.id].splice(idx, 1);
  } else {
    expandedLevel2.value[section.id].push(level2.id);
  }
};

const isSectionActive = (section) => props.activeSection == section.id;

const isLevel2Active = (section, level2) => props.activeSection == section.id && props.activeMenu == level2.id;

const isLevel3Active = (section, level2, level3) => {
  return props.activeSection == section.id && 
         props.activeMenu == level2.id &&
         props.activeSubmenu[level2.id] == level3.id;
};
watch(() => [props.activeSection, props.activeMenu, props.activeSubmenu], 
  ([newActiveSection, newActiveMenu, newActiveSubmenu]) => {
    menus.value.forEach(section => {
      if (section.id == newActiveSection) {
        if (!expandedSections.value.includes(section.id)) {
          expandedSections.value.push(section.id);
        }
        if (newActiveMenu && section.children) {
          const targetLevel2 = section.children.find(item => item.id == newActiveMenu);
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
  }, { deep: true, immediate: true });
const initMenu = () => {
  request.get('/api/menus/getMenus')
    .then(response => {
      if (response.code === 200) {
        menus.value = response.data;
        expandedSections.value = []; // 默认全部关闭
        expandedLevel2.value = {};
      }
    })
    .catch(error => {
      console.error('菜单加载失败:', error);
    });
};

onMounted(() => {
  initMenu();
});
</script>

<style scoped>
:deep(*) {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
}

.sidebar {
  width: 240px;
  background-color: #ffffff;
  border-right: 1px solid #e8e8e8;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.02);
}

.sidebar-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-logo {
  font-size: 18px;
  font-weight: 600;
  color: #ff7800;
  letter-spacing: 0.5px;
}

.menu-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.menu-section {
  margin: 4px 0;
  border-radius: 6px;
  margin: 0 8px;
  transition: all 0.2s ease;
}

.menu-section.active {
  background-color: #fff8f0;
}

.menu-section-title {
  padding: 12px 20px;
  font-size: 15px;
  color: #333333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.menu-section-title:hover {
  color: #ff7800;
  background-color: #faf6f0;
}

.section-title-text {
  flex: 1;
  text-align: left;
}

.section-expand-icon {
  font-size: 12px;
  color: #999;
  transition: transform 0.2s ease;
  width: 16px;
  text-align: center;
}

.level2-container {
  padding: 4px 0;
  transition: all 0.2s ease;
}

.level2-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  color: #444444;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  margin: 0 8px;
  transition: all 0.2s ease;
}

.level2-item:hover {
  background-color: #f8f8f8;
  color: #ff7800;
}

.level2-item.active {
  background-color: #fff8f0;
  color: #ff7800;
  font-weight: 500;
}

.level2-item-content {
  display: flex;
  align-items: center;
  flex: 1;
  text-align: left;
}

.level2-icon-wrapper {
  width: 16px;
  margin-right: 8px; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.level2-item-icon {
  font-size: 14px;
  color: #777;
}

.level2-item.active .level2-item-icon {
  color: #ff7800;
}

.level2-item-text {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.level2-expand-icon {
  font-size: 11px;
  color: #999;
  transition: transform 0.2s ease;
  width: 16px;
  text-align: center;
}

.level3-container {
  padding: 4px 0;
  margin-left: 24px; 
  transition: all 0.2s ease;
}

.level3-item {
  display: flex;
  align-items: center;
  padding: 9px 20px;
  color: #555555;
  cursor: pointer;
  font-size: 13px;
  border-radius: 6px;
  margin: 0 8px;
  transition: all 0.2s ease;
}

.level3-item:hover {
  background-color: #fff5eb;
  color: #ff7800;
}

.level3-item.active {
  background-color: #fff0e0;
  color: #ff7800;
  font-weight: 500;
}

.level3-icon-wrapper {
  width: 16px;
  margin-right: 8px; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.level3-item-prefix {
  font-size: 10px;
  color: #bbb;
}

.level3-item.active .level3-item-prefix {
  color: #ff7800;
}

.level3-item-text {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rotate-180 {
  transform: rotate(180deg);
}

.rotate-90 {
  transform: rotate(90deg);
}

.menu-wrapper::-webkit-scrollbar {
  width: 4px;
}

.menu-wrapper::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 2px;
}

.menu-wrapper::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.menu-wrapper::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
</style>