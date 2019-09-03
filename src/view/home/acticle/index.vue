<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>全部图文</span>
    </div>

    <el-form ref="form" :model="form">
      <el-form-item label="文章状态:">
        <el-radio-group v-model="form.radio">
          <el-radio :label="3">全部</el-radio>
          <el-radio :label="6">草稿</el-radio>
          <el-radio :label="7">待审核</el-radio>
          <el-radio :label="8">审核通过</el-radio>
          <el-radio :label="9">审核失败</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道列表:">
        <el-select v-model="form.region" placeholder="请选择频道">
          <el-option label="所有频道" value></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间选择:">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-button type="primary">筛选</el-button>
    </el-form>

    <p class="my-caption">
      共找到
      <b>{{ total }}</b>条符合条件的内容
    </p>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" v-if="isReady">
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
          <el-button size="small" type="danger" plain>删除</el-button>
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
  data() {
    return {
        isReady:false,
      loading: false,
      total: 13,
      form: {
        radio: 3,
        region: "",
        date: ""
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  methods: {
    getcurrent(page) {
        this.loading = true;
      this.$axios
        .get("/mp/v1_0/articles", {
          params: {
            page: page
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
          this.isReady = true;
        });
    },
    handleCurrentChange(page) {
      //点击页码发送请求
      this.getcurrent(page);
    }
  },
  created() {
    this.getcurrent(1);
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
.my-caption{
    margin: 20px 0;
}
</style>