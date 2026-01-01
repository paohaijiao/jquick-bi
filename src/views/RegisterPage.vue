<template>
  <div class="register-page">
    <div class="container">
      <header class="header">
        <div class="logo">
          <i class="fas fa-chart-line"></i>
          <span>JQuick BI</span>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <el-icon><Search /></el-icon>
            <input type="text" placeholder="搜索报表、数据集或文档...">
          </div>
        </div>
      </header>
      <div class="main-content">
        <div class="register-container">
          <div class="login-card">
            <div class="card-header">
              <h2>创建您的账号</h2>
              <p class="page-description text-align-left">请填写租户及管理员信息完成注册，带 <span class="required-star">*</span> 为必填项</p>
            </div>
            
            <div class="tabs-container">
              <div class="tabs-header">
                <div   class="tab-item" :class="{ active: activeTab === 1 }" @click="activeTab = 1" >
                  <i class="fas fa-building tab-icon"></i>
                  <span class="tab-title">租户信息</span>
                  <div class="tab-indicator" v-if="activeTab === 1"></div>
                </div>
                <div  class="tab-item" 
                  :class="{ active: activeTab === 2 }"
                  @click="activeTab = 2"
                >
                  <i class="fas fa-user-tie tab-icon"></i>
                  <span class="tab-title">管理员信息</span>
                  <div class="tab-indicator" v-if="activeTab === 2"></div>
                </div>
                <div 
                  class="tab-item" 
                  :class="{ active: activeTab === 3 }"
                  @click="activeTab = 3"
                >
                  <i class="fas fa-shield-alt tab-icon"></i>
                  <span class="tab-title">验证与确认</span>
                  <div class="tab-indicator" v-if="activeTab === 3"></div>
                </div>
              </div>
              
              <div class="tabs-content">
                <div class="tab-pane" v-show="activeTab === 1">
                  <form class="form-container" @submit.prevent="handleRegister">
                    <div class="form-section">
                      <div class="section-header">
                        <i class="fas fa-building section-icon"></i>
                        <h3>租户基本信息</h3>
                      </div>
                      
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label text-align-left">租户名称 <span class="required">*</span></label>
                          <div class="input-group">
                            <el-icon><Platform /></el-icon>
                            <input 
                              type="text" 
                              v-model="tenantForm.name" 
                              placeholder="请输入租户名称" 
                              required
                              class="form-control"
                              @blur="validateField('tenantName')"
                            >
                          </div>
                          <div class="error-message" v-if="errors.tenantName">{{ errors.tenantName }}</div>
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label text-align-left">机构代码 <span class="required">*</span></label>
                          <div class="input-group">
                            <el-icon><Collection /></el-icon>
                            <input 
                              type="text" 
                              v-model="tenantForm.code" 
                              placeholder="请输入营业执照或机构代码" 
                              required
                              class="form-control"
                            >
                          </div>
                          <div class="error-message" v-if="errors.tenantCode">{{ errors.tenantCode }}</div>
                        </div>
                      </div>
                      
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label text-align-left">企业联系电话 <span class="required">*</span></label>
                          <div class="input-group">
                            <el-icon><Phone /></el-icon>
                            <input 
                              type="tel" 
                              v-model="tenantForm.tel" 
                              placeholder="请输入企业联系电话" 
                              required
                              class="form-control"
                              @blur="validateField('tenantTel')"
                            >
                          </div>
                          <div class="error-message" v-if="errors.tenantTel">{{ errors.tenantTel }}</div>
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label text-align-left">所属行业 <span class="required">*</span></label>
                          <div class="input-group">
                            <el-icon><Suitcase /></el-icon>
                            <select 
                              v-model="tenantForm.industryId" 
                              required
                              class="form-control line-Height-With-19px"
                              @change="validateField('industryId')"
                            >
                              <option value="" disabled>请选择所属行业</option>
                              <option v-for="industry in industrys" :key="industry.id" :value="industry.id">{{ industry.name }}</option>
                            </select>
                          </div>
                          <div class="error-message" v-if="errors.industryId">{{ errors.industryId }}</div>
                        </div>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label text-align-left">企业地址 <span class="required">*</span></label>
                        <div class="input-group">
                          <el-icon><Location /></el-icon>
                          <textarea 
                            v-model="tenantForm.address" 
                            placeholder="请输入企业详细地址" 
                            required
                            class="form-control textarea-wrapper"
                            rows="2"
                            @blur="validateField('address')"
                          ></textarea>
                        </div>
                        <div class="error-message" v-if="errors.address">{{ errors.address }}</div>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label text-align-left">备注</label>
                        <div class="input-group">
                          <el-icon><Document /></el-icon>
                          <textarea 
                            v-model="tenantForm.remark" 
                            placeholder="请输入备注信息（可选）" 
                            class="form-control  textarea-wrapper"
                            rows="2"
                          ></textarea>
                        </div>
                      </div>
                      
                      <div class="form-actions">
                        <button type="button" class="btn btn-secondary" @click="activeTab = 2">
                          下一步
                          <i class="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              
                <div class="tab-pane" v-show="activeTab === 2">
                  <form class="form-container" @submit.prevent="handleRegister">
                    <div class="form-section">
                      <div class="section-header">
                        <i class="fas fa-user-tie section-icon"></i>
                        <h3>登录信息</h3>
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label text-align-left">登录名 <span class="required">*</span></label>
                          <div class="input-group">
                            <el-icon><User /></el-icon>
                            <input 
                              type="text" 
                              v-model="adminForm.loginName" 
                              placeholder="用于登录系统的用户名" 
                              required
                              class="form-control"
                            >
                          </div>
                          <div class="error-message" v-if="errors.loginName">{{ errors.loginName }}</div>
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label text-align-left">昵称</label>
                          <div class="input-group">
                            <el-icon><UserFilled /></el-icon>
                            <input 
                              type="text" 
                              v-model="adminForm.nickName" 
                              placeholder="您的昵称" 
                              class="form-control"
                            >
                          </div>
                        </div>
                      </div>
                      
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label text-align-left">真实姓名</label>
                          <div class="input-group">
                            <el-icon><User /></el-icon>
                            <input 
                              type="text" 
                              v-model="adminForm.realName" 
                              placeholder="您的真实姓名" 
                              class="form-control"
                            >
                          </div>
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label text-align-left">职位</label>
                          <div class="input-group">
                            <el-icon><Suitcase /></el-icon>
                            <input 
                              type="text" 
                              v-model="adminForm.position" 
                              placeholder="您的职位" 
                              class="form-control"
                            >
                          </div>
                        </div>
                      </div>
                      
                      <div class="section-header">
                        <i class="fas fa-address-card section-icon"></i>
                        <h3>联系信息</h3>
                      </div>
                      
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label text-align-left">电子邮箱 <span class="required">*</span></label>
                          <div class="input-group">
                            <el-icon><Message /></el-icon>
                            <input 
                              type="email" 
                              v-model="adminForm.email" 
                              placeholder="您的电子邮箱" 
                              required
                              class="form-control"
                              @blur="validateField('email')"
                            >
                          </div>
                          <div class="error-message" v-if="errors.email">{{ errors.email }}</div>
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label text-align-left">手机号码 <span class="required">*</span></label>
                          <div class="input-group">
                            <el-icon><Iphone /></el-icon>
                            <input 
                              type="tel" 
                              v-model="adminForm.phone" 
                              placeholder="您的手机号码" 
                              required
                              class="form-control"
                              @blur="validateField('phone')"
                            >
                          </div>
                          <div class="error-message" v-if="errors.phone">{{ errors.phone }}</div>
                        </div>
                      </div>
                      
                      <div class="section-header">
                        <i class="fas fa-shield-alt section-icon"></i>
                        <h3>安全设置</h3>
                      </div>
                      
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label text-align-left">设置密码 <span class="required">*</span></label>
                          <div class="input-group">
                            <el-icon><Lock /></el-icon>
                            <input 
                              type="password" 
                              v-model="adminForm.passwd" 
                              placeholder="请输入密码" 
                              required
                              class="form-control"
                              @blur="validateField('passwd')"
                            >
                          </div>
                          <div class="error-message" v-if="errors.passwd">{{ errors.passwd }}</div>
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label text-align-left">确认密码 <span class="required">*</span></label>
                          <div class="input-group">
                            <el-icon><Lock /></el-icon>
                            <input 
                              type="password" 
                              v-model="adminForm.confirmPassword" 
                              placeholder="请再次输入密码" 
                              required
                              class="form-control"
                              @blur="validateField('confirmPassword')"
                            >
                          </div>
                          <div class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
                        </div>
                      </div>
                      
                      <div class="section-header">
                        <i class="fas fa-info-circle section-icon"></i>
                        <h3>其他信息</h3>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label text-align-left">部门</label>
                        <div class="input-group">
                          <el-icon><OfficeBuilding /></el-icon>
                          <input 
                            type="text" 
                            v-model="adminForm.dept" 
                            placeholder="所在部门" 
                            class="form-control"
                          >
                        </div>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label text-align-left">个人签名</label>
                        <div class="input-group">
                          <el-icon><EditPen /></el-icon>
                          <input 
                            type="text" 
                            v-model="adminForm.signature" 
                            placeholder="个人签名" 
                            class="form-control"
                          >
                        </div>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label text-align-left">个人简介</label>
                        <div class="input-group">
                          <el-icon><Document /></el-icon>
                          <textarea 
                            v-model="adminForm.intro" 
                            placeholder="个人简介" 
                            class="form-control  textarea-wrapper"
                            rows="2"
                          ></textarea>
                        </div>
                      </div>
                      
                      <div class="form-actions">
                        <button type="button" class="btn btn-secondary" @click="activeTab = 1">
                          <i class="fas fa-arrow-left"></i>
                          上一步
                        </button>
                        <button type="button" class="btn btn-primary" @click="activeTab = 3">
                          下一步
                          <i class="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                
                <div class="tab-pane" v-show="activeTab === 3">
                  <form class="form-container" @submit.prevent="handleRegister">
                    <div class="form-section">
                      <div class="section-header">
                        <i class="fas fa-shield-alt section-icon"></i>
                        <h3>验证与确认</h3>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">验证码 <span class="required">*</span></label>
                        <div class="captcha-group">
                          <div class="captcha-input">
                            <div class="input-group">
                              <el-icon><Promotion /></el-icon>
                              <input 
                                type="text" 
                                v-model="captchaInput" 
                                placeholder="请输入验证码" 
                                required
                                class="form-control"
                                @blur="validateField('captcha')"
                              >
                            </div>
                          </div>
                          <div 
                            class="captcha-image" 
                            @click="generateCaptcha"
                          >
                            <img :src="captchaImage" alt="验证码" />
                            <div class="refresh-icon" @click.stop="generateCaptcha">
                              <i class="fas fa-sync-alt"></i>
                            </div>
                          </div>
                        </div>
                        <div class="error-message" v-if="errors.captcha">{{ errors.captcha }}</div>
                      </div>
                      
                      <div class="terms form-group">
                        <div class="terms-checkbox">
                          <input 
                            type="checkbox" 
                            id="agree-terms" 
                            v-model="agreeTerms"
                            required
                          >
                          <label for="agree-terms">
                            我已阅读并同意
                            <a href="#" @click.prevent="showTermsModal('service')">《服务条款》</a>
                            和
                            <a href="#" @click.prevent="showTermsModal('privacy')">《隐私政策》</a>
                          </label>
                        </div>
                        <div class="error-message" v-if="errors.agreeTerms">{{ errors.agreeTerms }}</div>
                      </div>
                      
      
                      <div class="preview-section">
                        <div class="section-header">
                          <i class="fas fa-eye section-icon"></i>
                          <h3>信息预览</h3>
                        </div>
                        
                        <div class="preview-content">
                          <div class="preview-row">
                            <div class="preview-label">租户名称：</div>
                            <div class="preview-value">{{ tenantForm.name || '未填写' }}</div>
                          </div>
                          <div class="preview-row">
                            <div class="preview-label">企业联系电话：</div>
                            <div class="preview-value">{{ tenantForm.tel || '未填写' }}</div>
                          </div>
                          <div class="preview-row">
                            <div class="preview-label">登录名：</div>
                            <div class="preview-value">{{ adminForm.loginName || '未填写' }}</div>
                          </div>
                          <div class="preview-row">
                            <div class="preview-label">电子邮箱：</div>
                            <div class="preview-value">{{ adminForm.email || '未填写' }}</div>
                          </div>
                          <div class="preview-row">
                            <div class="preview-label">手机号码：</div>
                            <div class="preview-value">{{ adminForm.phone || '未填写' }}</div>
                          </div>
                        </div>
                      </div>
                      
  
                      <div class="form-actions">
                        <button type="button" class="btn btn-secondary" @click="activeTab = 2">
                          <i class="fas fa-arrow-left"></i>
                          上一步
                        </button>
                        <button 
                          type="submit"
                          class="btn btn-primary" 
                          :disabled="isSubmitting"
                        >
                          <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
                          <span v-if="isSubmitting">注册中...</span>
                          <span v-else>完成注册</span>
                        </button>
                      </div>
                      
                      <div class="login-link">
                        已有账号？<a @click="login" class="register-link">立即登录</a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          <div class="app-info">
            <h2 class="page-title">JQuick BI 数据智能分析平台</h2>
            <p class="page-description">让数据会说话，让决策更精准。我们将企业繁杂数据转化为清晰可视的洞察，通过拖拽式操作即可生成专业分析报告，实时响应业务变化，为您的企业装上数据驱动的"智慧大脑"。</p>
            <ul class="features">
              <li><i class="fas fa-bolt"></i> 快速数据处理与分析，告别等待</li>
              <li><i class="fas fa-chart-line"></i> 40+可视化图表，数据一目了然</li>
              <li><i class="fas fa-cloud"></i> 全终端同步，随时随地掌控业务</li>
              <li><i class="fas fa-shield-alt"></i> 银行级加密体系，保障数据安全</li>
            </ul>
            
  
            <div class="steps-indicator">
              <div class="step" :class="{ active: activeTab === 1, completed: activeTab > 1 }">
                <div class="step-number">1</div>
                <div class="step-text">租户信息</div>
              </div>
              <div class="step-line" :class="{ active: activeTab > 1 }"></div>
              <div class="step" :class="{ active: activeTab === 2, completed: activeTab > 2 }">
                <div class="step-number">2</div>
                <div class="step-text">管理员信息</div>
              </div>
              <div class="step-line" :class="{ active: activeTab > 2 }"></div>
              <div class="step" :class="{ active: activeTab === 3 }">
                <div class="step-number">3</div>
                <div class="step-text">验证与确认</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <div class="footer">
        <p>© 2023 JQuick BI · 数据智能分析平台 · 隐私政策 · 服务条款</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import request from '../api/request';
