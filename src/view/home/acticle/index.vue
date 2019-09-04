<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>全部图文</span>
    </div>

    <el-form ref="form" :model="form">
      <el-form-item label="文章状态:">
        <el-radio-group v-model="form.radio">
          <el-radio label>全部</el-radio>
          <el-radio :label="0">草稿</el-radio>
          <el-radio :label="1">待审核</el-radio>
          <el-radio :label="2">审核通过</el-radio>
          <el-radio :label="3">审核失败</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道列表:">
        <el-select v-model="form.region" placeholder="请选择频道">
          <el-option label="所有频道" value></el-option>
          <el-option
            :label="channel.name"
            v-for="channel in channels"
            :key="channel.id"
            :value="channel.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间选择:">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="filterList">筛选</el-button>
    </el-form>

    <p class="my-caption">
      共找到
      <b>{{ total }}</b>条符合条件的内容
    </p>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="cover.images[0]" label="封面" width="120">
        <template slot-scope="scope">
          <img width="60" :src="scope.row.cover.images[0]" alt />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="120"></el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | formatStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pubdate" label="发布时间"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain>编辑</el-button>
          <el-button size="small" type="danger" plain @click="btnDele(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total"
      :disabled="loading"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "articleList",
  data() {
    return {
      loading: false,
      total: 13,
      form: {
        radio: "",
        region: "",
        date: ""
      },
      tableData: [],
      channels: []
    };
  },
  methods: {
    getcurrent(page) {
      this.loading = true;
      const status = this.form.radio === "" ? undefined : this.form.radio;
      const channel_id = this.form.region === "" ? undefined : this.form.region;
      this.$axios
        .get("/mp/v1_0/articles", {
          params: {
            page,
            status,
            channel_id,
            begin_pubdate: this.form.date[0],
            end_pubdate: this.form.date[1]
          }
          //   header:{
          //       Authorization: `Bearer ${user.token}`
          //   }
        })
        .then(res => {
          //   console.log(res);
          this.tableData = res.data.data.results;
          this.total = res.data.data.total_count;
          this.loading = false;
        });
    },
    handleCurrentChange(page) {
      //点击页码发送请求
      this.getcurrent(page);
    },
    filterList() {
      this.getcurrent(1);
    },
    btnDele(id) {
      // 删除前做一个用户判断
      this.$confirm("此操作将永久删除该文件, 是否继续?", "确认删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`/mp/v1_0/articles/${id}`).then(res => {
            // 重新渲染页面
            this.getcurrent(1);
            this.$message.success("删除成功!");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    // 获取文章列表
    this.getcurrent(1);

    // 获取文章频道
    this.$axios.get("/mp/v1_0/channels").then(res => {
      // console.log(res);
      this.channels = res.data.data.channels;
    });
  },

  filters: {
    formatStatus(val) {
      switch (val) {
        case 0:
          return "草稿";
        case 1:
          return "待审核";
        case 2:
          return "审核成功";
        case 3:
          return "审核失败";
        case 4:
          return "已删除";
      }
    }
  }
};
</script>

<style>
.my-caption {
  margin: 20px 0;
}
</style>