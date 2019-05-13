<template>
  <div>菜单管理</div>
</template>

<script>
export default {
  name: 'Menu',
  created() {
    this.$_HTTP.get(this.$_API.getMenu, {}, res => {
      console.log(res)
    })
  }
}
</script>

<style scoped>

</style>
