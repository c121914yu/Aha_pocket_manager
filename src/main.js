import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false

// 引入echarts
const echarts = require( 'echarts' )
Vue.prototype.Echarts = echarts

/* 注册element */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use( ElementUI )
/* 注册全局事件 */
require( "./assets/js/globalFun.js" )

/* 注册md编辑器 */
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

new Vue( {
	router,
	store,
	render: h => h( App )
} ).$mount( '#app' )
