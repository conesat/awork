<template>
  <div class="index">
    <div class="menu-left">
      <div class="top">
        <ADate></ADate>
      </div>
      <div class="bottom">
        <ATodo></ATodo>
      </div>

    </div>
    <div class="plan-right">

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
  html {
    background-color: #ECEFF1;
    -webkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    overflow: hidden;

    .index {
      height: 100%;
    }

    .menu-left {
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
        margin-bottom: 20px;
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
  }
</style>
