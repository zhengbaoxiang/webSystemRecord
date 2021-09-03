<template>
    <div>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 头部警告区域 -->
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                :closable="false"
                show-icon
            ></el-alert>

            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader
                        v-model="selectedCateKeys"
                        :options="cateList"
                        :props="{
                            expandTrigger: 'hover',
                            value: 'cat_id',
                            label: 'cat_name',
                            children: 'children',
                        }"
                        @change="handleChange"
                        clearable
                        :change-on-select="true"
                    ></el-cascader>
                </el-col>
            </el-row>

            <!-- tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isBtnDisabled"
                        @click="addDialogVisible = true"
                    >
                        添加参数
                    </el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag
                                    v-for="(item, i) in scope.row.attr_vals"
                                    :key="i"
                                    closable
                                    @close="handleClose(i, scope.row)"
                                >
                                    {{ item }}
                                </el-tag>
                                <!-- 文本输入框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                ></el-input>
                                <!-- 添加按钮 -->
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                >
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-edit"
                                    @click="showEditDialog(scope.row.attrId)"
                                >
                                    编辑
                                </el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="removeParams(scope.row.attrId)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isBtnDisabled"
                        @click="addDialogVisible = true"
                    >
                        添加属性
                    </el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag
                                    v-for="(item, i) in scope.row.attr_vals"
                                    :key="i"
                                    closable
                                    @close="handleClose(i, scope.row)"
                                >
                                    {{ item }}
                                </el-tag>
                                <!-- 文本输入框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                ></el-input>
                                <!-- 添加按钮 -->
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                >
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-edit"
                                    @click="showEditDialog(scope.row.attrId)"
                                >
                                    编辑
                                </el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="removeParams(scope.row.attrId)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数的对话框 -->
        <el-dialog
            :title="'添加' + titleText"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
        >
            <!-- 添加参数表单 -->
            <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑对话框 -->
        <el-dialog
            :title="'修改' + titleText"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
        >
            <!-- 添加参数表单 -->
            <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules="editFormRules">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      cateList: [],
      selectedCateKeys: [], // 级联选择框双向绑定到的数组
      activeName: 'many', // 被激活的页签名称
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    getCateList () {
      this.$http.get('categories').then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取商品分类失败！')
        }
        this.cateList = res.data.data
        console.log(this.cateList)
      })
    },
    handleChange () {
      this.getParamsData()
    },
    // tab页签点击事件的处理函数
    handleTabClick () {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数的数据
    getParamsData () {
      // 表示选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }

      // 根据所选分类的id，和当前所处的面板，获取对应的参数
      this.$http
        .get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: this.activeName
          }
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('获取参数列表失败！！！')
          }
          console.log(res.data.data)
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 添加一个布尔值，控制文本框的显示与隐藏
            item.inputVisible = false
            // 文本框输入的值
            item.inputValue = ''
          })
          console.log('改变之后', res.data.data)
          if (this.activeName === 'many') {
            this.manyTableData = res.data.data
          } else {
            this.onlyTableData = res.data.data
          }
        })
    },

    // 对话框的关闭时间
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 弹框确定按钮
    addParams () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        this.$http
          .post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          .then(res => {
            if (res.data.meta.status !== 201) {
              return this.$message.error('添加参数失败')
            }
            this.$message.success('添加参数成功')
            this.addDialogVisible = false
            this.getParamsData()
          })
      })
    },
    // 编辑按钮点击事件
    showEditDialog (attrId) {
      this.$http
        .get(`categories/${this.cateId}/attributes/${attrId}`, {
          params: {
            attr_sel: this.activeName
          }
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('获取参数信息失败！！！')
          }
          this.editForm = res.data.data
          this.editDialogVisible = true
        })
      this.editDialogVisible = true
    },

    // 编辑对话框关闭事件
    editDialogClosed () {
      // 重置对话框
      this.$refs.editFormRef.resetFields()
    },

    // 编辑弹框确定按钮
    editParams () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.$http
          .put(`categories/${this.cateId}/attributes/${this.editForm.attrId}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('修改参数失败！！！')
            }
            this.$message.success('修改参数成功！！！')
            this.getParamsData()
            this.editDialogVisible = false
          })
      })
    },

    // 删除按钮点击事件
    removeParams (attrId) {
      this.$confirm('确认要删除吗？？？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(res => {
          this.$http
            .delete(`categories/${this.cateId}/attributes/${attrId}`)
            .then(res => {
              if (res.data.meta.status !== 200) {
                return this.$message.error('删除参数失败！！！')
              }
              this.$message.success('删除参数成功！！！')
              this.getParamsData()
            })
        })
        .catch(err => {
          console.log(err)
          return this.$message.info('取消删除操作')
        })
    },

    // 文本框失去焦点或按下enter都会触发
    handleInputConfirm (row) {
      console.log('OK')
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return 则证明输入了内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求，保存操作
      this.saveAttrVals(row)
    },
    // 将对 attr_val 的操作保存到数据库
    saveAttrVals (row) {
      this.$http
        .put(`categories/${this.cateId}/attributes/${row.attrId}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('修改参数项失败！！！')
          }
          this.$message.success('修改参数项成功！！！')
        })
    },
    // 点击按钮，展示文本输入框
    showInput (row) {
      row.inputVisible = true
      // $nextTick：当页面上元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // tab标签删除
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 如果按钮需要被禁用，返回true，否则返回false
    isBtnDisabled () {
      // 没有选择三级分类
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },

    // 当前选中的三级分类的ID
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题名称
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
.el-tag {
    margin: 3px 5px;
}
.input-new-tag {
    width: 120px;
}
</style>
