
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue'),
    props: (route) => ({
      redirect: route.query.redirect
    })
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
