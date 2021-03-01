import axios from 'axios'
import store from "@/store"
import Vue from 'vue'


// 创建实例
const service = axios.create({
	baseURL : "https://ahapocket.cn/api",
	timeout : 10000
})

// 请求拦截
service.interceptors.request.use(req => {
	req.headers["Authorization"] = sessionStorage.getItem("token")
	return req
},(err) => {
	return Promise.reject(err)
})

// 错误处理
const error = async (err) => {
    store.commit("setLoading",false)
	if(err.response){
		if(err.response.data.code === 103 || err.response.data.code === 102){
			store.commit("logOut")
		}
		Vue.prototype.$showError(err.response.data.msg)
		return Promise.reject(err.response.data)
	}
	Vue.prototype.$showError("未知错误")
	return Promise.reject(err)
}

// 响应拦截
service.interceptors.response.use(res => {
	// console.log(res.headers);
	if(res.headers.authorization){
		store.state.token = res.headers.authorization
		sessionStorage.setItem("token",res.headers.authorization)
	}
	return res.data
},error)

/* 封装请求方式 */
export function GET(url,params,responseType){
	return service({
		url,
		method : "GET",
		params,
		responseType
	})
}
export function POST(url,data){
	return service({
		url,
		method : "POST",
		data
	})
}
export function PUT(url,data){
	return service({
		url,
		method : "PUT",
		data
	})
}
export function DELETE(url){
	return service({
		url,
		method : "DELETE"
	})
}
