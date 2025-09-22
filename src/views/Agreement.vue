<template>
  <div class="container">
    <!-- 返回按钮 -->
    <a href="#" class="back-button" @click.prevent="handleBack">
      <i class="fas fa-arrow-left"></i>
      返回首页
    </a>
    
    <!-- 顶部导航栏（简化版） -->
    <header class="header">
      <div class="logo">
        <i class="fas fa-chart-line"></i>
        <span>JQuick BI</span>
      </div>
    </header>
    
    <!-- 右侧内容区域 -->
    <main class="content-area">
      <div class="page-header">
        <div>
          <h1 class="page-title">使用协议</h1>
          <p class="page-description">请仔细阅读以下协议内容，使用我们的服务即表示您同意本协议</p>
        </div>
        <div class="action-buttons">
          <button class="btn btn-outline" @click="handlePrint">
            <i class="fas fa-print"></i>
            打印协议
          </button>
          <button class="btn btn-primary" @click="handleDownloadPdf">
            <i class="fas fa-download"></i>
            下载PDF
          </button>
        </div>
      </div>
      
      <!-- 协议内容 -->
      <div class="agreement-container">
        <div class="agreement-header">
          <h2 class="agreement-title">JQuick BI 服务使用协议</h2>
          <p class="agreement-subtitle">最后更新日期：2023年10月15日</p>
        </div>
        
        <div class="agreement-section">
          <h3 class="agreement-section-title text-align-left">1. 协议接受</h3>
          <p class="agreement-text">欢迎您使用JQuick BI服务。本协议是您与JQuick BI之间关于使用JQuick BI产品服务所订立的协议。您在使用我们的服务前，应当仔细阅读本协议，特别是免除或限制责任的条款，并选择接受或不接受。</p>
          <p class="agreement-text">您通过页面点击或以其他方式选择接受本协议，即表示您同意接受本协议的全部约定内容。如果您不同意本协议的任意内容，请不要使用JQuick BI服务。</p>
        </div>
        
        <div class="agreement-section">
          <h3 class="agreement-section-title text-align-left">2. 服务说明</h3>
          <p class="agreement-text">JQuick BI是一个商业智能分析平台，提供数据连接、数据处理、可视化分析和报表制作等功能。我们的服务包括但不限于：</p>
          <ul class="agreement-list">
            <li class="text-align-left">多种数据源的连接和集成</li>
            <li class="text-align-left">数据清洗、转换和建模</li>
            <li class="text-align-left">可视化图表和仪表盘制作</li>
            <li class="text-align-left">报表共享和协作功能</li>
            <li class="text-align-left">数据安全和权限管理</li>
          </ul>
          <p class="agreement-text">我们保留随时变更、中断或终止部分或全部服务的权利，且无需对用户或任何第三方负责。</p>
        </div>
        
        <div class="agreement-section">
          <h3 class="agreement-section-title text-align-left">3. 账户注册与安全</h3>
          <p class="agreement-text">在使用本服务前，您需要注册一个JQuick BI账户并同意以下条款：</p>
          <ul class="agreement-list">
            <li class="text-align-left">您提供的信息必须真实、准确、完整，且在发生变动时及时更新</li>
            <li class="text-align-left">您有责任保护账户密码的安全，并对使用该账户的所有活动负责</li>
            <li class="text-align-left">如发现任何未经授权使用您账户的情况，应立即通知JQuick BI</li>
            <li class="text-align-left">JQuick BI不会要求您提供密码信息，请勿向任何人透露您的密码</li>
          </ul>
        </div>
        
        <div class="agreement-section">
          <h3 class="agreement-section-title text-align-left">4. 用户行为规范</h3>
          <p class="agreement-text">您在使用本服务时必须遵守中国有关法律法规，并同意以下规范：</p>
          <ul class="agreement-list">
            <li class="text-align-left">不得上传、发布或传播任何非法、侵权、淫秽、暴力、恐怖主义等内容</li>
            <li class="text-align-left">不得利用本服务从事任何违反法律法规或侵犯他人权益的活动</li>
            <li class="text-align-left">不得干扰或破坏本服务及相关服务器、网络的安全和正常运行</li>
            <li class="text-align-left">不得尝试规避服务的技术保护措施或进行反向工程、反编译等行为</li>
            <li class="text-align-left">遵守所有与服务有关的协议、规定、程序和惯例</li>
          </ul>
        </div>
        
        <div class="agreement-section">
          <h3 class="agreement-section-title text-align-left">5. 数据隐私与安全</h3>
          <p class="agreement-text">我们高度重视用户数据的隐私和安全：</p>
          <ul class="agreement-list">
            <li  class="text-align-left">我们将按照隐私政策收集、使用、存储和共享您的个人信息</li>
            <li  class="text-align-left">我们采用行业标准的安全措施保护您的数据免受未经授权的访问</li>
            <li  class="text-align-left">您保留对您上传数据的所有权利，我们仅根据您的指示处理这些数据</li>
            <li  class="text-align-left">我们不会将您的数据用于本协议未说明的其他目的</li>
          </ul>
          <p class="agreement-text">详细内容请参阅我们的《隐私政策》。</p>
        </div>
        
        <div class="agreement-section">
          <h3 class="agreement-section-title text-align-left">6. 知识产权</h3>
          <p class="agreement-text">JQuick BI服务涉及的知识产权包括：</p>
          <ul class="agreement-list">
            <li  class="text-align-left">JQuick BI平台及其所有元素（包括但不限于软件、界面、文本、图形等）的知识产权归JQuick BI所有</li>
            <li  class="text-align-left">您上传的数据和创建的报表等内容的知识产权归您或相关权利人所有</li>
            <li  class="text-align-left">您授予JQuick BI在全球范围内、免版税的使用许可，以便我们为您提供服务</li>
            <li  class="text-align-left">未经明确授权，不得使用JQuick BI的任何商标、标识或商业外观</li>
          </ul>
        </div>
        
        <div class="agreement-section">
          <h3 class="agreement-section-title text-align-left">7. 免责声明</h3>
          <p class="agreement-text">JQuick BI服务按"现状"和"可用"的基础提供：</p>
          <ul class="agreement-list">
            <li  class="text-align-left">我们不保证服务不会中断或完全没有错误</li>
            <li  class="text-align-left">对于因使用服务而导致的任何间接、偶然、特殊或后果性损害，我们不承担责任</li>
            <li  class="text-align-left">对于第三方提供的内容、产品或服务，我们不承担任何责任</li>
            <li  class="text-align-left">我们不对因不可抗力或非我们所能控制的原因造成的服务中断承担任何责任</li>
          </ul>
        </div>
        
        <div class="agreement-section">
          <h3 class="agreement-section-title text-align-left">8. 协议变更与终止</h3>
          <p class="agreement-text">我们可能随时修改本协议条款，修改后的协议将在网站上公布。如果您继续使用我们的服务，即表示您接受修改后的协议。</p>
          <p class="agreement-text">您或我们均可根据以下规定终止本协议：</p>
          <ul class="agreement-list">
            <li  class="text-align-left">您可以随时通过停止使用我们的服务并关闭账户来终止本协议</li>
            <li  class="text-align-left">如果我们认为您违反了本协议，可以暂停或终止您的账户</li>
            <li  class="text-align-left">协议终止后，某些条款（包括但不限于知识产权、免责声明等）仍然有效</li>
          </ul>
        </div>
        
        <div class="agreement-section">
          <h3 class="agreement-section-title text-align-left">9. 法律适用与争议解决</h3>
          <p class="agreement-text">本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。</p>
          <p class="agreement-text">如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向JQuick BI所在地的人民法院提起诉讼。</p>
        </div>
        
        <div class="agreement-footer">
          <p>感谢您花时间阅读我们的使用协议。如果您有任何疑问，请联系我们的客服团队。</p>
          
          <div class="accept-checkbox">
            <input type="checkbox" id="acceptAgreement" v-model="isAccepted">
            <label for="acceptAgreement">我已阅读并同意以上使用协议</label>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script >
