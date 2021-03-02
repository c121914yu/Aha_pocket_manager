import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false

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
