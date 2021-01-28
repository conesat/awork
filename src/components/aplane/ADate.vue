<!-- 爱日历 -->
<template>
  <div class="a-date">
    <div class="date">
      <div class="date-top">
        <i class="fa fa-chevron-left" @click="beforMoth()"></i>
        <span>
          <span>{{pikerDateYear}}</span>
          年
          <span>{{pikerDateMoth}}</span>
          月
        </span>
        <i class="fa fa-chevron-right" @click="nextMoth()"></i>
      </div>
      <div class="line"></div>
      <div class="date-title">
        <span>日</span>
        <span>一</span>
        <span>二</span>
        <span>三</span>
        <span>四</span>
        <span>五</span>
        <span>六</span>
      </div>
      <div class="date-day">
        <div :class="{'active-week':indexDay==chioceWeek}" class="date-day-line" v-for="(item,indexDay) in day" :index='indexDay'>
          <span @click="choiceDateFun($event,index)" :class="{'now':item.type == 'now',
          'active':item.year==chioceYear&&item.moth==chioceMoth&&item.date==chioceDate,
          'today':item.year==today.year&&item.moth==today.moth&&item.date==today.date}"
            v-for="(item,index) in date" v-if="index<7*(indexDay+1)&&index>=7*indexDay">
            {{item.date}}
            <div class="tag" v-if="item.tag"></div>
          </span>
        </div>
      </div>
      <div class="bottm-title">
        Alife - Awork
        <div class="today" @click="toToday()">今</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    globalBus
  } from '@/assets/js/globalBus.js';
  export default {
    name: 'ADate',
    data() {
      return {
        date: [],
        day: [], //周
        pickerDate: undefined, //日历
        pikerDateYear: '',
        pikerDateMoth: '',
        pikerIndex: '', //当前选中的是数组哪一个


        chioceYear: "", //选中年份
        chioceMoth: "", //选中月份
        chioceDate: "", //选中日期
        chioceWeek: "", //选中周


        //Aplane 交互
        aPlane: {
          changeShowType: 'moth',
        },
        //今天日期
        today: {
          year: '',
          moth: '',
          date: ''
        },
        tagMap:undefined,
      }
    },
    created() {
      var _this = this;
      globalBus.$on('aDate_getDateList', (type) => {
        this.aPlane.changeShowType = type;
        return this.getDateList(type);
      });
      globalBus.$on('aDate_tag', (map) => {
        this.tagMap=map;
        this.doTag();
      });
      globalBus.$on('aDate_getDate', (type) => {
        globalBus.$emit('aDate_changeDateBack', {
          year: _this.chioceYear,
          moth: _this.chioceMoth,
          date: _this.chioceDate,
          week: _this.chioceWeek,
        });
      });
    },
    methods: {
      //打标
      doTag() {
        var _this=this;
        var map=_this.tagMap;
        if(!map||!_this.date){
          return;
        }
        for (var x in _this.date) {
          var date = _this.date[x];
          date.tag = map.get(date.year + "-" + date.moth + "-" + date.date);
          if(date.tag){
            this.$set(_this.date,x,date);
          }
        }
      },
      //回到当天
      toToday() {
        this.initToday();
        this.getDateList(this.aPlane.changeShowType);
      },
      initToday() {
        var _this = this;
        this.pickerDate = new Date();
        this.chioceYear = this.pickerDate.getFullYear();
        this.chioceMoth = this.pickerDate.getMonth();
        this.chioceDate = this.pickerDate.getDate();
        this.initDate();
        this.initDay();
        this.today = {
          year: this.chioceYear,
          moth: this.chioceMoth,
          date: this.chioceDate
        }
        globalBus.$emit('aDate_changeDateBack', {
          year: _this.chioceYear,
          moth: _this.chioceMoth,
          date: _this.chioceDate,
          week: _this.chioceWeek,
        });
      },
      getDateList(type) {
        var _this = this;
        if (type == 'moth') {
          globalBus.$emit('aPlane_changeShowTypeBack', {
            year: this.chioceYear,
            moth: this.chioceMoth,
            date: this.chioceDate
          });
        } else {
          if (this.chioceWeek == -1) {
            return;
          }
          var res = this.date.slice(7 * this.chioceWeek, 7 * (parseInt(this.chioceWeek) + 1));
          globalBus.$emit('aPlane_changeShowTypeBack', {
            year: this.chioceYear,
            moth: this.chioceMoth,
            date: this.chioceDate,
            dates: res
          });
        }

        globalBus.$emit('aDate_changeDateBack', {
          year: _this.chioceYear,
          moth: _this.chioceMoth,
          date: _this.chioceDate,
          week: _this.chioceWeek,
        });
      },
      choiceDateFun(e, index) {
        var parent = e.currentTarget.parentElement;
        var date = this.date[index];
        this.chioceYear = date.year;
        this.chioceMoth = date.moth;
        this.chioceDate = date.date;
        this.chioceWeek = parent.getAttribute("index");
        this.getDateList(this.aPlane.changeShowType);
      },
      beforMoth() {
        var currentDate = this.pickerDate;
        var nowYear = currentDate.getFullYear(); //得到年份
        var nowMonth = currentDate.getMonth() - 1; //得到月份
        var nowDate = currentDate.getDate(); //得到日期
        this.pickerDate = new Date(nowYear, nowMonth, nowDate);
        this.initDate();
      },
      nextMoth() {
        var currentDate = this.pickerDate;
        var nowYear = currentDate.getFullYear(); //得到年份
        var nowMonth = currentDate.getMonth() + 1; //得到月份
        var nowDate = currentDate.getDate(); //得到日期
        this.pickerDate = new Date(nowYear, nowMonth, nowDate);
        this.initDate();

      },
      initDate() {
        this.chioceWeek = -1;
        this.date.splice(0, this.date.length);
        var currentDate = this.pickerDate;
        var nowYear = currentDate.getFullYear(); //得到年份
        var nowMonth = currentDate.getMonth(); //得到月份
        var nowDate = currentDate.getDate(); //得到日期
        this.pikerDateYear = nowYear;
        this.pikerDateMoth = nowMonth + 1;

        var hour = currentDate.getHours(); //得到小时
        var minu = currentDate.getMinutes(); //得到分钟
        var sec = currentDate.getSeconds(); //得到秒

        var setDate = new Date(nowYear, nowMonth, 1);
        var day = setDate.getDay(); //得到周几
        setDate.setDate(setDate.getDate() - 1);
        var date = setDate.getDate(); //得到日期
        //填充前日期
        var beforMothValue;
        var beforYearValue;
        if (nowMonth == 0) {
          beforMothValue = 11;
          beforYearValue = nowYear - 1;
        } else {
          beforYearValue = nowYear
          beforMothValue = nowMonth - 1;
        }

        for (var x = day - 1; x >= 0; x--) {
          this.date.push({
            type: 'befor',
            date: date - x,
            year: beforYearValue,
            moth: beforMothValue,
          });
          if (beforYearValue == this.chioceYear && beforMothValue == this.chioceMoth && date - x == this.chioceDate) {
            this.chioceWeek = Math.ceil(this.date.length / 7) - 1;
          }
        }

        //获取本月最后一天
        var monthEndDate = new Date(nowYear, nowMonth + 1, 0);
        for (var x = 1; x <= monthEndDate.getDate(); x++) {
          this.date.push({
            type: 'now',
            date: x,
            year: nowYear,
            moth: nowMonth,
          });
          if (nowYear == this.chioceYear && nowMonth == this.chioceMoth && x == this.chioceDate) {
            this.chioceWeek = Math.ceil(this.date.length / 7) - 1;
          }
        }


        var nextMothValue;
        var nextYearValue;
        if (nowMonth == 11) {
          nextMothValue = 0;
          nextYearValue = nowYear + 1;
        } else {
          nextYearValue = nowYear;
          nextMothValue = nowMonth + 1;
        }
        for (var x = 1; this.date.length < 42; x++) {
          this.date.push({
            type: 'after',
            date: x,
            year: nextYearValue,
            moth: nextMothValue,
          });
          if (nextYearValue == this.chioceYear && nextMothValue == this.chioceMoth && x == this.chioceDate) {
            this.chioceWeek = Math.ceil(this.date.length / 7) - 1;
          }
        }

        this.doTag();
      },
      //初始化周
      initDay() {
        this.day.splice(0, this.day.length)
        for (var x = 0; x < 6; x++) {
          this.day.push({
            index: x,
            type: 'normal'
          })
        }
      }
    },
    mounted() {
      this.initToday();
    }
  }
