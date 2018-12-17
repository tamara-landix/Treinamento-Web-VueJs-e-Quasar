<template>
  <div class="absolute-center">
    <login-form @logged="saveUser"></login-form>
  </div>
</template>

<script>
import LoginForm from '../components/Login.vue'

export default {
  name: 'Login',
  components: {
    LoginForm // 'login-form': LoginForm
  },
  props: ['redirect'],
  methods: {
    saveUser: function (user) {
      this.$q.localStorage.set('user', user)
      this.$router.push(this.redirect)
    }
  }
}
</script>

<style>
</style>
