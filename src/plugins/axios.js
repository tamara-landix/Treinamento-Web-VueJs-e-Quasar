import axios from 'axios'

export default ({ Vue }) => {
  Vue.prototype.$axios = axios.create({
    baseURL: 'http://ldxscriptsdev.fw.landix.com.br/',
    withCredentials: true
  })
}
