<template>
        <div>
      <v-app-bar
        color="deep-purple accent-4"
        
        dark
      >

      <v-img
          contain
          lazy-src="../../assets/logo_size.jpg"
          max-height="100"
          max-width="100"
          src="../../assets/logo_size.jpg"
        ></v-img>
        <!-- <v-img src="./assets/logo_size.jpg" ></v-img> -->
        <v-toolbar-title class="ml-2">Controle Cargas</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon class="ml-2 mr-5" :exact="true" to="/movimento">
          Movimento
        </v-btn>

        <v-divider
          class="mx-4"
          vertical
        ></v-divider>

        <v-menu
          open-on-hover
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              v-bind="attrs"
              v-on="on" 
              icon 
              class="ml-2 mr-2 white--text ma-8"
              :exact="true">
              Cliente
            </v-btn>
          </template>

          <v-list>
            <v-list-item link :exact="true" to="/cliente">
              <v-list-item-title>Cliente</v-list-item-title>
            </v-list-item>

            <v-divider class="ml-2 mr-2"></v-divider>

            <v-list-item link :exact="true" to="/produto">
              <v-list-item-title>Produto</v-list-item-title>
            </v-list-item>

            <v-divider class="ml-2 mr-2"></v-divider>

            <v-list-item link :exact="true" to="/clienteProduto">
              <v-list-item-title>Cliente X Produto</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-divider
          class="mx-4"
          vertical
        ></v-divider>

        <v-btn icon class="ml-2 mr-2" to="/frota" :exact="true">
          Frota
        </v-btn>

        <v-divider
          class="mx-4"
          vertical
        ></v-divider>

        <v-btn icon class="ml-2 mr-2" to="/coletor" :exact="true">
          Coletor
        </v-btn>

        <v-divider
          class="mx-4"
          vertical
        ></v-divider>

        <v-menu
          open-on-hover
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              icon 
              class="ml-2 mr-2"
              v-bind="attrs"
              v-on="on" 
              :exact="true">
              <v-icon>account_circle</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item link :exact="true" to="/usuario">
              <v-list-item-title>Usuario</v-list-item-title>
            </v-list-item>

            <v-divider class="ml-2 mr-2"></v-divider>

            <v-list-item link :exact="true">
              <v-list-item-title @click="doLogoff">Logoff</v-list-item-title>
            </v-list-item>
          </v-list>

        </v-menu>

      </v-app-bar>
    </div>
</template>

<script>

import { mapActions } from 'vuex'

export default {
    name: "Menu",

    methods: {
      ...mapActions('auth', ['ActionSignOut']),

      doLogoff () {
        this.ActionSignOut()
        this.$router.push({ name: 'login' })
      }
    }
}
</script>

<style>

</style>