<template>
  <v-app>
    <div>
      <v-app-bar
        color="deep-purple accent-4"
        
        dark
      >

      <v-img
          contain
          lazy-src="./assets/logo_size.jpg"
          max-height="100"
          max-width="100"
          src="./assets/logo_size.jpg"
        ></v-img>
        <!-- <v-img src="./assets/logo_size.jpg" ></v-img> -->
        <v-toolbar-title class="ml-2">Controle Cargas</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon class="ml-2 mr-5">
          Movimento
        </v-btn>

        <v-divider
          class="mx-4"
          vertical
        ></v-divider>

        <v-menu
          open-on-hover
          offset-y
          :rounded="rounded"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              v-bind="attrs"
              v-on="on" 
              icon 
              class="ml-2 mr-2 white--text ma-8">
              Cliente
            </v-btn>
          </template>

          <v-list>
            <v-list-item link>
              <v-list-item-title>Cliente</v-list-item-title>
            </v-list-item>

            <v-divider class="ml-2 mr-2"></v-divider>

            <v-list-item link>
              <v-list-item-title>Produto</v-list-item-title>
            </v-list-item>

            <v-divider class="ml-2 mr-2"></v-divider>

            <v-list-item link>
              <v-list-item-title>Cliente X Produto</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-divider
          class="mx-4"
          vertical
        ></v-divider>

        <v-btn icon class="ml-2 mr-2">
          Frota
        </v-btn>

        <v-divider
          class="mx-4"
          vertical
        ></v-divider>

        <v-btn icon class="ml-2 mr-2">
          Coletor
        </v-btn>

        <v-divider
          class="mx-4"
          vertical
        ></v-divider>

        <v-menu
          open-on-hover
          offset-y
          :rounded="rounded"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              icon 
              class="ml-2 mr-2"
              v-bind="attrs"
              v-on="on" >
              <v-icon>account_circle</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item link>
              <v-list-item-title>Usuario</v-list-item-title>
            </v-list-item>

            <v-divider class="ml-2 mr-2"></v-divider>

            <v-list-item link>
              <v-list-item-title>Logoff</v-list-item-title>
            </v-list-item>
          </v-list>

        </v-menu>

      </v-app-bar>
    </div>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {

  },

  data: () => ({
    //
  }),
};
</script>
