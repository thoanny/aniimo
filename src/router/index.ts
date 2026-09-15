import AniilogView from '@/views/AniilogView.vue';
import DatabaseView from '@/views/DatabaseView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: AniilogView },
  { path: '/database', component: DatabaseView },
  { path: '/t-potes', component: () => import('@/views/TpotesView.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
