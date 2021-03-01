<!-- 文件属性设置 -->
<template>
	<div class="popup set-file" @click="$emit('close')">
		<div class="content" @click.stop>
			<h3 class="center">文件配置</h3>
			<el-form 
				ref="baseInfoForm" 
				label-width="80px" 
				:model="fileInfo">
				<el-form-item label="文件名" prop="name">
					<el-input v-model="fileInfo.name"></el-input>
				</el-form-item>
				<el-form-item label="文件类型" prop="fileType">
					<el-select style="width: 100%" v-model="fileInfo.fileType">
						<el-option 
							v-for="(item, index) in $store.state.arr_fileTypes" 
							:key="index" 
							:label="item.label" 
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="文件内容" prop="typeId">
					<el-select 
						style="width: 100%" 
						v-model="fileInfo.typeId"
						@change="fileInfo.price=(priceRange[0]+priceRange[1])/2">
						<el-option 
							v-for="(item, index) in $store.state.arr_fileClassify" 
							:key="index" 
							:label="item.label" 
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Aha点" prop="price">
					<el-input v-model="fileInfo.price"></el-input>
					<small>(最小值: {{priceRange[0]}},最大值: {{priceRange[1]}})</small>
				</el-form-item>
				<div class="btns">
					<el-button size="small" type="primary" @click="sure">确认</el-button>
					<el-button size="small" @click="$emit('close')">取消</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script>
export default{
	props: {
		file: {
			type: Object,
			default: () => {}
		},
		level: {
			type: Number,
			default: 53
		}
	},
	data(){
		return{
			fileInfo: null
		}
	},
	computed: {
		priceRange(){
			const award = this.$store.state.arr_prizeLevels.find(item => item.value === this.level)
			const rate = this.$store.state.arr_fileClassify[this.file.typeId-1].rate
			return [award.min*rate,award.max*rate]
		}
	},
	created() {
		this.fileInfo = this.file
	},
	methods:{
		/* 确认修改附件信息 */
		sure()
		{
			const range = this.priceRange
			if(this.fileInfo.price < range[0] || this.fileInfo.price > range[1]){
				this.$showWarn("价格不在范围")
				return
			}
			this.$emit('finish',this.fileInfo)
		}
	}
}
</script>

<style lang="stylus" scoped>
.set-file
	.content
		width 400px
		padding 10px
		h3
			margin-bottom 10px
			color var(--origin1)
		.btns
			margin 15px 0 5px
			display flex
			justify-content space-around
			.el-button
				width 30%
</style>
