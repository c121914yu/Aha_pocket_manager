import { GET,POST,PUT,DELETE,uploadFile } from './request.js'

/* 文件上传 */
const upFile = (data) => uploadFile(data)

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
/* 获取头像上传签名 */
const getAvatarSign = () => GET("/userInfo/avatar/sign/upload",{})
/* 修改用户私有信息 */
const putUserPrivate = (userId,data) => PUT(`/admin/user/${userId}`,data)
/* 修改用户公开信息 */
const putUserOpen = (userId,data) => PUT(`/admin/user/info/${userId}`,data)
/* 修改自己的详细信息 */
const putMe = (data) => PUT("/userInfo/me",data)
/* 获取用户简历 */
const getResume = (userId) => GET(`/resume/${userId}`,{})
/* 向用户发送通知 */
const sendInform = (data) => POST("/admin/message/systemPrivate",data)

/* 获取项目列表 */
const getProjects = (params) => GET("/admin/project",params)
/* 获取项目*/
const getProject = (projectId) => GET(`/project/${projectId}`,{})
/* 获取评论信息 */
const getComments = (params) => GET("/project/resource/score",params)
/* 获取下载签名 */
const getLoadSignature = (projectResourceId) => GET(`/admin/project/resource/${projectResourceId}/sign/download`,{})
/* 审批项目 */
const checkProject = (projectId,data) => POST(`/admin/project/check/${projectId}`,data)

/* 获取所有比赛 */
const getComps = () => GET("/competition",{})
/* 创建新比赛信息 */
const postNewComp = (data) => POST("/admin/competition/tag",data)
/* 修改比赛信息 */
const putComp = (data) => PUT(`/admin/competition/tag/${data.id}`,data)

/* 获取消息列表 */
const getMessages = (param) => GET("/message",param)

export {
	upFile,
	AdminLogin,
	
	/* 用户相关操作 */
	getUsers,
	getMe,
	getUser,
	getUserContract,
	getAvatarSign,
	putUserPrivate,
	putUserOpen,
	putMe,
	getResume,
	sendInform,
	
	getProjects,
	getProject,
	getComments,
	getLoadSignature,
	checkProject,
	
	getComps,
	postNewComp,
	putComp,
	
	getMessages
}