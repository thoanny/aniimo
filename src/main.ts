import '@/assets/main.css';

import { initMatomo, type MatomoTracker } from '@certible/use-matomo';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

const matomo = initMatomo({
  host: 'https://analytics.thoanny.fr',
  siteId: 17,
  trackRouter: true,
  disableCookies: true,
});

pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

app.provide<MatomoTracker>('matomo', matomo);

app.mount('#app');
