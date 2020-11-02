<template>
      <v-data-table
    :headers="headers"
    :items="frotaList"
    :search="search"
    :loading="isLoading"
    no-data-text="Você não tem permissão nesta página."
    sort-by="placa"
    class="elevation-1"
    loading-text="Pesquisando registros, por favor aguarde..."
  >
    <template v-slot:top>
      <v-toolbar
        flat
        color="blue lighten-4"
      >
        <v-toolbar-title>
          <v-icon>directions_bus</v-icon>
          Cadastro Frotas
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

                      <v-col>
                        <v-text-field
                          name="placa"
                          label="Placa"
                          :disabled="!isUpdating"
                          :error-messages="placaErrors"
                          :counter="10"
                          v-model.trim="$v.frota.placa.$model"
                        ></v-text-field>
                      </v-col>

                    </v-row>
                
                    <v-row>
                        <v-col>
                        <v-text-field
                          name="descricao"
                          label="Descrição"
                          :error-messages="descricaoErrors"
                          :counter="100"
                          v-model.trim="$v.frota.descricao.$model"
                        ></v-text-field>
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
              <v-card-text>Deseja excluir frota {{frota.placa}} ?
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
        @click="editFrota(item)"
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
        @click="GetFrotas()"
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
        frotaList: [],
        headers: [
        { text: 'Placa', value: 'placa' },
        { text: 'Descrição', value: 'descricao' },
        { text: '', value: 'actions', sortable: false, align: 'end' }
        ],
        editedIndex: -1,
        frota: {
            placa: '',
            descricao: ''
        },
        msgErroGenerica: 'Ocorreu um erro durante o processo. Tente novamente mais tarde.',
        responseGet: ''
    }),

    mounted () {
        this.GetFrotas()
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    computed: {
        geTitulo () {
            if (this.isDelete) {
                return 'Excluir Frota'
            } else {
                return this.editedIndex === -1 ? 'Novo Frota' : 'Editar Frota'
            }
        },

        getMsgNoData () {
          return this.responseGet
        },

        isUpdating () {
            return this.editedIndex === -1
        },

        placaErrors () {
            const errors = []
            const placa = this.$v.frota.placa
            
            if (!placa.$dirty) {
                return errors
            }

            !placa.required && errors.push('Placa obrigatória')
            !placa.maxLength && errors.push(`Placa deve ter no máximo ${placa.$params.maxLength.max} caracteres`)

            return errors
        },

        descricaoErrors () {
            const errors = []
            const descricao = this.$v.frota.descricao

            if (!descricao.$dirty) {
                return errors
            }
            
            !descricao.required && errors.push('Descrição obrigatória')
            !descricao.maxLength && errors.push(`Descrição deve ter no máximo ${descricao.$params.maxLength.max} caracteres`)

            return errors
        }
    },

    validations () {
      const validations = {
        frota: {
          placa: {
            required,
            maxLength: maxLength(10)
          },
          descricao: {
            required,
            maxLength: maxLength(100)
          }
        }
      }

      return validations
    },

    methods: {
        async GetFrotas () {
            this.isLoading = true

            let response = ''
            
            try {
              response = await service.getFrota()
              this.frotaList = response.data
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
            this.frota = Object.assign({}, { placa: '', descricao: '' })
            this.$v.$reset()
            this.editedIndex = -1
          })
        },

        editFrota (item) {
          this.editedIndex = this.frotaList.indexOf(item)
          this.frota = Object.assign({}, item)
          this.dialog = true
        },

        async save () {
          if (this.editedIndex === -1) {
            service.postFrota(this.frota).then((response) => {
              this.frotaList.push(response.data.data)

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
            service.putFrota(this.frota).then((response) => {
              const indice = this.frotaList.findIndex(c => c.id === response.data.data.id)

              if (indice !== undefined) {
                this.frotaList.splice(indice, 1, this.frota)

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
          service.deleteFrota(this.frota).then(() => {
            const indice = this.frotaList.findIndex(c => c.id === this.frota.id)

            if (indice !== undefined) {
                this.frotaList.splice(indice, 1)

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
          this.frota = Object.assign({}, item)
          this.isDelete = true
          this.dialog = true
        }
    }
}
</script>>