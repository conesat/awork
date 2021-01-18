import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//内置app
const apps = [{
  name: '计划',
  img: './static/img/apps/aplane.png',
  icon: './static/img/apps/aplane_icon.png',
  info: '工作安排，周报日报',
  url: '/aReport',
  type: 'app',
  fitMenu: false,
}, {
  name: 'Url转Json',
  img: './static/img/apps/urlToJson.png',
  icon: './static/img/apps/aplane_icon.png',
  info: '编码后的Url直接转换Json',
  url: '/urlToJson',
  type: 'app',
  fitMenu: false
}]

export {
  apps
};
