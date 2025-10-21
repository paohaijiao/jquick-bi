import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/js/all.min.js'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import request from './api/request'
import './styles/common.scss'
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
const app = createApp(App)
app.config.globalProperties.$iconList = iconList;
app.config.globalProperties.$request = request
app.use(router)
app.use(ElementPlus,{
  locale: zhCn
})
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}