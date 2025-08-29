<template>
  <div class="home">
    <h1>首页</h1>
    <el-button type="primary" @click="getData">测试请求</el-button>
    
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-if="data" class="data-container">
      <h3>响应数据:</h3>
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import api from '@/api/request'  // 改为默认导入
import { ElMessage } from 'element-plus'

export default {
  name: 'HomeAbout',
  setup() {
    const data = ref(null)
    const loading = ref(false)

    const getData = async () => {
      loading.value = true
      try {
        // 使用 api.get 而不是 get
        const response = await api.get('/api/test')
        data.value = response
        ElMessage.success('请求成功')
      } catch (error) {
        console.error('请求失败:', error)
        ElMessage.error('请求失败: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    return {
      data,
      loading,
      getData
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.loading {
  margin: 20px 0;
  color: #666;
}

.data-container {
  margin-top: 20px;
  text-align: left;
}

pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>