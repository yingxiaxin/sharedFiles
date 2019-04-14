const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, './release'),
        filename: './bundle.js'
    },
    devtool: 'cheap-module-eval-source-map', // 不同选项适用于不同环境
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            use: 'babel-loader'
        }, {
            test: /\.(css|scss)$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader",
                options: {
                    modules: true, // 指定启用css modules
                    // localIdentName: '[name]__[local]--[hash:base64:5]',   // 指定css的类名格式
                    localIdentName: '[local]',   // 指定css的类名格式

                    importLoaders: 1
                }
            }, {
                loader: "postcss-loader",
                options: {
                    modules: true
                }
            }, {
                loader: "sass-loader",
                options: {
                    modules: true
                }
            }]
        }, {
            test: /\.(png|jpg|gif|jpeg|woff|woff2|eot|ttf|svg)$/,
            use:
            {
                loader: "url-loader",
                options:
                {
                    limit: '1024'
                }
            }
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, './release'),
        open: true,
        port: 9000
    }
}