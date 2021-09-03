<template>
<div>
    <!-- 卡片视图区域 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>

        <!-- 表格 -->
        <tree-table
            class="treeTable"
            :data="cateList"
            :columns="columns"
            :expand-type="false"
            :selection-type="false"
            :show-index="true"
            index-text="#"
            border
        >
            <!-- 模板一：是否有效 -->
            <template slot="isok" slot-scope="scope">
                <i
                    v-if="scope.row.cat_deleted === false"
                    class="el-icon-success"
                    style="color: lightgreen"
                ></i>
                <i v-else class="el-icon-error" style="color: red"></i>
            </template>
            <!-- 模板二：排序 -->
            <template slot="order" slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">
                    二级
                </el-tag>
                <el-tag type="warning" size="mini" v-else>三级</el-tag>
            </template>
            <!-- 模板三：操作 -->
            <template slot="opt" slot-scope="scope">
                <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="editClick(scope.row)"
                >
                    编辑
                </el-button>
                <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="removeClick(scope.row)"
                >
                    删除
                </el-button>
            </template>
        </tree-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="querInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="querInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
        :title="showTitleVal"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addCateDialogClosed"
    >
        <!-- 添加/编辑 分类的表单 -->
        <el-form
            ref="addCateFormRef"
            :model="addCateForm"
            label-width="100px"
            :rules="addCateFormRules"
        >
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：" v-if="showDialogType === 1">
                <!-- options指定数据源 -->
                <!-- props用来指定数据对象 -->
                <el-cascader
                    v-model="selectedKeys"
                    :options="parentCateList"
                    :props="{
                        expandTrigger: 'hover',
                        value: 'cat_id',
                        label: 'cat_name',
                        children: 'children',
                    }"
                    @change="parentCateChange"
                    clearable
                    :change-on-select="true"
                ></el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template', // 表示将当前列定义为模板列
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      dialogVisible: false,
      addCateForm: {
        // 添加分类的表单数据对象
        cat_name: '', // 将要添加的分类名称
        cat_pid: 0, // 父级分类的id
        cat_level: 0 // 分类的等级，默认要添加的是一级分类
      },
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],
      showDialogType: 1, // 1表示新增时    2表示编辑时
      showTitleVal: '添加分类',
      useID: 0
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    getCateList () {
      this.$http
        .get('categories', {
          params: this.querInfo
        })
        .then(res => {
          console.log(res)
          if (res.data.meta.status !== 200) {
            return this.$message.error('获取商品列表失败')
          }

          console.log(res.data.data)
          this.cateList = res.data.data.result
          this.total = res.data.data.total
        })
    },
    // 监听pagsize改变
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 页面值改变
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },

    // 添加分类点击事件
    showAddCateDialog () {
      this.showTitleVal = '添加分类'
      this.showDialogType = 1
      // 先获取父级分类的列表
      this.getParentCateList()
      this.dialogVisible = true
    },

    // 获取父级分类的数据列表
    getParentCateList () {
      this.$http
        .get('categories', {
          params: {
            type: 2
          }
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('获取父级分类列表失败！！！')
          }

          this.parentCateList = res.data.data
          console.log('99999999', this.parentCateList)
        })
    },
    // 选择项发生变化触发的函数
    parentCateChange () {
      console.log(this.selectedKeys)
      // 如果selectedKeys数据中 length 大于0  证明选中了父级分类；
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类确定按钮
    addCate () {
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) return
        // 添加时
        if (this.showDialogType === 1) {
          this.$http.post('categories', this.addCateForm).then(res => {
            if (res.data.meta.status !== 201) {
              return this.$message.error('添加分类失败')
            }
            this.$message.success('添加分类成功！')
            this.getCateList()
            this.dialogVisible = false
          })
        } else if (this.showDialogType === 2) {
          // 编辑时
          this.$http
            .put(`categories/${this.useID}`, {
              cat_name: this.addCateForm.cat_name
            })
            .then(res => {
              if (res.data.meta.status !== 200) {
                return this.$message.error('编辑分类失败！！！')
              }
              this.$message.success('编辑分类成功！！！')
              this.getCateList()
              this.dialogVisible = false
            })
        }
      })
    },
    // 关闭添加分类弹框按钮
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_name = ''
    },
    // 编辑按钮
    editClick (row) {
      this.showDialogType = 2
      this.showTitleVal = '编辑分类'
      this.dialogVisible = true
      this.addCateForm.cat_name = row.cat_name
      console.log(row)
      this.useID = row.cat_id
    },
    // 删除按钮
    removeClick (row) {
      this.$confirm('确定要删除吗？？？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          this.$http.delete(`categories/${row.cat_id}`).then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('删除失败！')
            }
            this.$message.success('删除成功！！！')
            this.getCateList()
            this.dialogVisible = false
          })
        })
        .catch(err => {
          console.log(err)
          return this.$message.info('您已取消删除！')
        })
    }
  }
}
</script>
<style>
.el-cascader-panel {
    height: 200px;
}
</style>
<style lang="less" scoped>
.treeTable {
    margin-top: 20px;
}
.el-cascader {
    width: 100%;
}
</style>
