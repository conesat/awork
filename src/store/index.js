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
    bgColorStart: '#9d9d9d',
    bgColorEnd: '#9d9d9d',
    bfColor: '#ffffff',
    themeType:'light',
    normalFontColor: '#9d9d9d',
    activeFontColor: '#9d9d9d',
    openBgLinear:false,
    openBfLinear:false,
  }
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
  }
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
