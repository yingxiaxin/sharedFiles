module.exports={  
    entry:__dirname + '/client/js/index.js',  
    output:{  
        path: __dirname + '/client/build',  
        filename:'[name].bundle.js'  
    },  
    module:{  
        rules:[  
            {  
                test: /\.js$/,  
                exclude: /node_modules/,  
                loader: "babel-loader",  
                query:  
                {  
                    presets: ['es2015'],  
                    plugins: ['transform-runtime']  
                }  
            }  
        ]  
    },
	devtool: '#source-map'
}  