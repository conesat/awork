<template>
  <div class="about">
    <div class="title">关于</div>
    <div class="item">
      <label>应用：</label>
      <div class="input">
        {{appinfo.name}}
      </div>
    </div>
    <div class="item">
      <label>版本：</label>
      <div class="input">
        {{appinfo.version}}
      </div>
    </div>
    <div class="item">
      <label>更新日期：</label>
      <div class="input">
        {{appinfo.updateTime}}
      </div>
    </div>
    <div class="item">
      <label>作者：</label>
      <div class="input">
        {{appinfo.author}}
      </div>
    </div>
  </div>
</template>

<script>
  var ipcRenderer;
  if (window.require) {
    ipcRenderer = window.require('electron').ipcRenderer;
  }
  export default {
    components: {},
    name: 'Theme',
    data() {
      return {
        appinfo: {
          name: '爱工作',
          version: '1.0.0',
          description: '',
          author: 'hzl',
          updateTime: ''
        }
      }
    },
    methods: {
      
    },
    mounted() {
      var _this = this;
      if (ipcRenderer) {
        ipcRenderer.send("get-app-info");
        ipcRenderer.on("get-app-info-back", (event, data) => {
          _this.appinfo = data;
        });
      }
    }
  }
</script>

<style lang="scss">
  .about {
    .title {
      text-align: center;
      width: 100%;
      font-size: 1.4rem;
      font-weight: bold;
      margin-bottom: 20px;
    }

    /* Switch开关样式 */
    /* 必须是input为 checkbox class 添加 switch 才能实现以下效果 */
    input[type='checkbox'].switch {
      margin-top: 5px;
      cursor: pointer;
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      position: relative;
      width: 40px;
      height: 20px;
      background: #ccc;
      border-radius: 10px;
      transition: border-color .3s, background-color .3s;
    }

    input[type='checkbox'].switch::after {
      content: '';
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0, 0, 2px, #999;
      transition: .4s ease;
      top: 2px;
      position: absolute;
      left: 2px;
    }

    input[type='checkbox'].switch:checked {
      background: #3498db;
    }

    /* 当input[type=checkbox]被选中时：伪元素显示下面样式 位置发生变化 */
    input[type='checkbox'].switch:checked::after {
      content: '';
      position: absolute;
      left: 55%;
      top: 2px;
    }

    .item {
      display: flex;
      margin-bottom: 10px;
      line-height: 30px;

      label {
        text-align: right;
        width: 10rem;
      }

      .input {
        display: flex;
        outline: none;
        font-size: 1rem;
        color: #7f8c8d;
        border: none;
        flex: 1;
        width: 0;

        label {
          text-align: right;
          width: auto;
          white-space: nowrap;
        }

        .m-colorPicker {
          margin-top: 6px;
          margin-right: 10px;
        }
      }
    }
  }
</style>
