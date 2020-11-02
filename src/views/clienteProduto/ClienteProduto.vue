<template>
      <v-data-table
    :headers="headers"
    :items="clienteProdutoList"
    :search="search"
    :loading="isLoading"
    no-data-text="Você não tem permissão nesta página."
    sort-by="clienteDescricao"
    class="elevation-1"
    loading-text="Pesquisando registros, por favor aguarde..."
  >
    <template v-slot:top>
      <v-toolbar
        flat
        color="blue lighten-4"
      >
        <v-toolbar-title>
          <v-icon>format_list_bulleted</v-icon>
          Vinculação Cliente x Produto
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

                      <v-col cols="6">
                        <v-select
                          id="selectClienteId"
                          :items="clientesCombo"
                          :error-messages="clienteIdErrors"
                          label="Cliente"
                          item-text="descricao"
                          item-value="id"
                          no-data-text="Nenhum cliente cadastrado"
                          v-model="$v.clienteProduto.clienteId.$model"
                        ></v-select>
                      </v-col>

                      <v-col cols="6">
                        <v-select
                          id="selectProdutoId"
                          :items="produtosCombo"
                          :error-messages="produtoIdErrors"
                          label="Produto"
                          item-text="descricao"
                          item-value="id"
                          no-data-text="Nenhum produto cadastrado"
                          v-model="$v.clienteProduto.produtoId.$model"
                        ></v-select>
                      </v-col>

                    </v-row>
                
                    <v-row>
                        <v-col>
                        <v-text-field
                          name="codigoBarra"
                          label="Código de Barras"
                          :error-messages="codigoBarraErrors"
                          :counter="100"
                          v-model.trim="$v.clienteProduto.codigoBarra.$model"
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
              <v-card-text>Deseja excluir vinculação {{clienteProduto.clienteDescricao}} x {{clienteProduto.produtoDescricao}} ?
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
      <!--<v-icon
        small
        class="mr-2"
        @click="editClienteProduto(item)"
      >
        edit
      </v-icon>-->
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
        @click="GetClientesProdutos()"
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
        clienteProdutoList: [],
        headers: [
        { text: 'Cliente', value: 'clienteDescricao' },
        { text: 'Produto', value: 'produtoDescricao' },
        { text: 'Código de Barras', value: 'codigoBarra' },
        { text: '', value: 'actions', sortable: false, align: 'end' }
        ],
        editedIndex: -1,
        clienteProduto: {
            clienteId: '',
            clienteDescricao: '',
            produtoId: '',
            produtoDescricao: '',
            codigoBarra: ''
        },
        msgErroGenerica: 'Ocorreu um erro durante o processo. Tente novamente mais tarde.',
        responseGet: '',
        clientesCombo: [],
        produtosCombo: []
    }),

    mounted () {
        this.GetClientesProdutos()
        this.getClientes()
        this.getProdutos()
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    computed: {
        geTitulo () {
            if (this.isDelete) {
                return 'Excluir Relacionamento'
            } else {
                return this.editedIndex === -1 ? 'Novo Relacionamento' : 'Editar Relacionamento'
            }
        },

        getMsgNoData () {
          return this.responseGet
        },

        clienteIdErrors () {
            const errors = []
            const clienteId = this.$v.clienteProduto.clienteId
            
            if (!clienteId.$dirty) {
                return errors
            }

            !clienteId.required && errors.push('Cliente obrigatório')

            return errors
        },

        produtoIdErrors () {
            const errors = []
            const produtoId = this.$v.clienteProduto.produtoId
            
            if (!produtoId.$dirty) {
                return errors
            }

            !produtoId.required && errors.push('Produto obrigatório')

            return errors
        },

        codigoBarraErrors () {
            const errors = []
            const codigoBarra = this.$v.clienteProduto.codigoBarra

            if (!codigoBarra.$dirty) {
                return errors
            }
            
            !codigoBarra.required && errors.push('Código de Barras obrigatória')
            !codigoBarra.maxLength && errors.push(`Código de Barras deve ter no máximo ${codigoBarra.$params.maxLength.max} caracteres`)

            return errors
        }
    },

    validations () {
      const validations = {
        clienteProduto: {
          clienteId: {
            required
          },
          produtoId: {
              required
          },
          codigoBarra: {
            required,
            maxLength: maxLength(100)
          }
        }
      }

      return validations
    },

    methods: {
        async GetClientesProdutos () {
            this.isLoading = true

            let response = ''
            
            try {
              response = await service.getClienteProduto()
              this.clienteProdutoList = response.data
            } catch (error) {
              if (error.response.status && error.response.status === 401) {
                this.responseGet = '401'
              } else {
                this.responseGet = ''
              }
            }

            this.isLoading = false
        },

        getClientes () {
            service.getClientes().then((response) => {
                if (response.data) {
                    this.clientesCombo = response.data
                }
            })
        },

        getProdutos () {
            service.getProdutos().then((response) => {
                if (response.data) {
                    this.produtosCombo = response.data
                }
            })
        },

        close () {
          this.dialog = false
          this.isDelete = false
          this.$nextTick(() => {
            this.clienteProduto = Object.assign({}, { clienteId: '', clienteDescricao: '', produtoId: '', produtoDescricao: '', codigoBarra: '' })
            this.$v.$reset()
            this.editedIndex = -1
          })
        },

        editClienteProduto (item) {
          this.editedIndex = this.clienteProdutoList.indexOf(item)
          this.clienteProduto = Object.assign({}, item)
          this.dialog = true
        },

        async save () {
          const clienteDescricao = this.clientesCombo.find(x => x.id === this.clienteProduto.clienteId)
          if (clienteDescricao) {
            this.clienteProduto.clienteDescricao = clienteDescricao.descricao
          }

          const produtoDescricao = this.produtosCombo.find(x => x.id === this.clienteProduto.produtoId)
          if (produtoDescricao) {
            this.clienteProduto.produtoDescricao = produtoDescricao.descricao
          }
          
          if (this.editedIndex === -1) {
            service.postClienteProduto(this.clienteProduto).then((response) => {
              this.clienteProdutoList.push(response.data.data)

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
            service.putClienteProduto(this.clienteProduto).then((response) => {
              const indice = this.clienteProdutoList.findIndex(c => c.id === response.data.data.id)

              if (indice !== undefined) {
                this.clienteProdutoList.splice(indice, 1, this.clienteProduto)

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
          service.deleteClienteProduto(this.clienteProduto).then(() => {
            const indice = this.clienteProdutoList.findIndex(c => c.id === this.clienteProduto.id)

            if (indice !== undefined) {
                this.clienteProdutoList.splice(indice, 1)

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
          this.clienteProduto = Object.assign({}, item)
          this.isDelete = true
          this.dialog = true
        }
    }
}
</script>>