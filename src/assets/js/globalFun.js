import { MessageBox,Message } from "element-ui"

export function showSuccess(msg){
	Message({
		message: msg,
		type: 'success',
		duration: 2000
	})
}

export function showWarn(msg){
	Message({
		message: msg,
		type: 'warning',
		duration: 2000
	})
}

export function showError(msg){
	Message({
		message: msg,
		type: 'error',
		duration: 2000
	})
}

export function confirm(msg,success){
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
export function gformatDate(time){
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
	if(year === nyear && month === nmonth && day === nday){
		return `${hour}:${minutes}`
	}
	else if(year === nyear){
		return `${month}/${day} ${hour}:${minutes}`
	}
	else{
		return `${year}/${month}/${day} ${hour}:${minutes}`
	}
}