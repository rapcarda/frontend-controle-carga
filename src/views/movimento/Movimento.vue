<template>
  <v-data-table
    :headers="headers"
    :items="movimList"
    :search="search"
    :loading="isLoading"
    :expanded.sync="expanded"
    item-key="id"
    show-expand
    no-data-text="Você não tem permissão nesta página."
    sort-by="dataHoraInicial"
    :sort-desc="true"
    class="elevation-1"
    loading-text="Pesquisando registros, por favor aguarde..."
  >
    <template v-slot:top>
      <v-toolbar
        flat
        color="blue lighten-4"
      >
        <v-toolbar-title>
          <v-icon>view_list</v-icon>
          Movimentos
        </v-toolbar-title>

        <v-spacer></v-spacer>

          <v-menu
            v-model="fromDateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                label="Data Inicial"
                prepend-icon="event"
                readonly
                :value="fromDateDisp"
                v-on="on"
                class="inputFilterData"
              ></v-text-field>
            </template>
            <v-date-picker
              locale="pt-br"
              v-model="fromDateVal"
              elevation="15"
              @input="fromDateMenu = false"
            ></v-date-picker>
          </v-menu>


          <v-menu
            v-model="toDateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                label="Data Final"
                prepend-icon="event"
                readonly
                :value="toDateDisp"
                v-on="on"
                max-width="10px"
                min-width="10px"
                class="inputFilterData"
              ></v-text-field>
            </template>
            <v-date-picker
              locale="pt-br"
              v-model="toDateVal"
              hint="DD/MM/YYYY format"
              persistent-hint
              elevation="15"
              @input="fromDateMenu = false"
            ></v-date-picker>
          </v-menu>


        <v-btn
            color="primary"
            dark
            class="ml-2"
            @click="GetMovimento()"
        >Filtrar Período</v-btn>

        <v-btn
            color="green"
            dark
            class="ml-2"
        >Imprimir</v-btn>

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

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <v-data-table
            :headers="headersItemMovim"
            :items="getItemDoMovimento(item)"
            :search="search"
            sort-by="clienteCodigo"
            class="elevation-1"
            dense
            hide-default-footer
        >
        </v-data-table>
      </td>
    </template>

    <template v-slot:no-data>
      <v-btn
        v-if="responseGet !== '401'"
        color="primary"
        @click="GetMovimento()"
      >Nenhuma informação. Pesquisar novamente</v-btn>
    </template>

  </v-data-table>
</template>>

<script>

import { required, maxLength } from 'vuelidate/lib/validators'
import moment from 'moment'
import service from './service'

export default {
    data: () => ({
        search: '',
        isLoading: false,
        singleExpand: false,
        fromDateMenu: false,
        fromDateVal: new Date().toISOString().substr(0, 10),
        toDateMenu: false,
        toDateVal: new Date().toISOString().substr(0, 10),
        expanded: [],
        movimList: [],
        headers: [
            { text: 'Código Usuário', value: 'usuarioCodigo' },
            { text: 'Nome Usuário', value: 'usuarioNome' },
            { text: 'Frota', value: 'frotaPlaca' },
            { text: 'Data/Hora Inicial', value: 'dataHoraInicial' },
            { text: 'Data/Hora Final', value: 'dataHoraFinal' }
        ],
        headersItemMovim: [
            { text: 'Código Cliente', value: 'clienteCodigo' },
            { text: 'Desc. Cliente', value: 'clienteDescricao' },
            { text: 'Código Produto', value: 'produtoCodigo' },
            { text: 'Desc. Produto', value: 'produtoDescricao' },
            { text: 'Qtd.', value: 'qtd' }
        ],
        movimento: {
            id: '',
            usuarioCodigo: '',
            usuarioNome: '',
            frotaPlaca: '',
            dataHoraInicial: '',
            dataHoraFinal: ''
        },
        itemMovimList: {
            movimentoId: '',
            clienteCodigo: '',
            clienteDescricao: '',
            produtoCodigo: '',
            produtoDescricao: '',
            qtd: ''
        },
        responseGet: ''
    }),

    mounted () {
        this.GetMovimento()
    },

    computed: {
        fromDateDisp() {
            return this.fromDateVal ? this.formatDate(this.fromDateVal) : "";
        },

        toDateDisp() {
            return this.toDateVal ? this.formatDate(this.toDateVal) : "";
        },
        
        getMsgNoData () {
          return this.responseGet
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
        async GetMovimento () {
            this.isLoading = true

            let response = ''
            let filter
            
            
            filter = {
                dataHoraInicial: this.fromDateVal,
                dataHoraFinal: this.toDateVal
            }
            
            //try {
              response = await service.getMovimento(filter)
              console.log('response: ', response)

              this.movimList = this._createObjMovimento(response.data.data)
              this.itemMovimList = this._createObjItemMovimento(response.data.data)

              console.log('itens: ', this.itemMovimList)

              //this.movimList = response.data.data
           // }
            // } catch (error) {
            //   if (error.response.status && error.response.status === 401) {
            //     this.responseGet = '401'
            //   } else {
            //     this.responseGet = ''
            //   }
            // }

            this.isLoading = false
        },

        getItemDoMovimento (item) {
            return this.itemMovimList.filter(x => x.movimentoId === item.id)
        },

        formatDate (date) {
          if (!date) return null
          const [year, month, day] = date.split('-')
          return `${day}/${month}/${year}`
        },

        _createObjMovimento (response) {
            let obj

            if (Array.isArray(response)) {
                obj = response.map(function (item) {
                return {
                    id: item.id,
                    usuarioCodigo: item.usuarioCodigo,
                    usuarioNome: item.usuarioNome,
                    frotaPlaca: item.frotaPlaca,
                    dataHoraInicial: moment(item.dataHoraInicial).format('DD/MM/YYYY HH:mm:ss'),
                    dataHoraFinal: moment(item.dataHoraFinal).format('DD/MM/YYYY HH:mm:ss')
                }
                })
            }

            if (obj) {
                return obj
            } else {
                return null
            }
        },

        _createObjItemMovimento (response) {
            const itemList = []

            if (Array.isArray(response)) {
                response.forEach(movim => {
                     movim.itemMovimento.forEach(item => {
                         let obj = {
                             movimentoId: item.movimentoId,
                             clienteCodigo: item.clienteCodigo,
                             clienteDescricao: item.clienteDescricao,
                             produtoCodigo: item.produtoCodigo,
                             produtoDescricao: item.produtoDescricao,
                             qtd: item.qtd
                         }

                         itemList.push(obj)
                     });
                });
            }

            if (itemList) {
                return itemList
            } else {
                return null
            }
        }
    }
}
</script>

<style scoped>
.inputFilterData {
  margin-top: 30px;
  margin-right: 20px;
  width: 1px;
  max-width: 20%;
}
</style>>