<template>
  <div class="about-page">
    <h1>关于页面</h1>
    <p>这是一个使用Vue Router的示例页面</p>
    <el-button type="primary" @click="getData">测试API请求</el-button>
    
    <div v-if="data">
      <h3>API响应数据:</h3>
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script>
// 正确导入 api
import api from '@/api/request'

export default {
  name: 'AboutPage',
  data() {
    return {
      data: null
    }
  },
  methods: {
    async getData() {
      try {
        // 使用导入的 api
        const response = await api.get('/api/test')
        this.data = response
      } catch (error) {
        console.error('请求失败:', error)
        this.$message.error('请求失败')
      }
    }
  }
}
</script>

<style scoped>
.about-page {
  padding: 20px;
}

pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  text-align: left;
}
</style>