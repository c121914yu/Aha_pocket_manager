<template>
	<div class="slide-card">
		<h1>轮播图管理</h1>
		<el-button 
			class="btn-publish" 
			type="primary" 
			icon="el-icon-circle-plus-outline"
			size="small"
			@click="editType=0;slideInfo={}">
			添加轮播图
		</el-button>
		<el-table 
			ref="table"
			style="width: 100%"
			:data="arr_slide">
			<el-table-column
				label="ID"
				width="100"
				prop="id"
				align="center">
			</el-table-column>
			<el-table-column
				label="创建时间"
				sortable
				width="105px"
				column-key="date"
				prop="uploadTime"
				align="center">
			</el-table-column>
			<el-table-column
				label="图片"
				align="center">
				<template slot-scope="scope">
					<el-image
						style="width: 100px;border-radius: 8px;"
						:src="scope.row.pictureUrl"
						fit="fill"
						:preview-src-list="[scope.row.pictureUrl]">
					</el-image>
				</template>
			</el-table-column>
			<el-table-column
				label="跳转类型"
				prop="linkType"
				align="center">
				<template slot-scope="scope">
					<div>{{scope.row.linkType === 1 ? "小程序内跳转" : "外部跳转"}}</div>
				</template>
			</el-table-column>
			<el-table-column
				label="跳转地址"
				prop="linkUrl"
				align="center">
			</el-table-column>
			<el-table-column
				label="是否启用"
				align="center"
				:filters="[{ text: '启用', value: true }, { text: '禁用', value: false }]"
				:filter-multiple="false"
				filter-placement="bottom-end"
				:filter-method="(value, slide) => slide.enabled === value">
					<template slot-scope="scope">
						<i v-if="scope.row.enabled" class="icon success el-icon-success"></i>
						<i v-else class="icon none el-icon-error"></i>
					</template>
			</el-table-column>
			<el-table-column 
				label="操作"
				align="center">
				<template slot-scope="scope">
					<el-button style="width: 70px;" size="mini" @click="editType=1;slideInfo=scope.row">Edit</el-button>
					<el-button style="padding: 5px;" size="mini" type="danger" @click="removeSlide(scope.row)">Remove</el-button>
				</template>
			</el-table-column>
		</el-table>
		<EditSlide
			v-if="slideInfo"
			:slideInfo="slideInfo"
			:type="editType"
			@close="slideInfo=null"
			@finish="getSlideCard">
		</EditSlide>
	</div>
</template>

<script>
import { getSlide,deleteSlide } from "@/assets/axios/api_system.js"
import EditSlide from "./EditSlide.vue"
export default{
	data(){
		return{
			arr_slide: [],
			slideInfo: null,
			editType: 0,
		}
	},
	components: {
		EditSlide
	},
	created() {
		this.getSlideCard()
	},
	methods:{
		/* 获取 */
		getSlideCard()
		{
			this.slideInfo = null
			getSlide()
			.then(res => {
				this.arr_slide = []
				res.data.forEach(item => {
					item.uploadTime = this.gformatDate(item.uploadTime,true)
					this.arr_slide.push(item)
				})
				console.log(this.arr_slide)
			})
		},
		/* 删除轮播图 */
		removeSlide(slide)
		{
			this.$confirm("确认删除该轮播图?",() => {
				deleteSlide(slide.id)
				.then(res => {
					this.$showWarn("删除成功")
					this.getSlideCard()
				})
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.slide-card
	position relative
	h1
		margin-bottom 10px
		color var(--blue)
	.btn-publish
		position absolute
		top 0
		right 0
	.time
		white-space pre-line
	.icon
		font-size 20px
		&.success
			color var(--green)
		&.none
			color var(--gray)
</style>