import {
  Search, Platform, Collection, Phone, Suitcase,
  Location, Document, User, UserFilled, Message,
  Iphone, Lock, OfficeBuilding, EditPen, Promotion
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const activeTab = ref(1);

const captchaInput = ref('');
const agreeTerms = ref(false);
const industrys = ref([]);
const captchaImage = ref('');
const deviceId = ref('');
const isSubmitting = ref(false);

const tenantForm = reactive({
  name: '',
  code: '',
  tel: '',
  industryId: '',
  address: '',
  remark: ''
});

const adminForm = reactive({
  loginName: '',
  realName: '',
  nickName: '',
  email: '',
  phone: '',
  dept: '',
  position: '',
  signature: '',
  intro: '',
  passwd: '',
  confirmPassword: '',
  userType: 2 
});
const errors = reactive({
  tenantName: '',
  tenantCode: '',
  tenantTel: '',
  industryId: '',
  address: '',
  loginName: '',
  email: '',
  phone: '',
  passwd: '',
  confirmPassword: '',
  captcha: '',
  agreeTerms: ''
});

function resetErrors() {
  Object.keys(errors).forEach(key => errors[key] = '');
}

function login() {
  router.push('/login');
}

function showTermsModal(type) {
  const title = type === 'service' ? '服务条款' : '隐私政策';
  const content = type === 'service' 
    ? '这里是详细的服务条款内容...' 
    : '这里是详细的隐私政策内容...';
  
  alert(`${title}\n\n${content}`);
}
const generateCaptcha = () => {
  const currentTimestamp = Date.now();
  deviceId.value = currentTimestamp.toString();
  request.get('/api/pub/captcha/image?deviceId=' + currentTimestamp, {
    responseType: 'arraybuffer'  
  })
  .then(response => {
    const blob = new Blob([response], { type: 'image/png' })
    const reader = new FileReader()
    reader.onload = (e) => {
      captchaImage.value = e.target.result
    }
    reader.readAsDataURL(blob)
  })
  .catch(error => {
    console.error('获取验证码失败:', error);
  });
};

function getIndustry() {
  request.get('/api/pub/industry/list')
  .then(response => {
    industrys.value = response.data;
  })
  .catch(error => {
    console.error('获取行业失败:', error);
  });
}


function validateField(field) {
  switch (field) {
    case 'tenantName':
      errors.tenantName = tenantForm.name ? '' : '请输入租户名称';
      break;
    case 'tenantTel':
      errors.tenantTel = tenantForm.tel ? '' : '请输入企业联系电话';
      break;
    case 'industryId':
      errors.industryId = tenantForm.industryId ? '' : '请选择所属行业';
      break;
    case 'address':
      errors.address = tenantForm.address ? '' : '请输入企业地址';
      break;
    case 'email':
      if (!adminForm.email) {
        errors.email = '请输入电子邮箱';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminForm.email)) {
        errors.email = '请输入有效的邮箱地址';
      } else {
        errors.email = '';
      }
      break;
    case 'phone':
      if (!adminForm.phone) {
        errors.phone = '请输入手机号码';
      } else if (!/^1[3-9]\d{9}$/.test(adminForm.phone)) {
        errors.phone = '请输入有效的手机号码';
      } else {
        errors.phone = '';
      }
      break;
    case 'passwd':
      if (!adminForm.passwd) {
        errors.passwd = '请设置密码';
      } else if (adminForm.passwd.length < 6) {
        errors.passwd = '密码长度不能少于6位';
      } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(adminForm.passwd)) {
        errors.passwd = '密码必须包含字母和数字';
      } else {
        errors.passwd = '';
      }
      break;
    case 'confirmPassword':
      if (!adminForm.confirmPassword) {
        errors.confirmPassword = '请确认密码';
      } else if (adminForm.passwd !== adminForm.confirmPassword) {
        errors.confirmPassword = '两次输入的密码不一致';
      } else {
        errors.confirmPassword = '';
      }
      break;
    case 'captcha':
      errors.captcha = captchaInput.value ? '' : '请输入验证码';
      break;
  }
}

