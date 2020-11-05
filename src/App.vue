<template>
  <v-app>
    <v-main>

      <Menu v-if="!isLogin"/>

      <v-container :class="{'fill-height': isLogin, 'col-md-10': !isLogin}">
        <router-view />
      </v-container>

    </v-main>
  </v-app>
</template>

<script>

import Menu from './components/menu/Menu'

export default {
  name: 'App',

  components: {
    Menu
  },

  data: () => ({

  }),

  computed: {
    isLogin () {
      return this.$route.path.indexOf('/login') !== -1
    }
  }
};
</script>

<style scoped>
#app {
  background-color: #f5f5f5;
  background-size: cover;
  overflow: hidden;
}

.div1 {
  background-color: red;
}
</style>
