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
			:data="competitions.filter(item => !searchText || item.name.indexOf(searchText)>-1)">
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
				:filters="compFilter"
				filter-placement="bottom-end"
				:filter-multiple="false"
				:filter-method="(value, comp) => comp.competitionType.id === value"
				column-key="comp"
				prop="competitionType.name">
			</el-table-column>
			<el-table-column
				label="比赛介绍"
				align="center">
				<template slot-scope="scope">
					<el-button size="mini" @click="getCompetition(scope)">点击查看比赛介绍</el-button>
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
					<el-button size="mini" @click="editComp(scope)">Edit</el-button>
				</template>
			</el-table-column>
		</el-table>
		<IntroCard v-if="introMsg" title="比赛介绍" :html="introMsg" @close="introMsg=''"></IntroCard>
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
import { getComps,getComp } from "@/assets/axios/api_competition.js"
import EditCompetition from "@/components/EditCompetition/EditCompetition.vue"
import IntroCard from "@/components/IntroCard/IntroCard.vue"
export default{
	data(){
		return{
			competitions: [],
			searchText: "",
			EditType: 0,
			competition: null,
			introMsg: ''
		}
	},
	computed: {
		compFilter(){
			return this.$store.state.compType.map(item => {
				return{
					text: item.label,
					value: item.value
				}
			})
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
				this.$store.state.arr_competitions = res.data
				this.competitions = res.data
				console.log(res.data);
			})
		},
		/* 点击查看介绍，获取比赛详细信息 */
		getCompetition(scope)
		{
			const showIntro = () => {
				this.introMsg = this.competitions[scope.$index].intro
			}
			if(!scope.row.intro){
				getComp(scope.row.id)
				.then(res => {
					this.competitions[scope.$index] = res.data
					showIntro()
				})
			}
			else{
				showIntro()
			}
		},
		/* 编辑比赛信息 */
		editComp(scope)
		{
			this.EditType = 1
			const showEditComp = () => {
				this.competition={
					...this.competitions[scope.$index],
					type: this.competitions[scope.$index].competitionType.id,
				}
			}
			if(!scope.row.intro){
				getComp(scope.row.id)
				.then(res => {
					this.competitions[scope.$index] = res.data
					showEditComp()
				})
			}
			else{
				showEditComp()
			}
		}
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