export default {
  name: 'agreementPage'
}
</script>
<script setup>



// 处理打印功能
const handlePrint = () => {
  window.print();
};

// 处理下载PDF功能
const handleDownloadPdf = () => {
  alert('PDF下载已开始。在实际应用中，这里会下载协议的PDF版本。');
};

// 处理返回首页
const handleBack = () => {
  if(confirm('确定要返回首页吗？')) {
    // 这里可以添加返回首页的逻辑
    alert('正在返回首页...');
  }
};
</script>

<style>
:root {
  --primary-color: #ff8326;
  --secondary-color: #fff5eb;
  --border-color: #ffd5b8;
  --text-color: #2d3e50;
  --light-bg: #f9f9f9;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}
.text-align-left {
  text-align:left;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  color: var(--text-color);
  background-color: var(--light-bg);
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 顶部导航栏（简化版） */
.header {
  height: 60px;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  margin-bottom: 24px;
}

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

/* 右侧内容区域 */
.content-area {
  background-color: var(--light-bg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
}

.page-description {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: linear-gradient(to right, #ff8326, #ff6a00);
  color: white;
  box-shadow: 0 2px 5px rgba(255, 131, 38, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(to right, #ff6a00, #ff8326);
  box-shadow: 0 4px 8px rgba(255, 131, 38, 0.4);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-outline {
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-outline:hover {
  background-color: var(--secondary-color);
}

.btn i {
  margin-right: 8px;
}

/* 协议内容区域 */
.agreement-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 30px;
  margin-bottom: 24px;
}

.agreement-header {
  text-align: center;
  margin-bottom: 30px;
}

.agreement-title {
  font-size: 28px;
  color: var(--text-color);
  margin-bottom: 10px;
}

.agreement-subtitle {
  font-size: 16px;
  color: #666;
}

.agreement-section {
  margin-bottom: 25px;
}

.agreement-section-title {
  font-size: 18px;
  color: var(--primary-color);
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.agreement-text {
  line-height: 1.8;
  color: #555;
  margin-bottom: 15px;
  text-align: justify;
}

.agreement-list {
  padding-left: 20px;
  margin-bottom: 15px;
}

.agreement-list li {
  margin-bottom: 10px;
  line-height: 1.6;
}

.agreement-footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  color: #666;
}

.agreement-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

/* 接受协议复选框 */
.accept-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.accept-checkbox input {
  width: 18px;
  height: 18px;
}

.accept-checkbox label {
  font-size: 15px;
  color: #555;
}

/* 返回按钮 */
.back-button {
  display: inline-flex;
  align-items: center;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 20px;
}

.back-button i {
  margin-right: 8px;
}

.back-button:hover {
  text-decoration: underline;
}
</style>