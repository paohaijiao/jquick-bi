<template>
    <div class="logo">
        <i class="fas fa-chart-line"></i>
        <span>JQuick BI</span>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <el-icon><Search /></el-icon>
          <input type="text" placeholder="搜索报表1、数据源或文档...">
        </div>
        <div class="notification-icon" @click="toggleUserMessage">
          <i class="far fa-bell"></i>
          <span class="notification-badge">{{messageCnt}}</span>
        </div>
        <div class="user-info" @click="toggleUserMenu">
          <div class="user-avatar">{{user.chineseName}}</div>
          <span class="user-name">{{user.realName}}</span>
          <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
        </div>
      </div>
</template>
<script>
export default {
  name: 'HeaderPage'
}
</script>
<script setup>
import { ref,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import request from '../api/request';
const router = useRouter();
const messageCnt = ref(0);
const user = ref({});
const toggleUserMenu = () => {
    router.push('/userCenter');
};
const toggleUserMessage = () => {
    debugger;
    router.push('/message');
};
const handleUnReadMessage = () => {
  request.post('/api/message/getUnReadMessage')
  .then(response => {
    if(response.code==200){
      messageCnt.value=response.data;
    }
  });
};
const handleUserDetail = () => {
  request.get('/api/uaa-user/getCurrentUserInfo')
  .then(response => {
    if(response.code==200){
      user.value=response.data;
    }
  });
};
onMounted(() => {
  handleUnReadMessage();
  handleUserDetail();
});
</script>


<style scoped>

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
</style>