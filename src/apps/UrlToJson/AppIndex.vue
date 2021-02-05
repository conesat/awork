<template>
  <div class="url-main">
    <div class="url-main-left">
      <div class="url-main-top">
        <div class="item" :class="{'active':item.active}" v-for="(item,index) in itemLeft" :index="index">
          <span>
            {{item.title}}
          </span>
          <i class="fa fa-close" v-if="index!=0"></i>
        </div>
        <div class="item add" @click="addItem('left')">
          <i class="fa fa-plus"></i>
        </div>
      </div>
      <div class="detail">
        <div class="top">
          <input placeholder="粘贴需要转换的文本" />
        </div>
        <div class="bottom">
          <textarea></textarea>
        </div>
      </div>
    </div>
    <div class="url-main-right">
      <div class="url-main-top">
        <div class="item" :class="{'active':item.active}" v-for="(item,index) in itemRight" :index="index">
          <span>
            {{item.title}}
          </span>
          <i class="fa fa-close" v-if="index!=0"></i>
        </div>
        <div class="item add">
          <i class="fa fa-plus"></i>
        </div>
      </div>
      <div class="detail">
        <div class="top">
          <input placeholder="粘贴需要转换的文本" />
        </div>
        <div class="bottom">
          <textarea></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'urlToJson',
    components: {},
    data() {
      return {
        itemLeft: [{
          title: '#1',
          active: true
        }],
        itemRight: [{
          title: '#1',
          active: true
        }]
      }
    },
    methods: {
      addItem(type) {
        if (type == 'left') {
          this.itemLeft.push({
            title: '#' + (this.itemLeft.length + 1),
            active: false
          })
        }
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss">
  .url-main {
    box-sizing: border-box;
    padding: 10px;
    padding-top: 0;
    width: 100%;
    height: 100%;
    display: flex;

    * {
      font-size: 0.8rem;
      color: #6e797a;
    }

    .url-main-left,
    .url-main-right {
      box-sizing: border-box;
      overflow: hidden;
      width: 100%;
      border-top-right-radius: 4px;
      margin: 0 2px;
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;

      .detail {
        display: block;
        box-sizing: border-box;
        flex: 1;
        width: 100%;
        background: #FFFFFF;
        display: flex;
        flex-direction: column;
        z-index: 9;
        padding: 10px;

        .bottom {
          box-sizing: border-box;
          padding: 10px 0;
          flex: 1;

          textarea {
            width: 100%;
            height: 100%;
            outline: none;
            border: none;
            resize: none;
          }
        }

        .top {
          padding-top: 10px;
          padding-bottom: 10px;
          display: flex;
          border-bottom: 1px #95a5a6 solid;

          input {
            flex: 1;
            outline: none;
            border: none;
          }
        }
      }

      .url-main-top {
        padding-top: 10px;
        white-space: nowrap;
        //display: flex;
        width: 100%;
        overflow: auto;

        .item.add {
          width: auto;
          padding: 4px 20px;

          .fa {
            line-height: 1.2rem;
            color: #1abc9c;
          }

        }

        .item {
          display: inline-flex;
          width: 5rem;
          color: #34495e;
          padding: 4px 20px;
          padding-right: 8px;
          box-sizing: border-box;

          .fa-close {
            flex: 1;
            line-height: 1.2rem;
            cursor: pointer;
            text-align: right;
            font-size: 0.6rem;
            display: none;
            color: #e67e22;
          }
        }

        .item:hover {
          color: #2980b9;
          background: #ffffff;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;

          .fa-close {
            display: inline-block;
          }
        }

        .item.active {
          z-index: 9;
          color: #2980b9;
          background: #ffffff;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          box-shadow: 4px 0 6px #bdc3c7;

          .fa-close {
            display: inline-block;
          }
        }
      }
    }
  }
</style>
