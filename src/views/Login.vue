<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
          <img src="../assets/imgs/logo.png" alt="" />
      </div>
      <div class="topTitle">档案管理系统</div>
      <!-- 登录表单区 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        label-width="0px"
        class="login_form"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username" >
          <el-input
            v-model="loginForm.username"
            placeholder="请输入登录名"
            maxlength="15"
            clearable
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            maxlength="18"
            type="password"
            show-password
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 默认登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在3 到 10个字符之间',
            trigger: 'change'
          }
        ],
        // 验证密码是否合法
        password: [
          {
            required: true,
            message: '请输入登录密码',
            trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符之间',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 登录按钮
    login () {
      this.$refs.loginFormRef.validate((valid) => {
        console.log(valid) // 是一个布尔值，验证通过为true
        if (!valid) return
        const params = {
          username: this.loginForm.username,
          password: this.loginForm.password
        }
        console.log(this.$api)
        this.$api.login(params)
          .then((res) => {
            console.log(res.data)
            if (res.data.meta.status !== 200) {
              this.$message({
                message: res.data.meta.msg,
                type: 'error'
              })
            } else {
              this.$message({
                message: '登录成功',
                type: 'success',
                duration: 1000
              })
              // 登录成功之后的token，保存到客户端的sessionStorage中  localStorage是持久化存储机制，sessionStorage是会话期间的存储机制
              console.log(res.data.data.token)
              window.sessionStorage.setItem('token', res.data.data.token)
              setTimeout(() => {
                this.$router.push('/home')
              }, 1000)
            }
          })
          .catch((e) => {
            console.log(e)
            window.sessionStorage.setItem('token', 'selfdefinetoken')
            this.$message({
              message: '本地登录',
              type: 'success',
              duration: 1000
            })
            setTimeout(() => {
              this.$router.push('/home')
            }, 1000)
          })
      })
    },
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
      this.loginForm = {
        username: '',
        password: ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  // background-color: #2b4b6b;
  background-image: url("../assets/imgs/background.png");
  background-size: 100% 100%;
  // position: fixed;
  height: 100%;
}
.login_box {
  width: 500px;
  height: 350px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%; // 万能居中
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    top: -30px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .topTitle {
    width: 100%;
    height: 140px;
    // background: red;
    display: flex;
    align-items: center; // flex居中
    justify-content: center;
    font-size: 25px;
    font-weight: 700;
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}

</style>
