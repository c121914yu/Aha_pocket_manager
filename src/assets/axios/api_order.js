import { GET,POST,PUT,DELETE,uploadFile } from './request.js'

/* 获取项目订单 */
const getFileOrders = (params) => GET(`/admin/project/resource/purchased/${params.resourceId}`,params)


export {
	getFileOrders
}