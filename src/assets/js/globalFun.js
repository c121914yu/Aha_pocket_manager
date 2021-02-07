import Vue from 'vue'
import { MessageBox,Message } from "element-ui"

Vue.prototype.$prompt = MessageBox.prompt

Vue.prototype.$showSuccess = (msg,duration=2000) => {
	Message({
		message: msg,
		type: 'success',
		duration
	})
}

Vue.prototype.$showWarn = (msg,duration=2000) => {
	Message({
		message: msg,
		type: 'warning',
		duration
	})
}

Vue.prototype.$showError = (msg,duration=2000) => {
	Message({
		message: msg,
		type: 'error',
		duration
	})
}

Vue.prototype.$confirm = (msg,success) => {
	MessageBox.confirm(msg,"提示",{
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
	.then(success)
	.catch(() => {})
}

/* 
	name: formatDate
	desc: 格式化日期成yy/mm/dd HH:mm
	input: Date
	return: String
*/
Vue.prototype.gformatDate = (time,breakLine=false) => {
	const date = new Date(time)
	const year = date.getFullYear() 
	const month = date.getMonth() + 1 
	const day = date.getDate() 
	const hour = date.getHours()
	const minutes = date.getMinutes() 
	const second = date.getSeconds()
	
	const nDay = new Date()
	const nyear = nDay.getFullYear()
	const nmonth = nDay.getMonth() + 1
	const nday = nDay.getDate()
	if(breakLine){
		return `${year < 10 ? '0'+year : year}/${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day}\n${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}:${second < 10 ? '0'+second : second}`
	}
	if(year === nyear && month === nmonth && day === nday){
		return `${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}:${second < 10 ? '0'+second : second}`
	}
	if(year === nyear){
		return `${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}:${second < 10 ? '0'+second : second}`
	}
	return `${year < 10 ? '0'+year : year}/${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}:${second < 10 ? '0'+second : second}`
}

/* 上传文件 */
import { getPublicSign } from "@/assets/axios/api_system.js"
Vue.prototype.gUpFile = (filename,file) => {
	return new Promise((resolve,reject) => {
		getPublicSign({filename})
		.then(res => {
			const signature = res.data
			let cos
			try{
				cos = new COS({
				   getAuthorization: (options, callback) => {callback({Authorization: signature.authorization})}
				})
			} catch(err){
				reject(err)
			}
			cos.putObject({
			   Bucket: signature.bucketName,
			   Region: signature.region,
			   Key: signature.filename, 
			   StorageClass: 'STANDARD',
			   Body: file,
			   onProgress: (progressData) => {
			       // console.log(JSON.stringify(progressData));
			   }
			}, (err, data) => {
				if(err){
					reject(err)
				}
				resolve(data)
			})
		})
		.catch(err => {
			reject(err)
		})
	})
}

/* 
	获取文件URL
	@params signature:Object 签名
*/
Vue.prototype.gGetFileUrl = (signature) => {
	return new Promise((resolve,reject) => {
		let cos
		try{
			cos = new COS({
			   getAuthorization: (options, callback) => {
				   callback({
				       Authorization: signature.authorization
				   })
			   }
			})
		} catch(err){
			reject(err)
		}
		
		cos.getObjectUrl({
		    Bucket: signature.bucketName,
		    Region: signature.region, 
		    Key: signature.filename,
		    Sign: true
		}, (err, data) => {
			if(err){
				reject(err)
			}
			else{
				resolve(data.Url)
			}
		})
	})
}

/* 二进制文件转base64 */
Vue.prototype.binaryToBase64 = (data) => {
	let binary = ''
	let bytes = new Uint8Array(data)
	for (let i=0;i<bytes.byteLength;i++) {
		binary += String.fromCharCode(bytes[i])
	}
	return 'data:image/jpeg;base64,' + window.btoa(binary)
}