function validateCurrentTab() {
  resetErrors();
  let isValid = true;

  if (activeTab.value === 1) {
    const tenantFields = [
      { key: 'tenantName', value: tenantForm.name, message: '请输入租户名称' },
      { key: 'tenantCode', value: tenantForm.code, message: '请输入营业执照/机构代码' },
      { key: 'tenantTel', value: tenantForm.tel, message: '请输入企业联系电话' },
      { key: 'industryId', value: tenantForm.industryId, message: '请选择所属行业' },
      { key: 'address', value: tenantForm.address, message: '请输入企业地址' }
    ];

    tenantFields.forEach(field => {
      if (!field.value) {
        errors[field.key] = field.message;
        isValid = false;
      }
    });
  } else if (activeTab.value === 2) {
    if (!adminForm.loginName) {
      errors.loginName = '请输入登录名';
      isValid = false;
    }

    if (!adminForm.email) {
      errors.email = '请输入电子邮箱';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminForm.email)) {
      errors.email = '请输入有效的邮箱地址';
      isValid = false;
    }

    if (!adminForm.phone) {
      errors.phone = '请输入手机号码';
      isValid = false;
    } else if (!/^1[3-9]\d{9}$/.test(adminForm.phone)) {
      errors.phone = '请输入有效的手机号码';
      isValid = false;
    }

    if (!adminForm.passwd) {
      errors.passwd = '请设置密码';
      isValid = false;
    } else if (adminForm.passwd.length < 6) {
      errors.passwd = '密码长度不能少于6位';
      isValid = false;
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(adminForm.passwd)) {
      errors.passwd = '密码必须包含字母和数字';
      isValid = false;
    }

    if (!adminForm.confirmPassword) {
      errors.confirmPassword = '请确认密码';
      isValid = false;
    } else if (adminForm.passwd !== adminForm.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
      isValid = false;
    }
  } else if (activeTab.value === 3) {
    if (!captchaInput.value) {
      errors.captcha = '请输入验证码';
      isValid = false;
    }

    if (!agreeTerms.value) {
      errors.agreeTerms = '请阅读并同意服务条款和隐私政策';
      isValid = false;
    }
  }

  return isValid;
}

