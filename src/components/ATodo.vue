<!-- 待完成 -->
<template>
  <div class="a-todo">
    <div class="title" style="position: relative;">
      <img src="../assets/a-work-title.png" />
      代办事项
      <span class="fa fa-plus" title="新建任务" ></span>
    </div>
    <div class="list">
      <div v-if="list.length==0" class="no-todo">
        暂无任务，<span @click="add()">新建一个</span> 吧
      </div>
      <div class="item" v-for="(item,index) in list">
        <span class="item-title">{{item.title}}</span>
        <span class="fa fa-check" title="完成任务"></span>
        <span class="fa fa-trash" title="删除任务" @click="remove(index)"></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ATodo',
    components: {},
    data() {
      return {
        list: []
      }
    },
    methods: {
      remove(index) {
        this.list.splice(index, 1);
      },
      add(){
        this.list.push({
          title: '任务标题',
          status: 'todo'
        })
      }
    },
    mounted() {
      for (var i = 0; i < 10; i++) {
        this.list.push({
          title: '任务标题',
          status: 'todo'
        })
      }

    }
  }
</script>

<style lang="scss">
  .a-todo {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #FFFFFF;
    width: 100%;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 0.625rem;

    .title {
      line-height: 2rem;
      text-align: center;
      color: #69849B;
      border-bottom: 1px #a0b2c1 solid;

      .fa-plus {
        position: absolute;
        right: 8px;
        top: 8px;
        cursor: pointer;
        transition: all 0.1s linear;
      }

      .fa-plus:hover {
        color: #29B6F6;
        top: 0.3rem;
        font-size: 1.4rem;
      }
    }

    img {
      height: 0.8rem;
      width: 0.8rem;
      margin-right: 5px;
    }

    .list {
      overflow-y: auto;
      flex: 1;
      padding: 10px 0;

      .no-todo {
        color: #76838F;
        text-align: center;
        margin: 20px 0;

        span {
          color: #1565C0;
          cursor: pointer;
          transition: all 0.3s linear;
        }

        span:hover {
          color: #2196F3;
        }
      }

      .item {
        display: flex;
        color: #98aab8;
        cursor: pointer;
        padding: 0px 10px;
        transition: all 0.3s linear;

        .item-title {
          flex: 1;
        }

        span {
          line-height: 2rem;
        }



        .fa-trash,
        .fa-check {
          text-align: right;
          width: 1.8rem;
        }

        .fa {
          transition: display 3s linear;
          transition: color 0.2s linear;
          transition: font-size 0.1s linear;
        }

        .fa:hover {
          font-size: 1.4rem;
          color: #00897B;
        }

        .fa-trash:hover {
          font-size: 1.4rem;
          color: #F4511E;
        }
      }

      .item:hover {
        color: #5D85A8;
        border-radius: 4px;
        background: #ECEFF1;



      }
    }
  }
</style>
