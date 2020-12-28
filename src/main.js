import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// 引入echarts
const echarts = require('echarts')
Vue.prototype.Echarts = echarts

/* 注册element */
require("./assets/js/useElement.js") 
/* 注册全局事件 */
require("./assets/js/globalFun.js") 

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