const handleRegister = async () => {
  if (!validateAll()) {
    if (errors.tenantName || errors.tenantCode || errors.tenantTel || errors.industryId || errors.address) {
      activeTab.value = 1;
    } else if (errors.loginName || errors.email || errors.phone || errors.passwd || errors.confirmPassword) {
      activeTab.value = 2;
    } else {
      activeTab.value = 3;
    }
    return;
  }
  
  try {
    const tenantData = {
      name: tenantForm.name,
      code: tenantForm.code,
      tel: tenantForm.tel,
      industryId: tenantForm.industryId,
      address: tenantForm.address,
      remark: tenantForm.remark,
      status: 'trial',
      planType: 'free',
      maxUsers: 5,
      maxReports: 20
    };
    
    const userData = {
      loginName: adminForm.loginName,
      realName: adminForm.realName,
      nickName: adminForm.nickName || adminForm.realName || adminForm.loginName,
      dept: adminForm.dept,
      position: adminForm.position,
      signature: adminForm.signature,
      intro: adminForm.intro,
      passwd: adminForm.passwd,
      email: adminForm.email,
      phone: adminForm.phone,
      userType: 2,
      enabled: 1,
      accountNonExpired: 1,
      credentialsNonExpired: 1,
      accountNonLocked: 1,
      authorities: 'ROLE_TENANT_ADMIN',
      status: 'active'
    };
    
    const param = {
      deviceId: deviceId.value,
      validateCode: captchaInput.value,
      tenant: tenantData,
      user: userData
    };
    
    const response = await request.post('/api/pub/tenant/create', param);
    debugger;
    if (response.code === 200) {
      alert('注册成功！请登录系统。');
      router.push('/login');
    } else {
    
    }
  } catch (error) {
    console.error('注册失败:', error);
  }
};

