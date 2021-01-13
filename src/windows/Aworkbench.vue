<template>
  <div class="a-workbench">
    <div class="left">

    </div>
    <div class="right">
      <div class="top">
        <img src="../assets/logo.png" height="48px" />
      </div>
      <div class="center">
        <div class="apps">
          <div class="item" v-for="(app,index) in apps">
            <div class="card">
              <div class="bg"></div>
              <div class="bottom-info">
                <span class="title">
                  {{app.name}}
                </span>
                <div class="info">
                  {{app.info}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list-pop">

        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        apps: [{
          name: 'Url转Json',
          img: 'apps/UrlToJson/assets/logon.png',
          info: '编码后的Url直接转换Json'
        }]
      }
    },
    methods: {

    },
    mounted() {

    }
  }
</script>

<style lang="scss">
  .a-workbench {
    height: 100%;
    background: 100%;
    display: flex;
    background-color: #06091d;
    background-image: linear-gradient(#06091d, #040a1d);
    padding: 3rem;
    box-sizing: border-box;

    .right {
      padding: 2rem;
      flex: 1;
      display: flex;
      flex-direction: column;

      .top {
        height: 3rem;
        width: 100%;

      }

      .center {
        flex: 1;
        height: 100%;
        overflow-y: auto;

      }
    }

    .left {
      background: #9E9E9E;
      width: 3rem;
    }
  }

  .a-workbench {
    .apps {
      padding-top: 30px;
      display: table;
      margin: 0 auto;
      width: 70%;

      .item {
        border-radius: 0.4rem;
        overflow: hidden;
        cursor: pointer;
        display: inline-block;
        height: 10rem;
        width: 25%;
        padding: 16px;
        box-sizing: border-box;
        transition: all 0.2s cubic-bezier(1, -0.7, 0, 2);

        .card {
          position: relative;
          transition: all 0.1s ease;
          width: 100%;
          height: 100%;

          .bg {
             transition: all 0.2s ease-in-out;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            background-image: url(../assets/apps/urlToJson.png);
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }


          .bottom-info {
            transition: all 0.2s ease-in-out;
            background: rgba(0, 0, 0, 0.5);
            font-size: 0.8rem;
            line-height: 1.6rem;
            height: 1.8rem;
            text-align: center;
            position: absolute;
            width: 100%;
            bottom: 0;
            color: #FFFFFF;
            overflow: hidden;
            .info {
              padding: 1rem;
              box-sizing: border-box;
            }
          }
        }
      }

      .item:hover {
        box-shadow: 0 0 20px rgba(155, 209, 255, 0.5);
        border-radius: 0.4rem;
        padding: 0;
        .card {
          border-radius: 0.4rem;
          .bg {
            -webkit-filter: blur(5px);
            -moz-filter: blur(5px);
            -ms-filter: blur(5px);
            -o-filter: blur(5px);
            filter: blur(5px);
            filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false);
          }
          .bottom-info {
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            .title {
              font-size: 1rem;
              line-height: 2rem;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 1600px) {
    .a-workbench {
      .center {
        .apps {
          display: table;
          margin: 0 auto;
          width: 70%;

          .item {
            display: inline-block;
            height: 10rem;
            width: 33%;
          }
        }
      }
    }
  }

  @media screen and (max-width: 900px) {
    .a-workbench {
      .center {
        .apps {
          display: table;
          margin: 0 auto;
          width: 80%;

          .item {
            display: inline-block;
            height: 8rem;
            width: 50%;
          }
        }
      }
    }
  }
</style>
