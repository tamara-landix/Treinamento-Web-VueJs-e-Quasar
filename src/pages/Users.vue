<template>
  <q-page padding>
    <q-table
      ref="userTable"
      :data="serverData"
      :columns="columns"
      :filter="filter"
      row-key="name"
      :pagination.sync="serverPagination"
      :loading="loading"
      @request="request"
    />
      <template slot="top-left" slot-scope="props">
        <q-search hide-underline float-label="Nome" placeholder=" " v-model="filterName" @input="filterTable" />
        <q-search hide-underline float-label="LDAP UID" placeholder=" " v-model="filterLdapUid" @input="filterTable" />
        <q-radio v-model="filterActive" val="" label="Todos" @input="filterTable" />
        <q-radio v-model="filterActive" val="1" label="Ativos" @input="filterTable" />
        <q-radio v-model="filterActive" val="0" label="Inativos" @input="filterTable" />
      </template>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="name" :props="props">{{ props.row.name }}</q-td>
        <q-td key="email" :props="props">{{ props.row.email }}</q-td>
        <q-td key="ldap_uid" :props="props">{{ props.row.ldap_uid }}</q-td>
        <q-td key="created" :props="props">{{ new Date(props.row.created).toLocaleString() }}</q-td>
        <q-td key="active" :props="props">
          <q-chip
          :icon="props.row.active ? 'check' : 'close'"
          :color="props.row.active ? 'positive' : 'negative'"
          >
            {{ props.row.active ? "Sim" : "Não" }}
          </q-chip>
        </q-td>
      </q-tr>
      <template slot="top-right" slot-scope="props">
        <q-search hide-underline v-model="filter"/>
      </template>
  </q-page>
</template>

<script>
export default {
  name: 'Users',
  data: () => ({
    loading: false,
    filter: {},
    serverPagination: {
      page: 1,
      rowNumber: undefined
    },
    serverData: [],
    columns: [
      {
        name: 'name',
        required: true,
        label: 'Nome',
        align: 'left',
        field: 'name',
        sortable: true
      },
      {
        name: 'email',
        required: true,
        label: 'E-mail',
        align: 'left',
        field: 'email',
        sortable: true
      },
      {
        name: 'ldap_uid',
        required: true,
        label: 'LDAP UID',
        align: 'left',
        field: 'ldap_uid',
        sortable: true
      },
      {
        name: 'created',
        required: true,
        label: 'Data de criação',
        align: 'left',
        field: 'created',
        sortable: true
      },
      {
        name: 'active',
        required: true,
        label: 'Ativo',
        align: 'left',
        field: 'active',
        sortable: true
      }
    ]
  }),
  mounted () {
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  },
  methods: {
    request ({ pagination, filter }) {
      this.loading = true

      console.log(pagination)
      this.$axios
        .get(`/landix/user/`, { params: {
          limit: pagination.rowsPerPage,
          offset: (pagination.page - 1) * pagination.rowsPerPage,
          name__icontains: filter,
          ordering: pagination.sortBy ? (pagination.descending ? '-' : '') + pagination.sortBy : undefined
        } })
        .then(({ data }) => {
          this.serverPagination = pagination
          this.serverPagination.rowNumber = data.count
          this.serverData = data.results
          this.loading = false
        })
        .catch(error => {
          console.error(error)
          this.loading = false
        })
    },
    filterTable () {
      this.filter = {
        name: this.filterName,
        ldapUid: this.filterLdapUid,
        active: this.filterActive
      }
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      })
    }
  }
}
</script>

<style>
</style>
