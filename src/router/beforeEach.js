import {LocalStorage} from 'quasar'

export default (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!LocalStorage.get.item('user')) {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    } else {
      next()
    }
  } else {
    next()
  }
}
