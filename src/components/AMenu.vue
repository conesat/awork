<template>
  <div class="a-menu">
    <div class="menus-table">
      <div class="menus" :style="{'background':this.$store.state.theme.bfColor}">
        <div class="item home" @click="choiceMenuFun('/','home')">
          <img src="../assets/icon/menu/a-menu-home.png" :class="{'active':choiceMenu=='/'}" title="首页" />
        </div>
        <div class="active-app">
          <div class="item" @click="choiceMenuFun(app.url,app.name)" v-for="(app,index) in activeApps"
            @contextmenu.prevent="showRightMenu($event,index)">
            <img :src="app.icon" :class="{'active':choiceMenu==app.url||rightMenu.index==index}" :title="app.title" />
          </div>
        </div>
        <div class="item setting" @click="choiceMenuFun('/setting/theme','setting')">
          <img src="../assets/icon/menu/a-menu-setting.png" :class="{'active':choiceMenu=='/setting/theme'}" title="设置" />
        </div>
      </div>
    </div>
    <div class="vpopmenu" v-if="rightMenuStyle.show" :style="{top:rightMenuStyle.top+'px','background':this.$store.state.theme.bfColor}">
      <div @click="appFit();" v-if="!this.rightMenu.app.fitMenu">
        <i class="fa fa-star"></i>
        固定图标
      </div>
      <div @click="removeAppFit();" v-if="this.rightMenu.app.fitMenu">
        <i class="fa fa-star-o"></i>
        取消固定
      </div>
      <div @click="reloadApp();" v-if="this.rightMenu.app.url==this.choiceMenu">
        <i class="fa fa-repeat"></i>
        重新打开
      </div>
      <div @click="closeApp();" v-if="!this.rightMenu.app.fitMenu">
        <i class="fa fa-times"></i>
        关闭
      </div>
    </div>
  </div>
</template>

<script>
  // 加载模块
  const nedb = require('nedb');
  // 实例化连接对象（不带参数默认为内存数据库）
  const db = new nedb({
    filename: '/data/menu.db',
    autoload: true
  });
  // 对索引设置唯一性约束
  db.ensureIndex({
    fieldName: 'url',
    unique: true
  }, function(err) {});
  import {
    globalBus
  } from '@/assets/js/globalBus.js';
  export default {
    inject:['reload'],
    components: {},
    data() {
      return {
        choiceMenu: '/',
        choiceMenuName: '/',
        activeApps: [],
        rightMenuStyle: {
          left: 0,
          show: false,
        },
        rightMenu: {
          index: '-1',
          app: {},
        },
      }
    },
    created() {
      globalBus.$on('openApp', (app) => {
        for (var x in this.activeApps) {
          if (app.url == this.activeApps[x].url) {
            this.choiceMenuName = app.name;
            this.choiceMenu = app.url
            this.$router.push(app.url).catch(err => {
              err
            })
            return
          }
        }
        if (app.type == "app") {
          this.activeApps.push(app);
          this.choiceMenuName = app.name;
          this.choiceMenu = app.url
          this.$router.push(app.url).catch(err => {
            err
          })
        }
        this.$store.commit("iskeepAlive", app.name);
      });
    },
    methods: {
      reloadApp() {
        var _this=this;
        this.$store.commit("noKeepAlive", this.choiceMenuName);
        this.$router.push("/reload").catch(err => {console.log(err)})
        setTimeout(function(){
           _this.$router.push(_this.choiceMenu).catch(err => {console.log(err)})
           this.$store.commit("iskeepAlive", this.choiceMenuName);
        },1000)
      },
      closeApp() {
        var app = this.activeApps[this.rightMenu.index];
        this.$store.commit("noKeepAlive", app.name);
        if (this.choiceMenu == app.url) {
          this.choiceMenu = "/";
          this.$router.push("/").catch(err => {
            err
          })
        }
        this.activeApps.splice(this.rightMenu.index, 1);
      },
      removeAppFit(index) {
        var app = this.activeApps[this.rightMenu.index];
        app.fitMenu = false;
        db.remove({
          url: app.url
        }, {}, (err, ret) => {})
      },
      appFit(index) {
        var app = this.activeApps[this.rightMenu.index];
        app.fitMenu = true;
        db.insert(app, (err, ret) => {})
      },
      choiceMenuFun(url, name) {
        this.rightMenu.index = "-1";
        this.choiceMenu = url;
        this.choiceMenuName = name;
        this.$router.push(url).catch(err => {
          err
        })
      },
      showRightMenu(e, index) {
        this.rightMenu.index = index;
        this.rightMenu.app = this.activeApps[index];
        this.rightMenuStyle.top = e.srcElement.offsetTop;
        if (e.y + 130 > e.view.innerHeight) {
          this.rightMenuStyle.top = e.view.innerHeight - 130;
        }
        this.rightMenuStyle.show = true
      },
      clickOther(e) {
        this.rightMenu.index = "-1";
        this.rightMenuStyle.show = false;
      },
    },
    mounted() {
      var _this = this;
      window.addEventListener("click", this.clickOther);
      db.find({}, function(err, docs) {
        _this.activeApps = docs;
        for (var x in docs) {
          if (_this.$route.path == docs[x].url) {
            _this.choiceMenuFun(_this.$route.path);
            return;
          }
        }
        _this.choiceMenuFun('/');
      });

    }
  }
