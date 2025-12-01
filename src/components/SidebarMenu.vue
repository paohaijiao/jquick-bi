<template>
  <aside class="sidebar">
    <div 
      class="menu-section" 
      v-for="(section, sectionIndex) in menus" 
      :key="sectionIndex"
      :class="{ 'active': isSectionActive(section) }"
    >
      <div class="menu-section-title text-align-left" @click.stop="toggleSection(section)">
        {{ section.title }}
        <i 
          class="fas fa-chevron-down" 
          style="font-size: 12px; transition: transform 0.3s; margin-left: 8px;"
          v-if="section.children && section.children.length > 0"
          :class="{ 'rotate-180': expandedSections.includes(section.id) }"
        ></i>
      </div>
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

          <i 
            class="fas fa-chevron-down" 
            style="font-size: 12px; transition: transform 0.3s;"
            v-if="level2.children && level2.children.length > 0"
            :class="{ 'rotate-180': expandedLevel2[section.id]?.includes(level2.id) }"
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
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
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

const emit = defineEmits(['section-click', 'menu-click', 'submenu-click']);
const menus = ref([]);
const expandedSections = ref([]);
const expandedLevel2 = ref({});
const toggleSection = (section) => {
  emit('section-click', section.id);
  if (!section.children || section.children.length === 0) {
    return;
  }
  if (expandedSections.value.includes(section.id)) {
    expandedSections.value = expandedSections.value.filter(id => id !== section.id);
  } else {
    expandedSections.value.push(section.id);
    if (!expandedLevel2.value[section.id]) {
      expandedLevel2.value[section.id] = [];
    }
  }
};
const handleRoute = (menu) => {
     ElMessage.success(`已选择三级菜单：`);
     if(null!=menu||null!=menu.route){
        router.push(menu.route);
     }

}

const toggleLevel2 = (section, level2) => {
  if(!section||null!=section.route){
      debugger;
      router.push(section.route);
  }
  emit('menu-click', section.id, level2.id);
  if (!level2.children || level2.children.length === 0) {
    return;
  }
  if (!expandedLevel2.value[section.id]) {
    expandedLevel2.value[section.id] = [];
  }
  const level2Index = expandedLevel2.value[section.id].indexOf(level2.id);
  if (level2Index > -1) {
    expandedLevel2.value[section.id].splice(level2Index, 1);
  } else {
    expandedLevel2.value[section.id].push(level2.id);
  }
};
const isSectionActive = (section) => {
  return props.activeSection === section.id;
};
const isLevel2Active = (section, level2) => {
  return props.activeSection === section.id && props.activeMenu === level2.id;
};
const isLevel3Active = (section, level2, level3) => {
  return props.activeSection === section.id && 
         props.activeMenu === level2.id &&
         props.activeSubmenu[level2.id] === level3.id;
};
watch(() => [props.activeSection, props.activeMenu, props.activeSubmenu], 
  ([newActiveSection, newActiveMenu, newActiveSubmenu]) => {
    console.log(newActiveSubmenu)
    menus.value.forEach(section => {
      if (section.id === newActiveSection) {
        if (!expandedSections.value.includes(section.id)) {
          expandedSections.value.push(section.id);
        }
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
const initMenu = () => {
request.get('/api/menus/getMenus')
  .then(response => {
    console.log(response)
    if(response.code==200){
      menus.value=response.data;
        menus.value.forEach(section => {
          if (!expandedSections.value.includes(section.id)) {
            expandedSections.value.push(section.id);
          }
          if (!expandedLevel2.value[section.id]) {
            expandedLevel2.value[section.id] = [];
          }
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
.level2-container {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}
.menu-item {
  display: block ;
}
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
.level3-container {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}
.submenu-item.level3-item {
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 20px;
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
.rotate-180 {
  transform: rotate(180deg);
}
</style>