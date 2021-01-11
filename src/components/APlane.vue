<!-- 爱计划 -->
<template>
  <div class="a-plane">
    <div class="top">
      <div class="show-type">
        <div :class="{'active':showType=='moth'}" @click="changeShowType('moth')">月</div>
        <div :class="{'active':showType=='week'}" @click="changeShowType('week')">周</div>
        <div class="bottom-tag" :class="{'to-right':showType=='week','to-left':showType=='moth'}"></div>
      </div>
      <div class="tools">
        <span class="item">
          <i class="fa fa-file-text-o" aria-hidden="true"></i>
          <div>复制日报</div>
        </span>
        <span class="item">
          <i class="fa fa-file-word-o" aria-hidden="true"></i>
          <div>复制周报</div>
        </span>
        <span class="item">
          <i class="fa fa-envelope-o" aria-hidden="true"></i>
          <div>发送周报</div>
        </span>
        <span class="item">
          <i class="fa fa-refresh" aria-hidden="true" @click="reloadTable()" title="重置表格"></i>
        </span>
      </div>
    </div>
    <div class="bottom">
      <table @dblclick="reloadTable()" ref='table' @mousedown="move" :style="{'left':positionX+'px','top':positionY+'px','transform':'scale('+tableScale+')'}">
        <thead>
          <tr>
            <th style="white-space: nowrap;">分类</th>
            <th v-for="(day,wIndex) in dates">
              {{day.year+'/'+((day.moth+1)<10?'0'+(day.moth+1):(day.moth+1))+'/'+(day.date<10?'0'+day.date:day.date)}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in works">
            <td>
              <div class="work-item-type">
                {{works[index].name}}
              </div>
            </td>
            <td v-for="(work,wIndex) in works[index].data">
              <div class="work-item">
                123
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import {
    globalBus
  } from '@/assets/js/globalBus.js';
  export default {
    components: {

    },
    data() {
      return {
        showType: 'moth',
        dates: [],
        works: [{
          name: '第三方',
          data: [
            "工作内容", "工作内容", "工作内容", "工作内容", "工作内容",
            "工作内容", "工作内容", "工作内容", "工作内容", "工作内容",
            "工作内容", "工作内容", "工作内容", "工作内容", "工作内容",
            "工作内容", "工作内容", "工作内容", "工作内容", "工作内容"
          ]
        }],
        //table的移动缩放
        positionX: 0,
        positionY: 0,
        tableScale: 1,
      }
    },
    created() {
      globalBus.$on('aPlane_changeShowTypeBack', (res) => {
        return this.changeShowTypeBack(res);
      });
    },
    methods: {
      reloadTable(){
        this.positionX = 0;
        this.positionY = 0;
        this.tableScale = 1;
      },
      move(e) {
        let odiv = e.target; //获取目标元素
        //算出鼠标相对元素的位置
        let disX = e.clientX;
        let disY = e.clientY;
        let oldX = this.positionX;
        let oldY = this.positionY;
        document.onmousemove = (e) => { //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX;
          let top = e.clientY - disY;
          //绑定元素位置到positionX和positionY上面
          this.positionX = oldX + left;
          this.positionY = oldY + top;
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      },
      changeShowTypeBack(res) {
        this.dates.splice(0, this.dates.length)
        var start = false;
        if (this.showType == 'moth') {
          var monthEndDate = new Date(res.year, res.moth + 1, 0).getDate();
          for (var x = 1; x < monthEndDate; x++) {
            this.dates.push({
              year: res.year,
              moth: res.moth,
              date: x
            });
          }
        } else {
          for (var x = 0; x < res.length; x++) {
            this.dates.push({
              year: res[x].year,
              moth: res[x].moth,
              date: res[x].date
            });
          }
        }
      },
      changeShowType(type) {
        this.showType = type;
        globalBus.$emit('aDate_getDateList', type);
      }
    },
    mounted() {
      this.changeShowType('moth');
      var _this = this;
      this.$nextTick(function() {
        var scrollFunc = function(e) {
          e = e || window.event;
          if (e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
              if (_this.tableScale > 1.5) {
                return;
              }
              _this.tableScale += 0.1;
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
            if (_this.tableScale < 0.6) {
              return;
            }
              _this.tableScale -= 0.1;
            }
          } else if (e.detail) { //Firefox滑轮事件
            if (e.detail > 0) { //当滑轮向上滚动时
              if (_this.tableScale > 1.5) {
                return;
              }
              _this.tableScale += 0.1;
            }
            if (e.detail < 0) { //当滑轮向下滚动时
              if (_this.tableScale < 0.6) {
                return;
              }
              _this.tableScale -= 0.1;
            }
          }
        };
        //给页面绑定滑轮滚动事件
        if (this.$refs.table.addEventListener) {
           this.$refs.table.onmousewheel  = scrollFunc;
        }
        //滚动滑轮触发scrollFunc方法

      });
    }
  }
</script>

<style lang="scss">
  @keyframes toRightKF {
    0% {
      left: 0;
      width: 2rem;
    }

    50% {
      left: 0%;
      width: 4rem;
    }

    100% {
      left: 50%;
      width: 2rem;
    }
  }

  @keyframes toLeftKF {
    0% {
      left: 50%;
      width: 2rem;
    }

    50% {
      left: 0%;
      width: 4rem;
    }

    100% {
      left: 0;
      width: 2rem;
    }
  }

  .a-plane {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    padding: 14px;
    flex-direction: column;

    .bottom {
      width: 100%;
      flex: 1;
      padding-top: 4px;
      overflow: hidden;

      .work-item-type {
        padding: 10px;
      }

      .work-item {
        margin: 10px 0;
        margin-right: 10px;
        width: calc(100% - 10px);
        box-sizing: border-box;
        background: #E1F5FE;
        color: #03A9F4;
        border-left: 3px #03A9F4 solid;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        padding: 14px;
        padding-left: 4px !important;
        cursor: pointer;
        transition: all 0.2s linear;
      }

      .work-item:hover {
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      }

      table {
        transition: transform 0.2s linear;
        cursor: move;
        border: none;
        position: relative;
        display: block;
        border-collapse: collapse;
      }

      table th {
        padding: 10px !important;
      }

      table td,
      table th {
        padding: 10px 0;
        color: #607D8B;
        text-align: left;
        border: 1px solid #ECEFF1;
      }

    }

    .top {
      padding-bottom: 10px;
      border-bottom: 1px #ECEFF1 solid;
      display: flex;
      color: #90A4AE;

      .tools {
        flex: 1;
        text-align: right;

        .item {
          display: inline-flex;
          line-height: 1rem;
          cursor: pointer;
          margin-left: 10px;
          transition: all 0.2s linear;

          div {
            font-size: 0.8rem;
            margin-left: 4px;
            transition: all 0.2s linear;
            display: inline-block;
            width: 0px;
            overflow: hidden;
            white-space: nowrap;
          }
        }

        .item:hover {
          color: #1E88E5;

          div {
            width: 3.2rem;
          }
        }
      }

      .show-type {
        height: 1.4rem;
        display: flex;
        position: relative;

        .to-right {
          animation: toRightKF 0.5s;
          animation-fill-mode: forwards
        }

        .to-left {
          animation: toLeftKF 0.5s;
          animation-fill-mode: forwards
        }

        .bottom-tag {
          border-radius: 4px;
          height: 3px;
          width: 2rem;
          background: #1E88E5;
          position: absolute;
          bottom: -4px;
        }

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
          //  border-bottom: 3px #1E88E5 solid;
          padding-bottom: 4px;
        }
      }



    }
  }
</style>
