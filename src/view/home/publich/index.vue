<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发表文章</span>
    </div>
    <div>
      <el-form ref="form" :rules="rules" :model="form" label-width="60px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <quillEditor v-model="form.content" :options="editorOption"></quillEditor>
        </el-form-item>
        <el-form-item label="封面"></el-form-item>
        <el-form-item label="频道">
          <ttchannels></ttchannels>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="publishArticle('form')">发表</el-button>
          <el-button size="small" type="primary">存入草稿</el-button>
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
      form: {
        title: "",
        content: ""
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
  methods: {
    publishArticle(form) {
      // 表单验证
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$axios
            .post("/mp/v1_0/articles", {
             title:this.form.title,
              content:this.form.content,
              cover:{ type:1, images:["http://toutiao.meiduo.site/Fjl26KTE9-NFfkRzIZOner4yeqGl"]  },
              channel_id:2
            })
            .then(res => {
              if (res.data.message.toLowerCase() == "ok") {
                this.$message.success("发布成功！");
                this.$router.push("/acticle");
              }
            });
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