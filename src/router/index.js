import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/home/overview',
    meta: { ishome: true, keepAlive: true },
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: 'overview',
        component: () => import('../views/overview/overview.vue')
      },
      {
        path: 'fileList',
        component: () => import('../views/documentManage/fileList.vue')
      },
      {
        path: 'fileStatistic',
        component: () => import('../views/documentManage/fileStatistic.vue')
      },
      {
        path: 'environment',
        component: () => import('../views/environment/environment.vue')
      },
      {
        path: 'user',
        component: () => import('../views/system/userList.vue')
      },
      {
        path: 'role',
        component: () => import('../views/system/roleList.vue')
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
