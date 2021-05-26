import { GET,POST,PUT,DELETE,uploadFile } from './request.js'

/**
 * 获取所有标签
 */
export const getTags = () => GET("/post/tags/all")

/**
 * 新建一个标签
 * @param {String}  tagName
 */
export const postTag = (tagName) => POST(`/post/tags?tagName=${tagName}`)

/**
 * 修改一个标签
 * @param {Number}  tagId
 * @param {String}  tagName
 */
export const putTag = (tagId,tagName) => PUT(`/post/tags/${tagId}?tagName=${tagName}`)

/**
 * 删除一个标签
 * @param {Number}  tagId
 */
export const deleteTag = (tagId) => DELETE(`/post/tags/${tagId}`)