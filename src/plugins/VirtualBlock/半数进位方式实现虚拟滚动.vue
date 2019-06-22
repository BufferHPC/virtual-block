<template>
  <div class="container" @scroll.passive="handleScroll" ref="scrollContainer">
    <!--
      这里有3种方法可以实现这个效果
      第一种方法是：
        设置一个上下padding，监听scroll事件，根据滚动条所在的位置动态的设置 padding-top 和 padding-bottom 值
        虚拟滚动动态的根据监听结果

    -->
    <div :style="{height: `${offsetTop}px`}"></div>

    <!-- 使用数据插槽的方式向调用当前组件的父组件插槽内部传递相应的值，这里传递的是所有待渲染的数据列表 -->
    <div class="warpper" v-for="item in needReanderList">
      <slot :childItem="item"></slot>
    </div>

    <div :style="{height: `${offsetBottom}px`}"></div>

    <!-- 下拉到底部弹出对应的加载提醒，其是否显示根据父组件请求数据状态进行显示 -->
    <div class="loading" v-if="ifRequest">
      <Icon type="ios-loading" size="18" class="load"></Icon>
      <div>小二正在努力，请耐心等待</div>
    </div>
  </div>
</template>

<script>
import * as _ from "lodash";
import { setTimeout } from "timers";
export default {
  /**
   * 从父组件传递过来的数据信息
   * 对应的参数介绍：
      对应的参数介绍：
      ListData ： 获取所有的相关数据源信息
      height： 当前列栏目的定高
      bufferSize ： 一次性需要渲染的对应条数
      ifRequest ：当前是否处于数据请求状态，如果处于数据请求状态则在子组件中显示加载提示
   */
  props: {
    listData: { default: [], type: Array },
    bufferSize: { default: 20, type: Number },
    height: { default: 150, type: Number },
    ifRequest: { default: true, type: Boolean }
  },
  /**
   * 当前组件中需要使用的参数配置
   * 对应的参数介绍：
      needReanderList ： 需要渲染数数据列表，会根据滚动条的偏移位置而动态的计算，这是一个数组，素组的长度就是传过来的bufferSize参数
      listDataLength ： 所有源数据的对象数组的长度
      offsetTop ：当前滚动后padding-top应该设置的值
      offsetBottom ：当前滚动后padding-bottom应该设置的值
      scorllPosionOld ： 记录上一次滚动的值，判断滚动的方向做不同的调整
      bufferChangeTag : 设置在scoll时的多频发状态，只有为true时才能触发相应操作，设置延迟器进行修正
   */
  data() {
    return {
      needReanderList: [],
      listDataLength: 0,
      offsetTop: 0,
      offsetBottom: 0,
      scorllPosionOld: 0,
      bufferChangeTag: true
    };
  },
  /**
   * 监听listData（所有已获取相关数据）的值的变化，这个值的变化会因为父组件的异步更新数据而发生变化
   * 当新的数据源获取以后，我们先判断是否真实的发生了变化，若真实的发生了变化，则将新的listData长度赋值给变量方便后面使用
   * 同时，调用changeBufferneedReanderList函数，获取新的位移，高度等相关数据，以确保新的展示策略能够顺利过渡
   */
  watch: {
    listData(newVal, oldVal) {
      if (newVal.length === oldVal.length) {
        return;
      }
      //当第一次请求数据成功的时候，需要初始化需要显示的区域显示出来
      this.listDataLength = newVal.length;
      if (newVal.length > 0 && oldVal.length == 0) {
        this.offsetTop = 0;
        let subArr = this.listData.slice(0, this.bufferSize);
        this.needReanderList = [...subArr];
        this.offsetBottom =
          (this.listDataLength - this.bufferSize) * this.height;
      } else {
        //this.changeBufferneedReanderList();
      }
    }
  },
  mounted() {},
  methods: {
    handleScroll(e) {
      /*
       下面这里我重点介绍三种方法来实现这个策略
       第一种方法是使用debounce库相应的防抖动方法来进行处理，这种方法，需要注意的是，返回值是传入的回调函数，这个回调函数需要再执行一次才能真正的进行相应的渲染
            _.debounce(this.changeBufferneedReanderList, 100)();
       第二种方式是使用window API requestAnimationFrame 在每一次动画事件循环中，如果物理帧有多余的时间，即执行相关代码，这个是从浏览器硬件渲染层面进行优化处理的方式，性能更强
          window.requestAnimationFrame(this.changeBufferneedReanderList);
       第三种方式，就是自己模拟debounce的实现原理，设置断点防抖策略，这种方法可以有效的减少一个包的整个依赖
          if(this.bufferChangeTag){
            this.bufferChangeTag = false;
            setTimeout(()=>{
              this.changeBufferneedReanderList();
              this.bufferChangeTag = true;
            },200)
          };
       参考以上三种方式，通过实践，我们能够感觉到，防抖动的策略在这里只是提供一个解决方案，通过快速测试，我们能够明显感觉到，在性能上对比原生提供的API方法性能差距还是有一些的，
       但是，如果使用其原生的方法也有一个问题，我们明显会发现触发的次数也是非常多的，这并不一定是一个最优解决方案，所以，我们采取组合使用的方法得到最优的结果
        window.requestAnimationFrame(
          _.debounce(this.changeBufferneedReanderList, 100)
        );
       */
      if (this.bufferChangeTag) {
        this.bufferChangeTag = false;
        setTimeout(() => {
          window.requestAnimationFrame(this.changeBufferneedReanderList);
          this.bufferChangeTag = true;
        }, 100);
      }
    },
    /**
     * 这个是实现 虚拟滚动 最核心的部分了，我们基于Vue来做优势也非常非常明显
     * 我们几乎只用根据不同的逻辑判断，去修改needReanderList里面的数据内容就可以了，Vue会根据数据setter的绑定策略自动完成相关的数据修正，进而实现虚拟滚动
     */
    changeBufferneedReanderList() {
      // 第一步，我们获取当前容器在scoll事件中距离顶部的位移
      let scrollHeight = this.$refs.scrollContainer.scrollTop;
      // 第二步，根据上一次记录的滚动值和这一次的滚动值来判断滚动的具体方向，并将当前滚动的偏移量记录下来
      let direction = "down";
      if (this.scorllPosionOld > scrollHeight) {
        direction = "up";
      }
      this.scorllPosionOld = scrollHeight;

      // 记录偏移量
      const offsetBlock = scrollHeight % this.height;
      // 第三步，根据当前位移，获取到当前数据起点位移所在位置，使用两次取反的方式计算对应的值
      let current = ~~(scrollHeight / this.height);
      /**
       * 第四步，这一步很关键，在整个程序设计中，这也是极大优化的一个策略，还记得我们设计了 bufferSize 这个值，这个值的调整是根据一个页面显示的具体数据条数来进行估算的
       * 也就是说，我们触发了这个值的中间关键节点位置，我们就去更新对应的显示区域和上下位置，这样的话可以极大的提高整体访问的流畅性
       * 这里的逻辑是这样的：
       *    当我们是向下滑动的时候，并且刚好滑到其1/2的位置的时候，我们去修正待显示的数据，去掉上面的数据，下面追加相应的数据
       *    当我们向上互动的时候，并且刚好滑到其1/2的位置的时候，我们去修正待显示的数据，追加上面的数据，去掉下面相应的数据
       */
      let changeNum = ~~(this.bufferSize / 2);
      if (direction == "down" && (current % this.bufferSize == changeNum || current % this.bufferSize==0)) {
        this.offsetTop = current * this.height;
        let subArr = this.listData.slice(current, current + this.bufferSize);
        this.needReanderList = [...subArr];
        this.offsetBottom =
          (this.listDataLength - current - this.bufferSize) * this.height;
        this.$nextTick(() => {
          this.$refs.scrollContainer.scrollTop = scrollHeight;
        });
      }

      // 第三步： 根据取余数的方法，记录当前移动的块在顶部的偏移量
      let offsetBlock = scrollHeight % this.height;
      // 第四步： 这个时候，我们根据当前索引值和其所在的偏移量，动态的设置paddingTop的值，以确保完整的实现相应功能
      //this.offsetTop = current * this.height - offsetBlock;
      //console.log(current + "==" + this.current);
      // 第五步： 如果我们发现当前的偏移量发生了变化，说明需要更新整个needReanderList对应的值了，这里要做一个判断，如果当前值没有发生变化则不进行渲染，防止资源消耗提高性能
      if (current % 10 == 0) {
      }

      /*
      //第六步： 当当前位移的位置和系统当前记录的位移不一致的情况下，我们就需要及时修正其缓冲区的数据进行显示
      this.current = current;
      let subArr = this.listData.slice(
        this.current,
        this.current + this.bufferSize
      );

      this.offsetBottom =
        this.listDataLength * this.height -
        this.offsetTop -
        subArr.length * this.height;

      // 如果滑到底部了
      if (
        subArr.length * this.height + scrollHeight >=
        this.listDataLength * this.height
      ) {
        this.$emit("bottom");
      }
      this.needReanderList = [...subArr];
      */
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
  .loading {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    height: 60px;
    color: #2d8cf0;
    .load {
      animation: rotate infinite 1s;
    }
    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
