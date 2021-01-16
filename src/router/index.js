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
        name: '/',
        component: () => import("@/windows/AworkBench"),
      },
      {
        path: 'aReport',
        name: 'AReport',
        component: () => import("@/windows/AReport")
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import("@/windows/Setting"),
        children: [{
            path: 'theme',
            name: 'theme',
            component: () => import("@/components/setting/Theme"),
          },
          {
            path: 'account',
            name: 'account',
            component: () => import("@/components/setting/Account"),
          },
          {
            path: 'about',
            name: 'about',
            component: () => import("@/components/setting/About"),
          }
        ]
      }
    ]
  }, ]
})
