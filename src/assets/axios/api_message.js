import { GET,POST,PUT,DELETE,uploadFile } from './request.js'

/* 获取消息列表 */
const getMessages = (param) => GET("/message",param)
/* 向指定用户发送通知 */
const sendInform = (data) => POST("/admin/message/systemPrivate",data)
/* 向全体用户发送通知 */
const sendInform_all = (data) => POST("/admin/message/systemNotice",data)
/* 获取系统公告 */
const getNotices = (data) => GET("/admin/notice",data)
/* 发布系统公告 */
const sendNotice = (data) => POST("/admin/notice",data)
/* 修改公告 */
const putNotice = (data) => PUT(`/admin/notice/${data.id}`,data)

export {
	getMessages,
	sendInform,
	sendInform_all,
	getNotices,
	sendNotice,
	putNotice,
}