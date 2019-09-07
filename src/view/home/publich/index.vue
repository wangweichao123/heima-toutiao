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
        <el-form-item label="封面"></el-form-item>
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

export default {
  name: "publish",
  components: {
    quillEditor,
    ttchannels
  },
  data() {
    return {
      isLoading:true,
      form: {
        title: "",
        content: "",
        channel_id: ""
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
          this.form.title = res.data.data.title;
          this.form.content = res.data.data.content;
          this.form.channel_id = res.data.data.channel_id;
        });
    }else{
      this.isLoading = false;
    }
  },
  methods: {
    publishArticle(form) {
      // 表单验证
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.$route.name == "edit") {
            this.$axios
              .put(`/mp/v1_0/articles/${this.$route.params.id}`, {
                  title: this.form.title,
                content: this.form.content,
                cover: {
                  type: 1,
                  images: [
                    "http://toutiao.meiduo.site/Fjl26KTE9-NFfkRzIZOner4yeqGl"
                  ]
                },
                channel_id: this.form.channel_id
              })
              .then(res => {
                // console.log(res);
                if (res.data.message.toLowerCase() == 'ok') {
                  this.$message.success('修改成功');
                  this.$router.push('/acticle');
                }
              });

          } else {
            this.$axios
              .post("/mp/v1_0/articles", {
                title: this.form.title,
                content: this.form.content,
                cover: {
                  type: 1,
                  images: [
                    "http://toutiao.meiduo.site/Fjl26KTE9-NFfkRzIZOner4yeqGl"
                  ]
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
  }
};
</script>

<style>
.ql-editor {
  height: 400px;
}
</style>