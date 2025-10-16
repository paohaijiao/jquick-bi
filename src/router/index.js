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
    path: '/myReport',
    name: 'myReportPage',
    component: () => import('../views/myReport.vue')
  },
  {
    path: '/role',
    name: 'rolePage',
    component: () => import('../views/Role.vue')
  },
  {
    path: '/tenant',
    name: 'tenantPage',
    component: () => import('../views/Tenant.vue')
  },
  {
    path: '/users',
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
  },

  {
    path: '/support',
    name: 'supportPage',
    component: () => import('../views/Support.vue')
  },
  {
    path: '/report',
    name: 'reportPage',
    component: () => import('../views/Report.vue')
  },
  {
    path: '/tutorials',
    name: 'tutorialsPage',
    component: () => import('../views/Tutorials.vue')
  },
  {
    path: '/help',
    name: 'helpPage',
    component: () => import('../views/Help.vue')
  },
  {
    path: '/agreement',
    name: 'agreementPage',
    component: () => import('../views/Agreement.vue')
  },
  {
    path: '/variable',
    name: 'variablePage',
    component: () => import('../views/Variable.vue')
  },
  {
    path: '/connector',
    name: 'connectorPage',
    component: () => import('../views/Connector.vue')
  },
  {
    path: '/dataSet',
    name: 'dataSetPage',
    component: () => import('../views/DataSet.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router