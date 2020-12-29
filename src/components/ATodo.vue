<!-- 待完成 -->
<template>
  <div class="a-todo">
    <div class="list" v-show="false">
      <div class="title" style="position: relative;">
        <img src="../assets/a-work-title.png" />
        代办事项
        <span class="fa fa-plus" title="新建任务" @click.stop="add()"></span>
      </div>
      <div class="list">
        <div v-if="list.length==0" class="no-todo">
          暂无任务，<span @click.stop="add()">新建一个</span> 吧
        </div>
        <div class="item" :class="{'on-edit':editIndex==index}" v-for="(item,index) in list" @contextmenu.prevent="showRightMenu($event,index)">
          <span class="item-title">{{item.title}}</span>
          <span class="fa fa-check" title="完成任务"></span>
          <span class="fa fa-trash" title="删除任务" @click="remove(index)"></span>
        </div>
      </div>
      <div class="vpopmenu" v-if="rightMenuStyle.show" :style="{left:rightMenuStyle.left+'px',top:rightMenuStyle.top+'px'}">
        <div @click.stop="edit(editIndex);">
          <i class="fa fa-pencil"></i>
          编辑
        </div>
        <div @click.stop="top(editIndex);">
          <i class="fa fa-arrow-up"></i>
          置顶
        </div>
        <div @click.stop="finish(editIndex);">
          <i class="fa fa-check"></i>
          完成
        </div>
        <div class="delete" @click.stop="remove(editIndex);">
          <i class="fa fa-trash"></i>
          删除
        </div>
      </div>
    </div>
    <div class="add-pane">
      <i class="fa fa-arrow-left"></i>
      <input placeholder="请输入标题,最多20字" class="input-title" />
      <textarea v-model="addWorkForm.detail" placeholder="请输入内容,最多1000字" maxlength="1000" />

    </div>

    <div class="add-dialog" v-if="showAddDialog">
      <div class="input-div" @click.stop="">
        <div class="item">
          <div class="label">标题</div>
          <input v-model="addWorkForm.title" placeholder="请输入标题,最多20字" maxlength="20" />
        </div>
        <div class="item" style="margin-top: 20px;">
          <div class="label">分类 <a style="color: #000066;cursor: pointer;">【新建分类】</a></div>
          <select>
            <option>请选择</option>
            <option>第三方对接</option>
          </select>
        </div>
        <div class="item" style="margin-top: 20px;">
          <div class="label">内容</div>
          <textarea v-model="addWorkForm.detail" placeholder="请输入内容,最多1000字" maxlength="1000" />
          </div>
        <div class="item add-bottom">
          <div class="button" @click="clickOther()">
            <span class="fa fa-times"></span>
            取消
          </div>
          <div class="button" @click="addWork()">
            <span class="fa fa-check"></span>
            添加
          </div>
        </div>
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
        list: [],
        editIndex: -1,
        rightMenuStyle: {
          top: 0,
          left: 0,
          show: false,
        },
        showAddDialog:false,
        addWorkForm:{
          title:'',
          detail:''
        }
      }
    },
    methods: {
      remove(index) {
        this.list.splice(index, 1);
      },
      add() {
         this.showAddDialog = true;
      },
      addWork(){
        if(!this.addWorkForm.title){
          alert("标题不能为空！")
        }else if(!this.addWorkForm.detail){
          alert("内容不能为空！")
        }else{
          this.list.push({
            title: this.addWorkForm.title,
            status: 'todo'
          })
           this.showAddDialog = false;
           this.addWorkForm.title='';
           this.addWorkForm.detail='';
        }
      },
      edit(index) {

      },
      top(index) {

      },
      finish(index) {

      },
      showRightMenu(e, index) {
        this.editIndex = index;
        this.rightMenuStyle.left = e.x;
        this.rightMenuStyle.top = e.y;
        if (e.y + 130 > e.view.innerHeight) {
          this.rightMenuStyle.top = e.view.innerHeight - 130;
        }
        this.rightMenuStyle.show = true
      },
      clickOther() {
        this.rightMenuStyle.show = false;
        this.editIndex = -1;
        this.showAddDialog=false;
      }
    },
    mounted() {

      window.addEventListener("click", this.clickOther);
    },
    beforeDestroy() { // 实例销毁之前对点击事件进行解绑
      window.removeEventListener('click', this.clickOther);
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
    .add-pane{
      .fa-arrow-left {
        color: #607D8B;
        cursor: pointer;
        transition: all 0.1s linear;
      }
      .fa-arrow-left:hover {
        color: #29B6F6;
      }

      input,textarea,select {
        padding: 10px 0;
        font-family: auto;
        color: #546E7A;
        transition: all 0.3s linear;
        box-sizing: border-box;
        margin: 0;
        width: 100%;
        border: none;
        outline: none;
        border-bottom: 1px #CFD8DC solid;
      }
      select{
        line-height: 2rem;
      }
      textarea{
        margin-top: 20px;
        height: 8rem;
        resize: none;
      }
      input:focus,textarea:focus,select:focus {
        border-bottom: 1px #29B6F6 solid;
      }
    }
    .add-dialog {
      width: 100%;
      height: 100%;
      z-index: 99;
      background: rgba(0, 0, 0, 0.5);
      position: fixed;
      top: 0;
      left: 0;

      .input-div {
        box-sizing: border-box;
        padding: 10px;
        background: #FFFFFF;
        border-radius: 4px;
        width: 500px;
        margin: 0 auto;
        margin-top: 100px;
        .add-bottom{
          text-align: right;
          .button{
            margin-right: 10px;
            display: inline;
            cursor: pointer;
            transition: all 0.1s linear;
            color: #78909C;
          }
          .button:hover{
            color: #1976D2;
          }
        }
        .item {
          margin: 10px 0;

          .label {
            font-size: 1rem;
            font-weight: bold;
            color: #3d505a;
            margin-bottom: 4px;
          }

          input,textarea,select {
            font-family: auto;
            color: #546E7A;
            font-size: 1rem;
            transition: all 0.3s linear;
            box-sizing: border-box;
            padding: 4px;
            margin: 0;
            width: 100%;
            border: none;
            outline: none;
            border-bottom: 1px #CFD8DC solid;
          }
          select{
            padding: 4px 0;
            line-height: 2rem;
          }
          textarea{
            height: 8rem;
            resize: none;
          }
          input:focus,textarea:focus,select:focus {
            border-bottom: 1px #29B6F6 solid;
          }
        }
      }
    }

    .vpopmenu {
      position: fixed;
      background: #FFFFFF;
      padding: 10px;
      border-radius: 4px;
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
      transition: display 0.3s linear;

      .fa {
        width: 1.2rem;
      }

      div {
        transition: all 0.2s linear;
        margin: 4px 0;
        cursor: pointer;
        color: #69849B;
      }

      div:hover {
        color: #29B6F6;
      }

      .delete:hover {
        color: #F4511E;
      }
    }

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

      .on-edit {
        color: #5D85A8;
        border-radius: 4px;
        background: #ECEFF1;
      }

      .item:hover {
        color: #5D85A8;
        border-radius: 4px;
        background: #ECEFF1;
      }
    }
  }
</style>
