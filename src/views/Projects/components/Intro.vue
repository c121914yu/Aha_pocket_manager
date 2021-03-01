<template>
	<div class="project-intro">
		<mavon-editor 
			ref="md"
			style="height: calc(100vh - 110px)"
			:ishljs="true"
			:toolbars="toolbars"
			@imgAdd="addImg"
			@change="change"
			@save="saveIntro(true)"
			v-model="value"/>
	</div>
</template>

<script>
import { putProject } from "@/assets/axios/api_project.js"
export default{
	props:{
		projectId: {
			type: Number,
			default: 0
		}
	},
	data(){
		return{
			toolbars: {
				bold: true, // 粗体
				italic: true, // 斜体
				header: true, // 标题
				underline: true, // 下划线
				strikethrough: true, // 中划线
				mark: true, // 标记
				superscript: true, // 上角标
				subscript: true, // 下角标
				quote: true, // 引用
				ol: true, // 有序列表
				ul: true, // 无序列表
				link: true, // 链接
				imagelink: true, // 图片链接
				code: true, // code
				table: true, // 表格
				fullscreen: true, // 全屏编辑
				htmlcode: true, // 展示html源码
				help: true, // 帮助
				/* 1.3.5 */
				undo: true, // 上一步
				redo: true, // 下一步
				save: true, // 保存（触发events中的save事件）
				/* 2.1.8 */
				alignleft: true, // 左对齐
				aligncenter: true, // 居中
				alignright: true, // 右对齐
			},
			value: "",
			html: ""
		}
	},
	created() {
		if(this.projectId === 0){
			this.toolbars.save = false
		}
		// setInterval(() => {
		// 	this.saveIntro(false)
		// },30000)
	},
	methods:{
		addImg(pos,file)
		{
			this.gUpFile(Date.now(),file)
			.then(res => {
				console.log(res);
				this.$refs.md.$img2Url(pos, res)
			})
		},
		/* 编辑器输入 */
		change(val,render)
		{
			this.html = render
		},
		/* 保存 */
		saveIntro(remind)
		{
			if(this.projectId){
				putProject({
					id: this.projectId,
					intro: this.html
				})
				.then(res => {
					if(remind){
						this.$showSuccess("保存成功")
					}
				})
			}
		}
	}
}
</script>

<style  lang="stylus" scoped>
</style>
