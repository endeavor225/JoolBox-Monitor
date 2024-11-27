
const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/auth/Login.vue') },
      { path: 'inscription', component: () => import('pages/auth/Inscription.vue') },
      { path: 'forget-password', component: () => import('pages/auth/Forget-Password.vue') },
      { path: 'reset-password', component: () => import('pages/auth/Reset-Password.vue') },
    ]
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'accueil', component: () => import('pages/IndexPage.vue') },
      { path: 'dashboard', component: () => import('pages/dashboard/Index.vue') },
      { path: 'create-mission', component: () => import('src/pages/mission/Create-mission.vue') },
      { path: 'ruche', component: () => import('src/pages/ruche/Index.vue') },
      { path: 'create-ruche', component: () => import('src/pages/ruche/CreateRuche.vue') },
      { path: 'detail-ruche', name: 'detail-ruche', props: true, component: () => import('src/pages/ruche/ShowRuche.vue') },
      { path: 'restriction', component: () => import('src/pages/restriction/Index.vue') },
      { path: 'create-restriction', component: () => import('src/pages/restriction/CreateRestriction.vue') },
      { path: 'detail-mission', component: () => import('src/pages/mission/ShowMission.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
