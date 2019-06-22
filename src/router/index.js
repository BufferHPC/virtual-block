import Vue from 'vue'
import Router from 'vue-router'

//新闻中心 异步路由
const index = resolve => {
  require.ensure([], () => {
    resolve(require('@/pages/index.vue'))
  })
}

//项目简介 异步路由
const info = resolve => {
  require.ensure([], () => {
    resolve(require('@/pages/info.vue'))
  })
}

//个人中心 异步路由
const owner = resolve => {
  require.ensure([], () => {
    resolve(require('@/pages/owner.vue'))
  })
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },{
      path: '/info',
      name: 'info',
      component: info
    },{
      path: '/owner',
      name: 'owner',
      component: owner
    }
  ]
})
