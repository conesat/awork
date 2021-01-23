import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// 加载模块
const nedb = require('nedb');
// 实例化连接对象（不带参数默认为内存数据库）
const themeDb = new nedb({
  filename: '/data/theme.db',
  autoload: true
});
// 对索引设置唯一性约束
themeDb.ensureIndex({
  fieldName: 'name',
  unique: true
}, function(err) {});

const state = {
  theme: {
    bgColorStart: '#f9f9f9',
    bgColorEnd: '#f9f9f9',
    bfColor: '#ffffff',
    themeType: 'light',
    normalFontColor: '#9d9d9d',
    activeFontColor: '#9d9d9d',
    openBgLinear: false,
    openBfLinear: false,
  },
  //不缓存的页面--某些应用被关闭后记录下来，再次进入就刷新页面
  noCatchArr: []
}

themeDb.findOne({
  name: 'theme'
}, (err, ret) => {
  if (ret) {
    state.theme = ret.value;
  } else {
    themeDb.insert({
      name: 'theme',
      value: state.theme,
    }, (err, ret) => {});
  }
});

const mutations = {
  setTheme(state, payload) {
    state.theme = payload.theme;
    saveDb();
  },
  setBgColorEnd(state, payload) {
    state.theme.bgColorEnd = payload.color;
    saveDb();
  },
  setOpenBgLinear(state, payload) {
    state.theme.openBgLinear = payload.openBgLinear;
    saveDb();
  },
  // 对指定组件进行动态更改缓存（缓存）--组件调用该方法时，判断该组件是否存在于该缓存数组，无则添加
  iskeepAlive(state, component) {
    let index = state.noCatchArr.indexOf(component);
    index > -1 && state.noCatchArr.splice(index, 1);
  },
  // 对指定组件进行动态更改缓存（不缓存）--组件调用该方法时，从缓存数组中删除对应的组件元素
  noKeepAlive(state, component) {
     !state.noCatchArr.includes(component) && state.noCatchArr.push(component);
  },
}

function saveDb() {
  // 插入单项
  themeDb.update({
    name: 'theme'
  }, {
    name: 'theme',
    value: state.theme,
  }, {}, (err, ret) => {});
}

export default new Vuex.Store({
  state,
  mutations
});
