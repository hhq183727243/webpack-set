import Vue from "vue";//引入vue
const ajax = require('../server.js');//引入ajax封装
import '../../assets/css/public.css';


new Vue({
    el: '#App',
    data: {
        message: {
            name: '',
            email: '',
            content: ''
        } //实体
    },
    methods: {
        submitForm: function(id){
            var that = this;

            ajax.postJSON(`addMessage`,this.message,function(res){
                weui.toast('留言成功');

                that.message = {
                    name: '',
                    email: '',
                    content: ''
                }
            });
        }
    }
});