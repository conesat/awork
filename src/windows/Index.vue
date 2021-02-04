<template>
  <div class="index">
    <div class="menu-left">
      <AMenu></AMenu>
    </div>
    <keep-alive :exclude="noCatchArr">
      <router-view style="flex: 1;"/>
    </keep-alive>
  </div>
</template>

<script>
  import AMenu from '@/components/AMenu'
  export default {
    components: {
      AMenu
    },
    data() {
      return {
        noCatchArr: this.$store.state.noCatchArr
      }
    },
    methods: {

    },
    mounted() {

    },
    watch: {
      $route: {
        //监听路由变化
        handler: function(to, from) {
          this.noCatchArr = this.$store.state.noCatchArr;
        }
      }
    }
  }
</script>

<style lang="scss">
  html {
    -webkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    min-height: 600px;
    overflow-y: auto;

    .index {
      display: flex;
      box-sizing: border-box;
      height: 100%;
      padding: 6px;

      .plan-right {
        background: #FFFFFF;
        border-radius: 6px;
        flex: 1;
        height: 100%;
        margin-left: 10px;
        overflow: auto;
      }

      .plan-right:hover {
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
      }

      .date-div {
        width: 272px;
        height: 100%;
        display: flex;
        flex-direction: column;

        .top {
          overflow: hidden;
          border-radius: 6px;
          transition: all 0.2s linear;
        }

        .bottom {
          flex: 1;
          margin-top: 10px;
          overflow: hidden;
          border-radius: 6px;
          transition: all 0.2s linear;
        }

        .bottom:hover,
        .top:hover {
          box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
        }
      }

      .menu-left {
        z-index: 999999;
        margin-right: 10px;
      }
    }


  }
</style>