function validateAll() {
  resetErrors();
  let isValid = true;
  const tenantFields = [
    { key: 'tenantName', value: tenantForm.name, message: '请输入租户名称' },
    { key: 'tenantCode', value: tenantForm.code, message: '请输入营业执照/机构代码' },
    { key: 'tenantTel', value: tenantForm.tel, message: '请输入企业联系电话' },
    { key: 'industryId', value: tenantForm.industryId, message: '请选择所属行业' },
    { key: 'address', value: tenantForm.address, message: '请输入企业地址' }
  ];

  tenantFields.forEach(field => {
    if (!field.value) {
      errors[field.key] = field.message;
      isValid = false;
    }
  });

  if (!adminForm.loginName) {
    errors.loginName = '请输入登录名';
    isValid = false;
  }

  if (!adminForm.email) {
    errors.email = '请输入电子邮箱';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminForm.email)) {
    errors.email = '请输入有效的邮箱地址';
    isValid = false;
  }

  if (!adminForm.phone) {
    errors.phone = '请输入手机号码';
    isValid = false;
  } else if (!/^1[3-9]\d{9}$/.test(adminForm.phone)) {
    errors.phone = '请输入有效的手机号码';
    isValid = false;
  }

  if (!adminForm.passwd) {
    errors.passwd = '请设置密码';
    isValid = false;
  } else if (adminForm.passwd.length < 6) {
    errors.passwd = '密码长度不能少于6位';
    isValid = false;
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(adminForm.passwd)) {
    errors.passwd = '密码必须包含字母和数字';
    isValid = false;
  }

  if (!adminForm.confirmPassword) {
    errors.confirmPassword = '请确认密码';
    isValid = false;
  } else if (adminForm.passwd !== adminForm.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }

  if (!captchaInput.value) {
    errors.captcha = '请输入验证码';
    isValid = false;
  }

  if (!agreeTerms.value) {
    errors.agreeTerms = '请阅读并同意服务条款和隐私政策';
    isValid = false;
  }

  return isValid;
}

