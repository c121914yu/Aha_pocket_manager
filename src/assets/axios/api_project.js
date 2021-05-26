import { GET,POST,PUT,DELETE,uploadFile } from './request.js'

/* 获取项目列表 */
export const getProjects = (params) => GET("/admin/project",params)
/* 获取项目*/
export const getProject = (projectId) => GET(`/project/${projectId}`,{})
/* 删除项目 */
export const removeProject = (projectId) => DELETE(`/admin/project/${projectId}`,{})

/* 获取下载签名 */
export const getLoadSignature = (projectResourceId) => GET(`/admin/project/resource/${projectResourceId}/sign/download`,{})
/* 获取所有附件信息 */
export const getFiles = (params) => GET("/admin/project/resource",params)

/* 审核附件状态,通过/不通过 */
export const checkFile = (resourceId,passed) => POST(`/admin/project/resource/check/${resourceId}`,{passed})

/* 获取评论信息 */
export const getComments = (params) => GET("/project/resource/score",params)
/* 删除评论 */
export const removeComment = (projectResourceId,userId) => DELETE(`/admin/project/resource/score/${projectResourceId}`,{userId})

/* 审批项目 */
export const checkProject = (projectId,data) => POST(`/admin/project/check/${projectId}`,data)

/* 管理员创建项目给指定成员 */
export const createProject = (data) => POST(`/admin/project/saveProjectAndAuthor?creatorUserId=${data.userId}`,data)
/* 修改项目信息*/
export const putProject = (data) => PUT(`/admin/project/${data.id}`,data)
/* 增加上传附件 */
export const postFile = (projectId,data) => POST(`/admin/project/resource/${projectId}`,data)

/* 删除附件 */
export const removeFile = (projectResourceId) => DELETE(`/admin/project/resource/${projectResourceId}`,{})
/* 修改附件信息 */
export const putFile = (data) => PUT(`/admin/project/resource/${data.id}`,data)
/* 获取cos上传签名 */
export const getUpFileSign = (projectId,filename) => GET(`/admin/project/${projectId}/resources/sign/upload/private?filename=${filename}`,{})
/* 修改项目成员信息 */
export const postMember = (projectId,data) => POST(`/admin/project/member/${projectId}`,data)
export const putMember = (projectId,data) => PUT(`/admin/project/member/${projectId}/${data.memberUserId}`,data)
export const putMembers = (projectId,data) => PUT(`/admin/project/members/${projectId}`,data)
export const deleteMember = (projectId,memberUserId) => DELETE(`/admin/project/member/${projectId}/${memberUserId}`,{})

/* 匿名申请表获取 */
export const getApplyRecords = (params) => GET("/project/find",params)
/* 更新匿名申请表状态 */
export const putApplyRecords = (data) => PUT(`/admin/project/find/${data.id}`,data)
