<template>
  <div class="setting-main" :style="{'background':this.$store.state.theme.bfColor}">
    <div style="margin: 0 auto;display: flex;">
      <div class="left">
        <div class="item" :class="{'active':choiceItem=='theme'}" @click="choiceMenuFun('theme')">
          <img src="../assets/icon/setting/theme.png" />
          <span>主题</span>
        </div>
        <div class="item " :class="{'active':choiceItem=='account'}" @click="choiceMenuFun('account')">
          <img src="../assets/icon/setting/account.png" />
          <span>账号</span>
        </div>
        <div class="item" :class="{'active':choiceItem=='about'}" @click="choiceMenuFun('about')">
          <img src="../assets/icon/setting/about.png" />
          <span>关于</span>
        </div>
      </div>
      <div class="right">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    name: 'Setting',
    data() {
      return {
        choiceItem: 'theme',
      }
    },
    methods: {
      choiceMenuFun(menu) {
        this.choiceItem = menu;
        var url="/setting/"+menu;
        this.$router.push(url).catch(err => {err})
      },
    }
  }
</script>

<style lang="scss">
  * {
    transition: all 0.1s linear;
  }

  .setting-main {
    color: #7f8c8d;
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 6px;
    display: flex;
    padding: 10px;
    box-sizing: border-box;

    .left {
      padding-right: 10px;
      padding-top: 20px;
      padding-bottom: 20px;
      box-sizing: border-box;
      width: 300px;
      height: 100%;
      border-right: 2px #e3e3e3 solid;

      .item {

        color: #7f8c8d;
        cursor: pointer;
        display: flex;
        padding: 10px;

        img {
          height: 1rem;
        }

        span {
          margin-left: 10px;
          line-height: 1.2rem;
        }
      }

      .item:hover,
      .item.active {
        color: #2980b9;
        background: #efefef;

        img {
          height: 1.2rem;
        }
      }
    }

    .right {
      box-sizing: border-box;
      height: 100%;
      width: 400px;
      padding-left: 10px;
      padding-top: 20px;
      padding-bottom: 20px;


    }
  }

  .setting-main:hover {
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
  }
</style>
