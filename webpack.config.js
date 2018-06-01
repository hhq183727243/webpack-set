const base_config = require('./config/base.config');
const prod_config = require('./config/prod.config');

module.exports = {
    mode: 'production',
    
    entry: base_config.entry,
    
    output: base_config.output,

    module: base_config.module,
    
    //设置模块如何被解析，如import Vue from "vue";导入模块时，webpack会自动解析vue/dist/vue.min.js这个文件
    resolve: {
        //创建 import 或 require 的别名，来确保模块引入变得更简单
        alias: {
            vue: 'vue/dist/vue.min.js',
            jquery: 'jquery/dist/jquery.min.js'
        },
        //搜索模块
        modules: ["node_modules"]
    },

    //公共代码打包，避免每个入口重复引入相同代码
    optimization: base_config.optimization,
    
    plugins: prod_config.plugins
}