onMounted(() => {
  getIndustry();
  generateCaptcha();
});
</script>

<style scoped>
.register-page {
  --primary-color: #ff8326;
  --secondary-color: #fff5eb;
  --border-color: #ffd5b8;
  --text-color: #2d3e50;
  --light-bg: #f9f9f9;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  --header-height: 60px;
  --error-color: #f56c6c;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --info-color: #909399;
}

.register-page * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}

.register-page .container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.register-page .header {
  height: var(--header-height);
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.register-page .logo {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: var(--primary-color);
  font-size: 22px;
}

.register-page .logo i {
  margin-right: 10px;
  font-size: 26px;
}

.register-page .header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.register-page .search-box {
  position: relative;
  width: 280px;
}

.register-page .search-box input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.3s;
}
.line-Height-With-19px{
  line-height: 19px !important;
}
.register-page .search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.2);
}

.register-page .search-box .el-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
}

.register-page .main-content {
  flex: 1;
  padding: 30px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-page .register-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 50px;
  align-items: flex-start;
}

.register-page .login-card {
  flex: 1;
  max-width: 800px;
  min-width: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.register-page .card-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
  background-color: white;
}

.register-page .card-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
}

.register-page .page-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.register-page .text-align-left {
  text-align: left;
}

.register-page .required-star {
  color: var(--error-color);
}

.register-page .tabs-container {
  padding: 0;
}

