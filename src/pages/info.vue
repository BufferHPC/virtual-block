<template>
  <div class="container">
    <!-- 顶部标题栏目，对应的宽度是40px -->
    <h1 class="header">
      传智播客
      <span class="router-label">>> 项目简介</span>
    </h1>
    <div class="info">
      <h2>基于Vue海量数据高性能滚动插件开发</h2>
      <h3>六大亮点</h3>
      <div>
        <p class="title">模拟业务数据</p>
        <p class="more">使用Express+Mock尽可能真实模拟可能使用的接口API数据，并在个人服务器上发布，允许跨域，服务器地址是：http://52.199.69.165:4000/data?num=10000，num参数是一次请求需要模拟的数据条数</p>
      </div>
      <div>
        <p class="title">数据请求分割</p>
        <p class="more">我尽可能满足业务场景需求，采取第一次合理片段数据请求，后根据用户滚动到缓冲区允许范围外时，实时发送数据请求，以期望提高用户更好体验</p>
      </div>
      <div>
        <p class="title">虚拟滚动渲染</p>
        <p class="more">对海量的数据，动态的截取其中合理的一部分，不断的用数据中的部分值来刷新页面，从而产生虚拟滚动的过程</p>
      </div>
      <div>
        <p class="title">页面防抖优化</p>
        <p class="more">基于Debounce防抖和浏览器重采样策略requestAnimationFrame来进行优化，后使用tag监听的方式配合requestAnimationFrame组合实现优化</p>
      </div>
      <div>
        <p class="title">集成插件输出</p>
        <p class="more">基于vue定制化插件规则，科学合理代码结构，注册到Vue实例上直接进行全局调用</p>
      </div>
      <div>
        <p class="title">周边生态集成</p>
        <p class="more">引入了iView基础UI仓库，按需加载了card、icon等具体使用的相关插件，实现更好页面效果</p>
      </div>
      <div></div>
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
  height: 150%;
  margin: 0 auto;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  .header {
    position: absolute;
    width:100%;
    max-width: 800px;
    top:0;
    left:50%;
    transform: translateX(-50%);
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
  .info{
    width:90%;
    margin: 0 auto;
    padding:70px 0;
    margin-bottom: 20px;
    h2{
      text-align: center;
      font-size:18px;
      color:#333;
      padding-bottom: 10px;
    }
    h3{
      text-align: center;
      font-size:14px;
      color:#666;
    }
    p{
      text-align: justify;
    }
    p.title{
      font-size:16px;
      color:#000;
      margin-top:20px;
      padding: 0 0 5px 0 ;
    }
    p.more{
      background-color:#ccc;
      padding:5px ;
    }
  }
}
</style>
