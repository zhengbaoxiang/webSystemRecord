<template>
<div>
  <!-- 卡片区域 -->
  <el-card>
      <el-table :data="rightsList" border stripe height="80vh">
          <el-table-column align="center" label="#" type="index"></el-table-column>
          <el-table-column align="center" label="权限名称" prop="authName"></el-table-column>
          <el-table-column align="center" label="路径" prop="path"></el-table-column>
          <el-table-column align="center" label="权限等级" prop="level">
              <template slot-scope="scope">
                  <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                  <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
                  <el-tag v-else type="waring">三级</el-tag>
              </template>
          </el-table-column>
      </el-table>
  </el-card>
</div>
</template>
<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    // 请求数据
    this.getRightsList()
  },
  methods: {
    getRightsList () {
      this.$http.get('rights/list').then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取权限列表失败！')
        }
        this.rightsList = res.data.data
        console.log(this.rightsList)
      })
    }
  }
}
</script>
<style lang='less' scoped>
</style>
