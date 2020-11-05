<template>
  <!--O fill-height se transformará numa classe css, que irá fazer com que o "container" ocupe todo o espaço da tela-->
  <v-container fill-height>
    <v-layout
      justify-center
      align-center
    >
      <!-- as classes xs, sm, etc, são breackpoints de tamanho de tela, no caso, diz, que quando for xs, ocupa 12 posições na tela, etc -->
      <v-flex
        xs12
        sm12
        md12
        lg6
        xl4
      >
        <v-card class="elevation-12">
          <v-toolbar
            color="primary"
            dark
          >

            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <div class="row">
              <div class="col-md-9">
                <v-form>
                  <v-text-field
                    prepend-icon="person"
                    name="login"
                    label="Login"
                    type="name"
                    :error-messages="loginErrors"
                    v-model.trim="$v.user.login.$model"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="lock"
                    name="password"
                    label="Senha"
                    type="password"
                    :error-messages="passwordErrors"
                    v-model.trim="$v.user.password.$model"
                  ></v-text-field>
                </v-form>
              </div>
              <div class="col-md-3 centralizarImagem">
                <img
                  alt="Assiste logo"
                  src="./../../assets/login.png"
                >
              </div>
            </div>
            <div>
              <v-alert
                v-if="error && showAlert"
                border="left"
                dense
                outlined
                type="error"
                dismissible
                v-model="showAlert"
              >
                <div v-if="error.length">
                  <ul id="listErrors">
                    <li
                      v-for="(item, index) in error"
                      :key="index"
                    >{{item}}</li>
                  </ul>
                </div>
                <div v-else>

                </div>
              </v-alert>
            </div>
            <v-btn
              block
              color="primary"
              large
              :disabled="$v.$invalid"
              :loading="isLoading"
              @click="submit"
              @keyup.enter="submit"
            >Entrar</v-btn>
          </v-card-text>

        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>

import { mapActions } from 'vuex'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data: () => ({
    isLoading: false,
    error: [],
    showAlert: false,
    user: {
      login: '',
      password: '',
    }
  }),
  computed: {
    loginErrors () {
      const errors = []
      const login = this.$v.user.login

      if (!login.$dirty) {
        return errors
      }

      !login.required && errors.push('Login obrigatório!')
      !login.minLength && errors.push(`Insira pelo menos ${login.$params.minLength.min} caracteres`)
      !login.maxLength && errors.push(`Login deve ter no máximo ${login.$params.maxLength.max} caracteres`)
      return errors
    },
    passwordErrors () {
      const errors = []
      const password = this.$v.user.password

      if (!password.$dirty) {
        return errors
      }

      !password.required && errors.push('Senha obrigatória!')
      !password.minLength && errors.push(`Insira pelo menos ${password.$params.minLength.min} caracteres`)
      !password.maxLength && errors.push(`Senha deve ter no máximo ${password.$params.maxLength.max} caracteres`)
      return errors
    }
  },
  validations () {
    const validations = {
      user: {
        login: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(10)
        },
        password: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(10)
        }
      }
    }

    return validations 
  },
  methods: {
    ...mapActions('auth', ['ActionDoLogin']),

    async submit () {
      this.isLoading = true
      this.showAlert = false
      this.error = []

        try {
            await this.ActionDoLogin(this.user)

            this.$router.push({ name: 'home' })
        } catch (error) {
            this.showAlert = true

            if (error.response && error.response.data) {
            for (var msg1 in error.response.data.errors) {
                this.error.push(error.response.data.errors[msg1])
            }
            } else {
            this.error.push('Não foi possível fazer login, tente novamente.')
            }
        } finally {
            this.isLoading = false
        }
      
    }
  }
}
</script>

<style scoped>
.centralizarImagem {
  display: flex;
  display: -webkit-flex; /* Garante compatibilidade com navegador Safari. */

  justify-content: center;
  align-items: center;
}

.centralizarImagem img {
  width: 100px;
  height: 100px;
  overflow: hidden;
}
</style>
