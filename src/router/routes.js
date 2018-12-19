
const routes = [
  {
    path: '/',
    component: () => import('pages/Login.vue'),
    props: (route) => ({
      redirect: route.query.redirect
    })
  },
  {
    path: '/index',
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
