<template>
  <div class="a-menu">
    <div class="menus-table">
      <div class="menus">
        <div class="item home" @click="choiceMenuFun('home')">
          <img src="../assets/icon/menu/a-menu-home.png" :class="{'active':choiceMenu=='home'}" title="首页" />
        </div>
        <div class="item" @click="choiceMenuFun('work')">
          <img src="../assets/icon/menu/a-menu-work.png" :class="{'active':choiceMenu=='work'}" title="工作台" />
        </div>
        <div class="item setting" @click="choiceMenuFun('setting')">
          <img src="../assets/icon/menu/a-menu-setting.png" :class="{'active':choiceMenu=='setting'}" title="设置" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        choiceMenu: 'home',
      }
    },
    methods: {
      choiceMenuFun(menu) {
        this.choiceMenu = menu;
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss">
  .a-menu {
    height: 100%;
    display: table;

    .menus-table {
      display: table-cell;
      vertical-align: middle;

      .menus {
        width: 1.8rem;
        position: relative;
        display: flex;
        flex-direction: column;
        transition: all 0.2s ease-in-out;
        padding: 100px 10px;
        margin-left: auto;
        margin-right: auto;
        border-radius: 100px;
        background: #FFFFFF;
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1);

        .home {
          position: absolute;
          top: 0.8rem;
        }

        .setting {
          position: absolute;
          bottom: 0.2rem;
        }

        .item {
          height: 2.4rem;

          img {
            cursor: pointer;
            transition: all 0.1s linear;
            border-radius: 4px;
            height: auto;
            margin-left: 0.2rem;
            margin-top: 0.2rem;
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
            margin-top: 0;
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
