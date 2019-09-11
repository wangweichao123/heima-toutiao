<template>
  <el-card>
    <el-table :data="tableData" style="width: 100%" v-loading="isloading">
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="comment_status" label="评论状态" width="180">
        <template slot-scope="scope">{{ scope.row.comment_status ? '正常':'关闭' }}</template>
      </el-table-column>
      <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
      <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
      <el-table-column label="是否评论">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.comment_status" active-color="#13ce66" inactive-color="#ff4949" @change="dochange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small">修改</el-button>
          <el-button type="text" size="small">关闭评论</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40,50]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "comment",
  data() {
    return {
      tableData: [],
      currentPage: 1,
      total: 1000,
      pageSize: 10,
      isloading: true
    };
  },
  methods: {
    dochange(row){
      // console.log(row);
      // 发请求修改评论状态
      this.$axios
      .put(`/mp/v1_0/comments/status?article_id=${row.id}`,{
        allow_comment: row.comment_status
      }).then(res=>{
        // console.log(res);
      })
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.loadcomment();
    },
    handleCurrentChange(page) {
      this.loadcomment(page);
    },
    loadcomment(page = 1) {
      this.isloading = true;
      this.$axios
        .get("/mp/v1_0/articles", {
          params: {
            page,
            per_page: this.pageSize,
            response_type: "comment"
          }
        })
        .then(res => {
          //   console.log(res);
          this.tableData = res.data.data.results;
          this.total = res.data.data.total_count;
          this.isloading = false;
        });
    }
  },
  //一进页面就发请求获取数据
  created() {
    this.loadcomment();
  }
};
</script>

<style>
</style>