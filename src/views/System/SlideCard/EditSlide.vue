<template>
	<div class="edit-slide popup">
		<el-form 
			class="content"
			ref="informForm" 
			label-width="100px" 
			:rules="rules" 
			:model="slideCard">
			<h2 class="center">{{ type === 0 ? '添加新轮播图' : '修改轮播图' }}</h2>
			<el-form-item class="picture" label="轮播图图片">
				<el-image
					v-if="slideCard.pictureUrl"
					style="width: 100px;border-radius: 8px;"
					:src="slideCard.pictureUrl"
					fit="fill"
					:preview-src-list="[slideCard.pictureUrl]">
				</el-image>
				<label>
					<i class="el-icon-upload"></i>
					<input type="file" @change="checkImg"/>
				</label>
			</el-form-item>
			<el-form-item label="跳转类型" prop="linkType">
				<el-radio-group v-model="slideCard.linkType">
					<el-radio :label="1">小程序内跳转</el-radio>
					<el-radio :label="2">外部跳转</el-radio>
				  </el-radio-group>
			</el-form-item>
			<el-form-item label="是否启用" prop="linkUrl">
				<el-input placeholder="跳转地址" v-model="slideCard.linkUrl"></el-input>
			</el-form-item>
			<el-form-item label="是否启用" prop="enabled">
				<el-radio-group v-model="slideCard.enabled">
					<el-radio :label="true">启用</el-radio>
					<el-radio :label="false">禁用</el-radio>
				  </el-radio-group>
			</el-form-item>
			<el-form-item class="btns">
				<el-button class="sure" type="primary" plain @click="handleSure">确认</el-button>
				<el-button class="cancel" type="info" @click="$emit('close')">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { postSlide,putSlide } from "@/assets/axios/api_system.js"
export default {
	props: {
		slideInfo: {
			type: Object,
			default: () => {}
		},
		type: {
			type: Number,
			default: 0,//0新，1修改
		}
	},
	data() {
		return {
			rules: {
				linkUrl: [{ required: true, message: '请输入跳转地址', trigger: 'blur' }],
			},
			file: null,
			slideCard: {
				pictureUrl: '',
				linkType: 1,
				linkUrl: '',
				enabled: true,
			}
		}
	},
	created() {
		if (this.type === 1) {
			this.slideCard = {...this.slideInfo}
			console.log(this.slideInfo)
		}
	},
	methods: {
		/* 选择图片 */
		checkImg(e) {
			this.file = e.target.files[0];
			this.slideCard.pictureUrl = window.URL.createObjectURL(this.file);
		},
		/* 
			name: handleSure
			desc: 点击确认按键，先进行表单验证，然后根据type类型分别调用保存和修改API对比赛信息进行操作
		*/
		handleSure() {
			this.$refs.informForm.validate(valid => {
				if (valid) {
					if(this.slideCard.pictureUrl === ""){
						this.$showWarn("请选择轮播图片")
					}
					else{
						this.$confirm(this.type === 0 ? "确认新增轮播图？" : "确认修改该轮播图？",() => {
							/* 上传文件 */
							if(this.file){
								this.gUpFile(`轮播图${Date.now()}.jpg`,this.file)
								.then(res => {
									this.slideCard.pictureUrl = `https://${res.Location}`
									this.updateSlide()
								})
								.catch(err => {
									console.log(err);
									this.$showWarn("上传图片失败")
								})
							}
							else{
								this.updateSlide()
							}
						})
					}
				} 
				else {
					return false
				}
			})
		},
		/* 更新轮播图 */
		updateSlide()
		{
			/* 新图 */
			if (this.type === 0) {
				postSlide(this.slideCard)
				.then(res => {
					this.$emit("finish")
					this.$showSuccess("添加轮播图成功")
				})
			} 
			else {
				console.log(this.slideCard);
				putSlide(this.slideCard)
				.then(res => {
					this.$emit("finish")
					this.$showSuccess("修改轮播图成功")
				})
			}
		}
	}
};
</script>

<style lang="stylus" scoped>
.edit-slide
	.content
		width 600px
		h2
			margin-bottom 10px
			color var(--blue)
		.picture
			i
				margin-left 20px
				font-size 2em
				color var(--blue)
				cursor pointer
			.el-image
				border 1px solid var(--border1)
		.btns
			.sure
				width 30%
</style>
