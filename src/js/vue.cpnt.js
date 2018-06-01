//import Vue from "Vue";
const ajax = require('./server.js');

/**
 * vue 组件
 * author hhq
 * date 2018-4-27 10:29:27
 */
//时间格式化工具
Date.prototype.format = function(format){
	var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(),    //day
		"h+" : this.getHours(),   //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		"S" : this.getMilliseconds() //millisecond
	};
	
	if(/(y+)/.test(format)){
		format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	
	for(var k in o){
		if(new RegExp("("+ k +")").test(format)){
			format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		}
	}
	return format;
};

//全局组件，因此注册组件的vue应该可以实例化app的vue是同一个
module.exports = function(Vue){
	//Vue 注册全局过滤器，全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面  
	Vue.filter('dataFilter', function(value) {   
		if(!value){
			return '';
		}
		var date = null;

		if(value.indexOf('000Z') < 0){
			date = new Date(value.replace(/-/g,'/'))
		}else{
			date = new Date(value)
		}
		return date.format('yyyy-MM-dd');  
	}); 

	Vue.prototype.validate = function(fields,success){
		var len = fields.length;

		for(var i = 0;i < len; i++){
			var keys = fields[i].split('.'),
				lastKey = keys[keys.length - 1],
				val = this;

			keys.forEach((it,idx) => {
				val = val[it]
			});

			if(val == undefined || val == ''){
				if(fields[i].indexOf('picture') > -1){
					weui.alert('请上传封面图');
				}else{
					var hash = location.hash;
					if(hash == ''){
						location.href = location.href + '#' + lastKey;
					}else{
						location.href = location.href.replace(/#.+/,'#' + lastKey)
					}
					weui.toast('星号必填项不能为空');
				}
				
				return false;
			}
		}

		if(typeof success == 'function') success();

		return true;
	};

	//分页组件
	Vue.component('page-cpt',{
		props : ['pages','current'],
		template : '<div class="text-center" v-if="pages > 0">' +
			'<ul class="pagination">' + 
				'<li :class="{disabled : current === 1}"><a @click="changePage(1)" :href="href + 1">首页</a></li>' +
				'<li :class="{disabled : current === 1}"><a @click="changePage(current - 1)" :href="href + (current - 1)">上一页</a></li>' +
				'<template v-for="n in pages > 6 ? 6 : pages">' +
				'<li v-if="current > 3 &&　current <= pages - 3" :class="{active : current === n + current - 3}"><a @click="changePage(n + current - 3)" :href="href + (n + current - 3)">{{n + current - 3}}</a></li>' +
				'<li v-if="current > 3 &&　current > pages - 3" :class="{active : current === n + pages - 6}"><a @click="changePage(n + pages - 6)" :href="href + (n + pages - 6)">{{n + pages - 6}}</a></li>' +
				'<li v-if="current <= 3" :class="{active : current === n}"><a @click="changePage(n)" :href="href + n">{{n}}</a></li>' +
				'</template>'+

				'<li :class="{disabled : current === pages}"><a @click="changePage(current + 1)" :href="href + (current + 1)">下一页</a></li>' +
				'<li :class="{disabled : current === pages}"><a @click="changePage(pages)" :href="href + pages">末页</a></li>' +
				'<li class="disabled"><a :href="href">共{{current}}/{{pages}}页</a></li>' +
			'</ul>' +
		'</div>',
		
		methods : {
			//跳转页面
			changePage : function(cPage){
				if(cPage < 1 || cPage > this.pages){
					return;
				}
				
				//this.current = cPage;
				var a = this.$emit('switch',cPage);
			}
		},
		computed: {
			
		},
		data : function(){
			return { 
				href : '#App?page=',
			};
		}
	});

	Vue.component('input-cpt',{
		props: {
			label: {required: true},
			value: {},
			type: { default: 'text'},
			//是否必填
			rq: {
				type: Boolean,
				default: false
			},
			max: { 
				type: Number,
				default: 100
			},
		},
		template: '<div class="profile-info-row">' +
			'<div class="profile-info-name"><span v-if="rq" class="required">*</span>{{label}}</div>' +
			'<div class="profile-info-value">' +
				'<textarea v-if="type == \'textarea\'" :maxLength="max" :value="value" v-on:input="updateValue($event.target.value)" :placeholder="\'请输入\' + label"></textarea>' +
				'<input v-else :type="type" :maxLength="max" ref="input" :value="value" v-on:input="updateValue($event.target.value)" :placeholder="\'请输入\' + label">' +
			'</div>' +
		'</div>',
		methods: {
			updateValue: function (value) {
				// 通过 input 事件带出数值
				this.$emit('input',value)
			}
		}
	});

	Vue.component('select-cpt',{
		props: {
			label: {required: true},
			value: {},
			options: Array,
			//是否必选
			rq: {
				type: Boolean,
				default: false
			},
			isobj: { default: true}
		},
		template: '<div class="profile-info-row">' +
			'<div class="profile-info-name"><span v-if="rq" class="required">*</span>{{label}}</div>' +
			'<div class="profile-info-value">' +
				'<select :value="value" v-on:change="updateValue($event.target.value)">' +
					'<option disabled value="">{{"请选择" + label}}</option>' +
					'<option v-for="item in options" :value="isobj ? item.name : item">{{isobj ? item.name : item}}</option>' +
				'</select>' +
			'</div>' +
		'</div>',
		methods: {
			updateValue: function (value) {
				// 通过 input 事件带出数值
				this.$emit('input',value)
			}
		}
	});

	Vue.component('loading-cpt',{
		props: ['hasnext','len'],
		template: '<div>' +
			'<div class="weui-loadmore" v-if="hasnext">' +
				'<i class="weui-loading"></i>' +
				'<span class="weui-loadmore__tips">正在加载更多</span>' +
			'</div>' +
			// '<div class="weui-loadmore weui-loadmore_line" v-if="hasnext">' +
			//     '<a class="weui-loadmore__tips" @click="loadMore">点击加载更多</a>' +
			// '</div>' +
			'<div class="weui-loadmore weui-loadmore_line" v-if="!hasnext && len != 0">' +
				'<span class="weui-loadmore__tips">没有更多数据</span>' +
			'</div>' +
			'<div class="weui-loadmore weui-loadmore_line" v-if="!hasnext && len == 0">' +
				'<span class="weui-loadmore__tips">暂无相关数据</span>' +
			'</div>' +
		'</div>'
	})


	//上传封面组件
	Vue.component('upload-cover-cpt',{
		props: {
			picture: {},
			btnText: {
				default: '上传封面'
			}
		},
		template: '<div>' +
			'<span class="profile-picture">' +
				'<img width="180" class="editable img-responsive" :src="picture || defaultPicture">' +
			'</span>' +
			'<div><a class="btn btn-info btn-upload">{{btnText}}<input @change="handleFileChange" type="file" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp"/></a></div>' +
		'</div>',
		data: function(){
			return {
				defaultPicture: 'images/default.jpg'
			}
		},
		methods: {
			handleFileChange: function (value) {
				// 通过 input 事件带出数值
				this.$emit('upload',value);
			}
		}
	})

	//右侧部件
	Vue.component('widget-cpt',{
		props: ['name','flag'],
		template: `<div class="aside-widget">
			<header>
				<h3>{{name}}</h3>
			</header>
			<div class="body">
				<ul class="clean-list">
					<li class="ell" v-for="(item,index) in list">
						<a :href="'single.html?id=' + item.id">{{item.title}}</a>
					</li>
				</ul>
			</div>
		</div>`,
		data: function(){
			return {
				list: []
			}
		},
		methods: {
			getList: function(){
				var that = this,
					url = '';

				switch(this.flag){
					case 1: url = '/getHotBlogList';break;
					case 2: url = '/getRecommendBlogList';break;
				}

				ajax.getJSON(url,function(res){
					that.list = res.data.list;
				});
			}
		},
		mounted: function(){
			this.$nextTick(function () {
				this.getList();
			})
		}
	})
}
