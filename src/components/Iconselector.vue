<template>
            <div class="form-group">
              <label class="text-align-left">图标选择</label>
              <div class="icon-selector">
                <div 
                  class="icon-option" 
                  :class="{ 'selected': formData.icon === icon }"
                  v-for="icon in iconList" 
                  :key="icon"
                  @click="formData.icon = icon"
                >
                  <i :class="['fas', icon]"></i>
                </div>
              </div>
            </div>
</template>
<script>
export default {
  name: 'IconSelectorPage'
}
</script>
<script setup>
const iconList = [
  'fa-table', 'fa-users', 'fa-box', 'fa-chart-bar','fa-cart-shopping',
  'fa-gear','fa-clock-rotate-left','fa-code-branch','fa-plug','fa-table',
  'fa-check','fa-times','fa-plus','fa-minus','fa-edit','fa-pencil','fa-trash',
  'fa-search','fa-save','fa-undo','fa-redo','fa-home','fa-bars','fa-arrow-circle-left',
  'fa-chevron-left','fa-chevron-right','fa-arrow-up','fa-arrow-down','fa-arrow-left','fa-arrow-right',
  'fa-user','fa-user-circle','fa-user-plus','fa-user-lock','fa-sign-in','fa-sign-out',
  'fa-file','fa-file-text','fa-file-pdf','fa-file-excel','fa-file-image','fa-folder',
  'fa-download','fa-upload','fa-envelope','fa-phone','fa-comment','fa-comments','fa-share-alt',
  'fa-at','fa-exclamation-circle','fa-info-circle','fa-question-circle','fa-check-circle','fa-exclamation-triangle','fa-spinner',
  'fa-play','fa-pause','fa-volume-up','fa-volume-off','fa-video','fa-image','fa-picture-o',
  'fa-mobile','fa-laptop','fa-star','fa-heart','fa-map-marker','fa-calendar','fa-bell','fa-lock','fa-unlock',
  'fa-comment-dots', 'fa-user-plus', 'fa-folder-open', 'fa-spinner', 'fa-mobile-screen', 'fa-check-circle', 'fa-minus-circle', 'fa-upload'
];
</script>


<style scoped>
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
}
.form-hint {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

/* 图标选择器样式 */
.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.icon-option {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background-color: var(--light-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
}

.icon-option:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.icon-option.selected {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}
</style>