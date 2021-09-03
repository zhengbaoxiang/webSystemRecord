<template>
<div>
  <!-- 卡片区域 -->
  <el-card>
      <!-- 添加角色按钮区域 -->
      <!-- 行 -->
      <el-row>
          <!-- 列 -->
          <el-col>
              <el-button type="primary" @click="addRoles">添加角色</el-button>
          </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
              <template slot-scope="scope">
                  <!-- 行 -->
                  <el-row
                      :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
                      v-for="(item, index) in scope.row.children"
                      :key="item.id"
                  >
                      <!-- 列   渲染一级权限 -->
                      <el-col :span="5">
                          <el-tag closable @close="removeRightById(scope.row, item.id)">
                              {{ item.authName }}
                          </el-tag>
                          <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 渲染二级和三级权限 -->
                      <el-col :span="19">
                          <!-- 通过for循环嵌套渲染二级权限 -->
                          <el-row
                              :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                              v-for="(item2, index2) in item.children"
                              :key="item2.id"
                          >
                              <el-col :span="6">
                                  <el-tag
                                      type="success"
                                      closable
                                      @close="removeRightById(scope.row, item2.id)"
                                  >
                                      {{ item2.authName }}
                                  </el-tag>
                                  <i class="el-icon-caret-right"></i>
                              </el-col>
                              <el-col :span="18">
                                  <el-tag
                                      closable
                                      type="warning"
                                      v-for="item3 in item2.children"
                                      :key="item3.id"
                                      @close="removeRightById(scope.row, item3.id)"
                                  >
                                      {{ item3.authName }}
                                  </el-tag>
                              </el-col>
                          </el-row>
                      </el-col>
                  </el-row>
              </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column align="center" type="index" label="#"></el-table-column>
          <el-table-column align="center" label="角色名称" prop="roleName"></el-table-column>
          <el-table-column align="center" label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column align="center" label="操作" width="300px">
              <template slot-scope="scope">
                  <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-edit"
                      @click="editRoles(scope.row)"
                  >
                      编辑
                  </el-button>
                  <el-button
                      type="danger"
                      size="mini"
                      icon="el-icon-delete"
                      @click="removeRoles(scope.row)"
                  >
                      删除
                  </el-button>
                  <el-button
                      type="warning"
                      size="mini"
                      icon="el-icon-setting"
                      @click="showSetRightDialog(scope.row)"
                  >
                      分配权限
                  </el-button>
              </template>
          </el-table-column>
      </el-table>
  </el-card>

  <!-- 分配权限对话框 -->
  <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree
          :data="rightslist"
          :props="treeProps"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="defKeys"
          ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button @click="allotRights" type="primary">确 定</el-button>
      </span>
  </el-dialog>

  <!-- 添加/编辑 角色对话框 -->
  <el-dialog
      :title="showTitle"
      :visible.sync="addRolesVisible"
      width="50%"
      @close="addRolesClosed"
  >
      <el-form
          :model="addRolesForm"
          :rules="addRolesFormRules"
          ref="addRolesFormRef"
          label-width="100px"
      >
          <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="toAddRoles">确 定</el-button>
      </span>
  </el-dialog>
</div>
</template>
<script>
export default {
  data () {
    return {
      // 所有角色列表数据
      rolelist: [],
      setRightDialogVisible: false,
      rightslist: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: '', // 当前要分配权限的角色id
      addRolesVisible: false,
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      addRolesFormRules: {
        roleName: [{ required: true, message: '请输入角色名称！', trigger: 'blur' }]
      },
      showTitle: '添加角色',
      showDialogType: 1, // 1表示新增  2表示编辑
      editRolesId: '' // 要编辑的角色ID
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    getRolesList () {
      this.$http.get('roles').then(res => {
        console.log(res)
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取角色列表失败')
        }
        this.rolelist = res.data.data
      })
    },
    // 删除三级权限
    removeRightById (role, rightId) {
      this.$confirm('确定要删除该选项吗', '提示', {
        confirButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          console.log('确定')
          this.$http
            .delete(`roles/${role.id}/rights/${rightId}`)
            .then(res => {
              console.log(res)
              if (res.data.meta.status !== 200) {
                return this.$message.error('删除失败')
              }
              role.children = res.data.data
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
          this.$message.info('取消了删除')
        })
    },
    // 分配权限按钮
    showSetRightDialog (row) {
      console.log(row)
      this.roleId = row.id
      this.$http.get('rights/tree').then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取权限数据失败')
        }
        this.rightslist = res.data.data
      })
      this.defKeys = []
      // 递归查询三级节点的id
      this.getLeafKeys(row, this.defKeys)
      this.setRightDialogVisible = true
    },

    // 通过递归获取角色下所有的三级权限的id，并保存到 defKey 数组中
    getLeafKeys (node, arr) {
      // 如果当前 node 节点不包含children属性，证明是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },

    // 分配权限弹框确定按钮
    allotRights () {
      const key = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(key)

      const idStr = key.join(',')

      this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr }).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('分配权限失败')

        this.$message.success('分配权限成功')
        this.getRolesList()
        this.setRightDialogVisible = false
      })
    },

    // 添加角色按钮
    addRoles () {
      this.addRolesVisible = true
      this.showTitle = '添加角色'
      this.addRolesForm.roleName = ''
      this.addRolesForm.roleDesc = ''
      this.showDialogType = 1
    },
    addRolesClosed () {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 添加角色确定按钮
    toAddRoles () {
      this.$refs.addRolesFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！！！')
        }
        // 新增时
        if (this.showDialogType === 1) {
          this.$http.post('roles', this.addRolesForm).then(res => {
            console.log(res)
            if (res.data.meta.status !== 201) {
              return this.$message.error('添加角色失败！')
            }
            this.$message.success('添加角色成功！！！')
            this.addRolesVisible = false
            this.getRolesList()
          })
        } else if (this.showDialogType === 2) {
          // 编辑时
          // console.log('=====', this.addRolesForm);
          this.$http.put(`roles/${this.editRolesId}`, this.addRolesForm).then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('编辑角色信息失败！！！')
            }
            this.$message.success('编辑角色信息成功！！！')
            this.addRolesVisible = false
            this.getRolesList()
          })
        }
      })
    },
    // 编辑按钮
    editRoles (row) {
      console.log(row)
      this.editRolesId = row.id
      this.showTitle = '修改角色'
      this.addRolesVisible = true
      this.addRolesForm.roleName = row.roleName
      this.addRolesForm.roleDesc = row.roleDesc
      this.showDialogType = 2
    },
    // 删除按钮
    removeRoles (row) {
      console.log(row)
      this.$confirm('确定要删除吗？？？', '提示', {
        confirButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          console.log('点击了确定')
          this.$http.delete(`roles/${row.id}`).then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('删除操作失败！！！')
            }
            this.$message.success('删除成功！！！')
            this.getRolesList()
          })
        })
        .catch(err => {
          console.log(err)
          return this.$message.info('您已取消删除')
        })
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
