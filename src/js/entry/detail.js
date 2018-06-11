import Vue from "vue";//引入vue
import ajax from '../server.js';//引入ajax封装

const hljs = require('../highlight.pack.js');
const vue_cpnt = require('../vue.cpnt.js');//引入全局组件
import '../../assets/css/home.css';
vue_cpnt(Vue);//初始化后组件，由于该组件是全局组件，因此注册组件的vue应该可以实例化app的vue是同一个

new Vue({
    el: '#App',
    data: {
        entity: {}, //实体
        defaultComment: {},
        comment: {
            blogId: '',
            replyId: 0,
            name: '',
            email: '',
            website: '',
            content: ''
        },
        commentList: [],
        id: '', //实体id
    },
    methods: {
        getDetail: function(id){
            var that = this;

            ajax.getJSON(`/getBlogDetail?id=${id}`,function(res){
                that.entity = res.data.entity;

                setTimeout(function(){
                    $('#blogContent pre').each(function(i, block) {
                        hljs.highlightBlock(block);
                    });
                },0);
            });
        },
        getCommentList: function(blogId){
            var that = this;

            ajax.getJSON(`/getCommentList?page=1&blogId=${blogId}`,function(res){
                that.commentList = res.data.list;
            });
        },
        submitCommentForm: function(){
            var that = this;

            ajax.postJSON(`addComment`,this.comment,function(res){
                weui.toast('评论成功');
                that.comment = that.defaultComment;
                that.getCommentList(that.id);
            });
        }
    },
    mounted: function(){
        this.$nextTick(function () {
            var r = new RegExp(/[\?,&]?id=(\d+)&?/),
                res = r.exec(window.location),
                id = res != null ? res[1] : 0;

            this.id = id;
            this.comment.blogId = id;
            this.defaultComment = JSON.parse(JSON.stringify(this.comment));

            this.getDetail(id);
            this.getCommentList(id);
        })
    }
});