<template>
  <div class="footer-box">
    <!-- 底部导航栏目 -->
    <div class="my-footer">
      <router-link class="tab" to="/">
        <img :src="company" alt="新闻中心">
        <span>新闻中心</span>
      </router-link>
      <router-link class="tab" to="/info">
        <img :src="news" alt="项目简介">
        <span>项目简介</span>
      </router-link>
      <router-link class="tab" to="/owner">
        <img :src="user" alt="个人中心">
        <span>个人中心</span>
      </router-link>
    </div>
  </div>
</template>

<script>
//引入对应的icon相关文件
import company from "../assets/company.png";
import news from "../assets/news.png";
import user from "../assets/user.png";

export default {
  data() {
    return {
      company,
      news,
      user
    };
  }
};
</script>

<style lang="scss">
.footer-box{
  position: fixed;
  left: 0;
  bottom: 0;
  width:100%;
}
.my-footer {
  max-width: 800px;
  margin:0 auto;
  height: 60px;
  color: #007cba;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #efefef;
  .tab {
    width: 30%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    img {
      width: 30px;
    }
  }
}
</style>
