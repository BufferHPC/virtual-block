<template>
  <div class="container">
    <!-- 顶部标题栏目，对应的宽度是40px -->
    <h1 class="header">
      传智播客
      <span class="router-label">>> 新闻详情</span>
    </h1>
    <div class="my">
      <h2>{{this.$route.query.title}} </h2>
      <h2>{{this.$route.query.id}}</h2>
      <p>这里是新闻详情页面...</p>
      <p>这里是新闻详情页面...</p>
      <p>这里是新闻详情页面...</p>
      <p>这里是新闻详情页面...</p>
      <p>这里是新闻详情页面...</p>
      <p>这里是新闻详情页面...</p>
      <p>这里是新闻详情页面...</p>
      <p>这里是新闻详情页面...</p>
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
    padding: 80px 0 20px;
    h2 {
      width:60%;
      text-align: center;
      font-size: 16px;
      color: #666;
      padding-top: 0px;
      padding-bottom: 10px;
      margin-left:20%;
    }
    p{
      width:80%;
      text-align: center;
      margin-left:10%;
      line-height:28px;
    }
  }
}
</style>
