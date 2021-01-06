import { GET,POST,PUT,DELETE,uploadFile } from './request.js'

/* 登录 */
const AdminLogin = (data) => POST("/login/phone ",data)

/* 获取用户列表 */
const getUsers = (params) => GET("/admin/user",params)
/* 获取当前用户信息 */
const getMe = () => GET("/userInfo/me",{})
/* 获取用户详细信息 */
const getUser = (userId) => GET(`/admin/user/${userId}`,{})
/* 获取合同签名图片 */
const getUserContract = (userId) => GET(`/admin/user/contract/signature/${userId} `,{},"arraybuffer")
/* 修改用户私有信息 */
const putUserPrivate = (userId,data) => PUT(`/admin/user/${userId}`,data)
/* 获取用户简历 */
const getResume = (userId) => GET(`/resume/${userId}`,{})

/* 分页获取用户反馈 */
const getFeedbacks = (param) => GET("/admin/feedback",param)
/* 处理反馈 */
const putFeedback = (data) => PUT(`/admin/feedback/${data.id}`,data)

export {
	AdminLogin,
	
	/* 用户相关操作 */
	getUsers,
	getMe,
	getUser,
	getUserContract,
	putUserPrivate,
	getResume,
	/* 反馈 */
	getFeedbacks,
	putFeedback
}