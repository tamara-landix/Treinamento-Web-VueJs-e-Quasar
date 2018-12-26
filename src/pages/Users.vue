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
  data: () => ({
    columns: [
      {
        name: 'desc',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: 'name',
        sortable: true,
        classes: 'my-class',
        style: 'width: 500px'
      }
    ],
    tableData: [
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: '14%',
        iron: '1%'
      }
    ]
  })
}
</script>

<style>
</style>
