import store from "@/store"

// Vue.prototype.$prompt = ELEMENT.MessageBox.prompt

Vue.prototype.$showSuccess = (msg,duration=2000) => {
	ELEMENT.Message({
		message: msg,
		type: 'success',
		duration
	})
}

Vue.prototype.$showWarn = (msg,duration=2000) => {
	ELEMENT.Message({
		message: msg,
		type: 'warning',
		duration
	})
}

Vue.prototype.$showError = (msg,duration=2000) => {
	ELEMENT.Message({
		message: msg,
		type: 'error',
		duration
	})
}

Vue.prototype.$confirm = (msg,success) => {
	ELEMENT.MessageBox.confirm(msg,"提示",{
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

/* 
	name: gUploadFile
	description: 上传文件至COS存储空间
	@params file: String,文件
	@params signature: Object,签名
	@return: fileUrl: String,文件路径
	time: 2020/12/30
*/
import axios from 'axios'
Vue.prototype.gUploadFile = (file,signature,updateDom=null) => {
	return new Promise((resolve,reject) => {
		let formData = new FormData()
		formData.append("key",signature.filename)
		formData.append("policy",signature.policy)
		formData.append("q-sign-algorithm","sha1")
		formData.append("q-ak",signature.secretId)
		formData.append("q-key-time",signature.keyTime)
		formData.append("q-signature",signature.signature)
		formData.append("file",file)
		axios({
			url: `https://${signature.bucketName}.cos.${signature.region}.myqcloud.com`,
			method: "POST",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data"
			},
			onUploadProgress: (progressEvent) => {
				if(updateDom){
					updateDom(Math.round(progressEvent.loaded / progressEvent.total * 100) | 0)
				}
			}
		})
		.then(res => {
			if(res.status === 204){
				resolve(res.config.url + signature.filename)
			}
			else{
				this.$store.commit("setLoading",false)
				reject(res)
			}
		})
		.catch(err => {
			this.$store.commit("setLoading",false)
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

/* 选择文件，返回文件以及路径 */
Vue.prototype.gSelectFile = (dom) => {
	const file = dom.files[0]
	if(/image/g.test(file.type)){
		return{
			file,
			url: window.URL.createObjectURL(file)
		}
	}
	else{
		this.$showError("需为图片格式")
		return false
	}
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