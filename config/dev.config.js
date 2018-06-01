const webpack = require('webpack');
const path = require('path'); //引入path
const CopyWebpackPlugin = require('copy-webpack-plugin');
const base_config = require('./base.config');

const devConfig = {
    plugins: [
        ...base_config.plugins,

        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            IS_PRODUCTION: false
        }),

        //热更新
        new webpack.HotModuleReplacementPlugin(),

        // new webpack.optimize.SplitChunksPlugin({
        //     chunks: "all",
        //     minSize: 0,
        //     minChunks: 2,
        //     maxAsyncRequests: 10,
        //     maxInitialRequests: 10,
        //     //name: 'commons'
        // }),

        //webpack 4.0之后已上传CommonsChunkPlugin插件，
        //使用 ptimization.splitChunks and optimization.runtimeChunk替代
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'commons', // 这公共代码的chunk名为'commons'
        //     filename: 'js/[name].bundle.js', // 生成后的文件名，虽说用了[name]，但实际上就是'commons.bundle.js'了
        //     minChunks: 2, // 设定要有4个chunk（即4个页面）加载的js模块才会被纳入公共代码。这数目自己考虑吧，我认为3-5比较合适。
        // }),
        
        //文件拷贝，在dev中会将文件拷贝到内存中，在build中将文件拷贝到硬盘中
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static/css'),//定义要拷贝的源目录
            to: 'css', //定义要拷贝到的目标目录，以output-path为相对路径 to: __dirname + ‘/dist’
            //ignore: ['*.css']
        },{
            from: path.resolve(__dirname, '../static/img'),//定义要拷贝的源目录
            to: 'img', //定义要拷贝到的目标目录，以output-path为相对路径 to: __dirname + ‘/dist’
            //ignore: ['*.css']
        }])
    ],
    // 配置webpack服务
    devServer:{
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        host: 'localhost',
        compress: true,
        inline: true,//实时刷新
        //publicPath: '/public/',
        port: 3000,
        proxy: {
            '/get': {
                target: 'http://39.105.108.120/', // 接口的域名
                // secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                //   pathRewrite: {
                //     '^/api': ''
                //   }
            }
        },//代理配置
    }
}

module.exports = devConfig;