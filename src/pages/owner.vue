<template>
  <div class="container">
    <!-- 顶部标题栏目，对应的宽度是40px -->
    <h1 class="header">
      传智播客
      <span class="router-label">>> 个人中心</span>
    </h1>
    <div class="my">
      <img src="../assets/buhe.jpg">
      <h2>贺鹏程</h2>
      <h3>天行健，君子以自强不息</h3>
      <h3>地势坤，君子以厚德载物</h3>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  max-width: 800px;
  height: 100%;
  margin: 0 auto;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  .header {
    position: fixed;
    max-width: 800px;
    width: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: #eee;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    text-indent: 16px;
    color: #444;
    .router-label {
      color: #888;
      font-size: 14px;
      padding-left: 5px;
    }
  }
  .my {
    padding: 210px 0 20px;
    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: block;
      margin: 0 auto;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    }
    h2 {
      text-align: center;
      font-size: 22px;
      color: #333;
      padding-top: 20px;
      padding-bottom: 10px;
    }
    h3 {
      text-align: center;
      font-size: 18px;
      color: #666;
    }
  }
}
</style>
