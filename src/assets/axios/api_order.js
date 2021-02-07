import { GET,POST,PUT,DELETE } from './request.js'

/* 
	获取订单
	@params pageNum: Number 页码
	@params pageSize: Number 页码大小
	@params resourceId: Number 附件ID
	@params projectId: Number 项目ID
	@params userId: Number 用户ID
	@params orderId: Number 订单ID
*/
const getOrders = (params) => GET(`/admin/project/resource/purchased`,params)


export {
	getOrders
}