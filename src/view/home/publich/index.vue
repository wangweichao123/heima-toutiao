<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发表文章</span>
    </div>
    <div>
      <el-form ref="form" :rules="rules" :model="form" label-width="60px" v-loading="isLoading">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <quillEditor v-model="form.content" :options="editorOption"></quillEditor>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div class="my-updatedimg">
          <myupload class="updatedimg" v-for="(item , index) in form.type" :key="index" @checked="form.images[item-1] = $event"></myupload>
          </div>
        </el-form-item>
        <el-form-item label="频道">
          <ttchannels v-model="form.channel_id"></ttchannels>
        </el-form-item>
        <el-form-item>
          <el-button size="small">存入草稿</el-button>
          <el-button size="small" type="primary" @click="publishArticle('form')">发表</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import ttchannels from "../../../components/ttchannels/";
import myupload from "./components/myupload.vue";

export default {
  name: "publish",
  components: {
    quillEditor,
    ttchannels,
    myupload
  },

  data() {
    return {
      // 开关,判断是否点击发表
      ispublish: false,
      seveForm: {},
      isLoading: true,
      form: {
        title: "",
        content: "",
        channel_id: "",
        images:[],
        type:1
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 5, max: 30, message: "长度在 5 到 30 个字符", trigger: "blur" }
        ]
      },
      // 富文本编辑器配置
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction

            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],
            ["image"],
            ["clean"] // remove formatting button
          ]
        }
      }
    };
  },
  created() {
    if (this.$route.name == "edit") {
      this.$axios
        .get(`/mp/v1_0/articles/${this.$route.params.id}`)
        .then(res => {
          this.isLoading = false;
          // console.log(res1);
          this.form = res.data.data;
          // 将数据另外保存用于判断
          Object.assign(this.seveForm, this.form);
        });
    } else {
      this.isLoading = false;
    }
  },
  // 通过监听id判断是否是新增
  watch: {
    "$route.params.id"(value) {
      // 若变化后有id,则是编辑
      if (value) {
      } else {
        // 新增,则将内容清空
        this.form.title = "";
        this.form.content = "";
      }
    }
  },
  methods: {
    publishArticle(form) {
      this.ispublish = true;
      // 表单验证
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.$route.name == "edit") {
            this.$axios
              .put(`/mp/v1_0/articles/${this.$route.params.id}`, {
                title: this.form.title,
                content: this.form.content,
                cover: {
                  type: this.form.type,
                  images: this.form.images
                },
                channel_id: this.form.channel_id
              })
              .then(res => {
                // console.log(res);
                if (res.data.message.toLowerCase() == "ok") {
                  this.$message.success("修改成功");
                  this.$router.push("/acticle");
                }
              });
          } else {
            this.$axios
              .post("/mp/v1_0/articles", {
                title: this.form.title,
                content: this.form.content,
                cover: {
                  type: this.form.type,
                  images: this.form.images
                },
                channel_id: this.form.channel_id
              })
              .then(res => {
                if (res.data.message.toLowerCase() == "ok") {
                  this.$message.success("发布成功！");
                  this.$router.push("/acticle");
                }
              });
          }
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    }
  },
  // 导航守卫,离开页面之前
  beforeRouteLeave(to, from, next) {
    // 如果保存了,则直接放行,不做弹框
    if (this.ispublish) return next();

    // console.log(to);
    if (this.$route.name == "edit") {
      // 编辑则判断内容有没有修改,若修改则做提示
      if (
        this.form.title == this.seveForm.title &&
        this.form.content == this.seveForm.content
      ) {
        return next();
      }
    } else {
      // 发布则判断内容是否为空
      if (this.form.title == "" && this.form.content == "") {
        return next();
      }
    }

    this.$confirm("有未完成内容", "确定要退出?", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        next();
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消退出"
        });
      });
  }
};
</script>

<style lang="less">
.ql-editor {
  height: 400px;
}
.my-updatedimg{
  display: flex;
  .updatedimg{
    margin-right: 10px;
  }
}
</style>