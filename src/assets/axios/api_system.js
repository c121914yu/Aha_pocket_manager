import { GET,POST,PUT,DELETE,uploadFile } from './request.js'

/* 获取公开上传签名 */
const getPublicSign = (param) => GET("/cos/sign/upload/public",param)

/* 获取轮播图 */
const getSlide = () => GET("/admin/slideShow",{})
/* 新增轮播图 */
const postSlide = (data) => POST("/admin/slideShow",data)
/* 更新轮播图 */
const putSlide = (data) => PUT("/admin/slideShow/"+data.id,data)
/* 删除轮播图 */
const deleteSlide = (id) => DELETE("/admin/slideShow/"+id,{})

/* 获取活动信息 */
const getActivitiy = (params) => GET("/activity",params)
/* 新增活动 */
const postActivity = (data) => POST("/admin/activity",data)
/* 删除活动 */
const deleteActivity = (id) => DELETE("/admin/activity/"+id,{})
/* 生成兑换码 */
const getCDKEY = (params) => GET("/admin/activity/code",params)
/* 获取未兑换的兑换码数量 */
const getUnuserCDKEY = (id) => GET(`/admin/activity/code/count?activityId=${id}`,{})

export {
	getPublicSign,
	
	getSlide,
	postSlide,
	putSlide,
	deleteSlide,
	
	getActivitiy,
	postActivity,
	deleteActivity,
	
	getCDKEY,
	getUnuserCDKEY
}