.register-page .tabs-header {
  display: flex;
  background-color: var(--light-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 0;
}

.register-page .tab-item {
  flex: 1;
  text-align: center;
  padding: 20px 16px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.register-page .tab-item:hover {
  background-color: rgba(255, 131, 38, 0.05);
}

.register-page .tab-item.active {
  background-color: white;
  color: var(--primary-color);
}

.register-page .tab-icon {
  font-size: 20px;
  color: #999;
  transition: all 0.3s;
}

.register-page .tab-item.active .tab-icon {
  color: var(--primary-color);
}

.register-page .tab-title {
  font-size: 16px;
  font-weight: 600;
  color: #666;
  transition: all 0.3s;
}

.register-page .tab-item.active .tab-title {
  color: var(--primary-color);
}

.register-page .tab-indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 3px 3px 0 0;
}

.register-page .tabs-content {
  padding: 0;
}

.register-page .tab-pane {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-page .form-container {
  padding: 24px;
}

.register-page .form-section {
  margin-bottom: 0;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: white;
  transition: all 0.3s ease;
}

.register-page .form-section:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(255, 131, 38, 0.1);
}

.register-page .section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--secondary-color);
}

.register-page .section-icon {
  margin-right: 12px;
  color: var(--primary-color);
  font-size: 20px;
  background-color: var(--secondary-color);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-page .section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.register-page .form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.register-page .form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.register-page .form-group {
  margin-bottom: 16px;
}

.register-page .form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-color);
  font-weight: 500;
}

.register-page .required {
  color: var(--error-color);
  margin-left: 2px;
}

.register-page .input-group {
  position: relative;
}

.register-page .input-group .el-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  font-size: 16px;
  z-index: 1;
}

.register-page .form-control {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
  background-color: white;
}

.register-page .form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 131, 38, 0.1);
}

.register-page input.form-control, 
.register-page select.form-control {
  height: 44px;
  line-height: 44px;
}

.register-page select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 36px;
}

.register-page textarea.form-control {
  min-height: 100px;
  padding-top: 12px;
  padding-bottom: 12px;
  resize: vertical;
  line-height: 1.5;
}

.register-page .error-message {
  color: var(--error-color);
  font-size: 12px;
  margin-top: 6px;
  min-height: 18px;
}

.register-page .captcha-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.register-page .captcha-input {
  flex: 1;
  min-width: 0;
}

.register-page .captcha-image {
  width: 120px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  flex-shrink: 0;
}

.register-page .captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.register-page .refresh-icon {
  position: absolute;
  right: 4px;
  top: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.register-page .refresh-icon i {
  font-size: 10px;
  color: #666;
}

.register-page .refresh-icon:hover {
  background-color: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}

.register-page .terms {
  margin-top: 24px;
  margin-bottom: 24px;
}

.register-page .terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.register-page .terms-checkbox input {
  margin-top: 4px;
  accent-color: var(--primary-color);
  cursor: pointer;
}

.register-page .terms-checkbox label {
  cursor: pointer;
  user-select: none;
}

.register-page .terms-checkbox a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s;
}

.register-page .terms-checkbox a:hover {
  color: #e65c00;
  text-decoration: underline;
}

.register-page .preview-section {
  margin-top: 24px;
  padding: 20px;
  background-color: var(--light-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.register-page .preview-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.register-page .preview-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed var(--border-color);
}

.register-page .preview-row:last-child {
  border-bottom: none;
}

.register-page .preview-label {
  width: 120px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.register-page .preview-value {
  flex: 1;
  font-size: 14px;
  color: var(--text-color);
  word-break: break-all;
}

.register-page .form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  justify-content: space-between;
}

.register-page .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  outline: none;
  text-align: center;
  min-height: 44px;
}

.register-page .btn-primary {
  background: linear-gradient(135deg, #ff8326, #ff6a00);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 131, 38, 0.3);
}

.register-page .btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff6a00, #ff8326);
  box-shadow: 0 4px 12px rgba(255, 131, 38, 0.4);
  transform: translateY(-1px);
}

.register-page .btn-secondary {
  background: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.register-page .btn-secondary:hover:not(:disabled) {
  background-color: var(--secondary-color);
  transform: translateY(-1px);
}

.register-page .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.register-page .btn i {
  margin-right: 8px;
}

.register-page .btn i.fa-spinner {
  margin-right: 8px;
  animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.register-page .login-link {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  font-size: 14px;
  color: #666;
}

.register-page .register-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
  font-weight: 500;
  margin-left: 4px;
}

.register-page .register-link:hover {
  color: #e65c00;
  text-decoration: underline;
}

.register-page .app-info {
  flex: 0 0 400px;
  padding: 30px 0;
}

.register-page .app-info .page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 20px;
  line-height: 1.3;
}

