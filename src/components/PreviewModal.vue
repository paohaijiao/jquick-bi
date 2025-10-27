<!-- PreviewModal.vue -->
<template>
  <div class="modal-overlay" :class="{ active: modelValue }" @click="close">
    <div class="modal preview-modal" @click.stop>
      <div class="modal-header">
        <div class="modal-title">报表预览</div>
        <div class="preview-actions">
          <button class="action-btn" @click="handlePrint">
            <i class="fas fa-print"></i>打印
          </button>
          <button class="action-btn" @click="downloadPDF">
            <i class="fas fa-download"></i>导出PDF
          </button>
          <button class="modal-close" @click="close">&times;</button>
        </div>
      </div>
      <div class="modal-body preview-body">
        <!-- 预览内容 -->
        <div class="preview-container" :style="previewStyle">
          <!-- 预览画布 -->
          <div class="preview-canvas">
            <div 
              v-for="component in components" 
              :key="component.id"
              class="preview-component"
              :style="getComponentStyle(component)"
            >
              <div class="preview-component-header">
                <i :class="getComponentIcon(component.type)"></i>
                <span>{{ component.name }}</span>
              </div>
              <div class="preview-component-content">
                {{ getComponentPreviewContent(component) }}
              </div>
            </div>
            
            <!-- 空状态 -->
            <div 
              v-if="components.length === 0"
              class="preview-empty"
            >
              <i class="fas fa-inbox"></i>
              <p>暂无组件，请先添加组件到画布</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewModal'
}
</script>

<script setup>
import { computed,defineProps,defineEmits } from 'vue'

// 使用 defineProps 和 defineEmits
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  reportInfo: {
    type: Object,
    default: () => ({})
  },
  components: {
    type: Array,
    default: () => []
  },
  reportStyle: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'print'])

// 计算预览容器样式
const previewStyle = computed(() => {
  const styles = {
    backgroundColor: props.reportStyle.bgColor || '#fff'
  }
  
  // 根据报表尺寸设置样式
  if (props.reportStyle.size === 'A4 (横向)') {
    styles.width = '297mm'
    styles.height = '210mm'
  } else if (props.reportStyle.size === 'A4 (纵向)') {
    styles.width = '210mm'
    styles.height = '297mm'
  }
  
  return styles
})

// 获取组件图标
const getComponentIcon = (type) => {
  const icons = {
    'chart': 'fas fa-chart-line',
    'table': 'fas fa-table',
    'text': 'fas fa-font',
    'image': 'fas fa-image',
    'section': 'fas fa-border-all',
    'pagebreak': 'fas fa-file-page-break'
  }
  return icons[type] || 'fas fa-cube'
}

// 获取组件样式
const getComponentStyle = (component) => {
  return {
    height: component.height ? `${component.height}px` : 'auto',
    minHeight: component.type === 'chart' || component.type === 'table' ? '200px' : '100px'
  }
}

// 获取组件预览内容
const getComponentPreviewContent = (component) => {
  if (component.content) {
    return component.content
  }
  
  const defaultContents = {
    'chart': `图表预览: ${component.chartType || '折线图'}`,
    'table': '表格数据预览',
    'text': '文本内容预览',
    'image': '图片预览',
    'section': '分区容器',
    'pagebreak': '--- 分页符 ---'
  }
  
  return defaultContents[component.type] || '组件内容'
}

// 关闭预览
const close = () => {
  emit('update:modelValue', false)
}

// 处理打印
const handlePrint = () => {
  emit('print', {
    reportInfo: props.reportInfo,
    components: props.components,
    style: props.reportStyle
  })
}

// 导出PDF（模拟）
const downloadPDF = () => {
  // 这里可以集成实际的PDF导出库
  console.log('导出PDF功能', {
    reportInfo: props.reportInfo,
    components: props.components
  })
  
  // 模拟下载
  alert('PDF导出功能开发中...')
}
</script>

<style scoped>
.preview-modal {
  max-width: 90%;
  max-height: 90vh;
  width: auto;
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-body {
  padding: 0;
  overflow: auto;
}

.preview-container {
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

.preview-canvas {
  padding: 20px;
  min-height: 400px;
}

.preview-component {
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  background: white;
}

.preview-component-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: var(--primary-color);
  font-weight: 500;
}

.preview-component-content {
  background: #f9f9f9;
  border-radius: 4px;
  padding: 15px;
  text-align: center;
  color: #666;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.preview-empty i {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.5;
}

@media print {
  .modal-overlay,
  .modal-overlay.active {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 9999;
  }
  
  .modal-header,
  .modal-footer,
  .preview-actions {
    display: none !important;
  }
  
  .preview-modal {
    box-shadow: none;
    max-width: none;
    max-height: none;
  }
  
  .preview-container {
    box-shadow: none;
  }
}
</style>