<template>
  <v-app>
    <v-main>
    <Menu />

    <v-container class="col-md-10">
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
    //
  }),
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
