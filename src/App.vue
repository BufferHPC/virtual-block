<template>
  <div id="app">
    <!-- 路由放置区域，keep-alive目的是 -->
    <div class="router" :style="{ height : containerHeight+'px' }">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <!-- 底部导航栏目 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
//引入公共基础组件footer
import myFooter from "@/components/MyFooter.vue";
export default {
  name: "app",
  components: {
    myFooter
  },
  data() {
    return {
      //整个可视窗口的高度
      windowHeight: 0
    };
  },
  computed: {
    //监听resize事件，动态计算容器的高度，为后续允许滚动的范围做好铺垫
    containerHeight() {
      return this.windowHeight - 60;
    }
  },
  mounted() {
    // 初始化窗口的高度并监测屏幕变化及手机横竖屏变化事件，准确的拿到对应的容器内部可显示区域的大小
    this.windowHeight = window.innerHeight;
    window.onresize = this.myresize;
    window.orientationchange = this.myresize;
  },
  methods: {
    myresize: () => {
      this.windowHeight = window.innerHeight;
    }
  }
};
</script>

<style lang="scss">
body {
  background-color: #efefef;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>