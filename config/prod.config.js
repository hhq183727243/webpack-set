const webpack = require('webpack');
const path = require('path'); //引入path
const CopyWebpackPlugin = require('copy-webpack-plugin');
const base_config = require('./base.config');
const CleanWebpackPlugin = require("clean-webpack-plugin");

const prodConfig = {
    plugins: [
        ...base_config.plugins,
        
        //webpack清除打包文件夹中的文件
        new CleanWebpackPlugin(['dist'],{
            root: __dirname + '/../',       　　　　　//根目录
            verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
            dry:      false,       　　　　　　　　　　//启用删除文件,true未模拟删除，false为真实删除
            exclude: ['img']
        }),

        // new webpack.optimize.SplitChunksPlugin({
        //     chunks: "all",
        //     minSize: 0,
        //     minChunks: 2,
        //     maxAsyncRequests: 5,
        //     maxInitialRequests: 3,
        //     name: 'commons'
        // }),

        //webpack 4.0之后已上传CommonsChunkPlugin插件，
        //使用 ptimization.splitChunks and optimization.runtimeChunk替代
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'commons', // 这公共代码的chunk名为'commons'
        //     filename: 'js/[name].bundle.js', // 生成后的文件名，虽说用了[name]，但实际上就是'commons.bundle.js'了
        //     minChunks: 2, // 设定要有4个chunk（即4个页面）加载的js模块才会被纳入公共代码。这数目自己考虑吧，我认为3-5比较合适。
        // }),

        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            IS_PRODUCTION: true
        }),

        //文件拷贝，在dev中会将文件拷贝到内存中，在build中将文件拷贝到硬盘中
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static/css'),//定义要拷贝的源目录
            to: path.resolve(__dirname, '../dist/css'), //定义要拷贝到的目标目录，以output-path为相对路径
            //ignore: ['*.css']
        },{
            from: path.resolve(__dirname, '../static/img'),//定义要拷贝的源目录
            to: path.resolve(__dirname, '../dist/img'), //定义要拷贝到的目标目录，以output-path为相对路径
            //ignore: ['*.css']
        }])
    ]
}


module.exports = prodConfig;