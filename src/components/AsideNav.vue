<template>
  <div>
    <!-- 这里去掉路由自动跳转，使用点击事件传出，手动跳转 -->
    <el-menu
      class="selfClass"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409fff"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="false"
      :default-active="defaultItem"
      @open="handleOpen" @close="handleClose"
    >
      <div v-for="item in dataList" :key="item.id">
        <!-- 一级菜单  无子菜单，直接选项 el-menu-item,无需模板-->
        <el-menu-item
          :index="'/home/' + item.path"
          v-if="!item.children || item.children.length === 0"
          @click.native="menuClick(item)"
        >
          <i :class="item.icon + ' myIcon'"></i>
          <!-- 文本 需要slot-->
          <span slot="title">{{ item.authName }}</span>
        </el-menu-item>
        <!-- 一级菜单 有子菜单-el-submenu   -->
        <el-submenu :index="item.id + ''" v-else >
          <!-- 一级菜单的模板区 -->
          <template slot="title">
            <i :class="item.icon + ' myIcon'"></i>
            <span slot="title">{{ item.authName }}</span>
          </template>
          <!--子 菜单项 -->
          <el-menu-item
            :index="'/home/' + subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click.stop.native="menuClick(subItem)"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'AsideNav',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: () => []
    },
    defaultItem: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      role: 124
    }
  },
  created () {
    // console.log('created')
  },
  mounted () {
    // console.log('mounted')
  },
  activated () {
    console.log('activated')
  },
  methods: {
    // 传递点击事件
    menuClick (item) {
      // console.log('emitClick', item)
      this.$emit('emitClick', item)
    },
    handleOpen (key, keyPath) {
      // console.log('handleOpen', key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log('handleClose', key, keyPath)
    }
  }
}
</script>
<style lang="less" scoped>
.myIcon {
    margin-right: 10px;
    width: 16px;
    height: 16px;
}

</style>
