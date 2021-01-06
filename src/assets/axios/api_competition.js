import { GET,POST,PUT,DELETE,uploadFile } from './request.js'

/* 获取所有比赛 */
const getComps = () => GET("/competition",{})
/* 获取比赛信息 */
const getComp = (id) => GET(`/competition/${id} `,{})
/* 创建新比赛信息 */
const postNewComp = (data) => POST("/admin/competition",data)
/* 修改比赛信息 */
const putComp = (data) => PUT(`/admin/competition/${data.id}`,data)

export {
	getComps,
	getComp,
	postNewComp,
	putComp,
}