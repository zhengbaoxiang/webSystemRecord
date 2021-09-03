import Vue from 'vue'
import VueRouter from 'vue-router'

import Users from '../views/user/Users.vue'
import Rights from '../views/power/Rights.vue'
import Roles from '../views/power/Roles.vue'
import Cate from '../views/goods/Cate.vue'
import Params from '../views/goods/Params.vue'
import List from '../views/goods/List.vue'
import Add from '../views/goods/add.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login' // 重定向
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/home/reports',
    meta: { ishome: true, keepAlive: true },
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/home/welcome',
        name: 'welcome',
        component: () => import('../views/Welcome.vue')
      },

      {
        path: '/home/reports',
        component: () => import('../views/report/Report.vue')
      },
      {
        path: '/home/orders',
        component: () => import('../views/order/order.vue')
      },

      {
        path: '/home/users',
        component: Users
      },
      {
        path: '/home/rights',
        component: Rights
      },
      {
        path: '/home/roles',
        component: Roles
      },
      {
        path: '/home/categories',
        component: Cate
      },
      {
        path: '/home/params',
        component: Params
      },
      {
        path: '/home/goods',
        component: List
      },
      {
        path: '/home/goods/add',
        component: Add
      }

    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转过来
  // next 是一个函数 表示放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
