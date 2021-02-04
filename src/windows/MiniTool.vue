<template>
  <div :style="{'top':top+'px'}" id="main-div">
    <div class="tool-main" id="content">
      <div class="top" id="top-content">
        <div class="title">
          <img src="../assets/logo.png" height="30px" />
        </div>
        <div style="display: flex;padding: 10px;">
          <i class="fa fa-window-maximize" @click="showMaxWin"></i>
          <i class="fa fa-thumb-tack" :style="{'transform':fit?'rotate(90deg)':'rotate(0deg)'}" @click="setTop"></i>
          <i class="fa fa-close" @click="closeMiniTool"></i>
        </div>
      </div>
      <div class="plane">
        <div class="item" v-for="(item,index) in todoList" :index="index" v-if="index<2||showMorePlane">
          <input v-model="item.checked" v-show="showMorePlane" type="checkbox" @click="checkFun(index)" />
          <span>{{item.title}}</span>
          <div class="menu">
            <i class="fa more" :class="{'fa-angle-right':showMoreMenu,'fa-angle-left':!showMoreMenu}" @click="changeMore(index)"></i>
            <i v-if="showMoreMenu" class="fa fa-close" title="删除"></i>
            <i class="fa fa-check" title="完成"></i>
          </div>
        </div>
        <div style="text-align: center;padding: 20px;color: #7f8c8d;" v-if="todoList.length==0">无任务</div>
      </div>
      <div class="more-plane" v-if="todoList.length>0">
        <div class="left">
          <input v-show="showMorePlane" @click="checkAllFun" type="checkbox" v-model="checkAll" />
          <span v-show="showMorePlane">全选</span>
        </div>
        <div class="right">
          <div class="bottom-menu" :class="{'deep-color':hasSelect}" v-show="showMorePlane">
            <div class="item">预排</div>
            <div class="item">延期</div>
            <div class="item">删除</div>
            <div class="item">完成</div>
          </div>
          <div @click="showMorePlaneFun(true)" v-if="!showMorePlane" class="item show-more">更多 <i class="fa fa-angle-down"></i></div>
          <div @click="showMorePlaneFun(false)" v-if="showMorePlane" class="item show-more">收起 <i class="fa fa-angle-up"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const nedb = require('nedb');
  var ipcRenderer;
  if (window.require) {
    ipcRenderer = window.require('electron').ipcRenderer;
  }
  export default {
    components: {},
    name: 'miniTool',
    updated() {
      var mainDiv = document.getElementById("main-div");
      var offsetHeight = mainDiv.offsetHeight;
      if (ipcRenderer) {
        if (this.top < 0) {
          ipcRenderer.send("mini-set-size", 12)
          ipcRenderer.send("mini-win-ignore-mouse")
        } else {
          ipcRenderer.send("mini-set-size", offsetHeight)
          ipcRenderer.send("mini-win-close-ignore-mouse")
        }
      }
    },
    data() {
      return {
        top: 0,
        fit: true,
        showMoreMenu: false,
        showMorePlane: false,
        hasSelect: false,
        checkAll: false,
        todoList: [],
        aplaneTodoDb: {},
      }
    },
    mounted() {
      var _this = this;
      var mainDiv = document.getElementById("main-div");
      if (ipcRenderer) {
        var offsetHeight = mainDiv.offsetHeight;
        ipcRenderer.send("mini-set-size", offsetHeight)
        //监听窗口变化
        ipcRenderer.on('mini-resize', (event, data) => {
          var offsetHeight = mainDiv.offsetHeight;
          ipcRenderer.send("mini-set-size", offsetHeight)
        });
        //监听窗口变化
        ipcRenderer.on('mini-top', (event, data) => {
          if (data == "true") {
            this.top = -mainDiv.offsetHeight + 8;
          } else {
            this.top = 0;
          }
        });
        mainDiv.onmouseover = function() {
          if (_this.top <= 0) {
            _this.top = 0;
            ipcRenderer.send("mini-win-show")
          }
        }
      }
      var currentDate = new Date();
      var year = currentDate.getFullYear(); //得到年份
      var moth = currentDate.getMonth(); //得到月份
      var date = currentDate.getDate(); //得到日期
      this.aplaneTodoDb = new nedb({
        filename: '/data/aplane-todo_' + year + '-' + moth + '.db',
        autoload: true
      });
      setTimeout(function() {
        // 查询所有结果集
        _this.aplaneTodoDb.find({
          year: year,
          moth: moth,
          date: date,
          status: '进行中'
        }, function(err, docs) {
          _this.todoList = docs;
        })
      }, 50)
    },
    methods: {
      showMaxWin() {
        if (ipcRenderer) {
          ipcRenderer.send("main-win-open")
        }
      },
      setTop() {
        this.fit = !this.fit;
        if (ipcRenderer) {
          ipcRenderer.send("mini-set-top", this.fit)
        }
      },
      closeMiniTool() {
        if (ipcRenderer) {
          ipcRenderer.send("mini-close")
        }
      },
      checkFun(index) {
        this.checkAll = true;
        this.hasSelect = false;
        for (var x in this.todoList) {
          if (index == x) {
            continue
          }
          if (this.todoList[x].checked) {
            this.hasSelect = true;
          } else {
            this.checkAll = false;
          }
        }
        if (this.todoList[index].checked) {
          this.checkAll = false;
        } else {
          this.hasSelect = true;
        }
      },
      checkAllFun() {
        for (var x in this.todoList) {
          this.todoList[x].checked = !this.checkAll;
        }
        this.hasSelect = !this.checkAll;

        if (!this.showMorePlane && !this.checkAll) {
          this.showMorePlane = true;
        }
      },
      showMorePlaneFun(show) {
        this.showMorePlane = show
      },
      changeMore(index) {
        this.showMoreMenu = !this.showMoreMenu
      },
      choiceMenuFun(menu) {
        this.choiceItem = menu;
        var url = "/setting/" + menu;
        this.$router.push(url).catch(err => {
          err
        })
      },
    }
  }