.register-page .app-info .page-description {
  font-size: 16px;
  color: #666;
  line-height: 1.7;
  margin-bottom: 32px;
}

.register-page .features {
  list-style: none;
  margin-top: 32px;
}

.register-page .features li {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: var(--text-color);
  line-height: 1.5;
}

.register-page .features i {
  margin-right: 16px;
  color: var(--primary-color);
  width: 24px;
  height: 24px;
  background-color: var(--secondary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 12px;
}

.register-page .steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
}

.register-page .step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.register-page .step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s;
}

.register-page .step.active .step-number {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 0 0 4px rgba(255, 131, 38, 0.2);
}

.register-page .step.completed .step-number {
  background-color: var(--success-color);
  color: white;
}

.register-page .step-text {
  margin-top: 8px;
  font-size: 14px;
  color: #999;
  transition: all 0.3s;
}

.register-page .step.active .step-text {
  color: var(--primary-color);
  font-weight: 500;
}

.register-page .step.completed .step-text {
  color: var(--text-color);
}

.register-page .step-line {
  width: 80px;
  height: 2px;
  background-color: #f0f0f0;
  margin: 0 10px;
  transition: all 0.3s;
}

.register-page .step-line.active {
  background-color: var(--primary-color);
}

.register-page .footer {
  padding: 20px 24px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  font-size: 14px;
  color: #999;
  background-color: white;
}
.textarea-wrapper{
  align-content: center !important;
}
@media (max-width: 1024px) {
  .register-page .register-container {
    gap: 40px;
  }
  
  .register-page .app-info {
    flex: 0 0 350px;
  }
}

@media (max-width: 900px) {
  .register-page .register-container {
    flex-direction: column;
    gap: 40px;
  }
  
  .register-page .login-card {
    max-width: 100%;
  }
  
  .register-page .app-info {
    flex: none;
    width: 100%;
    max-width: 600px;
    padding: 0;
    text-align: center;
  }
  
  .register-page .app-info .page-title {
    font-size: 24px;
  }
  
  .register-page .app-info .page-description {
    font-size: 15px;
  }
  
  .register-page .features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .register-page .features li {
    margin-bottom: 0;
    justify-content: center;
    text-align: left;
  }
  
  .register-page .steps-indicator {
    margin-top: 30px;
  }
}
.tabs-header{
  height: 64px;
}
@media (max-width: 768px) {
  .register-page .main-content {
    padding: 20px 16px;
  }
  
  .register-page .tabs-header {
    flex-direction: column;
  }
  
  .register-page .tab-item {
    padding: 16px;
  }
  
  .register-page .form-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .register-page .form-section {
    padding: 16px;
  }
  
  .register-page .captcha-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .register-page .captcha-image {
    width: 100%;
    height: 48px;
  }
  
  .register-page .header-actions {
    display: none;
  }
  
  .register-page .card-header {
    padding: 20px;
  }
  
  .register-page .form-container {
    padding: 20px;
  }
  
  .register-page .steps-indicator {
    flex-direction: column;
    gap: 20px;
  }
  
  .register-page .step-line {
    width: 2px;
    height: 40px;
  }
}

@media (max-width: 576px) {
  .register-page .container {
    min-height: 100vh;
  }
  
  .register-page .form-section {
    padding: 14px;
  }
  
  .register-page .features {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .register-page .form-actions {
    flex-direction: column;
  }
  
  .register-page .btn {
    width: 100%;
  }
  
  .register-page .section-header {
    margin-bottom: 16px;
    padding-bottom: 8px;
  }
  
  .register-page .preview-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .register-page .preview-label {
    width: 100%;
  }
}

@media print {
  .register-page .header,
  .register-page .app-info,
  .register-page .footer,
  .register-page .captcha-image,
  .register-page .terms,
  .register-page .form-actions,
  .register-page .login-link,
  .register-page .tabs-header {
    display: none;
  }
  
  .register-page .container {
    background: white;
  }
  
  .register-page .login-card {
    box-shadow: none;
    border: 1px solid #ddd;
  }
  
  .register-page .tab-pane {
    display: block !important;
  }
}
</style>