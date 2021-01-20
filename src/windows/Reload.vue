<template>
  <div class="reload-main">
    <div class="preloader">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="preloader text">正在加载</div>
  </div>
</template>

<script>
</script>

<style>
  .preloader.text{
    left: calc(50% - 4px);
    top: calc(50% - 50px);
    color: #69849B;
  }
  .preloader {
    left: 50%;
    top: calc(50% - 100px);
    position: relative;
  }

  .preloader span {
    display: block;
    bottom: 0px;
    width: 9px;
    height: 5px;
    background: #9b59b6;
    position: absolute;
    animation: preloader 1.5s infinite ease-in-out;
  }

  .preloader span:nth-child(2) {
    left: 11px;
    animation-delay: .2s;
  }

  .preloader span:nth-child(3) {
    left: 22px;
    animation-delay: .4s;
  }

  .preloader span:nth-child(4) {
    left: 33px;
    animation-delay: .6s;
  }

  .preloader span:nth-child(5) {
    left: 44px;
    animation-delay: .8s;
  }

  @keyframes preloader {
    0% {
      height: 5px;
      transform: translateY(0px);
      background: #9b59b6;
    }

    25% {
      height: 30px;
      transform: translateY(15px);
      background: #3498db;
    }

    50% {
      height: 5px;
      transform: translateY(0px);
      background: #9b59b6;
    }

    100% {
      height: 5px;
      transform: translateY(0px);
      background: #9b59b6;
    }
  }
</style>
