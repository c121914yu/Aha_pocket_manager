<template>
	<div v-if="userInfo" class="user-info">
		<!-- 基本信息 -->
		<el-form label-width="80px">
			<h2 class="center">用户基础信息</h2>
			<!-- 头像 -->
			<el-tooltip content="点击修改头像" placement="right-start">
				<label class="check-file">
					<el-avatar
						:size="60" 
						:src="userInfo.avatarUrl">
						<img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
					</el-avatar>
					<input type="file" @change="changeAvatar">
				</label>
			</el-tooltip>
			<!-- id -->
			<el-form-item label="userId">
				{{userInfo.id}}
			</el-form-item>
			<!-- 昵称 -->
			<el-form-item label="昵称">
				<el-input :disabled="!allowEdit" v-model="userInfo.nickname"></el-input>
			</el-form-item>
			<!-- 真实姓名 -->
			<el-form-item label="真实姓名">
				<el-input :disabled="!allowEdit" v-model="userInfo.trueName"></el-input>
			</el-form-item>
			<!-- 比赛标签 -->
			<el-form-item label="特长标签">
				<el-tag
					v-for="(tag,index) in specialtyTags"
					:key="index"
					:closable="allowEdit"
					:disable-transitions="false"
					@close="removeTag('specialtyTags',index)">
				  {{tag}}
				</el-tag>
				<span v-if="allowEdit && specialtyTags.length<4">
					<el-input
					  class="input-new-tag"
					  v-if="inputVisible==='specialtyTags'"
					  v-model="inputValue"
					  ref="saveTagInput"
					  size="small"
					  @keyup.enter.native="addTag('specialtyTags')"
					  @blur="addTag('specialtyTags')">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput('specialtyTags')">+ New Tag</el-button>
				</span>
			</el-form-item>
			<!-- 特长标签 -->
			<el-form-item label="比赛标签">
				<el-tag
					v-for="(tag,index) in compTags"
					:key="index"
					:closable="allowEdit"
					:disable-transitions="false"
					@close="removeTag('compTags',index)">
					{{tag}}
				</el-tag>
				<span v-if="allowEdit && compTags.length<4">
					<el-input
					  class="input-new-tag"
					  v-if="inputVisible==='compTags'"
					  v-model="inputValue"
					  ref="saveTagInput"
					  size="small"
					  @keyup.enter.native="addTag('compTags')"
					  @blur="addTag('compTags')">
					</el-input>
					<el-button 
						v-else 
						class="button-new-tag" 
						size="small"
						 @click="showInput('compTags')">
						 + New Tag
					</el-button>
				</span>
			</el-form-item>
			<!-- 用户简历 -->
			<el-form-item label="用户简历">
				<router-link class="link-resume" :to="'/resume/'+userInfo.id">查看用户简历</router-link>
			</el-form-item>
			<!-- 按键 -->
			<el-form-item>
				<el-button v-if="allowEdit" class="save-btn" type="primary" @click="saveInfo">保存信息</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="el-icon-bell" @click="isSendInform=true">发送通知</el-button>
				<el-button icon="el-icon-warning" type="danger">禁止登录</el-button>
			</el-form-item>
		</el-form>
		<!-- 重要信息 -->
		<el-form label-width="80px">
			<h2 class="center">用户重要信息</h2>
			<!-- 身份 -->
			<el-form-item label="用户身份">
				<el-select 
					placeholder="请选择用户身份"
					v-model="userInfo.role.name"
					:disabled="!allowEdit"
					@change="setUserRole">
				    <el-option
				      v-for="item in roles"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				  </el-select>
			</el-form-item>
			<!-- 手机号 -->
			<el-form-item label="手机号">
				{{userInfo.phone || "未绑定"}}
			</el-form-item>
			<!-- 余额 -->
			<el-form-item label="余额">
				<strong>100元</strong>
			</el-form-item>
			<!-- 贡献点 -->
			<el-form-item label="贡献点">
				<strong>{{userInfo.contribPoint}}</strong>
				<span class="give-point">发放贡献点</span>
			</el-form-item>
			<!-- 协议签署 -->
			<el-form-item label="协议状态">
				<el-radio-group :disabled="!allowEdit" v-model="userInfo.signedNotice" @change="setNotice">
					<el-radio :label="true">已签署</el-radio>
					<el-radio :label="false">未签署</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 合同签署 -->
			<el-form-item label="合同状态">
				<el-radio-group :disabled="!allowEdit" v-model="userInfo.signedContract" @change="setNotice">
					<el-radio :label="true">已签署</el-radio>
					<el-radio :label="false">未签署</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 合同图片 -->
			<el-form-item v-if="userInfo.signedContract" label="合同图片">
				<el-image 
					style="width: 100px;"
					:src="contarctImg" 
					:preview-src-list="[contarctImg]">
				</el-image>
			</el-form-item>
		</el-form>
		<!-- 活跃程度 -->
		<el-form label-width="80px">
			<h2 class="center">用户活跃程度</h2>
			
		</el-form>
		<!-- 用户消费记录 -->
		<el-form label-width="80px">
			<h2 class="center">用户消费记录</h2>
			
		</el-form>
		<SendInform 
			v-if="isSendInform"
			:receiver="{...userInfo,title: '私信用户'}"
			@close="isSendInform=false"
			@success="sendInform">
		</SendInform>
	</div>
</template>

