<script>
  import Vue from 'vue';
  import Vuex from 'vuex';

  Vue.use(Vuex);

  const theme = {
    bgColor: '#9d9d9d',
    bgColor1: '#9d9d9d',
    bfColor: '#9d9d9d',
    normalFontColor: '#9d9d9d',
    activeFontColor: '#9d9d9d',
  }
  const mutations = {
    setBgColor(theme, bgColor) {
      theme.bgColor = bgColor;
    }
  }

  export default new Vuex.Store({
    theme,
    mutations
  });
</script>
