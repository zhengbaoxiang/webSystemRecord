<template>
    <div>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getGoodsList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getGoodsList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- table表格区域 -->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column
                    label="商品名称"
                    prop="goods_name"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="商品价格(元)"
                    prop="goods_price"
                    width="105px"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="商品重量"
                    prop="goods_weight"
                    width="95px"
                    align="center"
                ></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="230px" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-edit"
                            @click="editClick(scope.row)"
                        >
                            编辑
                        </el-button> -->
                        <el-button
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            @click="removeById(scope.row.goods_id)"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [], // 商品列表
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList () {
      this.$http
        .get('goods', {
          params: this.queryInfo
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('获取商品列表失败！！！')
          }
          console.log(res.data.data)
          this.goodslist = res.data.data.goods
          this.total = res.data.data.total
        })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除按钮
    removeById (row) {
      this.$confirm('此操作会永久删除该商品，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          this.$http.delete(`goods/${row}`).then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('删除失败')
            }
            this.$message.success('删除成功！！！')
            this.getGoodsList()
          })
        })
        .catch(err => {
          console.log(err)
          return this.$message.info('您取消了删除')
        })
    },
    // 编辑按钮
    editClick (row) {},
    // 添加商品按钮
    goAddPage () {
      this.$router.push('/home/goods/add')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
