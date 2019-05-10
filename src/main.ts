import Vue from 'vue';
import './plugins/vuetify';
import App from '@/app';
import { Button, Slider, Select, Tabs, Icon } from 'ant-design-vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.use(Button);
Vue.use(Slider);
Vue.use(Select);
Vue.use(Tabs);
Vue.use(Icon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
