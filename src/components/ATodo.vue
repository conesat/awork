<!-- 待完成 -->
<template>
  <div class="a-todo">
    <div class="list" :style="{'width':showAdd?'0':'100%'}">
      <div style="width: 252px;height: 100%;">
        <div style="width: 100%;display: flex;flex-direction: column;height: 100%;overflow: hidden;">
          <div class="title" style="position: relative;">
            <span class="fa fa-plus" title="新建任务" @click="add()"></span>
            代办事项
          </div>
          <div class="list">
            <div v-if="list.length==0" class="no-todo">
              暂无任务，<span @click.stop="add()">新建一个</span> 吧
            </div>
            <div class="item" :class="{'on-edit':editIndex==index}" v-for="(item,index) in list" @contextmenu.prevent="showRightMenu($event,index)">
              <span class="item-title" :title="item.title" @click="edit(index)">{{item.title}}</span>
              <span class="fa fa-check" title="完成任务"></span>
              <span class="fa fa-trash" title="删除任务" @click="remove(index)"></span>
            </div>
          </div>
          <div class="vpopmenu" v-if="rightMenuStyle.show" :style="{left:rightMenuStyle.left+'px',top:rightMenuStyle.top+'px'}">
            <div @click="edit(editIndex);">
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
      </div>
    </div>
    <div class="add-pane" :style="{'width':showAdd?'100%':'0'}">
      <div style="width: 252px;display: flex;flex-direction: column;height: 100%;">
        <div class="title" style="position: relative;">
          <span class="fa fa-arrow-left" title="新建任务" @click="closeAdd()"></span>
          新建任务
          <span class="fa fa-check" title="添加" @click="addWork()"></span>
        </div>
        <div style="flex: 1;overflow-y: auto;">
          <input v-model="addWorkForm.title" placeholder="请输入标题,最多20字" class="input-title" />
          <div class="select-type">
            <select v-model="addWorkForm.type">
              <option value="" selected="selected">请选择分类</option>
              <option value="1">第三方对接</option>
            </select>
            <span class="fa fa-plus" title="添加" @click="addWorkType()"></span>
          </div>
          <textarea v-model="addWorkForm.detail" placeholder="请输入内容,最多1000字" maxlength="1000" />

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
        showAdd:false,
        addWorkForm:{
          index:'',
          id:'',
          title:'',
          detail:'',
          status:'',
          type:''
        }
      }
    },
    methods: {
      remove(index) {
        this.list.splice(index, 1);
      },
      add() {
         this.showAdd = true;
      },
      addWorkType(){
        var type=prompt("请输入类型");
      },
      addWork(){
        this.addWorkForm.title=this.addWorkForm.title.trim();
        this.addWorkForm.detail=this.addWorkForm.detail.trim();
        if(!this.addWorkForm.detail){
          alert("内容不能为空！")
        }else{
          if(!this.addWorkForm.title){
            this.addWorkForm.title=this.addWorkForm.detail.substring(0,10)
          }
          if(this.addWorkForm.index+"x" == 'x'){
            this.list.push({
              title:this.addWorkForm.title,
              detail:this.addWorkForm.detail,
              type:this.addWorkForm.type,
              status:this.addWorkForm.status,
            })
          }else {
            this.list.splice(this.addWorkForm.index,1,{
              title:this.addWorkForm.title,
              detail:this.addWorkForm.detail,
              type:this.addWorkForm.type,
              status:this.addWorkForm.status,
            })
          }
          this.showAdd = false;
          this.addWorkForm.index='';
          this.addWorkForm.id='';
          this.addWorkForm.title='';
          this.addWorkForm.detail='';
        }

      },
      closeAdd(){
        this.showAdd = false;
        this.addWorkForm.index='';
        this.addWorkForm.id='';
        this.addWorkForm.title='';
        this.addWorkForm.detail='';
      },
      edit(index) {
        this.addWorkForm={
          index:index,
          id:this.list[index].id,
          title:this.list[index].title,
          detail:this.list[index].detail,
          status:this.list[index].status,
          type:this.list[index].type
        };
        this.showAdd = true;
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
    position: relative;
    transition: all 0.1s linear;
    overflow: hidden;
    display: flex;
    height: 100%;
    background-color: #FFFFFF;
    width: 100%;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 0.625rem;

    .add-pane{
      overflow: hidden;
      transition: all 0.2s linear;
      width: 0;
      padding: 10px 0;

      .select-type{
        display: flex;
        .fa-plus{
           transition: all 0.2s linear;
          cursor: pointer;
          line-height: 2.4rem;
          width: 3rem;
          text-align: center;
          color: #90A4AE;
        }
        .fa-plus:hover{
          color: #29B6F6;
        }
      }
      .add-bottom{
        width: 100%;
        text-align: right;
        display: flex;
      }
      .title{
        margin-bottom: 10px;
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
        min-height: 3rem;
        max-height: 8rem;
        resize: vertical;
      }
      input:focus,textarea:focus,select:focus {
        border-bottom: 1px #29B6F6 solid;
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

      .fa-plus,.fa-arrow-left {
        position: absolute;
        left: 8px;
        top: 8px;
        cursor: pointer;
        transition: all 0.1s linear;
      }

      .fa-check{
        color: #2E7D32;
        position: absolute;
        right: 8px;
        top: 8px;
        cursor: pointer;
        transition: all 0.1s linear;
      }

      .fa-plus:hover,.fa-arrow-left:hover,.fa-check:hover {
        color: #29B6F6;
      }

      .fa-check:hover {
        color: #43A047;
      }
    }

    img {
      height: 0.8rem;
      width: 0.8rem;
      margin-right: 5px;
    }

    .list {
      transition: all 0.2s linear;
      width: 100%;
      overflow-y: auto;
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
          white-space:nowrap;/* 规定文本是否折行 */
          overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
          text-overflow: ellipsis;
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
