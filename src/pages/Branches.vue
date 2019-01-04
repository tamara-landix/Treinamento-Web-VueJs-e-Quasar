<template>
  <q-page padding>
    <div class="row justify-end q-ma-md">
      <q-btn icon="add" color="positive" label="Novo braço" @click="formModalOpened = true"/>
    </div>
    <q-table
      ref="branchesTable"
      :data="serverData"
      :columns="columns"
      row-key="name"
      :pagination.sync="serverPagination"
      :loading="loading"
      :filter="filter"
      @request="request"
    >
      <template slot="top-left" slot-scope="props">
        <q-search hide-underline float-label="Nome" placeholder=" " v-model="filterName" @input="filterTable"/>
      </template>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="id" :props="props">{{ props.row.id }}</q-td>
        <q-td key="name" :props="props">{{ props.row.name }}</q-td>
        <q-td key="type" :props="props">{{ props.row.type.description }}</q-td>
        <q-td key="product" :props="props">{{ props.row.product.name }}</q-td>
        <q-td key="responsible" :props="props">{{ props.row.responsible.map(item => item.name).join(', ') }}</q-td>
        <q-td key="parent_branch" :props="props">{{ props.row.parent_branch ? props.row.parent_branch.name : '-' }}</q-td>
        <q-td key="created_date" :props="props">{{ new Date(props.row.created_date).toLocaleString() }}</q-td>
        <q-td key="merge_executed" :props="props">
          <q-chip
            :icon="props.row.merge_executed ? 'check' : 'close'"
            :color="props.row.merge_executed ? 'positive' : 'negative'"
          >
            {{ props.row.merge_executed ? 'Sim' : 'Não' }}
          </q-chip>
        </q-td>
        <q-td>
          <q-btn icon="edit" color="dark" size="sm" @click="edit(props.row.id)"/>
          <q-btn icon="delete_forever" color="dark" size="sm" @click="deleteBranch(props.row.id)"/>
        </q-td>
      </q-tr>
    </q-table>

    <q-modal v-model="formModalOpened" :content-css="{minWidth: '40vw', minHeight: '80vh'}" @hide="clearData">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn
            flat
            round
            dense
            v-close-overlay
            icon="keyboard_arrow_left"
          />
          <q-toolbar-title>
            {{ form.name || 'Novo braço' }}
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          <q-field
            label="Nome:"
            orientation="vertical"
            class="q-mt-md"
            :error="$v.form.name.$error"
            :error-label="`* ${capitalize($t('message.requiredValidate', { field: 'Nome' }))}`"
          >
            <q-input v-model="form.name" @blur="$v.form.name.$touch"/>
          </q-field>
          <q-field
            label="Descrição:"
            orientation="vertical"
            class="q-mt-md"
            :error="$v.form.description.$error"
            :error-label="`* ${capitalize($t('message.requiredValidate', { field: 'Descrição' }))}`"
          >
            <q-input v-model="form.description" @blur="$v.form.description.$touch"/>
          </q-field>
          <q-field
            label="Merge realizado?"
            orientation="vertical"
            class="q-mt-md"
          >
            <q-checkbox v-model="form.merge_executed" />
          </q-field>
          <q-field
            label="Tipo:"
            orientation="vertical"
            class="q-mt-md"
            :error="$v.form.type.$error"
            :error-label="`* ${capitalize($t('message.requiredValidate', { field: 'Tipo' }))}`"
          >
            <select2
              selectId="typeBranch"
              ref="typeBranch"
              v-model="form.type"
              :url="branchTypesUrl"
              :withCredentials="true"
              responseData="results"
              dataId="id"
              dataText="description"
              dataLimit="limit"
              dataOffset="offset"
              dataTotal="count"
              dataTerm="description__icontains"
              placeholder="Selecione o tipo do braço ..."
              @blur="$v.form.type.$touch"
            />
          </q-field>
          <q-field
            label="Nome do produto:"
            orientation="vertical"
            class="q-mt-md"
            :error="$v.form.product.$error"
            :error-label="`* ${capitalize($t('message.requiredValidate', { field: 'Nome do produto' }))}`"
          >
            <select2
              selectId="productList"
              ref="productList"
              v-model="form.product"
              :url="productItemsUrl"
              :withCredentials="true"
              responseData="results"
              dataId="id"
              dataText="name"
              dataLimit="limit"
              dataOffset="offset"
              dataTerm="name__icontains"
              dataTotal="count"
              placeholder="Selecione o produto ..."
              @onSelect="onProductSelect"
              @blur="$v.form.product.$touch"
            />
          </q-field>
          <q-field
            label="Braço pai:"
            orientation="vertical"
            class="q-mt-md"
            :error="$v.form.parent_branch.$error"
            :error-label="`* ${capitalize($t('message.requiredValidate', { field: 'Braço pai' }))}`"
          >
            <select2
              selectId="parentBranch"
              ref="parentBranch"
              v-model="form.parent_branch"
              :url="branchItemsUrl"
              :withCredentials="true"
              responseData="results"
              dataId="id"
              dataText="name"
              dataLimit="limit"
              dataOffset="offset"
              dataTerm="name__icontains"
              placeholder="Selecione o braço pai ..."
              dataTotal="count"
              @blur="$v.form.parent_branch.$touch"
            />
          </q-field>
          <q-field
            label="Responsável pelo braço:"
            orientation="vertical"
            class="q-mt-md"
            :error="$v.form.responsible.$error"
            :error-label="`* ${capitalize($t('message.requiredValidate', { field: 'Responsável pelo braço' }))}`"
          >
            <select2
              selectId="answerableList"
              ref="answerableList"
              v-model="form.responsible"
              :url="answerableUrl"
              :withCredentials="true"
              :multiple="true"
              responseData="results"
              dataId="id"
              dataText="name"
              dataLimit="limit"
              dataOffset="offset"
              dataTotal="count"
              dataTerm="name__icontains"
              placeholder="Selecione o responsável ..."
              :queryParameters="{ profile_types__id__in: 1, ordering: 'name' }"
              @blur="$v.form.responsible.$touch"
            />
          </q-field>
          <div class="row justify-end q-mt-lg">
            <q-btn icon="check" color="positive" label="Salvar" @click="save"/>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
  </q-page>
