<!-- 这个Demo根据用户传递过来的值，同时设置了向上和向下两个缓冲区，确保不管是向上滚动还是向下滚动都能确保非常顺畅的用户体验 -->
<template>
  <div class="container" @scroll.passive="handleScroll" ref="scrollContainer">
    <div class="warpper" :style="paddingStyle" ref="wapperBox">
      <div v-for="(item,index) in needReanderList" :key="index">
        <slot :childItem="item"></slot>
      </div>
      <div class="loading" v-if="onRequesting">
        <div>{{msg}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    //所有获取数据列表
    allDataList: { default: [], type: Array },
    //上下环缓存区数目
    bufferSize: { default: 5, type: Number },
    //单行显示高度
    blockHeight: { default: 150, type: Number },
    //是否正在请求批量数据状态
    onRequesting: { default: true, type: Boolean },
    //数据加载显示的区域
    msg: { default: "小二正在努力，请耐心等待...", type: String }
  },
  data() {
    return {
      //屏幕容积数量
      screenNum: 5,
      //当前块所在的位置索引
      currentBlockIndex: 0,
      //设置在scoll事件频发调用状态，只有为true时才能触发相应操作，设置断点提高防抖性能
      bufferChangeTag: true,
      //记录当前行模块的偏移量
      offsetBlock: 0,
      //用来记录准确的当前block定位
      rebackCurrentBlockIndex: 0
    };
  },
  computed: {
    //距离顶部位移
    offsetTop() {
      if (this.currentBlockIndex < this.bufferSize) {
        return 0;
      } else {
        return (this.currentBlockIndex - this.bufferSize) * this.blockHeight;
      }
    },
    //距离底部位移
    offsetBottom() {
      if (this.currentBlockIndex < this.bufferSize) {
        return (
          (this.allDataListLength - this.needRenderSize) * this.blockHeight
        );
      } else {
        return (
          (this.allDataListLength -
            this.needRenderSize -
            this.currentBlockIndex +
            this.bufferSize) *
          this.blockHeight
        );
      }
    },
    //根据上下位padding值，计算待渲染样式
    paddingStyle() {
      return {
        "padding-top": this.offsetTop + "px",
        "padding-bottom": this.offsetBottom + "px"
      };
    },
    //根据屏幕容积数量和缓冲区数量，计算待渲染数据长度(这里要考虑上缓冲区在初始化的时候的需求)
    needRenderSize() {
      if (this.currentBlockIndex < this.bufferSize) {
        return this.currentBlockIndex + this.screenNum + this.bufferSize;
      } else {
        return this.screenNum + this.bufferSize * 2;
      }
    },
    //根据父组件传递的服务器拉取的数据，计算获取数据长度
    allDataListLength() {
      return this.allDataList.length;
    },
    //根据顶部位移以及缓冲区相关，计算带渲染数组的内容
    needReanderList() {
      let subArr = [];
      if (this.currentBlockIndex < this.bufferSize) {
        subArr = this.allDataList.slice(0, this.needRenderSize);
      } else {
        subArr = this.allDataList.slice(
          this.currentBlockIndex - this.bufferSize,
          this.currentBlockIndex - this.bufferSize + this.needRenderSize
        );
      }
      return [...subArr];
    }
  },
  mounted() {
    //监听屏幕变化，动态获取当前屏幕最大容积数量
    this.myresize();
    window.onresize = this.myresize;
    window.orientationchange = this.myresize;
  },
  activated() {
    //在keep-alive路由模式下，切换路由时确保能够返回用户之前所在位置
    this.$nextTick(() => {
      this.$refs.scrollContainer.scrollTop =
        this.rebackCurrentBlockIndex * this.blockHeight + this.offsetBlock;
    });
  },
  methods: {
    //监听屏幕变化，动态获取屏幕最大容积数量，直接使用对应渲染API体验效果更佳
    myresize() {
      this.screenNum = ~~((window.innerHeight - 100) / this.blockHeight) + 2;
      this.$refs.scrollContainer.style.height = (window.innerHeight - 100)+"px";
    },
    //监听当前容器的滚动事件
    handleScroll(e) {
      //兼容低版本浏览器
      window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
      //浏览器防抖优化：根据浏览器FPS采用递归方法（常见游戏优化策略），队列调用requestAnimationFrame方法实现优化，同时兼容低浏览器版本
      let fps = 30;
      let now;
      let then = Date.now();
      let interval = 1000 / fps;
      let that = this;
      requestAnimationFrame(function() {
        now = Date.now();
        let delta = now - then;
        then = now;
        that.changeBufferneedReanderList();
        if (delta >= interval) {
          requestAnimationFrame(arguments.callee);
        }
      });
    },
    //根据滚动事件修正相应数据
    changeBufferneedReanderList(e) {
      //第一步，我们获取当前容器在scoll事件中距离顶部的位移
      let scrollHeight = this.$refs.scrollContainer.scrollTop;
      // 记录偏移量
      this.offsetBlock = scrollHeight % this.blockHeight;
      //第二步，根据当前位移，获取到当前需要渲染的数据起点位移所在位置，使用两次取反的方式计算对应的值
      let currentBlockIndex = ~~(scrollHeight / this.blockHeight);
      this.rebackCurrentBlockIndex = currentBlockIndex;
      //第三步：如果我们发现当前的偏移量发生了变化，说明需要更新整个needReanderList对应的值了，这里要做一个判断，如果当前值没有发生变化则不进行渲染，防止资源消耗提高性能
      if (this.currentBlockIndex == currentBlockIndex) return;
      //第四步：判断是否到达底部，如果到达底部则触发新的数据请求
      if (currentBlockIndex + this.screenNum >= this.allDataListLength) {
        //如果用户滑动过快，因为截流函数100毫秒内，可能会导致很多值变化，offectBottom会因为计算属性而导致不合理变化，需要重新设置
        this.$refs.wapperBox.style.paddingTop =
          (this.allDataListLength - this.bufferSize) * this.blockHeight;
        this.$refs.wapperBox.style.paddingBottom = "0px";
        this.$emit("bottom");
      } else {
        //第五步：如果没有到达底部，我们只需要在这里修正其新的index即可，剩下的交给计算属性来完成更详细的细节工作
        this.currentBlockIndex = currentBlockIndex;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  padding-bottom: 60px;
  overflow-y: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
  .warpper{
    height:100%;
  }
  .loading {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    height: 60px;
    color: #2d8cf0;
  }
}
</style>
