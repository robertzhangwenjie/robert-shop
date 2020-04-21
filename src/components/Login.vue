<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt />
      </div>
      <!-- 登陆表单 -->
      <el-form
        class="login-form"
        ref="loginForm"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="80px"
      >
        <!-- 用户名 -->
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-zhanghao1"></i>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password">
            <i slot="prefix" class="iconfont icon-icon_password_yes"></i>
          </el-input>
        </el-form-item>
        <!-- 登陆按钮 -->
        <el-form-item class="login-btn">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetField">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 18, message: '账号最少5位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码在6到18位之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetField() {
      this.$refs.loginForm.resetFields()
    },
    login() {
      this.$refs.loginForm.validate((valid, err) => {
        if (valid) {
          this.$http
            .post('login', this.loginForm)
            .then(res => {
              if (res.data.meta.status !== 200) {
                this.$message({
                  showClose: true,
                  message: '登陆失败!',
                  type: 'error',
                  duration: 2000
                })
                return
              }
              const token = res.data.data.token
              // 存储token到sessionStorage中
              sessionStorage.setItem('token', token)
              this.$message.success('登陆成功!')

              // 跳转到首页
              this.$router.push({ name: 'home' })
            })
            .catch(err => {
              console.log(err)
              this.$message.error('请求超时!')
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin flex-row($justify-content, $align-items) {
  display: flex;
  justify-content: $justify-content;
  align-items: $align-items;
}

@mixin flex-end-center {
  @include flex-row(flex-end, center);
}

@mixin flex-between-center {
  @include flex-row(space-between, center);
}

.login-container {
  background-color: #2b4b6b;
  height: 100%;
  @include center;
  .login-box {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;

    // position: absolute;
    // left: 50%;
    // top: 50%;
    // transform: translate(-50%,-50%);
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
    // flex-direction: column;
    .avatar_box {
      position: absolute;
      left: 50%;
      height: 100px;
      width: 100px;
      transform: translate(-50%, -50%);
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 5px;
      background-color: #fff;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login-form {
      position: absolute;
      bottom: 0;
      transform: translateY(-10%);
      width: 100%;
      box-sizing: border-box;
      padding: 0 70px 0px 0px;
      .login-btn {
        @include flex-end-center;
      }
    }
  }
}
</style>
