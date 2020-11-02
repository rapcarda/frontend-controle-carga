<template>
      <v-data-table
    :headers="headers"
    :items="coletorList"
    :search="search"
    :loading="isLoading"
    no-data-text="Você não tem permissão nesta página."
    sort-by="numero"
    class="elevation-1"
    loading-text="Pesquisando registros, por favor aguarde..."
  >
    <template v-slot:top>
      <v-toolbar
        flat
        color="blue lighten-4"
      >
        <v-toolbar-title>
          <v-icon>mobile_screen_share</v-icon>
          Cadastro Coletores
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

                      <v-col cols="9">
                        <v-text-field
                          name="numero"
                          label="Número"
                          :disabled="!isUpdating"
                          :error-messages="numeroErrors"
                          :counter="3"
                          v-model.trim="$v.coletor.numeroText.$model"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="3">
                        <v-switch
                            v-model="status"
                            label="Status"
                            inset
                        ></v-switch>
                      </v-col>

                    </v-row>
                
                    <v-row>
                        <v-col>
                        <v-text-field
                          name="observacao"
                          label="Observação"
                          :error-messages="obsErrors"
                          :counter="250"
                          v-model.trim="$v.coletor.observacao.$model"
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
              <v-card-text>Deseja excluir coletor {{coletor.numero}} ?
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
        @click="editColetor(item)"
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
        @click="GetCidades()"
      >Reset</v-btn>
    </template>

  </v-data-table>
</template>>

<script>

import { required, maxLength, numeric } from 'vuelidate/lib/validators'
import service from './service'

export default {
    data: () => ({
        search: '',
        dialog: false,
        isDelete: false,
        isLoading: false,
        coletorList: [],
        headers: [
        { text: 'Número', value: 'numero' },
        { text: 'Status', value: 'statusText' },
        { text: 'Observação', value: 'observacao' },
        { text: '', value: 'actions', sortable: false, align: 'end' }
        ],
        editedIndex: -1,
        coletor: {
            numeroText: '',
            numero: 0,
            observacao: '',
            status: '',
            statusText: ''
        },
        status: true,
        msgErroGenerica: 'Ocorreu um erro durante o processo. Tente novamente mais tarde.',
        responseGet: ''
    }),

    mounted () {
        this.GetColetores()
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    computed: {
        geTitulo () {
            if (this.isDelete) {
                return 'Excluir Coletor'
            } else {
                return this.editedIndex === -1 ? 'Novo Coletor' : 'Editar Coletor'
            }
        },

        isUpdating () {
            return this.editedIndex === -1
        },

        numeroErrors () {
            const errors = []
            const numero = this.$v.coletor.numeroText
            if (!numero.$dirty) {
                return errors
            }

            !numero.required && errors.push('Número obrigatório')
            !numero.numeric && errors.push('Número deve conter apenas números!')
            !numero.maxLength && errors.push(`Número deve ter no máximo ${numero.$params.maxLength.max} caracteres`)

            return errors
        },

        obsErrors () {
            const errors = []
            const observacao = this.$v.coletor.observacao

            if (!observacao.$dirty) {
                return errors
            }

            !observacao.maxLength && errors.push(`Observação deve ter no máximo ${observacao.$params.maxLength.max} caracteres`)

            return errors
        },

        statusErrors () {
            const errors = []
            const status = this.$v.coletor.status

            if (!status.$dirty) {
                return errors
            }

            !status.required && errors.push('Status obrigatório')

            return errors
        },
    },

    validations () {
      const validations = {
        coletor: {
          numeroText: {
            required,
            maxLength: maxLength(3),
            numeric
          },
          observacao: {
            maxLength: maxLength(250)
          }
        }
      }

      return validations
    },

    methods: {
        async GetColetores () {
            this.isLoading = true

            let response = ''
            
            try {
              response = await service.getColetor()
              this.coletorList = response.data

              this.coletorList.forEach(item => {
                item.statusText = this._getStatusText(item)
                item.numeroText = item.numero
              })
            } catch (error) {
              if (error.response.status && error.response.status === 401) {
                this.responseGet = '401'
              } else {
                this.responseGet = ''
              }
            }

            // const response = await service.getColetor()
            // this.coletorList = response.data

            // this.coletorList.forEach(item => {
            //   item.statusText = this._getStatusText(item)
            //   item.numeroText = item.numero
            // })

            this.isLoading = false
        },

        close () {
          this.dialog = false
          this.isDelete = false
          this.$nextTick(() => {
            this.coletor = Object.assign({}, { numero: 0, numeroText: '', status: '', statusText: '', observacao: '' })
            this.status = ''
            this.$v.$reset()
            this.editedIndex = -1
          })
        },

        editColetor (item) {
          item.numeroText = item.numero.toString();
          this.status = item.status === 0 ? true : false
          this.editedIndex = this.coletorList.indexOf(item)
          this.coletor = Object.assign({}, item)
          this.dialog = true
        },

        async save () {
          this.coletor.status = this.status ? 0 : 1
          
          try {
            this.coletor.numero = parseInt(this.coletor.numeroText)
          } catch (error) {
            this.$toasted.global.toaster_error({
                message: 'Número inválido'
            })
            return
          }
          if (this.editedIndex === -1) {
            service.postColetor(this.coletor).then((response) => {
              this.coletorList.push(response.data.data)

              this.coletorList.forEach(item => {
                item.statusText = this._getStatusText(item)
              })

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
            service.putColetor(this.coletor).then((response) => {
              const indice = this.coletorList.findIndex(c => c.id === response.data.data.id)

              if (indice !== undefined) {
                this.coletorList.splice(indice, 1, this.coletor)

                this.coletorList.forEach(item => {
                  item.statusText = this._getStatusText(item)
                })

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
          service.deleteColetor(this.coletor).then(() => {
            const indice = this.coletorList.findIndex(c => c.id === this.coletor.id)

            if (indice !== undefined) {
                this.coletorList.splice(indice, 1)

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
          this.coletor = Object.assign({}, item)
          this.isDelete = true
          this.dialog = true
        },

        _getStatusText (item) {
          return item.status === 0 ? 'Ativo' : 'Inativo'
        }
    }
}
</script>>