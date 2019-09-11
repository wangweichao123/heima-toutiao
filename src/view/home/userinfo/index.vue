<template>
  <el-container>
    <el-aside width="430px">      
      <el-form ref="userInfo" :model="userInfo" label-width="80px" label-position="top">
        <el-form-item label="媒体名称">
          <el-input v-model="userInfo.name" size="small"></el-input>
        </el-form-item>

        <el-form-item label="媒体简介">
          <el-input type="textarea" :rows="2" v-model="userInfo.intro" size="small"></el-input>
        </el-form-item>
        <el-form-item label="头条号id">
          <el-input v-model="userInfo.id" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="绑定手机">
          <el-input v-model="userInfo.mobile" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userInfo.email" size="small"></el-input>
        </el-form-item>

        <el-button type="primary" @click="doSave">保存更新</el-button>
      </el-form>

    </el-aside>
    <el-main>
      <!-- action：图片上传的地址 -->
      <!-- 以前我们设置的基地址，是设置axios的基地址，也就是说要通过axios发请求，才会帮我们添加基地址 -->
      <!-- 但这里用的不是axios，所以路径不能简写 -->
      <!-- 我们以前设置了axios的请求拦截，在请求拦截里把请求拦下来，加了token -->
      <!-- 但现在这里不是axios发请求，所以自己手动还要加token -->
      <!-- 因为它上传时默认的参数叫file,可能跟你接口要求的不一样，所以通过name属性来修改上传的参数名 -->
      <!-- 它默认只是发post请求 -->
      <!-- 有的时候它默认自带发请求不能满足我们的需求，所以我们需要自定义一个请求 -->
      <!-- <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
        :headers="headers"
        name="image"
        :show-file-list="false"
      > -->
      <el-upload
        action=""
        class="avatar-uploader"
        :http-request="customUpload"
        :show-file-list="false"
      >
        <img v-if="$store.state.userInfo.photo" :src="$store.state.userInfo.photo" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        
      </el-upload>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "account",
  data() {
    return {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(window.sessionStorage.getItem("user_info")).token
        }`
      },
      userInfo: {
        name: "",
        intro: "",
        email: "",
        mobile: "",
        photo: "",
        id: ""
      }
    };
  },

  methods: {
    doSave() {
      //发请求
      this.$axios
        .patch("/mp/v1_0/user/profile", this.userInfo)
        .then(res => {
          if (res.data.message.toLowerCase() == "ok") {
            this.$message.success("修改成功");

            // 修改后的数据要给vuex更新
            this.$store.commit('changeUserInfo',this.userInfo)

          } else {
            this.$message.error("修改失败");
          }
        })
        .catch(error => {
          this.$message.error("修改失败");
        });
    },

    // 自定义上传的函数
    // 当你选择文件后，就会调用这个函数
    // 并且这个函数有一个参数，参数里的file属性，就是你刚刚选择的文件
    customUpload(data){

        // console.log(data.file);
        // 自己发请求上传文件要用FormData对象
        let fm = new FormData()
        // 参数1：参数名
        // 参数2：真正要上传的值
        fm.append('photo',data.file)
        
       //自己写代码上传
       this.$axios.patch('/mp/v1_0/user/photo',fm)
            .then( res => {

                // console.log(res);
                this.userInfo.photo = res.data.data.photo;

                this.$store.commit('changeUserInfo',this.userInfo)
            })
        
    }
  },

  created() {
    this.$axios.get("/mp/v1_0/user/profile").then(res => {
      this.userInfo = res.data.data;
      // 界面一打开就应该先给vuex赋值
      this.$store.commit('changeUserInfo',this.userInfo)
    });
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>