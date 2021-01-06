import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import router from '@/router'

export default new Vuex.Store({
  state: {
	loading: false,
	token: "",
	myInfo: null,
	arr_competitions: null,
	prizeLevels: [
		{label: "国一",value:53},
		{label: "国二",value:52},
		{label: "国三",value:51},
		{label: "省一",value:43},
		{label: "省二",value:42},
		{label: "省三",value:41},
		{label: "市一",value:33},
		{label: "市二",value:32},
		{label: "市三",value:31},
		{label: "校一",value:23},
		{label: "校二",value:22},
		{label: "校三",value:21},
		{label: "参与奖",value:10},
	],
	compType: [
		{label: "经济类",value: 1},
		{label: "管理类",value: 2},
		{label: "法学类",value: 3},
		{label: "公管类",value: 4},
		{label: "语言类",value: 5},
		{label: "艺术传媒类",value: 6},
		{label: "学科类",value: 7},
		{label: "计算机类",value: 8},
		{label: "机械类",value: 9},
		{label: "建筑类",value: 10},
		{label: "化工类",value: 11},
		{label: "科研创业类",value: 12},
	],
  },
  mutations: {
    setLoading(state,type){
      state.loading = type
    },
    successLogin(state,{token,personalUserInfo}){
		state.token = token
		state.myInfo = personalUserInfo
		sessionStorage.setItem("token",token)
		router.push("/projects")
    },
	logOut(state){
		state.token = ""
		state.myInfo = null
		sessionStorage.removeItem("token")
		router.push("/")
	}
  },
  actions: {
  },
  modules: {
  }
})
