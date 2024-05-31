import { createRouter, createWebHistory } from 'vue-router'
import OperatorList from '@/views/OperatorsList.vue'
import OperatorDetails from '@/views/OperatorDetails.vue'

const routes = [
  {
    path: '/',
    redirect: '/operators'
  },
  {
    path: '/operators',
    name: 'operator-list',
    component: OperatorList
  },
  {
    path: '/operator/:id',
    name: 'operator-details',
    component: OperatorDetails,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
