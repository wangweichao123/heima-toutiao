<template>
  <el-select v-model="form.region" placeholder="请选择频道">
    <el-option label="所有频道" value></el-option>
    <el-option
      :label="channel.name"
      v-for="channel in channels"
      :key="channel.id"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name:'ttchannels',
  data() {
    return {
      form:{
        region:''
      },
      channels:[]
    }
  },
  created() {
    // 获取文章频道
    this.$axios.get("/mp/v1_0/channels").then(res => {
      // console.log(res);
      this.channels = res.data.data.channels;
    });
  },
};
</script>

<style>
</style>