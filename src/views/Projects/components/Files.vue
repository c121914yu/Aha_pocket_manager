<!-- 文件和项目成员 -->
<template>
	<div v-if="projectId>0" class="filesInfo">
		<label style="padding: 7px 15px;background-color: var(--blue);color: #FFFFFF;" class="select-file">
			<input type="file" multiple @change="selectFile($event)">
			<span>选取文件</span>
		</label>
		<el-button
			style="margin-left: 10px;"
			size="small" 
			:disabled="!canUp"
			@click="upFile">
			上传
		</el-button>
		<!-- 上传列表 -->
		<div
			class="file"
			v-for="(file,index) in fileList"
			:key="index">
			<div style="flex: 1;">
				<header><strong><small>{{file.name}}</small></strong></header>
				<el-progress :percentage="file.progress"></el-progress>
				<footer>
					<div class="type">{{$store.state.arr_fileTypes[file.fileType].label}} / {{$store.state.arr_fileClassify[file.typeId-1].label}}</div>
					<div>
						<div class="price">
							<i class="iconfont icon-qian"></i>
							{{file.price}}
						</div>
					</div>
				</footer>
			</div>
			<i class="edit icon el-icon-edit-outline" @click="openSetFile(file,index)"></i>
			<i class="delete icon el-icon-delete" @click="deleteFile(file,index)"></i>
		</div>
		<SetFile
			v-if="file"
			:file="file"
			:level="level"
			@close="file=null"
			@finish="changeFile">
		</SetFile>
	</div>
</template>

<script>
import { postFile,putFile,getUpFileSign,removeFile } from "@/assets/axios/api_project.js"
import SetFile from "./SetFile.vue"
export default{
	props:{
		projectId: {
			type: Number,
			default: 0
		},
		level: {
			type: Number,
			default: 53
		}
	},
	data(){
		return{
			fileList: [],
			members: [],
			userId: "",
			member: null,
			file: null
		}
	},
	computed: {
		canUp(){
			let files = this.fileList.filter(file => file.progress===0)
			return files.length > 0
		}
	},
	components: {
		SetFile
	},
	methods:{
		selectFile(e)
		{
			const renderSize = (fsize) => {
				const unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB")
				let index = 0
				let srcsize = parseFloat(fsize)
				index = Math.floor(Math.log(srcsize) / Math.log(1024))
				let size = srcsize / Math.pow(1024,index)
				size = size.toFixed(2)
				return size + unitArr[index]
			}
			const award = this.$store.state.arr_prizeLevels.find(item => item.value === this.level)
			e.target.files.forEach(file => {
				const type = this.$store.state.arr_fileTypes.find(item => item.reg.test(file.name))
				this.fileList.push({
					name: file.name,
					file,
					size: renderSize(file.size),
					typeId: this.$store.state.arr_fileClassify[3].value,
					fileType: type.value,
					price: (award.max + award.min)/2 * this.$store.state.arr_fileClassify[3].rate,
					progress: 0,
					status: 0, // 0待上传，1上传成功，2上传中，3上传失败
				})
			})
			console.log(this.fileList);
		},
		openSetFile(file,index)
		{
			this.file = {
				...file,
				index
			}
		},
		/* 修改文件信息 */
		changeFile(file)
		{
			/* 替换filelist中file */
			this.fileList[file.index] = file
			/* 根据progress判断是否未以及上传的文件，若已经上传需要触发修改API */
			if(file.progress >= 100){
				this.$store.commit("setLoading",true)
				putFile(file)
				.then(res => {
					this.$showSuccess("修改成功")
					this.$store.commit("setLoading",false)
				})
				.catch(err => {
					this.$store.commit("setLoading",false)
				})
			}
			else{
				this.$showSuccess("修改成功")
			}
			this.file = null
		},
		upFile()
		{
			let successAmount = 0
			let sumFiles = 0
			const updateFiles = (data,index) => {
				postFile(this.projectId,data)
				.then(res => {
					this.fileList[index].id = res.data
					successAmount++
					if(successAmount === sumFiles){
						this.$showSuccess("添加附件成功")
						this.$store.commit("setLoading",false)
					}
				})
			}
			this.fileList.forEach((file,index) => {
				/* 筛选未上传的项目 */
				if(file.progress < 100){
					sumFiles++
					this.$store.commit("setLoading",true)
					getUpFileSign(this.projectId,file.name)
					.then(res => {
						this.gUploadFile(file.file,res.data,(progress) => {
							file.progress = progress
						})
						.then(loadRes => {
							/* 添加新附件 */
							updateFiles({
								name: file.name,
								fileType: file.fileType,
								typeId: file.typeId,
								filename: res.data.filename,
								price: file.price,
								discount: 0
							},index)
						})
					})
				}
			})
		},
		deleteFile(file,index)
		{
			this.$confirm("确认删除该文件?",() => {
				removeFile(file.id)
				this.fileList.splice(index,1)
				this.$showSuccess("删除文件成功")
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.filesInfo
	.file
		margin 10px 0
		display flex
		align-items center
		header
			display flex
			.name
				margin-right 5px
				flex 1
				white-space pre-wrap
		footer
			display flex
			font-size 12px
			padding-right 20px
			.type
				flex 1
			.price
				color var(--origin1)
				.iconfont
					font-size 14px
		.icon
			font-size 20px
			cursor pointer
			&.edit
				margin-right 10px
				color var(--blue)
			&.delete:hover
				color var(--red)
</style>
