import axios from 'axios'
import store from "@/store"
import Vue from 'vue'

const closeLoad = () => {
	setTimeout(() => {
		store.commit("setLoading",false)
	})
}

// 创建实例
const service = axios.create({
	baseURL : "https://ahapocket.cn/api",
	timeout : 10000
})

// 请求拦截
service.interceptors.request.use(req => {
	req.headers["Authorization"] = sessionStorage.getItem("token")
	store.commit("setLoading",true)
	return req
},(err) => {
	return Promise.reject(err)
})

// 错误处理
const error = async (err) => {
	if(err.response){
		if(err.response.data.code === 103 || err.response.data.code === 102){
			store.commit("logOut")
		}
		closeLoad()
		Vue.prototype.$showError(err.response.data.msg)
		return Promise.reject(err.response.data)
	}
	closeLoad()
	Vue.prototype.$showError("未知错误")
	return Promise.reject(err)
}

// 响应拦截
service.interceptors.response.use(res => {
	if(res.headers.authorization){
		store.state.token = res.headers.authorization
		sessionStorage.setItem("token",res.headers.authorization)
	}
	closeLoad()
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
export function uploadFile(data){
	let formData = new FormData()
	formData.append("key",data.name)
	formData.append("policy",data.policy)
	formData.append("OSSAcccessKeyId",data.accessid)
	formData.append("signature",data.signature)
	formData.append("file",data.file)
	formData.append("success_action_status","200")
	return service({
		url: data.host,
		method: "POST",
		data: formData,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	})
}