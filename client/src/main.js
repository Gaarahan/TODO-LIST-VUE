import Vue from 'vue'
import App from './App.vue'
import $ from 'jquery'
import VueResource from 'vue-resource'

Vue.use(VueResource);
Vue.http.options.root = 'http://localhost:8848/';
Vue.http.options.emulateJSON = true;

if (module.hot) {
  module.hot.accept();
}

new Vue({
  el: '#app',
  render: h => h(App),
});