</template>

<script>
import { format } from 'quasar'

const { capitalize } = format

import Select2 from 'ldx-vue-select2'

import { required } from 'vuelidate/lib/validators'

export default {
  name: 'Branches',
  components: {
    Select2
  },
  data () {
    return {
      capitalize,
      formModalOpened: false,
      loading: false,
      filterName: undefined,
      filter: {},
      serverPagination: {
        page: 1,
        rowsNumber: undefined
      },
      serverData: [],
      columns: [
        {
          name: 'id',
          required: true,
          label: 'Código',
          align: 'center',
          field: 'id',
          sortable: true
        },
        {
          name: 'name',
          required: true,
          label: 'Nome',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'type',
          required: true,
          label: 'Tipo',
          align: 'left',
          field: 'type',
          sortable: true
        },
        {
          name: 'product',
          required: true,
          label: 'Produto',
          align: 'left',
          field: 'product',
          sortable: true
        },
        {
          name: 'responsible',
          required: true,
          label: 'Responsável',
          align: 'left',
          field: 'responsible',
          sortable: true
        },
        {
          name: 'parent_branch',
          required: true,
          label: 'Braço Pai',
          align: 'left',
          field: 'parent_branch',
          sortable: true
        },
        {
          name: 'created_date',
          required: true,
          label: 'Data de criação',
          align: 'left',
          field: 'created_date',
          sortable: true
        },
        {
          name: 'merge_executed',
          required: true,
          label: 'Merge executado?',
          align: 'left',
          field: 'merge_executed',
          sortable: true
        },
        {
          name: 'actions',
          required: true,
          label: 'Ações',
          align: 'left'
        }
      ],
      branchEditingId: undefined,
      form: {
        name: undefined,
        description: undefined,
        merge_executed: false,
        parent_branch: undefined,
        type: undefined,
        product: undefined,
        responsible: []
      },
      productItemsUrl: this.$axios.defaults.baseURL + '/landixscripts/products/',
      answerableUrl: this.$axios.defaults.baseURL + '/landix/user/',
      branchTypesUrl: this.$axios.defaults.baseURL + '/landixscripts/branchtype/',
      branchItemsUrl: this.$axios.defaults.baseURL + '/landixscripts/branches/'
    }
  },
  validations: {
    form: {
      name: { required },
      description: { required },
      merge_executed: { required },
      parent_branch: { required },
      type: { required },
      product: { required },
      responsible: { required }
    }
  },
  mounted () {
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  },
  methods: {
    request ({ pagination, filter }) {
      this.loading = true

      this.$axios
        .get('/landixscripts/branches/', { params: {
          limit: pagination.rowsPerPage,
          offset: (pagination.page - 1) * pagination.rowsPerPage,
          ordering: pagination.sortBy ? (pagination.descending ? '-' : '') + pagination.sortBy : undefined,
          name__icontains: filter ? filter.name : undefined
        } })
        .then(({ data }) => {
          this.serverPagination = pagination
          this.serverPagination.rowsNumber = data.count
          this.serverData = data.results
          this.loading = false
        })
        .catch(error => {
          this.$q.notify({
            message: 'Ocorreu um erro ao buscar os braços. Erro: ' + error,
            type: 'negative'
          })
          this.loading = false
        })
    },
    filterTable () {
      this.filter = {
        name: this.filterName
      }
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      })
    },
    edit (branchId) {
      this.$axios
        .get(`/landixscripts/branches/${branchId}/`)
        .then(({ data }) => {
          this.formModalOpened = true
          this.branchEditingId = branchId
          this.form.name = data.name
          this.form.description = data.description
          this.form.merge_executed = data.merge_executed
          this.form.parent_branch = data.parent_branch ? data.parent_branch.id : undefined
          this.form.type = data.type.id
          this.form.product = data.product.id
          this.form.responsible = data.responsible.map(item => item.id)
          this.$nextTick()
            .then(() => {
              this.$refs.typeBranch.setItems([{ id: data.type.id, text: data.type.description }])
              this.$refs.productList.setItems([{ id: data.product.id, text: data.product.name }])
              this.$refs.answerableList.setItems(data.responsible.map(item => { return { id: item.id, text: item.name } }))
              if (data.parent_branch) {
                this.$refs.parentBranch.setItems([{ id: data.parent_branch.id, text: data.parent_branch.name }])
              }
            })
        })
        .catch(error => {
          this.$q.notify({
            message: 'Ocorreu um erro ao editar o braço. Erro: ' + error,
            type: 'negative'
          })
          this.branchEditingId = undefined
        })
    },
    deleteBranch (branchId) {
      this.$q.dialog({
        title: 'Confirmação',
        message: 'Deseja realmente deletar o braço ' + branchId + '?',
        ok: 'Sim',
        cancel: 'Não'
      })
        .then(() => {
          this.$axios
            .delete(`/landixscripts/branches/${branchId}/`)
            .then(({ data }) => {
              this.request({
                pagination: this.serverPagination,
                filter: this.filter
              })
              this.$q.notify({
                message: 'Braço excluído!',
                type: 'positive'
              })
            })
            .catch(error => {
              this.$q.notify({
                message: 'Ocorreu um erro ao deletar o braço. Erro: ' + error,
                type: 'negative'
              })
            })
        })
        .catch(() => {
          this.$q.notify({
            message: 'Exclusão cancelada.',
            type: 'info'
          })
        })
    },
    clearData () {
      this.form = {
        name: undefined,
        description: undefined,
        merge_executed: false,
        parent_branch: undefined,
        type: undefined,
        product: undefined,
        responsible: []
      }
      this.branchEditingId = undefined
      this.$refs.parentBranch.cleanAll()
      this.$refs.productList.cleanAll()
      this.$refs.answerableList.cleanAll()
      this.$refs.typeBranch.cleanAll()
    },
    onProductSelect (product) {
      if (this.$refs.parentBranch) {
        this.$refs.parentBranch.cleanAll()
        this.$refs.parentBranch.updateQueryParameters({ product__in: product })
      }
    },
    save () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: this.capitalize(this.$t('message.reviewField')),
          icon: 'report_problem'
        })
        return
      }
      this.form.parent_branch = this.form.parent_branch ? this.form.parent_branch[0].id : undefined
      this.form.type = this.form.type ? this.form.type[0].id : undefined
      this.form.product = this.form.product ? this.form.product[0].id : undefined
      this.form.responsible = this.form.responsible.map(item => item.id)
      this.$axios({
        method: this.branchEditingId ? 'put' : 'post',
        url: `/landixscripts/branches/${this.branchEditingId ? this.branchEditingId + '/' : ''}`,
        data: this.form
      })
        .then(() => {
          this.formModalOpened = false
          this.request({
            pagination: this.serverPagination,
            filter: this.filter
          })
        })
        .catch(error => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Ocorreu um erro ao salvar o braço. Erro: ' + error,
            icon: 'report_problem'
          })
        })
    }
  }
}
</script>

<style>
</style>
