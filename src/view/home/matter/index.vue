<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-radio-group v-model="radioPic" size="medium" @change="dosearch(radioPic)">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="收藏"></el-radio-button>
      </el-radio-group>

      <el-upload
        class="upload-demo"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="header"
        name="image"
        :on-success="doFile"
        multiple
        :show-file-list="false"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-row class="my-row" :gutter="30" v-loading="isLoading">
      <el-col :span="4" v-for="item in imgList" :key="item.id">
        <el-card body-style="padding:0;">
          <div class="my-pic">
            <img :src="item.url" class="image" />
          </div>
          <div class="iconfont">
            <i
              class="matter"
              :class="item.is_collected?'el-icon-star-on':'el-icon-star-off'"
              @click="doCollect(item)"
            ></i>
            <i class="el-icon-delete matter" @click="doDel(item)"></i>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="changePage"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "matter",
  data() {
    return {
      radioPic: "全部",
      imgList: [],
      total: 10,
      is_collected:false,
      isLoading:true,
      header:{
        Authorization:`Bearer ${JSON.parse(window.sessionStorage.getItem('user_info')).token}`
      }
    };
  },
  methods: {
    // 上传完成时的钩子
    doFile(){
      // console.log(response);
      this.loadMatter();
      this.$message.success('上传成功');
    },
    changePage(page) {
      this.loadMatter(page);
    },
    doCollect(item) {
      item.is_collected = !item.is_collected;
      this.$axios.put(`/mp/v1_0/user/images/${item.id}`, {
        collect: item.is_collected
      });
    },
    doDel(item) {
      // 删除前弹框提示
      this.$confirm("是否删除该图片", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`/mp/v1_0/user/images/${item.id}`).then(res => {
            // console.log(res);
            this.loadMatter();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    dosearch(val) {
      // console.log(val);
      this.is_collected = val == "全部" ? false : true;
      this.loadMatter();
    },
    loadMatter(page = 1) {
      this.$axios
        .get("/mp/v1_0/user/images", {
          params: {
            page,
            per_page: 12,
            collect: this.is_collected
          }
        })
        .then(res => {
          // console.log(res);
          this.imgList = res.data.data.results;
          this.total = res.data.data.total_count;
          this.isLoading=false;
        });
    }
  },
  created() {
    this.loadMatter();
  }
};
</script>

<style lang="less" scoped>
.upload-demo {
  float: right;
}
.my-row {
  margin-bottom: 10px;
  .my-pic {
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .iconfont {
    height: 40px;
    width: 100%;
    background-color: #f4f5f6;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: rgb(92, 188, 226);
    .matter {
      cursor: pointer;
    }
  }
}
</style>