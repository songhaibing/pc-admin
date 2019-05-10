<template>
  <div class="main-contain">
    <h1 class="font-s36 font-w300 text-amethyst animated fadeInDown">提示</h1>
    <h2 class="h3 font-w300 push-20 animated fadeInUp">
      请选择子系统进行操作
    </h2>
  </div>
</template>

<script>
export default {
  name: 'TipMessage'
}
</script>

<style scoped>
  .main-contain{
    margin-left:200px;
    background-color: #f5f5f5;
    width: 100%;
    height: 150px;
    margin-top: 100px;
    text-align: center;
  }
  .fadeInDown {
    -webkit-animation-name: fadeInDown;
    animation-name: fadeInDown;
  }
  .fadeInUp {
    -webkit-animation-name: fadeInUp;
    animation-name: fadeInUp;
  }
  .animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  .text-amethyst {
    color: #a48ad4;
  }
  .font-s36 {
    font-size: 36px !important;
  }
  .font-w300 {
    font-weight: 300 !important;
  }
  .push-20 {
    margin-bottom: 20px !important;
  }
  @keyframes fadeInUp {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
  .h3{
    margin: 0;
    font-weight: 600;
    line-height: 1.2;
    color: inherit;
  }
  h1,h2{
    font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", STHeiti, "Microsoft YaHei";
    webkit-tap-highlight-color: rgba(0,0,0,0);
    color: #646464;
  }
  @keyframes fadeInDown {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
</style>