</script>

<style lang="scss">
  .a-date .date {
    font-size: 0.8rem;
    //height: 400px;
    display: inline-block;
    background-image: url('../../../static/img/date-bg.png');
    background-size: auto 100%;
  }

  .a-date .date {
    padding: 20px;
  }

  .a-date .date .date-top {
    display: flex;
  }

  .a-date .date .date-top {
    color: #E3F2FD;
  }

  .a-date .date .date-top span {
    font-size: 0.8rem;
    text-align: center;
    flex: 1;
  }

  .a-date .date .date-top span span,
  .a-date .date .date-top i {
    cursor: pointer;
  }

  .a-date .date .date-top span span:hover,
  .a-date .date .date-top i:hover {
    color: #6DC9FF;
  }


  .line {
    margin-top: 20px;
    margin-bottom: 10px;
    background-color: #BBDEFB;
    width: 100%;
    height: 1px;
  }

  .a-date .date {
    .bottm-title {
      position: relative;
      width: 100%;
      text-align: center;
      line-height: 2rem;
      font-weight: bold;
      color: #9FA8DA;

      .today {
        position: absolute;
        top: 6px;
        right: 10px;
        border: 1px #dcdcdc solid;
        border-radius: 20px;
        height: 1.2rem;
        width: 1.2rem;
        line-height: 1.2rem;
        color: #dcdcdc;
        font-size: 0.6rem;
        cursor: pointer;
        transition: all 0.2s linear;
      }

      .today:hover {
        border: 1px #FFFFFF solid;
        background: #FFFFFF;
        color: #6DC9FF;
      }
    }

    .date-title {
      display: flex;
      color: #E3F2FD;
    }

    .date-title,
    .date-day .date-day-line {
      padding: 4px;
      font-size: 0.8rem;
    }

    .date-day .date-day-line {
      color: #B0BEC5;
      transition: all 0.3s linear;

      .today {
        background: #59a4d0;
        border-radius: 50%;
        color: #FFFFFF;
      }
    }

    .date-day .date-day-line:hover,
    .date-day .active-week {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 2rem;
    }

    .date-day .date-day-line .now {
      color: #B3E5FC;
    }

    .date-day .date-day-line .tag {
      width: 4px;
      height: 4px;
      border-radius: 4px;
      background-color: #8bffff;
      position: relative;
      left: 1.5rem;
      bottom: 1.7rem;
    }
  }

  .a-date .date .date-title span,
  .a-date .date .date-day .date-day-line span {
    text-align: center;
    height: 2rem;
    width: 2rem;
    line-height: 2rem;
    display: inline-block;
  }

  .a-date .date .date-day .date-day-line span {
    cursor: pointer;
    transition: all 0.3s linear;
  }

  .a-date .date .date-day .date-day-line span:hover,
  .a-date .date .date-day .date-day-line .active {
    background: #6DC9FF;
    border-radius: 50%;
    color: #FFFFFF;
  }
</style>
