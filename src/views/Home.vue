<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
        <div>
            <!-- <img style="margin-left: 15px" src="@/assets/logo.png" alt="" /> -->
            <span style="margin-left: 20px">后台管理系统欢迎您</span>
        </div>
        <div></div>
        <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体内容 -->
    <el-container>
      <!-- 侧边栏内容 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <AsideNav
          :dataList="menuList"
          :defaultItem="currentPath"
          :isCollapse="isCollapse"
          @emitClick="menuClick"
        >
        </AsideNav>
      </el-aside>
      <!-- 显示内容 -->
      <el-main>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{menuTitle}}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="subTitle">{{subTitle}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menuList: [], // 左侧菜单数据
      menuTitle: '', // 一级菜单
      subTitle: '', // 二级菜单
      isCollapse: false
    }
  },
  created () {
    console.log('created')
    this.getMenuList()
    // this.currentPath = this.$route.path
  },
  mounted () {
    console.log('mounted')
  },
  activated () {
    console.log('activated')
  },
  watch: {
    currentPath (newVal, oldVal) {
      // console.log('watch=>>>>', newVal, oldVal)
    }
  },
  computed: {
    currentPath () {
      const path = this.$route.path
      // console.log('computed=>>>>', path)
      this.getBreadcrumb(path)
      return path
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单
    getMenuList () {
    //   this.$api.getMenuList()
    //     .then(res => {
    //       console.log(res)
    //       if (res.data.meta.status !== 200) {
    //         this.$message.error(res.meta.msg)
    //         return
    //       }
    //       this.menuList = res.data.data
    //     })
    //     .catch(() => {
    //     })
      const res = {
        'data': [
          { 'id': 10086,
            'authName': '欢迎首页',
            'icon': 'iconfont icon-shangpin',
            'path': 'welcome'
          },
          { 'id': 100,
            'authName': '数据总览',
            'icon': 'iconfont icon-baobiao',
            'path': 'reports',
            'children': []
          },
          { 'id': 101,
            'authName': '订单管理',
            'icon': 'iconfont icon-tijikongjian',
            'path': 'orders',
            'children': [{ 'id': 107, 'authName': '订单列表', 'path': 'orders', 'children': [] }]
          },
          { 'id': 102,
            'authName': '权限管理',
            'icon': 'iconfont icon-danju',
            'path': 'rights',
            'children': [
              { 'id': 111, 'authName': '角色列表', 'path': 'roles', 'children': [] },
              { 'id': 112, 'authName': '权限列表', 'path': 'rights', 'children': [] }]
          },
          { 'id': 103,
            'authName': '商品管理',
            'icon': 'iconfont icon-shangpin',
            'path': 'goods',
            'children': [
              { 'id': 104, 'authName': '商品列表', 'path': 'goods', 'children': [] },
              { 'id': 115, 'authName': '分类参数', 'path': 'params', 'children': [] },
              { 'id': 121, 'authName': '商品分类', 'path': 'categories', 'children': [] }
            ]
          },
          { 'id': 104,
            'authName': '用户管理',
            'icon': 'iconfont icon-user',
            'path': 'users',
            'children': [{ 'id': 1, 'authName': '用户列表', 'path': 'users', 'children': [] }]
          }

        ],
        'meta': { 'msg': '获取菜单列表成功', 'status': 200 } }
      this.menuList = res.data
    },

    // 点击按钮切换菜单的折叠展开事件
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 可以手动跳转，加传参
    menuClick (item) {
      console.log('menuClick', item)
      this.isCollapse = false // 只要点击了跳转菜单，就展开
      // 处理同一个地址重复点击会报错 NavigationDuplicated
      if (this.$route.path.includes(item.path)) {
        return
      }
      this.$router.push({
        path: '/home/' + item.path,
        query: {
          Id: item.id
        }
      })
    },
    // 自动获取导航面包屑，无需单独在页面内写死
    getBreadcrumb (path) {
      this.menuList.forEach((item) => {
        const children = item.children || []
        if (children.length > 0) {
          children.forEach((subItem) => {
            if (path.includes(subItem.path)) {
              // console.log('获取菜单标题', subItem)
              // 获取菜单标题
              this.menuTitle = item.authName
              this.subTitle = subItem.authName
            }
          })
        } else {
          if (path.includes(item.path)) {
            // console.log('获取菜单标题', item)
            // 获取菜单标题
            this.menuTitle = item.authName
            this.subTitle = ''
          }
        }
      })
    }
  }
}
</script>
<style lang="less">
.home-container {
    height: 100%;
}
.el-header {
    background-color: #333744;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        img {
            width: 60px;
            height: 60px;
        }
        span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    color: #fff;
    letter-spacing: 0.2em; //增加或减少字符间的空白
    cursor: pointer;
}
</style>
