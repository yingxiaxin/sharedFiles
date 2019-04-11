const path = require('path');
module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    node: {
        fs: "empty"
    },
    devtool: '#source-map',
    // devServer: {
    //     contentBase: path.join(__dirname, './build'),
    //     open: true,
    //     port: 9000
    // }
}