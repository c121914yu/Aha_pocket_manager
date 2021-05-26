<template>
	<div class="forum-tags">
		<h1>论坛标签管理</h1>
		<div 
			class="tag"
			v-for="(tag,i) in arr_tags"
			:key="tag.id">
			<el-tag
				closable 
				:disable-transitions="false" 
				@close="removeTag(tag.id,i)"
				@click="updateIndex=i">
				{{ tag.name }}
			</el-tag>
			<el-input
				class="input-update-tag"
				v-if="i === updateIndex"
				size="small"
				placeholder="修改标签内容"
				@keyup.enter.native="changeTag(tag.id,i)"
				@blur="changeTag(tag.id,i)"
				v-model="inputContent"
			></el-input>
		</div>
		
		<el-input
			class="input-new-tag"
			v-if="is_inputTag"
			size="small"
			placeholder="新标签"
			@keyup.enter.native="addTags"
			@blur="addTags"
			v-model="inputContent"
		></el-input>
		<el-button 
			v-else 
			class="button-new-tag" 
			size="small" 
			@click="is_inputTag=true">
			+ New Tag
		</el-button>
	</div>
</template>

<script>
import { getTags, postTag, putTag, deleteTag } from '@/assets/axios/api_forum.js';
export default {
	data() {
		return {
			arr_tags: [],
			is_inputTag: false,
			updateIndex: null,
			inputContent: ""
		};
	},
	created() {
		getTags()
		.then(res => {
			console.log(res);
			this.arr_tags = res.data;
		});
	},
	methods: {
		/**
		 * 添加新标签
		 */
		addTags()
		{
			if(this.inputContent) {
				this.$store.commit("setLoading",true)
				postTag(this.inputContent)
				.then(res => {
					this.arr_tags.push({
						id: res.data,
						name: this.inputContent
					})
					this.$showSuccess = "添加成功"
				})
				.finally(() => this.$store.commit("setLoading",false))
				this.inputContent = ""
			}
			this.is_inputTag = false
		},
		/**
		 * 修改标签内容
		 */
		changeTag(id,i)
		{
			if(this.inputContent) {
				putTag(id,this.inputContent)
				this.$showSuccess = "修改成功"
				this.arr_tags[i].name = this.inputContent
				this.inputContent = ""
			}
			this.updateIndex = null
		},
		/**
		 * 删除标签
		 * @param {Number} id
		 * @param {Number} i
		 */
		removeTag(id,i)
		{
			console.log(id);
			this.$confirm("确认删除该标签?", () => {
				deleteTag(id)
				this.arr_tags.splice(i,1)
			})
		}
	}
};
</script>

<style lang="stylus" scoped>
.forum-tags
	position relative
	h1
		margin-bottom 10px
		color var(--blue)
	.tag
		margin-bottom 10px
		display flex
		align-items center
		.input-update-tag
			margin-left 10px
			width 150px
	.button-new-tag 
		height 32px
		line-height 30px
		padding 0 10px
	.input-new-tag 
		width 150px
</style>
