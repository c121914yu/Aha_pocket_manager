import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/* 引入UI组件 */
import {
	Button,
	Menu,
	Submenu,
	MenuItem,
	MenuItemGroup,
	Container,
	Header,
	Aside,
	Main,
	Input,
	Form,
	FormItem,
	Table,
	TableColumn,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Image,
	Avatar,
	Tooltip,
	InputNumber,
	Icon,
	RadioGroup,
	Radio,
	Tag,
	Select,
	Option,
	Popover,
	InfiniteScroll
} from 'element-ui'
Vue
	.use(InfiniteScroll)
	.use(Popover)
	.use(Option)
	.use(Select)
	.use(Tag)
	.use(RadioGroup)
	.use(Radio)
	.use(Icon)
	.use(InputNumber)
	.use(Tooltip)
	.use(Avatar)
	.use(Image)
	.use(Dropdown)
	.use(DropdownMenu)
	.use(DropdownItem)
	.use(Button)
	.use(Menu)
	.use(Submenu)
	.use(MenuItem)
	.use(MenuItemGroup)
	.use(Container)
	.use(Header)
	.use(Aside)
	.use(Main)
	.use(Input)
	.use(Form)
	.use(FormItem)
	.use(Table)
	.use(TableColumn)

/* 引入全局提示 */
import {
	showSuccess,
	showWarn,
	showError,
	confirm,
	gformatDate
} from "@/assets/js/globalFun.js"
Vue.prototype.$showError = showError
Vue.prototype.$showWarn = showWarn
Vue.prototype.$showSuccess = showSuccess
Vue.prototype.$confirm = confirm
Vue.prototype.gformatDate = gformatDate

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