</script>

<style lang="scss">
  .a-menu {
    position: relative;
    height: 100%;
    display: table;

    .vpopmenu {
      z-index: 99;
      position: absolute;
      left: 100%;
      background: #FFFFFF;
      padding: 10px;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      box-shadow: 6px 0px 6px rgba(0, 0, 0, 0.2);
      transition: display 0.3s linear;

      .fa {
        line-height: 1.4rem;
        width: 1.2rem;
      }

      div {
        transition: all 0.2s linear;
        margin: 4px 0;
        cursor: pointer;
        color: #69849B;
        display: flex;
        white-space: nowrap;
      }

      div:hover {
        color: #29B6F6;
      }

      .delete:hover {
        color: #F4511E;
      }
    }

    .menus-table {
      display: table-cell;
      vertical-align: middle;

      .menus {
        box-sizing: border-box;
        height: 100%;
        width: calc(1.8rem + 20px);
        position: relative;
        display: flex;
        flex-direction: column;
        transition: all 0.2s ease-in-out;
        padding: 20px 10px;
        margin-left: auto;
        margin-right: auto;
        border-radius: 10px;
        background: #FFFFFF;
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1);

        .active-app {
          margin-top: 10px;
          border-top: 2px #c6c6c6 solid;
          padding: 10px 0;
          flex: 1;
        }

        .home {
          /* position: absolute;
          top: 0.8rem; */
        }

        .setting {
          /* position: absolute;
          bottom: 0.2rem; */
        }

        .item {
          height: 2.4rem;

          img {
            cursor: pointer;
            transition: all 0.1s linear;
            border-radius: 4px;
            height: auto;
            margin-left: 0.2rem;
            margin-top: 0.5rem;
            width: 1.4rem;
            -webkit-filter: grayscale(100%);
            -moz-filter: grayscale(100%);
            -ms-filter: grayscale(100%);
            -o-filter: grayscale(100%);
            filter: grayscale(100%);
            filter: gray;
          }

          .active,
          img:hover {
            margin-left: 0;
            margin-top: 0.3rem;
            width: 1.8rem;
            -webkit-filter: grayscale(0%);
            -moz-filter: grayscale(0%);
            -ms-filter: grayscale(0%);
            -o-filter: grayscale(0%);
            filter: grayscale(0%);
            filter: none;
          }
        }
      }

      .menus:hover {
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
