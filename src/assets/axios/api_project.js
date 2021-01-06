import { GET,POST,PUT,DELETE,uploadFile } from './request.js'

/* 获取项目列表 */
const getProjects = (params) => GET("/admin/project",params)
/* 获取项目*/
const getProject = (projectId) => GET(`/project/${projectId}`,{})
/* 修改项目信息*/
const putProject = (data) => PUT(`/admin/project/${data.id}`,data)

/* 获取下载签名 */
const getLoadSignature = (projectResourceId) => GET(`/admin/project/resource/${projectResourceId}/sign/download`,{})
/* 获取附件信息 */
const getFiles = (params) => GET("/admin/project/resource",params)
/* 修改附件状态 */
const checkFile = (resourceId,passed) => POST(`/admin/project/resource/check/${resourceId}`,{passed})
/* 删除附件 */
const removeFile = (projectResourceId) => DELETE(`/admin/project/resource/${projectResourceId}`,{})

/* 获取评论信息 */
const getComments = (params) => GET("/project/resource/score",params)
/* 删除评论 */
const removeComment = (projectResourceId,userId) => DELETE(`/admin/project/resource/score/${projectResourceId}`,{userId})

/* 审批项目 */
const checkProject = (projectId,data) => POST(`/admin/project/check/${projectId}`,data)

export {
	getProjects,
	getProject,
	putProject,
	
	getLoadSignature,
	getFiles,
	checkFile,
	removeFile,
	
	getComments,
	removeComment,
	
	checkProject,
}