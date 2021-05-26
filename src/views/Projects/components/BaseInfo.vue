<template>
	<div class="base">
		<!-- 头像 -->
		<div class="avatar">
			<el-image 
				style="width: 70px; height: 70px;border-radius: 8px;" 
				:src="baseInfo.avatarUrl" placeholder="头像加载中..." 
				fit="cover" 
				lazy
				:preview-src-list="[baseInfo.avatarUrl]">
			</el-image>
			<label class="select-file">
				<div>编辑项目头像</div>
				<input 
					ref="avatarUrl"
					type="file"
					accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" 
					@change="selectFile('avatarUrl')"/>
			</label>
		</div>
		<!-- 表单信息 -->
		<el-form ref="baseInfoForm" :rules="rules" :model="baseInfo" label-width="85px">
			<el-form-item label="项目名称" prop="name"><el-input placeholder="项目名称" v-model="baseInfo.name"></el-input></el-form-item>
			<el-form-item class="project-tags" label="项目标签" prop="tags">
				<el-input class="input-tag" size="small" placeholder="输入标签,不同标签以空格隔开" v-model="baseInfo.tags">
					<template slot="append">
						<small>空格隔开</small>
					</template>
				</el-input>
				<el-tag v-for="(tag, index) in tags" :key="index">{{ tag }}</el-tag>
			</el-form-item>
			<el-form-item label="获奖比赛" prop="compName">
				<el-select 
					style="width: 100%" 
					filterable 
					placeholder="请选择获奖比赛" 
					allow-create
					v-model="baseInfo.compName" 
					@change="baseInfo.awardLevel = ''">
					<el-option 
						v-for="(item, index) in $store.state.arr_competitions" 
						:key="index" 
						:label="item.name" 
						:value="item.name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="baseInfo.compName" label="获奖时间" prop="awardTime">
				<el-date-picker 
					v-model="baseInfo.awardTime" 
					type="month"
					placeholder="请选择获奖时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item v-if="baseInfo.compName" label="获奖等级" prop="awardLevel">
				<el-select filterable placeholder="请选择获奖等级" v-model="baseInfo.awardLevel">
					<el-option 
						v-for="(item, index) in levels" 
						:key="item.value" 
						:label="item.label" 
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="baseInfo.compName" label="获奖证明" prop="awardProveUrl">
				<div class="award-prove">
					<el-image
						v-if="baseInfo.awardProveUrl"
						style="margin-right: 10px;width: 70px; height: 70px;border-radius: 8px;"
						:src="baseInfo.awardProveUrl"
						fit="cover"
						lazy
						:preview-src-list="[baseInfo.awardProveUrl]"
					></el-image>
					<label class="select-file">
						<div>选择获奖证明</div>
						<input
							ref="awardProveUrl"
							type="file"
							accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" 
							@change="selectFile('awardProveUrl')"/>
					</label>
				</div>
			</el-form-item>
			<el-form-item v-if="projectId===0" label="归属用户" prop="userId">
				<el-input placeholder="用户的ID" v-model.number="baseInfo.userId"></el-input>
			</el-form-item>
		</el-form>
		<!-- 修改项目按键 -->
		<el-button 
			v-if="projectId>0"
			style="display: block;margin-left: 85px;" 
			type="primary" 
			size="small"
			@click="updateProject">
			修改项目信息
		</el-button>
		<!-- 新建项目按键 -->
		<el-button
			v-else
			style="display: block;margin-left: 85px;" 
			type="primary" 
			size="small"
			@click="creaProject">
			创建项目
		</el-button>
	</div>
</template>

<script>
import { putProject } from "@/assets/axios/api_project.js"
import { getPublicSign } from "@/assets/axios/api_system.js"
export default{
	props: {
		projectId: {
			type: Number,
			default: 0
		}
	},
	data(){
		return{
			baseInfo: {
				avatarUrl: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png",
				name: "",
				tags: "",
				compName: "",
				awardLevel: "",
				awardTime: "",
				awardProveUrl: "",
				userId: "",
			},
			rules: {
				name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
				compName: [{ required: true, message: '请输入获奖名称', trigger: 'blur' }],
				awardLevel: [{ required: true, message: '请输入获奖等级', trigger: 'blur' }],
				awardTime: [{ required: true, message: '请输入获奖时间', trigger: 'blur' }],
				awardProveUrl: [{ required: true, message: '请上传获奖证明', trigger: 'blur' }],
				userId: [{ required: true, message: '请输入项目归属用户ID', trigger: 'blur' }],
			}
		}
	},
	computed: {
		tags(){
			return this.baseInfo.tags.split(' ').filter(tag => tag !== '')
		},
		levels(){
			const comp = this.$store.state.arr_competitions.find(item => item.name === this.baseInfo.compName)
			if(comp){
				const start = (5-comp.level)*3
				return this.$store.state.arr_prizeLevels.slice(start,start+3)
			}
			else{
				return []
			}
		}
	},
	methods:{
		/* 选择图片 */
		selectFile(dom)
		{
			const res = this.gSelectFile(this.$refs[dom])
			if(res){
				this.$store.commit("setLoading",true)
				const file = res.file
				/* 获取签名 */
				getPublicSign({
					filename: `${Date.now()}.${file.name.split(".")[1]}`
				})
				.then(res => {
					this.gUploadFile(file,res.data)
					.then(res => {
						this.baseInfo[dom] = res
						this.$store.commit("setLoading",false)
					})
				})
			}
		},
		/* 创建项目，检验表单后触发父级创建方法 */
		creaProject()
		{
			this.$refs.baseInfoForm.validate(valid => {
				if(valid){
					this.$store.commit("setLoading",true)
					const baseInfo = {...this.baseInfo}
					const date = new Date(baseInfo.awardTime)
					baseInfo.awardTime = `${date.getFullYear()}-${date.getMonth()+1}`
					const data = {
						...baseInfo,
						compId: this.$store.state.arr_competitions.find(item => item.name === baseInfo.compName).id
					}
					this.$emit("createProject",data)
				}
				else{
					return false
				}
			})
		},
		/* 更新项目信息 */
		updateProject()
		{
			this.$refs.baseInfoForm.validate(valid => {
				if(valid){
					this.$store.commit("setLoading",true)
					const baseInfo = {...this.baseInfo}
					const date = new Date(baseInfo.awardTime)
					baseInfo.awardTime = `${date.getFullYear()}-${date.getMonth()+1}`
					const data = {
						id: this.projectId,
						...baseInfo,
						compId: this.$store.state.arr_competitions.find(item => item.name === baseInfo.compName).id
					}
					console.log(data);
					putProject(data)
					.then(res => {
						this.$showSuccess("修改成功")
						this.$store.commit("setLoading",false)
					})
					.catch(err => {
						this.$store.commit("setLoading",false)
					})
				}
				else{
					return false
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.base
	padding 10px
	.avatar
		display flex
		flex-direction column
		align-items center
		justify-content center
		.select-file
			margin 5px 0
	.project-tags
		.el-tag
			margin 0 8px 8px 0
	.award-prove
		display flex
		align-items center
</style>
