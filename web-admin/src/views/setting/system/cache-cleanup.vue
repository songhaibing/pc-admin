<template>
  <div style="padding: 20px">
    <el-button type="success" @click="cleanUp">清理系统缓存</el-button>
  </div>
</template>

<script>
  export default {
    name: "cache-cleanup",
    methods: {
      cleanUp(){
        window.open("http://106.75.178.9:8080/admin/cache/flush");
      }
    }
  }
</script>

<style scoped>

</style>
