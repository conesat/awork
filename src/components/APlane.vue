<!-- 爱计划 -->
<template>
  <div class="a-plane">
    <div class="top">
      <div class="show-type">
        <div :class="{'active':showType=='moth'}" @click="changeShowType('moth')">月</div>
        <div :class="{'active':showType=='week'}" @click="changeShowType('week')">周</div>
      </div>
      <div class="tools">
        <span class="item">
          <i class="fa fa-file-text" aria-hidden="true"></i>
          <div>下载日报</div>
        </span>
        <span class="item">
          <i class="fa fa-file-text" aria-hidden="true"></i>
          <div>下载周报</div>
        </span>
        <span class="item">
          <i class="fa fa-file-text" aria-hidden="true"></i>
          <div>发送周报</div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {

    },
    data() {
      return {
        showType: 'moth'
      }
    },
    methods: {
      changeShowType(type) {
        this.showType = type;
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss">
  .a-plane {
    padding: 14px;

    .top {
      display: flex;
      color: #90A4AE;

      .tools {
        flex: 1;
        text-align: right;

        .item {

          cursor: pointer;
          margin-left: 10px;

          div {
            transition: all 0.2s linear;
            display: inline-block;
            width: 0px;
            overflow: hidden;
            white-space: nowrap;
          }
        }

        .item:hover {
          div {
            width: 4rem;
          }
        }
      }

      .show-type {
        display: flex;

        div {
          width: 2rem;
          cursor: pointer;
          text-align: center;
          line-height: 1.2rem;
          transition: all 0.1s linear;
        }

        div:hover {
          color: #1E88E5;
        }

        .active {
          font-weight: bold;
          font-size: 1.2rem;
          color: #1E88E5;
          width: 2rem;
          border-bottom: 3px #1E88E5 solid;
          padding-bottom: 4px;
        }
      }



    }
  }
</style>
