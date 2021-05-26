const CompressionPlugin = require("compression-webpack-plugin")
module.exports = {
	publicPath: "/",
	outputDir: "dist",
	//打包是否生成.map文件
	productionSourceMap: false,
	lintOnSave: false,
	configureWebpack: {
		// 打包忽略文件
		externals: {
			"vue": "Vue",
			"vue-router": "VueRouter",
			"vuex": "Vuex",
			"axios": "axios",
			"element-ui": "ELEMENT",
			"echarts": "echarts"
		},
		plugins: [
			
		]
	},
	pages: {
		index: {
			entry: 'src/main.js',
			template: 'public/index.html',
			filename: 'index.html',
			chunks: [ 'chunk-vendors', 'chunk-common', 'index' ],
			cdn: {
				css: [
					'https://at.alicdn.com/t/font_2234098_noyx8dp7zj.css',
					'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.0/theme-chalk/index.min.css'
				],
				js: [
					"https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.min.js",
					"https://cdn.bootcdn.net/ajax/libs/vue-router/3.4.8/vue-router.min.js",
					"https://cdn.bootcdn.net/ajax/libs/vuex/3.5.1/vuex.min.js",
					"https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.0/index.js",
					"https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js",
					"https://unpkg.com/cos-js-sdk-v5/dist/cos-js-sdk-v5.min.js",
					"https://cdn.bootcdn.net/ajax/libs/echarts/5.0.1/echarts.min.js",
				]
			}
		}
	}
}