</script>

<style lang="scss">
  html {
    min-height: 0 !important;
  }

  #main-div {
    box-sizing: border-box;
    padding: 4px;
    position: relative;
    transition: all 0.2s linear;
  }

  .tool-main {
    box-shadow: 0 0 4px #7f8c8d;
    display: flex;
    flex-direction: column;
    background: #FFFFFF;

    * {
      transition: all 0.1s linear;
      font-size: 0.8rem;
    }

    .more-plane {
      flex: 1;
      display: flex;
      color: #7f8c8d;
      border-top: 1px #ecf0f1 solid;
      padding: 8px 10px;

      .right {
        display: flex;

        .bottom-menu.deep-color {
          color: #7f8c8d;
        }

        .bottom-menu {
          display: flex;
          color: #dfe0e1;
        }

        .show-more {
          border-left: 1px #e6e9ea solid;
          padding-left: 10px;
        }

        .item {
          margin-left: 10px;
          cursor: pointer;
        }

        .item:hover {
          color: #2980b9;
        }
      }

      .left {
        flex: 1;

        input {
          margin: 0;
          position: relative;
          top: 1px;
        }
      }
    }

    .plane {
      color: #4c5354;
      font-size: 0.8rem;

      .item:hover {
        background: #f6f7f8;

        .menu {
          display: block;
        }
      }

      .item {
        padding: 6px 10px;
        font-size: 0.8rem;
        position: relative;

        input {
          margin: 0;
          position: relative;
          top: 1px;
        }

        span {
          margin-right: 3rem;
        }

        .menu {
          display: none;
          z-index: 2;
          position: absolute;
          right: 10px;
          top: 6px;

          .more {
            padding-right: 8px;
            border-right: 1px #d8dbdc solid;
          }

          i {
            line-height: 1rem;
            transition: all 0.2s linear;
            cursor: pointer;
            color: #95a5a6;
            margin-left: 8px;
          }

          i:hover {
            color: #2980b9;
          }

          .fa-close:hover {
            color: #e74c3c;
          }
        }
      }

    }

    .top {
      box-sizing: border-box;
      line-height: 1rem;
      display: flex;
      width: 100%;
      font-size: 0.8rem;
      border-bottom: 1px #ecf0f1 solid;

      .title {
        margin-top: 3px;
        //padding: 10px;
        color: #7f8c8d;
        flex: 1;
        -webkit-app-region: drag;
        -webkit-user-select: none;
      }

      i {
        line-height: 1rem;
        transition: all 0.2s linear;
        cursor: pointer;
        color: #95a5a6;
        margin-left: 16px;
      }

      i:hover {
        color: #2980b9;
      }
    }
  }
</style>
