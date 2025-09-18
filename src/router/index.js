import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: import('../views/LoginPage.vue')
  },

  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('../views/LoginPage.vue')
  }
  ,
  {
    path: '/register',
    name: 'RegisterPage',
    component: () => import('../views/RegisterPage.vue')
  },
  {
    path: '/index',
    name: 'IndexPage',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/help',
    name: 'HelpPage',
    component: () => import('../views/Help.vue')
  },
  {
    path: '/ds',
    name: 'DsPage',
    component: () => import('../views/Ds.vue')
  },
  {
    path: '/myReport',
    name: 'myReportPage',
    component: () => import('../views/myReport.vue')
  },
  {
    path: '/permission',
    name: 'permissionPage',
    component: () => import('../views/permission.vue')
  },
  {
    path: '/tenant',
    name: 'tenantPage',
    component: () => import('../views/Tenant.vue')
  },
  {
    path: '/userManage',
    name: 'userManagePage',
    component: () => import('../views/UserManage.vue')
  },
  {
    path: '/userCenter',
    name: 'userCenterPage',
    component: () => import('../views/UserCenter.vue')
  },
  {
    path: '/message',
    name: 'messagePage',
    component: () => import('../views/MessagePage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router