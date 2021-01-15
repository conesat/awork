<template>
  <div id="app" :style="{'background':'linear-gradient(135deg,'+this.$store.state.theme.bgColorStart+', '+this.$store.state.theme.bgColorEnd+')'}">
    <div class="top-bar" v-if="showBar">
      <div class="left">
        <img src="./assets/logo.png" height="100%" />
        <span>爱生活-爱工作</span>
      </div>
      <div class="right">
        <span class="fa fa-window-minimize" @click="onMinimize"></span>
        <span class="fa" :class="maxRes" @click="onMaximize"></span>
        <span class="fa fa-close" @click="onClose"></span>
      </div>
    </div>
    <div class="view">
      <router-view />
    </div>
  </div>
</template>

<script>
  var ipcRenderer;
  if(window.require){
    ipcRenderer = window.require('electron').ipcRenderer;
  }
  export default {
    name: 'App',
    data() {
      return {
        maxRes: 'fa-window-restore',
        showBar: false,
      }
    },
    mounted() {
      var _this = this;
      if (ipcRenderer) {
        this.showBar = true;
        //监听窗口变化
        ipcRenderer.on('restoreMaximize', (event, data) => {
          switch (data) {
            case 'restore':
              _this.maxRes = 'fa-window-maximize';
              break;
            case 'maximize':
              _this.maxRes = 'fa-window-restore';
              break;
          }
        });
      }
    },
    methods: {
      //置顶功能
      onTopping() {
        ipcRenderer.send('window-top');
      },
      //最小化
      onMinimize() {
        ipcRenderer.send('window-min');
      },
      //最大化
      onMaximize() {
        ipcRenderer.send('window-max');
      },
      //关闭
      onClose() {
        ipcRenderer.send('window-close');
      }
    }
  }
</script>

<style lang="scss">
  #app {
    display: flex;
    flex-direction: column;

    .top-bar {
      background: rgba(255, 255, 255, 0.6);
      box-shadow: 0 0 2px #bdbdbd;
      display: flex;
      height: 2rem;
      color: #546E7A;
      line-height: 2rem;
      font-size: 0.8rem;


      .left {
        display: flex;
        margin-left: 10px;
        flex: 1;
        -webkit-app-region: drag;
        -webkit-user-select: none;
      }

      .right {
        display: flex;

        span {
          padding: 0 16px;
          line-height: 2rem;
        }

        span:hover {
          background: #dadada;
        }
      }
    }

    .view {
      flex: 1;
    }
  }
</style>
