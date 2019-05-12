import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Argon from "./plugins/argon-kit";
import firebase from 'firebase';
import './components/firebaseInit';

import { store } from './store/store'

Vue.config.productionTip = false;
Vue.use(Argon);

firebase.auth().onAuthStateChanged(function(user) {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
});