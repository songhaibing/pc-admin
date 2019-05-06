<template >
    <div>
      <div class="left-main">
        <div class="boxLeftTop">
          <span class="menu_title">系统目录</span>
        </div>
        <div class="single-content">
          <i class="el-icon-share"></i>
          <span class="title">平台系统管理</span>
        </div>
        <div class="single-content">
          <i class="el-icon-share"></i>
          <span class="title">平台系统管理</span>
        </div>
        <div class="single-content">
          <i class="el-icon-share"></i>
          <span class="title">平台系统管理</span>
        </div>
        <div class="single-content">
          <i class="el-icon-share"></i>
          <span class="title">平台系统管理</span>
        </div>


      </div>
    </div>
</template>

<script>
    export default {
        name: "role"
    }
</script>

<style scoped lang="scss">
  .left-main{
    position: fixed;
    background: #F8F8F8;
    height: 100%;
    width: 200px;
    border-right: 1px solid #e0e1e3;
    .boxLeftTop{
      .menu_title{
        padding-left: 16px;
        background-color: #f8f8f8;
        font-size: 16px;
        line-height: 55px;
      }
    }
    .single-content{
      cursor: pointer;
      padding: 10px 0 0 16px;
      .title{
        font-size: 12px;
        font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif;
      }
    }

  }

</style>
