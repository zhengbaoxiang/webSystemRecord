<template>
<div>
  <!-- 卡片区域 -->
  <el-card>
      <el-row :gutter="20">
          <el-col :span="8">
              <el-input
                  placeholder="请输入内容"
                  v-model="queryInfo.query"
                  clearable
                  @clear="getUserList"
              >
                  <el-button
                      slot="append"
                      icon="el-icon-search"
                      @click="getUserList"
                  ></el-button>
              </el-input>
          </el-col>
          <el-col :span="4">
              <el-button type="primary" @click="addUserClick">添加用户</el-button>
          </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
              <template slot-scope="scope">
                  <el-switch
                      v-model="scope.row.mg_state"
                      @change="userStateChanged(scope.row)"
                  ></el-switch>
              </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                  <!-- 修改按钮 -->
                  <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-edit"
                      @click="showEditDialog(scope.row)"
                  ></el-button>
                  <!-- 删除按钮 -->
                  <el-button
                      type="danger"
                      size="mini"
                      icon="el-icon-delete"
                      @click="removeUserByid(scope.row)"
                  ></el-button>
                  <el-tooltip
                      effect="dark"
                      content="分配角色"
                      placement="top"
                      :enterable="false"
                  >
                      <!-- 分配角色按钮 -->
                      <el-button
                          type="warning"
                          size="mini"
                          icon="el-icon-setting"
                          @click="setRole(scope.row)"
                      ></el-button>
                  </el-tooltip>
              </template>
          </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>

      <el-dialog
          :title="showTitle"
          :visible.sync="addDialogVisible"
          width="50%"
          @close="addDialogClosed"
      >
          <el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
              <el-form-item label="用户名" prop="username">
                  <el-input v-if="showDialogType === 1" v-model="addForm.username"></el-input>
                  <el-input v-else disabled v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" v-if="showDialogType === 1">
                  <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                  <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="cancleAdd">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
      </el-dialog>
  </el-card>

  <!-- 分配角色对话框 -->
  <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClose"
  >
      <div>
          <p>当前用户：{{ userInfo.username }}</p>
          <p>当前角色：{{ userInfo.role_name }}</p>
          <p>
              分配新角色：
              <el-select v-model="selectedRoleId" placeholder="请选择">
                  <el-option
                      v-for="item in rolesList"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id"
                  ></el-option>
              </el-select>
          </p>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确定</el-button>
      </span>
  </el-dialog>
</div>
</template>
<script>
export default {
  data () {
    // 校验邮箱验证
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 校验手机号规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页数
        pagesize: 2 // 当前每页显示多少条数据
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'biur' },
          { min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'biur' },
          { min: 6, max: 15, message: '密码的长度在6-15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'biur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入邮箱', trigger: 'biur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      showTitle: '', // 对话框显示标题
      showDialogType: 1, // 1表示新增用户弹出来，2表示编辑
      editUserId: '', // 要修改的用户的ID
      setRoleDialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectedRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
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
        'data': {
          'total': 4,
          'pagenum': 1,
          'users': [
            { 'id': 500, 'role_name': '超级管理员', 'username': 'admin', 'create_time': 1486720211, 'mobile': '12345678', 'email': 'adsfad@qq.com', 'mg_state': true },
            { 'id': 502, 'role_name': '测试角色2', 'username': 'linken', 'create_time': 1486720211, 'mobile': '1213213123', 'email': 'asdf@qq.com', 'mg_state': false }
          ]
        },
        'meta': { 'msg': '获取管理员列表成功', 'status': 200 } }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize 改变事件
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关状态的改变
    userStateChanged (userinfo) {
      console.log(userinfo)
      // this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`).then(res => {
      //   if (res.data.meta.status !== 200) {
      //     userinfo.mg_state = !userinfo.mg_state
      //     return this.$message.error('更新用户状态失败！')
      //   }
      // closeAll()
      this.$message.closeAll()
      // this.$message({
      //   message: '标准写法',
      //   type: 'success'
      // })
      this.$message.success('更新用户状态成功')
      // })
    },
    // 监听dialog对话框关闭事件
    addDialogClosed () {
      // 新增时，每次关闭对话框时都要清空一下所有内容
      if (this.showDialogType === 1) {
        this.$refs.addFormRef.resetFields()
      }
    },
    // 添加用户按钮
    addUserClick () {
      this.showTitle = '添加用户'
      this.addDialogVisible = true
      this.showDialogType = 1
      this.addForm = { username: '', password: '', email: '', mobile: '' }
    },
    // dialog弹框取消按钮
    cancleAdd () {
      this.addDialogVisible = false
    },
    // dialog弹框确定按钮
    addUser () {
      this.$refs.addFormRef.validate(valid => {
        console.log(valid)
        if (!valid) return

        // 新增时
        if (this.showDialogType === 1) {
          this.$http.post('users', this.addForm).then(res => {
            console.log(res)
            if (res.status !== 200) {
              return this.$message.error('添加用户失败！')
            }
            this.$message.success('添加用户成功！')
            // 隐藏用户对话框
            this.addDialogVisible = false
            // 重新获取用户列表数据
            this.getUserList()
          })
        } else if (this.showDialogType === 2) {
          // 编辑时
          this.$http
            .put('users/' + this.editUserId, {
              email: this.addForm.email,
              mobile: this.addForm.mobile
            })
            .then(res => {
              console.log('看一下返回信息', res)
              if (res.status !== 200) {
                return this.$message.error('更新用户信息失败')
              }

              this.$message.success('更新用户信息成功')
              // 关闭弹框
              this.addDialogVisible = false
              // 重新获取数据
              this.getUserList()
            })
        }
      })
    },
    // 展示修改对象的对话框，修改按钮
    showEditDialog (item) {
      this.editUserId = item.id
      this.showDialogType = 2
      this.showTitle = '修改用户'
      this.addDialogVisible = true
      // 根据用户ID查询用户信息
      this.$http.get('users/' + item.id).then(res => {
        console.log(res)
        if (res.data.meta.status !== 200) {
          return this.$message.error('用户信息查询失败')
        }
        this.addForm.username = res.data.data.username
        this.addForm.email = res.data.data.email
        this.addForm.mobile = res.data.data.mobile
      })
    },
    // 删除用户
    removeUserByid (item) {
      this.$confirm('确定要删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          console.log(res)
          this.$http.delete('users/' + item.id).then(res => {
            console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功')
            // 刷新用户列表
            this.getUserList()
          })
        })
        .catch(err => {
          console.log(err)
          return this.$message.info('您已取消删除该用户')
        })
    },

    // 分配权限按钮
    setRole (row) {
      this.userInfo = row

      // 展示对话框之前先展示所有的角色列表
      this.$http.get('roles').then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) return this.$message.error('获取角色列表失败')
        this.rolesList = res.data.data
      })

      this.setRoleDialogVisible = true
    },

    // 分配角色确定按钮
    saveRoleInfo () {
      // setRoleDialogVisible = false

      if (this.selectedRoleId === '') {
        return this.$message.error('请选择要分配的权限')
      }

      this.$http
        .put(`users/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId
        })
        .then(res => {
          console.log(res)
          if (res.data.meta.status !== 200) {
            return this.$message.error('分配角色失败！')
          }
          this.$message.success('更新角色成功！')
          this.getUserList()
          this.setRoleDialogVisible = false
        })
    },
    // 分配角色对话框的关闭事件
    setRoleDialogClose () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang='less' scoped>
</style>
