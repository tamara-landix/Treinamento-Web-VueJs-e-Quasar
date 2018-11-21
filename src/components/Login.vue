<template>
  <q-card color="dark" class="q-pa-lg">
    <q-card-title>
      <div class="row justify-center items-center">
        <div class="col-md-6 text-center">
          <img src="../statics/logo.png" width="50%"/>
        </div>
        <div id="login-title" class="col-md-6">
          <p class="text-center">
            Treinamento Web
          </p>
          <p class="text-center">
            VueJS + Quasar
          </p>
        </div>
      </div>
    </q-card-title>

    <q-card-separator />

    <q-card-main>
      <q-field
        dark
        icon="fas fa-user"
        :label="Capitalize($t('label-user'))"
        helper="Entre com o seu usuário"
      >
        <q-input color="primary" dark suffix="" v-model="username" />
      </q-field>

      <q-field
        dark
        icon="fas fa-key"
        :label="Capitalize($t('label-password'))"
        helper="Entre com a sua senha"
      >
        <q-input color="primary" dark type="password" v-model="password" />
      </q-field>

      <div>
        <div>
          <q-btn icon="" label="Entrar" color="positive" @click="login" />
        </div>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>

import { format } from 'quasar'
const { capitalize } = format

export default {
  name: 'Login',
  data () {
    return {
      username: undefined,
      password: undefined,
      capitalize
    }
  },
  computed: {
    // Utiliza sempre que precisa de alguma lógica, que não pode ser colocada no data
    // Nesse caso, concatena "@landix.com.br" com o usuário digitado
    fullUserName: function () { return this.username ? this.username + '@landix.com.br' : undefined }
  },
  methods: {
    login () {
      this.$axios.post('/landix/login/', { username: this.fullUserName, password: this.password })
        .then((response) => {
          this.$emit('logged', response.data)
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Usuário ou senha inválidos',
            icon: 'report-problem'
          })
        })
    }
  }
}
</script>

<style>
</style>
