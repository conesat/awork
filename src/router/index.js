import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Index',
    component: () => import("@/windows/Index"),
    children: [{
        path: '/',
        name: 'Report',
       component: () => import("@/windows/AReport"),
      }
    ]
  },
  {
    path: '/aworkBench',
    name: 'Index',
    component: () => import("@/windows/AworkBench")
  }]
})
