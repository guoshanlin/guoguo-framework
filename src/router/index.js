import Vue from 'vue'
import Router from 'vue-router'
import config from '../../config'

Vue.use(Router)

export default new Router({
  base: process.env.NODE_ENV === 'production'
    ? config.build.assetsPublicPath
    : config.dev.assetsPublicPath,
  scrollBehavior: () => ({y: 0}),
  routes: [
    {path: '/', redirect: '/index'},
    {
      path: '/index',
      name: 'index',
      component: (resolve) => require(['../view/index/index'], resolve)
    }
  ]
})
