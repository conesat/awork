<template>
  <div id="app" :style="{'background':'linear-gradient(135deg,'+this.$store.state.theme.bgColorStart+', '+this.$store.state.theme.bgColorEnd+')'}">
    <div class="top-bar">
      <div class="left">
        <img src="./assets/logo.png" height="100%" />
        <span>爱生活-爱工作</span>
       </div>
      <div class="right">
        <span class="fa fa-window-minimize"></span>
        <span class="fa fa-window-restore"></span>
        <span class="fa fa-close"></span>
      </div>
    </div>
    <div class="view">
      <router-view />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'App'
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
