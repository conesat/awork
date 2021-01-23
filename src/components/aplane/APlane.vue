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
          <i class="fa fa-file-text-o" aria-hidden="true" title="复制日报"></i>
          <div></div>
        </span>
        <span class="item">
          <i class="fa fa-file-word-o" aria-hidden="true" title="复制周报"></i>
          <div></div>
        </span>
        <span class="item">
          <i class="fa fa-envelope-o" aria-hidden="true" title="发送周报"></i>
          <div></div>
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
              <div class="work-item-type" style="white-space: nowrap;">
                {{works[index].type}}
              </div>
            </td>
            <td v-for="(work,wIndex) in works[index].data" :colspan='work.colspan'>
              <div class="work-item" v-for="(detail,dIndex) in work.data"
              :style="{'width':getTdWidth(detail.colspan,work.colspan)}" :title="'持续'+detail.colspan+'天'">
                {{detail.title}}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  const nedb = require('nedb');
  import {
    globalBus
  } from '@/assets/js/globalBus.js';
  export default {
    components: {

    },
    data() {
      return {
        //任务类型数据库
        aplaneTypeDb: undefined,
        //任务数据库
        aplaneTodoDb: undefined,
        //当前加载的数据库
        startLoadDate: {
          year: '',
          moth: '',
          date: '',
          week: ''
        },
        //当前加载的数据库
        endLoadDate: {
          year: '',
          moth: '',
          date: '',
          week: ''
        },
        showType: '',
        dates: [],
        works: [],
        typeListMap: new Map(),
        typeDate: {},
        //table的移动缩放
        positionX: 0,
        positionY: 0,
        tableScale: 1,
        dateTag:new Map(),//用于更新日历打标记
      }
    },
    created() {
      globalBus.$on('aPlane_changeShowTypeBack', (res) => {
        this.changeShowTypeBack(res);
      });
      globalBus.$on('aPlane_reload', (res) => {
        this.loadTypes();
        this.startLoadDate={};
        this.endLoadDate={};
      });
    },
    methods: {
      //计算占据宽度 col自身比例  allCol总的宽比
      getTdWidth(col,allCol){
        if(col==allCol){
          return 'calc(100% - 10px)';
        }else{
          return 'calc('+col/allCol * 100+'% - 10px)';
        }
      },
      reload() {
        this.loadTypes();
        this.startLoadDate={};
        this.endLoadDate={};
        this.reloadTable();
      },
      reloadTable() {
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
        var _this = this;
        _this.dates.splice(0, this.dates.length)
        _this.works.splice(0, _this.works.length);

        _this.typeListMap.forEach(function(value, key) {
          value.splice(0,value.length)
        });

        var start = false;
        if (this.showType == 'moth') {
          if (_this.startLoadDate.year + "-" + _this.startLoadDate.moth != res.year + "-" + res.moth &&
            _this.endLoadDate.year + "-" + _this.endLoadDate.moth != res.year + "-" + res.moth) {
            _this.aplaneTodoDb = new nedb({
              filename: '/data/aplane-todo_' + res.year + '-' + res.moth + '.db',
              autoload: true
            });
          }
          _this.startLoadDate = res;
          _this.endLoadDate = res;
          var monthEndDate = new Date(res.year, res.moth + 1, 0).getDate();
          for (var x = 1; x < monthEndDate; x++) {
            _this.dates.push({
              year: res.year,
              moth: res.moth,
              date: x
            });
            (function(x) {
              _this.findAndAddPlane({
                year: res.year,
                moth: res.moth,
                date: x
              });
            })(x)
          }
        } else if (res.dates && res.dates.length > 0) {
          var startDate = res.dates[0];
          var endDate = res.dates[res.dates.length - 1];
          //判断这个周是否横跨两个月
          if (startDate.moth == endDate.moth) {
            //进入这里说明没有横跨两个月  然后判断是否需要重新加载数据库   避免重复载入先判断和上次加载是否一样
            if (_this.startLoadDate.year + "-" + _this.startLoadDate.moth != startDate.year + "-" + startDate.moth &&
              _this.endLoadDate.year + "-" + _this.endLoadDate.moth != startDate.year + "-" + startDate.moth) {
              _this.aplaneTodoDb = new nedb({
                filename: '/data/aplane-todo_' + startDate.year + '-' + startDate.moth + '.db',
                autoload: true
              });
              _this.startLoadDate = startDate;
            }

          }
          for (var x = 0; x < res.dates.length; x++) {
            this.dates.push({
              year: res.dates[x].year,
              moth: res.dates[x].moth,
              date: res.dates[x].date
            });
            (function(x) {
              _this.findAndAddPlane({
                year: res.dates[x].year,
                moth: res.dates[x].moth,
                date: res.dates[x].date
              });
            })(x)
          }
        }

        _this.typeListMap.forEach(function(value, key) {
          _this.works.push({
            type: key,
            data: value
          });
        });
        
        //通知日历打标
        globalBus.$emit('aDate_tag', this.dateTag);
      },
      //res 日期 找到这个日期下所有计划
      findAndAddPlane(res) {
        var _this = this;
        // 查询所有结果集
        _this.aplaneTodoDb.find({
          year: res.year,
          moth: res.moth,
          date: res.date
        }, function(err, docs) {
          //先添加一个空计划占行
          _this.typeListMap.forEach(function(value, key) {
            value.push({
              colspan:1,
              data:[]
            })
          });
          //遍历找到的全部计划
          for (var x in docs) {
            //如果找不到对应分类就是未分类
            var type = docs[x].type ? docs[x].type : '未分类';
            if (!_this.typeListMap.get(type)) {
              type = '未分类';
            }
            //默认一个任务一天
            docs[x].colspan=1;
            //获取这个分类下所及计划 把计划归到这下面
            var data = _this.typeListMap.get(type);
            if(data.length>1){
              var beforDatas=data[data.length - 2];//前一天的任务
              for(var i in beforDatas.data){
                if(docs[x].title==beforDatas.data[i].title){//如果前一天有同一个任务就不在添加  把天数+1
                   beforDatas.colspan++;
                   beforDatas.data[i].colspan++;
                   data[data.length - 1].data.splice(data.length - 1,1);
                   _this.dateTag.set(res.year+"-"+res.moth+"-"+res.date,true);
                   return;
                }
              }
            }
            _this.dateTag.set(res.year+"-"+res.moth+"-"+res.date,true);
            data[data.length - 1].data.push(docs[x]);
          }
        });
      },
      changeShowType(type) {
        if(this.showType!=type){
          this.reloadTable();
        }
        this.showType = type;
        globalBus.$emit('aDate_getDateList', type);
      },
      loadTypes() {
        var _this = this;
        _this.typeListMap.clear();
        _this.typeListMap.set('未分类',[]);
        _this.aplaneTypeDb = new nedb({
          filename: '/data/aplane-type.db',
          autoload: true
        });
        // 查询所有结果集
        _this.aplaneTypeDb.find({}, function(err, docs) {
          for (var x in docs) {
            _this.typeListMap.set(docs[x].name, []);
          }
          if (_this.showType) {
            _this.changeShowType(_this.showType);
          } else {
            _this.changeShowType('moth');
          }
        });
      }
    },
    mounted() {
      this.loadTypes();
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
          this.$refs.table.onmousewheel = scrollFunc;
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
        border: 1px solid rgba(#ECEFF1, 0.6);
      }

    }

    .top {
      padding-bottom: 10px;
      border-bottom: 1px rgba(#ECEFF1, 0.6) solid;
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
            //width: 3.2rem;
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
