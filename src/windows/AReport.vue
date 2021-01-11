<template>
  <div class="a-report">
     <div class="date-div">
      <div class="top">
        <ADate></ADate>
      </div>
      <div class="bottom">
        <ATodo></ATodo>
      </div>
    </div>
    <div class="plan-right">
      <APlane></APlane>
    </div>
  </div>
</template>


<script>

  import ADate from '@/components/ADate'
  import APlane from '@/components/APlane'
  import ATodo from '@/components/ATodo'
  export default {
    components: {
      ADate,
      APlane,
      ATodo
    },
    data() {
      return {

      }
    },
    methods: {

    },
    mounted() {
      
    }
  }
</script>

<style lang="scss">
  .a-report {
    width: 0;
    display: flex;
    box-sizing: border-box;
    height: 100%;
    padding: 6px;

    .plan-right {
      background: #FFFFFF;
      border-radius: 6px;
      flex: 1;
      height: 100%;
      margin-left: 10px;
      overflow: auto;
    }

    .plan-right:hover {
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
    }

    .date-div {
      width: 272px;
      height: 100%;
      display: flex;
      flex-direction: column;

      .top {
        overflow: hidden;
        border-radius: 6px;
        transition: all 0.2s linear;
      }

      .bottom {
        flex: 1;
        margin-top: 10px;
        overflow: hidden;
        border-radius: 6px;
        transition: all 0.2s linear;
      }

      .bottom:hover,
      .top:hover {
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
      }
    }

    .menu-left {
      margin-right: 10px;
    }
  }
</style>
