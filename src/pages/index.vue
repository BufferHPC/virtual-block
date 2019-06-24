<template>
  <div class="container">
    <!-- 顶部标题栏目，对应的宽度是40px -->
    <h1 class="header">
      柔宇科技
      <span class="router-label">>> 新闻中心</span>
    </h1>
    <!-- 
      调用封装的虚拟滚动及数据请求分割回调事件
      对应的参数介绍：
      listData ： 获取所有的相关数据源信息
      height： 当前列栏目的定高
      bufferSize ： 一次性需要渲染的对应条数
      ifRequest ：当前是否处于数据请求状态，如果处于数据请求状态则在子组件中显示加载提示
      @bottom ：当前子组件在下拉到底部的时候，触发数据请求相关事件
      v-slot：作用域插槽，也叫带数据作用域的插槽，可以拿到子组件注入的对应数据进行响应
    -->
    <virtual-block
      style="height:100%"
      class="scroller"
      :allDataList="this.listData"
      :blockHeight="150"
      :bufferSize="5"
      :onRequesting="ifRequest"
      @bottom="atBottom"
      v-slot:default="needRenderList"
    >
      <div class="display">
        <Card class="card">
          <div class="head">
            <div class="imgbox">
              <img :src="needRenderList.childItem.image" alt="图片">
            </div>
            <div class="info">
              <h2>{{needRenderList.childItem.id}} - {{needRenderList.childItem.title}}</h2>
              <h2 class="small">
                {{needRenderList.childItem.time}}
                <span
                  class="thumbup"
                >评论：{{needRenderList.childItem.stars}}</span>
              </h2>
            </div>
          </div>
          <div class="content">
            <span>{{needRenderList.childItem.content}}</span>
          </div>
        </Card>
      </div>
    </virtual-block>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //用来存放当前数据源的对象数组
      listData: [],
      //用来通知子组件内部的加载提示是否需要显示
      ifRequest: true
    };
  },
  async mounted() {
    // 分批发送请求时，先请求一部分数据保证数据显示
    let request = await this.getMock(50);
    this.listData = [...request.list];
    this.ifRequest = false;
  },
  methods: {
    // 发送请求获取新的请求模拟数据，这个是跨域请求的网络mock数据
    getMock(num) {
      return fetch("http://52.199.69.165:4000/data?num=" + num, {
        mode: "cors"
      }).then(res => res.json());
    },
    // 到达底部重新获取数据，触发这个事件是子组件下拉数据到底部以后再进行触发的
    atBottom() {
      this.moreRequest();
    },
    /**
     * 用户下拉到底部后，再次发出批量数据请求信息，并将新得到的数据放到整个数据对象数组中以方便调用显示
     * 这里将回调的纯函数进行了传递和调用，确保数据的顺利加载
     * 同时，这里有一个非常重要的环节就是：如果我现在正在请求数据，那么用户在子组件中就算是再次触发下拉到底的操作也不会重复请求追加数据，这个是基于数据请求速度本身进行防抖设置的具有极大的优势
     */
    async moreRequest() {
      if(this.ifRequest) return ;
      this.ifRequest = true;
      let result = await this.getMock(150);
      this.listData = [...this.listData, ...result.list];
      this.ifRequest = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  max-width: 800px;
  height: 100%;
  margin: 0 auto;
  .header {
    height: 39px;
    line-height: 39px;
    font-size: 18px;
    text-indent: 16px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    color: #444;
    .router-label {
      color: #888;
      font-size: 14px;
      padding-left: 5px;
    }
  }
  .scroller {
    .display {
      height: 150px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      .card {
        width: 100%;
        height: 98%;
        z-index: -1;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        align-items: flex-start;
        position: relative;
        .head {
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          height: 80px;
          width: 100%;
          .imgbox {
            width: 60px;
            height: 60px;
            background-color: #007cba;
          }
          img {
            width: 60px;
            background-color: #007cba;
          }
          .info {
            width: calc(100% - 60px);
            padding-left: 10px;
            box-sizing: border-box;
            h2 {
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 15px;
              text-align: justify;
              line-height: 21px;
              color: #555;
              height: 42px;
            }
            .small {
              margin-top: 5px;
              font-size: 12px;
              color: #666;
              height: 16px;
              .thumbup {
                bottom: 4px;
                right: 20px;
                background-color: rgba(255, 255, 255, 0.4);
                float: right;
              }
            }
            .label {
              width: 4em;
              display: inline-block;
            }
          }
        }
        .content {
          height: 50px;
          overflow: hidden;
          text-align: justify;
          text-overflow: ellipsis;
          font-size: 12px;
          line-height: 16px;
          color: #666;
        }
      }
    }
  }
}
</style>
