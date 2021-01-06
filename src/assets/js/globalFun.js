import Vue from 'vue'
import { MessageBox,Message } from "element-ui"

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
	
	const nDay = new Date()
	const nyear = nDay.getFullYear()
	const nmonth = nDay.getMonth() + 1
	const nday = nDay.getDate()
	if(breakLine){
		return `${year < 10 ? '0'+year : year}/${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day}\n${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
	}
	if(year === nyear && month === nmonth && day === nday){
		`${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
	}
	if(year === nyear){
		return `${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
	}
	return `${year < 10 ? '0'+year : year}/${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
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