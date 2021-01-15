<template>
  <div class="setting">
    <div class="title">主题风格</div>
    <div class="item">
      <label>内置风格：</label>
      <select class="input" v-model="themeType" @change="changeThemeType(themeType)" >
        <option value="light">
          亮色
        </option>
        <option value="night">
          暗色
        </option>
        <option value="self">
          自定义
        </option>
      </select>
    </div>

    <div class="item">
      <label>背景颜色：</label>
      <div class="input">
        <div style="display: flex;flex: 1;">
          <div style="position: relative;">
            <div class="m-colorPicker" :style="{'background':this.theme.bgColorStart}" @click.stop="showChoiceFun('bgColorStart')"></div>
            <color-picker v-show="showChoice=='bgColorStart'" class='picker' v-model="bgColorStart" @input="headleChangeColor($event,'bgColorStart')"></color-picker>
          </div>
          <div style="position: relative;" v-show="openBgLinear">
            <div class="m-colorPicker" :style="{'background':this.theme.bgColorEnd}" @click.stop="showChoiceFun('bgColorEnd')"></div>
            <color-picker v-show="showChoice=='bgColorEnd'" class='picker' v-model="bgColorEnd" @input="headleChangeColor($event,'bgColorEnd')"></color-picker>
          </div>
        </div>
        <div style="display: flex;">
          <label>渐变</label>
          <input type="checkbox" class="switch" @input="changeBgLinearSwitch" v-model="openBgLinear">
        </div>
      </div>

    </div>
    <div class="item">
      <label>前景颜色：</label>
      <div class="input">
        <div style="display: flex;flex: 1;">
          <div style="position: relative;">
            <div class="m-colorPicker" :style="{'background':this.theme.bfColor}" @click.stop="showChoiceFun('bfColor')"></div>
            <color-picker v-show="showChoice=='bfColor'" class='picker' v-model="bfColor" @input="headleChangeColor($event,'bfColor')"></color-picker>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {
    Chrome
  } from 'vue-color' //有6中风格，用哪种直接引用对应的名字就行
  export default {
    components: {
      'color-picker': Chrome
    },
    name: 'Theme',
    data() {
      return {
        themeType: this.$store.state.theme.themeType,
        openBgLinear: this.$store.state.theme.openBgLinear,
        openBfLinear: this.$store.state.theme.openBfLinear,
        showChoice: '',
        bgColorStart: {
          hex: this.$store.state.theme.bgColorStart,
          a: 1
        },
        bgColorEnd: {
          hex: this.$store.state.theme.bgColorEnd,
          a: 1
        },
        bfColor: {
          hex: this.$store.state.theme.bfColor,
          a: 1
        },
        theme: this.$store.state.theme,
        isRouterAlive: true,
        normalFontColor: '#9d9d9d',
        activeFontColor: '#9d9d9d',
      }
    },
    methods: {
      changeThemeType(e) {
        this.theme.themeType = e;
        this.updeteTheme();
      },
      changeBgLinearSwitch(e) {
        this.theme.openBgLinear = e;
        if (!e) {
          this.theme.bgColorEnd = color;
        }
        this.updeteTheme();
      },
      clickOther(e) {
        if (e.srcElement.className.indexOf('vc-') >= 0) {
          return;
        }
        this.showChoice = '';
      },
      showChoiceFun(showChoice) {
        this.showChoice = showChoice;
      },
      headleChangeColor(e, type) {
        var color;
        if (e.a < 1) {
          color = 'rgba(' + e.rgba.r + ',' + e.rgba.g + ',' + e.rgba.b + ',' + e.rgba.a + ')'
        } else {
          color = e.hex;
        }
        switch (type) {
          case 'bgColorEnd':
            this.theme.bgColorEnd = color;
            break;
          case 'bgColorStart':
            this.theme.bgColorStart = color;
            if (!this.openBgLinear) {
              this.theme.bgColorEnd = color;
            }
            break;
          case 'bfColor':
            this.theme.bfColor = color;
            break;
        }
        this.updeteTheme();
      },
      updeteTheme() {
        this.$store.commit({
          type: 'setTheme',
          theme: this.theme
        });
      }
    },
    mounted() {
      window.addEventListener("click", this.clickOther);
    },
    beforeDestroy() {
      window.removeEventListener('click', this.clickOther);
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
        background: transparent;
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
          margin-right: 10px;
          width: 20px;
          height: 20px;
          border: 1px #eee solid;
          margin-top: 4px;
        }

        .picker {
          position: absolute;
          z-index: 999;
          margin-top: 10px;
        }
      }
    }
  }
</style>
