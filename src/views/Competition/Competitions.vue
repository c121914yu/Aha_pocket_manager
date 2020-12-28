<template>
	<div class="competitions">
		<h1>比赛信息管理</h1>
		<el-button 
			class="add-btn" 
			icon="el-icon-circle-plus-outline" 
			type="primary"
			@click="competition={}">
			添加比赛
		</el-button>
		<el-table 
			ref="table"
			style="width: 100%"
			stripe
			:data="competitions.filter(item => !searchText || item.name === searchText)">
			<el-table-column
				label="ID"
				width="100"
				prop="id"
				align="center">
			</el-table-column>
			<el-table-column
				label="比赛名称"
				align="center"
				prop="name">
			</el-table-column>
			<el-table-column
				label="比赛分类"
				align="center"
				prop="competitionType.name">
			</el-table-column>
			<el-table-column
				label="比赛介绍"
				align="center">
				<template slot-scope="scope">
					<el-button size="mini" @click="showIntro=scope.row.intro">点击查看比赛介绍</el-button>
				</template>
			</el-table-column>
			<el-table-column align="center">
				<template slot="header" slot-scope="scope">
					<el-input
						class="search-input"
						size="mini"
						placeholder="输入比赛名称进行搜索"
						v-model="searchText"/>
				</template>
				<template slot-scope="scope">
					<el-button size="mini" @click="EditType=1;competition={...scope.row,type:scope.row.competitionType.id}">Edit</el-button>
				</template>
			</el-table-column>
		</el-table>
		<IntroCard v-if="showIntro" title="比赛介绍" :html="showIntro" @close="showIntro=''"></IntroCard>
		<EditCompetition 
			v-if="competition"
			:competitionInfo="competition" 
			:type="EditType"
			@close="competition=null;EditType=0"
			@finish="getCompetitions">
		</EditCompetition>
	</div>
</template>

<script>
import EditCompetition from "@/components/EditCompetition/EditCompetition.vue"
import IntroCard from "@/components/IntroCard/IntroCard.vue"
import { getComps } from "@/assets/axios/api.js"
export default{
	data(){
		return{
			competitions: [],
			searchText: "",
			EditType: 0,
			competition: null,
			showIntro: ''
		}
	},
	components: {
		EditCompetition,
		IntroCard
	},
	created() {
		this.getCompetitions()
	},
	methods:{
		/* 获取比赛信息 */
		getCompetitions()
		{
			this.EditType = 0
			this.competition = null
			getComps()
			.then(res => {
				this.$store.state.arr_competions = res.data
				this.competitions = res.data
				console.log(res.data);
			})
		},
	}
}
</script>

<style lang="stylus" scoped>
.competitions
	position relative
	h1
		margin-bottom 10px
		color var(--blue)
	.add-btn
		position absolute
		top 0
		right 10px
	.search-input
		max-width 300px
</style>
