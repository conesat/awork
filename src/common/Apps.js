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
  title: '邮件',
  img: './static/img/apps/email.jpg',
  icon: './static/img/apps/email_icon.png',
  info: '周报邮箱',
  url: '/email',
  type: 'app',
  name: 'encryption',
	status:'未上线'
}, {
  title: 'Url转Json',
  img: './static/img/apps/urlToJson.png',
  icon: './static/img/apps/urlToJson_icon.png',
  info: '编码后的Url直接转换Json',
  url: '/urlToJson',
  type: 'app',
  name: 'urlToJson'
}, {
  title: '加密工具',
  icon: './static/img/apps/encryption_icon.png',
  info: 'rsa/aes/md5加密',
  url: '/encryption',
  type: 'app',
  name: 'encryption'
}]

export {
  apps
};
