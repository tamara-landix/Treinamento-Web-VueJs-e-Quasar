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
        :label="capitalize($t('label.user'))"
        helper="Entre com o seu usuário"
        :error="$v.username.$error"
        :error-label="`* ${capitalize($t('message.requiredValidate', { field: $t('label.user') }))}`"
      >
        <q-input color="primary" dark suffix="@landix.com.br" v-model="username" @blur="$v.username.$touch" @submit="login"/>
      </q-field>

      <q-field
        dark
        icon="fas fa-key"
        :label="capitalize($t('label.password'))"
        helper="Entre com a sua senha"
        :error="$v.password.$error"
        :error-label="`* ${capitalize($t('message.requiredValidate', { field: $t('label.password') }))}`"
      >
        <q-input color="primary" dark type="password" v-model="password" @blur="$v.password.$touch" @submit="login"/>
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
import { required } from 'vuelidate/lib/validators'
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
  validations: {
    username: { required },
    password: { required }
  },
  computed: {
    // Utiliza sempre que precisa de alguma lógica, que não pode ser colocada no data
    // Nesse caso, concatena "@landix.com.br" com o usuário digitado
    fullUserName: function () { return this.username ? this.username + '@landix.com.br' : undefined }
  },
  methods: {
    login () {
      this.$v.$touch()

      if (this.$v.$error) {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: this.capitalize(this.$t('message.reviewField')),
          icon: 'report_problem'
        })
        return
      }

      this.$axios.post('/landix/login/', { username: this.fullUserName, password: this.password })
        .then((response) => {
          this.$emit('logged', response.data)
          this.$router.push('index')
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Usuário ou senha inválidos',
            icon: 'report_problem'
          })
        })
    }
  }
}

</script>

<style>
</style>
