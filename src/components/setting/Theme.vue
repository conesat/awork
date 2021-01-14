<template>
  <div class="setting">
    <div class="title">主题风格</div>
    <div class="item">
      <label>内置风格：</label>
      <select class="input">
        <option>
          亮色
        </option>
        <option>
          暗色
        </option>
        <option>
          自定义
        </option>
      </select>
    </div>
    <div class="item">
      <label>背景颜色：</label>
      <div class="input">
        <div style="display: flex;flex: 1;">
          <colorPicker v-model="bgColor" v-on:change="headleChangeColor($event,'bg')" />
          <colorPicker v-model="bgColor1" v-on:change="headleChangeColor($event,'bg1')" />
        </div>

        <div style="display: flex;">
          <label>渐变</label>
          <input type="checkbox" class="switch">
        </div>
      </div>

    </div>
    <div class="item">
      <label>前景颜色：</label>
      <div class="input">
        <div style="display: flex;flex: 1;">
          <colorPicker v-model="bfColor" />
          <colorPicker v-model="bfColor" />
        </div>

        <div style="display: flex;">
          <label>渐变</label>
          <input type="checkbox" class="switch">
        </div>
      </div>
    </div>
    <div class="item">
      <label>普通字体：</label>
      <div class="input">
        <colorPicker v-model="normalFontColor" />
      </div>
    </div>
    <div class="item">
      <label>高亮字体：</label>
      <div class="input">
        <colorPicker v-model="activeFontColor" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    name: 'Theme',
    data() {
      return {
        bgColor: '#9d9d9d',
        bgColor1: '#9d9d9d',
        bfColor: '#9d9d9d',
        normalFontColor: '#9d9d9d',
        activeFontColor: '#9d9d9d',
      }
    },
    methods: {
      headleChangeColor(e, type) {
        console.log(e)
      }
    }
  }
</script>

<style lang="scss">
  .setting {
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
        margin-top: 2px;
        cursor: pointer;
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
