<template>
      <v-data-table
    :headers="headers"
    :items="usuarioList"
    :search="search"
    :loading="isLoading"
    no-data-text="Você não tem permissão nesta página."
    sort-by="codigo"
    class="elevation-1"
    loading-text="Pesquisando registros, por favor aguarde..."
  >
    <template v-slot:top>
      <v-toolbar
        flat
        color="blue lighten-4"
      >
        <v-toolbar-title>
          <v-icon>supervisor_account</v-icon>
          Cadastro Usuários
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-dialog
          v-model="dialog"
          persistent
          max-width="800px"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-on="on"
            >Novo</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{geTitulo}}</span>
            </v-card-title>

            <div v-if="!isDelete">
              <v-form @submit.prevent="save">
                <v-card-text>

                  <v-container>
                    <v-row>

                      <v-col cols="4">
                        <v-text-field
                          name="codigo"
                          label="Código"
                          :disabled="!isUpdating"
                          :error-messages="codigoErrors"
                          :counter="5"
                          v-model.trim="$v.usuario.codigo.$model"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="8">
                        <v-text-field
                          name="nome"
                          label="Nome"
                          :error-messages="nomeErrors"
                          :counter="50"
                          v-model.trim="$v.usuario.nome.$model"
                        ></v-text-field>
                      </v-col>

                    </v-row>
                
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          name="login"
                          label="Login"
                          :error-messages="loginErrors"
                          :counter="10"
                          v-model.trim="$v.usuario.login.$model"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="6">
                        <v-text-field
                          name="senha"
                          label="Senha"
                          :type="'password'"
                          :error-messages="loginErrors"
                          :counter="10"
                          v-model.trim="$v.usuario.senha.$model"
                        ></v-text-field>
                        {{showPassword}}
                      </v-col>
                    </v-row>

                  </v-container>
                  
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="red darken-1"
                    text
                    @click="close()"
                  >Cancelar</v-btn>
                  <v-btn
                    type="submit"
                    color="blue darken-1"
                    text
                    :disabled="$v.$invalid"
                  >Salvar</v-btn>
                </v-card-actions>

              </v-form>
            </div>
            <div v-else>
              <v-card-text>Deseja excluir usuario {{usuario.nome}} ?
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red darken-1"
                  text
                  @click="close()"
                >Não</v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="deleteItem()"
                >Sim</v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </v-dialog>

      </v-toolbar>

      <v-card flat>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Pesquisar"
            single-line
            hide-details
            dense
          ></v-text-field>
        </v-card-title>
      </v-card>

    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editUsuario(item)"
      >
        edit
      </v-icon>
      <v-icon
        small
        @click="configIsDelete(item)"
      >
        delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        v-if="responseGet !== '401'"
        color="primary"
        @click="GetUsuarios()"
      >Reset</v-btn>
    </template>

  </v-data-table>
</template>>

<script>

import { required, maxLength } from 'vuelidate/lib/validators'
import service from './service'

