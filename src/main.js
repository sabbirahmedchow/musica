import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import iziToast from "izitoast";
import axios from "axios";

//require("dotenv").config();

axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("token");
var eventBus = new Vue();
Vue.prototype.$eventBus = eventBus;

Vue.prototype.$iziToast = iziToast;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
