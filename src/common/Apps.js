import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//内置app
const apps = [{
  title: '计划',
  img: './static/img/apps/aplane.png',
  icon: './static/img/apps/aplane_icon.png',
  info: '工作安排，周报日报',
  url: '/aReport',
  type: 'app',
  name: 'aReport'
}, {
  title: 'Url转Json',
  img: './static/img/apps/urlToJson.png',
  icon: './static/img/apps/urlToJson_icon.png',
  info: '编码后的Url直接转换Json',
  url: '/urlToJson',
  type: 'app',
  name: 'urlToJson'
}, {
  title: '加密工具少时诵诗书所是是是',
  img: './static/img/apps/urlToJson.png',
  icon: './static/img/apps/urlToJson_icon.png',
  info: 'rsa/aes/md5加密',
  url: '/urlToJson',
  type: 'app',
  name: 'urlToJson'
}]

export {
  apps
};
