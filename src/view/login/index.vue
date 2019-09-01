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
                <el-button @click="getCode" :disabled="sec!=60">{{sec==60 ? '获取验证码' : '还剩'+sec+'秒'}}</el-button>
              </div>
            </el-col>
          </el-row>
          <el-form-item prop="checkit">
            <el-checkbox v-model="ruleForm.checkit" name="checkit">
              我已阅读并同意
              <a href="javascript:void(0);">用户协议</a>和
              <a href="javascript:void(0);">隐私条款</a>
            </el-checkbox>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="btn-login" @click="doLogin">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        phone: "18801185985",
        code: "",
        checkit: false
      },
      rules: {
        phone: [
          { required: true, message: "请输入11位手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位正确手机号", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入6位验证码", trigger: "blur" },
          { min: 6, max: 6, message: "请输入6位正确验证码", trigger: "blur" }
        ],
        checkit: [
          { pattern: /true/, message: "请阅读并选中", trigger: "change" }
        ]
      },
      sec: 60
    };
  },
  methods: {
    getCode() {
      // 判断是否输入手机号
      if (this.ruleForm.phone == "") {
        this.$message({
          message: "请输入手机号",
          type: "warning"
        });
        return;
      }
      // 点击开始倒计时60秒
      this.sec--;
      let timeID = setInterval(() => {
        this.sec--;
        //假设等2秒后放验证码
        if (this.sec == 57) {
          this.ruleForm.code = "246810";
        }

        if (this.sec == 0) {
          clearInterval(timeID);
          this.sec = 60;
        }
      }, 1000);
    },
    doLogin() {
      // validate方法判断用户输入是否正确
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          // 发送axios
            this.$axios
            .post("http://ttapi.research.itcast.cn/mp/v1_0/authorizations", {
              mobile: this.ruleForm.phone,
              code: this.ruleForm.code
            })
            .then(res => {
    
              if (res.data.data) {
                // 需要把这个整体存到浏览器缓存里
                // console.log(res.data.data);
                // return;

                // 先把对象转成json字符串
                let jsonStr = JSON.stringify(res.data.data)
                window.sessionStorage.setItem('user_info',jsonStr)
      
                this.$message({
                  message: "登录成功！",
                  type: "success"
                });

                // 如果正确就跳转到home页
                this.$router.push("/home");

              } else {
                // 如果错误提示错误信息并不跳转
                this.$message({
                  message: "账号或密码错误！",
                  type: "error"
                });
              }
            })
            // 发请求出现错误就触发
            .catch( res => {
              
              this.isLoading = false;
              
              this.$message({
                  message: "账号或密码错误！",
                  type: "error"
                });
            } )
          
        } else {
          this.$message('请输入正确的手机号或验证码')
          return false;
        }
      });
    }
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
    .btn-login {
      width: 100%;
    }
  }
}
</style>