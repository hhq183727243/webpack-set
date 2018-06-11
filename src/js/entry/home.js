import Vue from "vue";//引入vue
import ajax from '../server.js';//引入ajax封装
import vue_cpnt from "../vue.cpnt.js";//引入vue

import '../../assets/css/home.css';

vue_cpnt(Vue);//初始化后组件，由于该组件是全局组件，因此注册组件的vue应该可以实例化app的vue是同一个

new Vue({
    el: '#App',
    data: {
        list: [], //数据列表
        pages: 0,
        page: 1, //当前页
        loading: false,//加载中
        hasNext: true//是否有下一页
    },
    methods: {
        getSignature: function(){
            var that = this;

            ajax.getJSON(`/getSignature?url=${encodeURIComponent(location.href.split('#')[0])}`,function(res){
                that.initWeixinApi(res.data);
            });
        },
        initWeixinApi: function(config){
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: config.appId, // 必填，公众号的唯一标识
                timestamp: config.timestamp, // 必填，生成签名的时间戳
                nonceStr: config.noncestr, // 必填，生成签名的随机串
                signature: config.signature,// 必填，签名
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
            });

            wx.ready(function(){
                wx.onMenuShareTimeline({
                    title: '123456', // 分享标题
                    link: 'http://www.hhq.com/', //分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://www.hhq.com/uploads/1525857140193mm4102022_440x319.png', // 分享图标
                    success: function () {

                    }
                });
            });
        },
        switchPage: function(page){
            $('html, body').animate({scrollTop: $('#App').offset().top},300)
            this.getList(page);
        },
        getList: function(page){
            var that = this;

            ajax.getJSON(`/getBlogList?page=${page}`,function(res){
                that.list = res.data.list;
                that.pages = res.data.pages;
                that.page = page;
                that.hasNext = res.data.hasNext;
                that.loading = false;
            });
        }
    },
    mounted: function(){
        this.$nextTick(function () {
            let r = new RegExp(/[\?,&]?page=(\d+)&?/);
            let res = r.exec(window.location);
            let page = res != null ? res[1] : 1;

            this.getList(parseInt(page,10));
            this.getSignature();
        })
    }
});