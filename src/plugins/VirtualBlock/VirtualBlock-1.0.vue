<!--
  这个Demo仅仅是将向下的数据缓冲起来，不断的虚拟滚动实现相应的效果
-->
<template>
  <div class="container" @scroll.passive="handleScroll" ref="scrollContainer">
    <!--
      首先我们在scroll上调用passive，passived主要用于优化浏览器页面滚动的性能，让页面滚动更顺滑，其原理是因为：
        passive 的意思是“顺从的”，表示它不会对事件的默认行为说 no，浏览器知道了一个监听器是 passive 的，它就可以在两个线程里同时执行监听器中的 JavaScript 代码和浏览器的默认行为了
        它通过扩展事件属性passive让Web开发者来告知浏览器监听器是否会阻止事件的默认行为，从而让浏览器可以更智能地决策并优化，这其中涉及到了Chrome的多线程渲染框架、输入事件处理等知识。
      这个容器的核心意义就是，实现虚拟滚动，虚拟滚动的原理很简单，就是一句话：对海量的数据，动态的截取其中合理的一部分，不断的用数据中的部分值来刷新页面，从而产生虚拟滚动的过程
      第一种方法是：
        设置一个上下padding，监听scroll事件，根据滚动条所在的位置动态的设置 padding-top 和 padding-bottom 值，这种方法坑很多，在滚动过程中padding会有什么具体的影响，padding在滚动中若是变化，因为容器的变化则会导致滚动的位移发生变化，在监听判断过程中需要注意很多细节，不过这种方案最大的优势就是可以直观的调用系统原生的滚动条，进而可以得到更好体验，尤其在移动端会更加理想，但是，要注意的是在windows非全屏模式下的一个模块内部出现方块滚动条则体验极差
          <div class="warpper" :style="{paddingTop:offsetTop+'px',paddingBottom:offsetBottom+'px'}">
      第二种方法是上下各事业一个占位box，使用box的高度变化来撑开盒子，这个和第一种方案非常相似，不过我们还是需要注意的是，这个是两个位置上的排位，从代码阅读上感觉也不错
          <div :style="{height: `${offsetTop}px`}"></div>
          <div :style="{height: `${offsetBottom}px`}"></div>
      第三种方案是使用 文档流模式，使用绝对定位相对定位，这样的优势是不会因为系统的滚动条而造成影响，但是，则需要我们大量的代码去实现一个可拖拉的定制化滚动条

      以上几种方案都各有应用场景，我们应该根据我们的业务实际需求来考虑后作出准确选择，这里我们使用padding方式来实现相关逻辑
    -->

    <div class="warpper" :style="{paddingTop:offsetTop+'px',paddingBottom:offsetBottom+'px'}">
      <!-- 使用数据插槽的方式向调用当前组件的父组件插槽内部传递相应的值，这里传递的是所有待渲染的数据列表 -->
      <div v-for="(item,index)  in needReanderList" :key="index">
        <slot :childItem="item"></slot>
      </div>

      <!-- 下拉到底部弹出对应的加载提醒，其是否显示根据父组件请求数据状态进行显示 -->
      <div class="loading" v-if="ifRequest">
        <div>小二正在努力，请耐心等待...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { setTimeout, clearTimeout } from "timers";
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
      scorllPosionOld ： 记录上一次滚动时所在的位置，主要用来判断方向
      offsetBlock ： 主要用来记录当前滚动在当前列上的偏移量
      current ： 当前滚动显示所在的索引位置
      offsetTop ：当前滚动后padding-top应该设置的值
      offsetBottom ：当前滚动后padding-bottom应该设置的值
      bufferChangeTag : 设置在scoll时的多频发状态，只有为true时才能触发相应操作，设置延迟器进行修正
   */
  data() {
    return {
      needReanderList: [],
      listDataLength: 0,
      scorllPosionOld: 0,
      offsetBlock: 0,
      current: 0,
      offsetTop: 0,
      offsetBottom: 0,
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
      //当第一次请求数据成功的时候，需要初始化需要显示的区域显示出来
      this.listDataLength = newVal.length;
      if (newVal.length > 0 && oldVal.length == 0) {
        let subArr = this.listData.slice(0, this.bufferSize);
        this.needReanderList = [...subArr];
      } else {
        this.changeBufferneedReanderList();
      }
    }
  },
  /**
   * 在实际应用场景中，用户在访问列表中间切换到其他路由后再切换回来的场景，用户会希望返回的时候能够准确定位到上一次查看信息所在的位置，以期望更好的体验
   */
  activated() {
    this.keepaliveShow();
  },
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
        import * as _ from "lodash";
        window.requestAnimationFrame(
          _.debounce(this.changeBufferneedReanderList, 100)
        );
        当然，我们也可以使用定制化的方法得到更好的结果
       */
      if (this.bufferChangeTag) {
        this.bufferChangeTag = false;
        let timer = setTimeout(() => {
          window.requestAnimationFrame(this.changeBufferneedReanderList);
          this.bufferChangeTag = true;
          clearTimeout(timer);
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

      /**
       *  根据上一次记录的滚动值和这一次的滚动值来判断滚动的具体方向，并将当前滚动的偏移量记录下来
        let direction = "down";
        if (this.scorllPosionOld > scrollHeight) {
          direction = "up";
        }
        this.scorllPosionOld = scrollHeight;
       * */
      // 记录偏移量
      this.offsetBlock = scrollHeight % this.height;

      // 第二步，根据当前位移，获取到当前需要渲染的数据起点位移所在位置，使用两次取反的方式计算对应的值
      let current = ~~(scrollHeight / this.height);

      // 第三步： 如果我们发现当前的偏移量发生了变化，说明需要更新整个needReanderList对应的值了，这里要做一个判断，如果当前值没有发生变化则不进行渲染，防止资源消耗提高性能
      if (this.current == current) return;

      /*
       第四步： 这个时候，我们根据当前索引值和其所在的偏移量，动态的设置paddingTop的值，以确保顺滑的滚动效果，这里需要说明的是：为什么不把滚动的时候的偏移量加上去？这是个大坑！
       在索引值没有发生进位变化时，要知道浏览器本身的滑动过程中，去设置置顶位置的时候，会因为paddig的机器实现策略导致两次进位
       */
      this.offsetTop = current * this.height;
      this.offsetBottom =
        this.listDataLength * this.height -
        this.offsetTop -
        this.bufferSize * this.height +
        80;
      //第五步： 当当前位移的位置和系统当前记录的位移不一致的情况下，我们就需要及时修正其缓冲区的数据进行显示，同时使用拓展运算符进行拷贝，触发数据更新实现虚拟滚动
      this.current = current;
      let subArr = this.listData.slice(
        this.current,
        this.current + this.bufferSize
      );
      this.needReanderList = [...subArr];

      /**
       * 下一次数据请求的时机是一个很难把握的行为，因为用户
       * 我们根据bufferSize的值进行监听，如果当前位置超过了缓存上限则执行请求
       * 这样做的优势是：可以让用户无感的情况下，后台根据合适的时机顺利的发出请求，并主动的填充数据
       * 但是，问题是：用户的行为是不可知的，我们就算采用数据节流等各种方式，也无法确保多次数据的请求注入，这个从时间上来讲，本身就是一个悖论，容易出现风险
       * if (current >= this.listDataLength - this.bufferSize) {
          this.offsetBottom = 80;
          this.$emit("bottom", () => {
            this.current = current;
            let subArr = this.listData.slice(
              this.current,
              this.current + this.bufferSize
            );
            this.needReanderList = [...subArr];
          });
        }
       */

      /**
       * 如果我们监听的是下拉到底部的时候，再发出请求，这样的不足之处就是：用户在底部需要等待数据加载
       * 但是优势是：到底的行为是稳定的，同时，数据请求过程中也可以根据断点标签进行节流防止多次请求
       * 所以这种方案是相对合理的
       *  */
      if (
        current + ~~((window.innerHeight - 100) / this.height) + 1 >=
        this.listDataLength
      ) {
        this.offsetBottom = 80;
        this.$emit("bottom", () => {
          this.current = current;
          let subArr = this.listData.slice(
            this.current,
            this.current + this.bufferSize
          );
          this.needReanderList = [...subArr];
        });
      }
    },
/**
 * 在keep-alive路由模式下，切换路由时确保能够返回用户之前所在位置
 */
    keepaliveShow() {
      this.offsetTop = this.current * this.height;
      this.offsetBottom =
        this.listDataLength * this.height -
        this.offsetTop -
        this.bufferSize * this.height +
        80;
      let subArr = this.listData.slice(
        this.current,
        this.current + this.bufferSize
      );
      this.needReanderList = [...subArr];
      this.$nextTick(() => {
        this.$refs.scrollContainer.scrollTop = this.offsetTop + this.offsetBlock;
      });
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
  -webkit-overflow-scrolling: touch;
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
