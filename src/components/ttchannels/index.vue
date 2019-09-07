<template>
  <el-select :value="channel_id" placeholder="请选择频道" @change="dochange($event)">
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
  props:['channel_id'],
  model:{
    prop:'channel_id',
    event:'change'
  },
  data() {
    return {
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
  methods: {
    dochange(e){
      this.$emit('change',e)
    }
  },
};
</script>

<style>
</style>