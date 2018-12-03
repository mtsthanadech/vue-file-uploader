import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Argon from "./plugins/argon-kit";
import firebase from 'firebase';
import './components/firebaseInit';

Vue.config.productionTip = false;
Vue.use(Argon);

firebase.auth().onAuthStateChanged(function(user) {
  new Vue({
    router,
    render: h => h(App)
  }).$mount("#app");
});