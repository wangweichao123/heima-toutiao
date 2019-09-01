<template>
  <div class="login-bg">
    <div class="login-main">
      <div class="logo">
        <img src="./img/login_logo.png" alt />
      </div>
      <div class="form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item prop="code">
                  <el-input v-model="ruleForm.code" placeholder="请输入验证码"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4" :offset="4">
              <div class="grid-content bg-purple-light">
                <el-button>获取验证码</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <el-checkbox class="read">我已阅读并同意<a href="javascript:void(0);">用户协议</a>和<a href="javascript:void(0);">隐私条款</a></el-checkbox>
        <el-button type="primary" class="btn-login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        phone: "",
        code: ""
      },
      rules: {
        phone: [
          { required: true, message: "请输入11位手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位正确手机号", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入6位验证码", trigger: "blur" },
          { min: 6, max: 6, message: "请输入6位正确验证码", trigger: "blur" }
        ]
      }
    };
  }
};
</script>

<style lang="less">
.login-bg {
  width: 100%;
  height: 100%;
  background: url("./img/login_bg.jpg") no-repeat center / cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-main {
    background: #fff;
    width: 400px;
    height: 400px;
    padding: 30px;
    .logo {
      text-align: center;
      margin-bottom: 40px;
      img {
        width: 150px;
      }
    }
    .read{
      margin: 0px 0 20px 10px;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>