<template>
  <div class="user-form-modal" :class="{ 'visible': visible }">
    <div class="modal-overlay" @click="handleClose"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEdit ? '编辑用户' : '新增用户' }}</h3>
        <button class="close-btn" @click="handleClose">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <form class="form-container">
          <div class="form-group">
            <label class="text-align-left">登录名 <span class="required">*</span></label>
            <input 
              type="text" 
              v-model="formData.loginName" 
              :disabled="isEdit"
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label class="text-align-left">姓名 <span class="required">*</span></label>
            <input 
              type="text" 
              v-model="formData.chineseName" 
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label class="text-align-left">手机号 <span class="required">*</span></label>
            <input 
              type="text" 
              v-model="formData.phone" 
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label class="text-align-left">邮箱 <span class="required">*</span></label>
            <input 
              type="email" 
              v-model="formData.email" 
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label class="text-align-left">用户类型 <span class="required">*</span></label>
            <select v-model="formData.userType" class="form-control">
              <option value="">请选择</option>
              <option v-for="t in userType" :key="t.code" :value="t.code">
                {{ t.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group" v-if="isEdit">
            <label class="text-align-left">状态 <span class="required">*</span></label>
            <select v-model="formData.status" class="form-control">
              <option value="">请选择</option>
              <option v-for="s in userStatus" :key="s.code" :value="s.code">
                {{ s.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group" v-if="!isEdit">
            <label class="text-align-left">初始密码 <span class="required">*</span></label>
            <input 
              type="password" 
              v-model="formData.password" 
              class="form-control"
            >
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-outline" @click="handleClose">取消</button>
        <button class="btn btn-primary" @click="handleSubmit">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {  reactive, watch,defineProps,defineEmits } from 'vue';
import request from '../api/request';
import { ElMessage } from 'element-plus';
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  userId: {
    type: [String, Number],
    default: null
  },
  userType: {
    type: Array,
    default: () => []
  },
  userStatus: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:visible', 'success']);
const formData = reactive({
  loginName: '',
  chineseName: '',
  phone: '',
  email: '',
  userType: '',
  status: '',
  password: ''
});
const resetForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = '';
  });
};
const loadUserInfo = (id) => {
  debugger;
  request.get(`/api/uaa-user/${id}`).then(res => {
    if (res.code === 200) {
      Object.assign(formData, res.data);
    }
  }).catch(err => {
    console.error('加载用户信息失败:', err);
  });
};
watch(() => props.userId, (newVal) => {
  if (props.isEdit && newVal) {
    loadUserInfo(newVal);
  } else {
    resetForm();
  }
}, { immediate: true });

const handleSubmit = () => {
  // 简单验证
  if (!formData.loginName || !formData.chineseName) {
    alert('请填写必填字段');
    return;
  }

  if (props.isEdit) {
    request.post('/api/uaa-user/saveOrUpdate', formData).then(res => {
      if (res.code === 200) {
        emit('success');
        emit('update:visible', false);
      }
    });
  } else {
    request.post('/api/uaa-user', formData).then(res => {
      if (res.code === 200) {
        emit('success');
        emit('update:visible', false);
      }
    });
  }
};

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false);
  resetForm();
};
</script>

<style scoped>
.user-form-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: none;
}

.user-form-modal.visible {
  display: block;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.modal-content {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: var(--light-bg);
  color: var(--primary-color);
}

.modal-body {
  padding: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: var(--text-color);
}

.required {
  color: #ff4d4f;
}

.form-control {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.2);
}

.form-control:disabled {
  background-color: var(--light-bg);
  cursor: not-allowed;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  background-color: var(--light-bg);
}
</style>