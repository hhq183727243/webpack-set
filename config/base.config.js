/** 
 * @webpack 公用配置
**/
const fs = require('fs');

const webpack = require('webpack');
//css 代码抽取插件，可将多个css文件合并成一个,webpack4.0之后不再支持ExtractTextPlugin，使用MiniCssExtractPlugin代替
//const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
//css 代码抽取
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//引入path
const path = require('path'); 

const publictPath = '../src/js/entry/';

//遍历入口文件
function getEntryFiles(dir) {
    var files = fs.readdirSync(__dirname + '/' + dir);

    //获取所有.js结尾的文件
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    return js_files;
}

const entry_js = getEntryFiles(publictPath);
const entry_file = {
    my_css: path.resolve(__dirname, `../src/js/common_css.js`)
}

entry_js.forEach(item => {
    entry_file[item.replace(/.js$/g,'')] = path.resolve(__dirname, `${publictPath}${item}`);
});

const HtmlWebpackPlugin_temp = [];

for(let key in entry_file){
    if(key != 'my_css'){
        HtmlWebpackPlugin_temp.push(new HtmlWebpackPlugin({
            title: key,
            template: path.resolve(__dirname, `../src/page/${key}.html`),
            filename: `./page/${key}.html`,
            chunks: ['vendors','commons','common_style',`runtime~${key}`,key] // 自动加载上业务的入口文件以及公共chunk
        }));
    }
}

const devMode = process.env.NODE_ENV !== 'production'

console.log(`======================${devMode}=====================`);

module.exports = {
    entry: entry_file,
    output: {
        path: path.resolve('__dirname','../dist/'),//打包后的文件存放的地方。公共路径，该路径也是css、html打包后的相对路径
        //publicPath: 'js/',//配置相对路径
        filename: 'js/[name].bundle.js?temp=[hash]'//打包后输出文件的文件名
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: "babel-loader"
            },
            exclude: /node_modules/
        },{
            // test: /\.css$/,
            // use: ExtractTextPlugin.extract({
            //     fallback: "style-loader", 
            //     use: "css-loader" 
            // })//webpack 4.0之后不再支持ExtractTextPlugin
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader"
            ]
        },{
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 8192,
                name: '[hash].[ext]',
                outputPath: './img',
                publicPath: '../img'
            }
        }]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 3,//该参数好像不起作用，配置1-10都可以提取出公共代码块
            maxAsyncRequests: 5,
            maxInitialRequests: 5,
            name: 'commons',
            cacheGroups: {
                // commons: {
                //     chunks: "initial",
                //     name: "_commons",
                //     test: /[\\/]src[\\/]$/,
                //     reuseExistingChunk: true
                // },
                styles: {
                    minChunks: 3,//最少几个模块引入才抽取公共代码
                    name: 'common_style',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                },
                vendors: {
                    minChunks: 2,
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 1
                }
            }
        },
        runtimeChunk: true
    },
    plugins : [
        //new ExtractTextPlugin("css/styles.css"),//webpack 4.0+ 后不再使用
        //会自动根据optimization 配置来构建css，如果满足条件则会打包成公用css，反之则单独打包
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "css/[name].css",//name 值为cacheGroups.styles.name 对应值，如果没有配置styles,则为commons
            chunkFilename: "css/[name].css"
        }),

        //全局引用插件
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),

        ...HtmlWebpackPlugin_temp
    ]
}