<script>
import { upFile,getUser,getUserContract,getAvatarSign,putUserPrivate,putUserOpen,sendInform } from "@/assets/axios/api.js"
import SendInform from "@/components/SendInform/SendInform.vue"
export default{
	data(){
		return {
			allowEdit: false,
			userInfo: null,
			contarctImg: "",
			inputVisible: false,
			inputValue: "",
			roles: ["ROLE_USER","ROLE_ADMIN"],
			isSendInform: false
		}
	},
	computed: {
		specialtyTags(){
			if(this.userInfo.specialtyTags)
				return this.userInfo.specialtyTags.split(",")
			return ""
		},
		compTags(){
			if(this.userInfo.compTags)
				return this.userInfo.compTags.split(",")
			return ""
		}
	},
	watch: {
		"$route": "initData"
	},
	methods: {
		/* 初始化数据 */
		initData()
		{
			getUser(this.$route.params.id)
			.then(res => {
				this.userInfo = res.data
				console.log(this.userInfo)
				/* 请求合同图片 */
				this.getContract()
				/* 普通管理员仅可修改自己的信息 */
				if(this.$store.state.myInfo.userInfo.userId == this.$route.params.id){
					this.allowEdit = true
				}
			})
		},
		/* 获取合同图片,预先判断是否签署 */
		getContract()
		{
			if(this.userInfo.signedContract){
				getUserContract(this.userInfo.id)
				.then(res => {
					/* 二进制转base64 */
					let binary = ''
					let bytes = new Uint8Array(res)
					for (let i=0;i<bytes.byteLength;i++) {
						binary += String.fromCharCode(bytes[i])
					}
					this.contarctImg = 'data:image/jpeg;base64,' + window.btoa(binary)
				})
			}
		},
		/* 修改头像 */
		changeAvatar(e)
		{
			const file = e.target.files[0]
			getAvatarSign()
			.then(res => {
				upFile({
					...res.data,
					name: `${res.data.dir}/${file.name}`,
					file
				})
				.then(res => {
					console.log(res);
				})
				.catch(err => {
					console.log(err);
					this.$showError("上传头像错误")
				})
			})
		},
		/* 修改用户身份（设置管理员） */
		setUserRole(e)
		{
			console.log(e);
		},
		/* 
			name：修改协议状态
			desc: 根据选中协议状态调用API更新协议状态
			time: 2020/11/28
		*/
		setNotice(e)
		{
			putUserPrivate(this.userInfo.id,{
			  signedNotice: e
			})
			.then(res => {
				if(e){
					this.$showSuccess("协议已签署")
				}
				else{
					this.$showWarn("协议取消签署")
				}
			})
		},
		/*
			name：修改合同状态
			desc: 根据选中合同状态调用API更新合同状态
			time: 2020/11/28
		*/
		setContract(e)
		{
			putUserPrivate(this.userInfo.id,{
				signedContract: e
			})
			.then(res => {
				if(e){
					this.$showSuccess("合同已签署")
				}
				else{
					this.$showWarn("合同取消签署")
				}
			})
		},
		/* 添加新标签按键 */
		showInput(key) 
		{
			this.inputVisible = key
			this.$nextTick(() => {
				this.$refs.saveTagInput.$refs.input.focus();
			})
		},
		/*
			name: 添加新标签
			desc: 传入键值，向userInfo追加字段
			time: 2020/11/28
		*/
		addTag(key)
		{
			if (this.inputValue){
				this.userInfo[key] += `,${this.inputValue}`
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
		/*
			name: 删除标签
			desc: 传入下标和key值，删除userInfo中某个字段（先转化成数组去除，再转化成字符串）
			time: 2020/11/28
		*/
		removeTag(key,index)
		{
			const tagArr = this.userInfo[key].split(",")
			tagArr.splice(index,1)
			this.userInfo[key] = tagArr.join(",")
		},
		/* 
			name: 保存用户公开信息
			desc: 用户公开信息：userInfo中userInfo字段
			time： 2020/11/28
		*/
		saveInfo()
		{
			const data = {
				avatarUrl: this.userInfo.avatarUrl,
				nickname: this.userInfo.nickname,
				trueName: this.userInfo.trueName,
				compTags: this.userInfo.compTags,
				specialtyTags: this.userInfo.specialtyTags,
			}
			putUserOpen(this.userInfo.id,data)	
			.then(res => {
				this.$showSuccess("修改成功")
			})
		},
		/* 
			name: 发送通知
			desc: 调用API向用户发送通知
			params：
					receiverUserId: int,用户id
					title: String,题目
					content: String,内容
		*/
		sendInform(e)
		{
			sendInform(e)
			.then(res => {
				this.$showSuccess("发送通知成功！")
				this.isSendInform = false
			})
			.catch(err => {
				this.isSendInform = false
			})
		}
	},
	created() {
		this.initData()
	},
	components: {
		SendInform
	}
}
</script>

<style lang="stylus" scoped>
.user-info
	display grid
	grid-template-columns 1fr 1fr
	grid-gap 10px
	.el-form
		padding 10px
		background-color rgba(64,158,255,0.04)
		border-radius 8px
		box-shadow var(--shadow1)
		h2
			margin-bottom 10px
		.check-file
			margin-left calc(50% - 30px)
			display inline-block
		.el-form-item
			margin 5px 0
			.el-input
				max-width 300px
			.el-tag
				margin 0 5px 5px 0
			.button-new-tag 
				margin-left 5px
				height 32px
				line-height 30px
				padding-top 0
				padding-bottom 0
			.input-new-tag
				width 100px
				margin-left 5px
				padding 0
			.link-resume
				border 1px solid var(--boder-color1)
				padding 5px 10px
				border-radius var(--radius2)
			.save-btn
				width 300px
			.give-point
				margin-left 10px
				color var(--blue)
				text-decoration underline
				cursor pointer
</style>
