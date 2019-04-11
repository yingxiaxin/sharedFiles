
// 引入 express 模块
var express = require('express');

// 创建 express 实例
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var Connector = require('./src/Connector');

app.use(express.static('../client'));

// 响应HTTP的GET方法
app.get('/', function (req, res) {
    res.send('Fuck World!');
    global.console.log('request received');
});

http.listen(3000, function () {
    global.console.log('listening on *:3000');
});

let connector = new Connector(io);