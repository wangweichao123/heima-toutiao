<template>
  <div>
    <div class="my-upload" @click="doDis">
      <p v-if="!updatedImg || !isShow" class="my-text">点击选择图片</p>
      <i v-if="!updatedImg || !isShow" class="el-icon-upload my-icon"></i>
      <img v-if="updatedImg && isShow" :src="updatedImg" class="show-img" />
    </div>
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="上传图片" name="first">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="header"
            name="image"
            :show-file-list="false"
            :on-success="doFile"
          >
            <img v-if="updatedImg" :src="updatedImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="媒体库" name="second">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-radio-group v-model="radioPic" size="medium" @change="dosearch(radioPic)">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="收藏"></el-radio-button>
              </el-radio-group>
            </div>
            <el-row class="my-row" :gutter="30" v-loading="isLoading">
              <el-col :span="8" v-for="item in imgList" :key="item.id">
                <el-card body-style="padding:0;" class="my-card" :class="{isshow:item.id == prveId}">
                  <div class="my-pic"  @click="chooseImg(item)">
                    <img :src="item.url" class="image" />
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
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="del">取 消</el-button>
        <el-button type="primary" @click="doUpdated">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "matter",
  data() {
    return {
      prveId:'',
      isShow: false,
      updatedImg: "",
      activeName: "second",
      dialogVisible: false,
      radioPic: "全部",
      imgList: [],
      total: 10,
      is_collected: false,
      isLoading: true,
      header: {
        Authorization: `Bearer ${
          JSON.parse(window.sessionStorage.getItem("user_info")).token
        }`
      }
    };
  },
  methods: {
    chooseImg(item){
      this.prveId = item.id;
      this.updatedImg = item.url;
    },
    del() {
      this.isShow = false;
      this.dialogVisible = false;
    },
    doUpdated() {
      this.isShow = true;
      this.dialogVisible = false;
      this.$emit("checked", this.updatedImg);
    },
    handleClick() {},
    doDis() {
      this.dialogVisible = true;
    },
    // 上传完成时的钩子
    doFile(res) {
      // console.log(res);
      this.updatedImg = res.data.url;
      this.loadMatter();
      this.$message.success("上传成功");
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
            per_page: 9,
            collect: this.is_collected
          }
        })
        .then(res => {
          // console.log(res);
          this.imgList = res.data.data.results;
          this.total = res.data.data.total_count;
          this.isLoading = false;
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
.my-upload {
  padding: 5px;
  .show-img {
    width: 100%;
    height: 100%;
  }
}
.my-row {
  margin-bottom: 10px;
  .my-card {
    position: relative;
    cursor: pointer;
    &.isshow::before{
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .3);
      background-image: url(data:image/png;base64,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);
      background-repeat: no-repeat;
      background-size: 40px;
      background-position: right top;
    }
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
  }
}

.my-upload {
  width: 215px;
  height: 215px;
  border: 2px solid #eee;
  text-align: center;
  cursor: pointer;
  .my-text {
    font-size: 20px;
    margin: 20px 0;
  }
  .my-icon {
    font-size: 100px;
  }
}

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