export default {
    data: () => ({
        search: '',
        dialog: false,
        isDelete: false,
        isLoading: false,
        usuarioList: [],
        headers: [
        { text: 'Código', value: 'codigo' },
        { text: 'Nome', value: 'nome' },
        { text: 'Login', value: 'login' },
        { text: '', value: 'actions', sortable: false, align: 'end' }
        ],
        editedIndex: -1,
        usuario: {
            codigo: '',
            nome: '',
            login: '',
            senha: ''
        },
        msgErroGenerica: 'Ocorreu um erro durante o processo. Tente novamente mais tarde.',
        responseGet: '',
        showPassword: false
    }),

    mounted () {
        this.GetUsuarios()
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    computed: {
        geTitulo () {
            if (this.isDelete) {
                return 'Excluir Usuário'
            } else {
                return this.editedIndex === -1 ? 'Novo Usuário' : 'Editar Usuário'
            }
        },

        getMsgNoData () {
          return this.responseGet
        },

        isUpdating () {
            return this.editedIndex === -1
        },

        codigoErrors () {
            const errors = []
            const codigo = this.$v.usuario.codigo
            
            if (!codigo.$dirty) {
                return errors
            }

            !codigo.required && errors.push('Código obrigatório')
            !codigo.maxLength && errors.push(`Código deve ter no máximo ${codigo.$params.maxLength.max} caracteres`)

            return errors
        },

        nomeErrors () {
            const errors = []
            const nome = this.$v.usuario.nome

            if (!nome.$dirty) {
                return errors
            }
            
            !nome.required && errors.push('Nome obrigatória')
            !nome.maxLength && errors.push(`Nome deve ter no máximo ${nome.$params.maxLength.max} caracteres`)

            return errors
        },

        loginErrors () {
            const errors = []
            const login = this.$v.usuario.login

            if (!login.$dirty) {
                return errors
            }
            
            !login.required && errors.push('Login obrigatória')
            !login.maxLength && errors.push(`Login deve ter no máximo ${login.$params.maxLength.max} caracteres`)

            return errors
        },

        senhaErrors () {
            const errors = []
            const senha = this.$v.usuario.senha

            if (!senha.$dirty) {
                return errors
            }
            
            !senha.required && errors.push('Senha obrigatória')
            !senha.maxLength && errors.push(`Senha deve ter no máximo ${senha.$params.maxLength.max} caracteres`)

            return errors
        }
    },

    validations () {
      const validations = {
        usuario: {
          codigo: {
            required,
            maxLength: maxLength(5)
          },
          nome: {
            required,
            maxLength: maxLength(100)
          },
          login: {
            required,
            maxLength: maxLength(10)
          },
          senha: {
            required,
            maxLength: maxLength(10)
          }
        }
      }

      return validations
    },

    methods: {
        async GetUsuarios () {
            this.isLoading = true

            let response = ''
            
            try {
              response = await service.getUsuario()
              this.usuarioList = response.data
            } catch (error) {
              if (error.response.status && error.response.status === 401) {
                this.responseGet = '401'
              } else {
                this.responseGet = ''
              }
            }

            this.isLoading = false
        },

        close () {
          this.dialog = false
          this.isDelete = false
          this.$nextTick(() => {
            this.usuario = Object.assign({}, { codigo: '', nome: '', login: '', senha: '' })
            this.$v.$reset()
            this.editedIndex = -1
          })
        },

        editUsuario (item) {
          this.editedIndex = this.usuarioList.indexOf(item)
          this.usuario = Object.assign({}, item)
          this.dialog = true
        },

        async save () {
          if (this.editedIndex === -1) {
            service.postUsuario(this.usuario).then((response) => {
              this.usuarioList.push(response.data.data)

              this.close()

              this.$toasted.global.toaster_crud_success({
                message: 'incluido'
              })
            }).catch((error) => {
              if (error.response.data.errors) {
                error.response.data.errors.forEach(erro => {
                  this.$toasted.global.toaster_error({
                    message: erro
                  })
                })
              }
            })
          }
          else {
            service.putUsuario(this.usuario).then((response) => {
              const indice = this.usuarioList.findIndex(c => c.id === response.data.data.id)

              if (indice !== undefined) {
                this.usuarioList.splice(indice, 1, this.usuario)

                this.close()

                this.$toasted.global.toaster_crud_success({
                  message: 'alterado'
                })
              }
              else {
                this.$toasted.global.toaster_error({
                  message: 'Indice não encontrado para alteração.'
                })
              }
            }).catch((error) => {
              if (error.response.data.errors) {
                error.response.data.errors.forEach(erro => {
                  this.$toasted.global.toaster_error({
                    message: erro
                  })
                })
              }
            })
          }
        },

        deleteItem () {
          service.deleteUsuario(this.usuario).then(() => {
            const indice = this.usuarioList.findIndex(c => c.id === this.usuario.id)

            if (indice !== undefined) {
                this.usuarioList.splice(indice, 1)

                this.close()

                this.$toasted.global.toaster_crud_success({
                  message: 'excluido'
                })
              }
              else {
                this.$toasted.global.toaster_error({
                  message: 'Indice não encontrado para alteração.'
                })
              }
          }).catch((error) => {
            if (error.response.data.errors) {
              error.response.data.errors.forEach(erro => {
                this.$toasted.global.toaster_error({
                  message: erro
                })
              })
            }

            this.close()
          })
        },

        configIsDelete (item) {
          this.usuario = Object.assign({}, item)
          this.isDelete = true
          this.dialog = true
        }
    }
}
</script>>