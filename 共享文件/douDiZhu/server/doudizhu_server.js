// 引入 express 模块
var express = require('express');

// 创建 express 实例
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('../client'));

// 响应HTTP的GET方法
app.get('/', function (req, res) 
{
    res.send('Fuck World!');
    console.log('request received');
});


http.listen(3000, function()
{
    console.log('listening on *:3000');
});

io.on('connection', function(socket)
{
    console.log('a user connected');  

    io.sockets.emit('news', 'xxxxx');
    console.log('emit news event');


    socket.on('private_message', function(data)
    {
      console.log('333 received ! private message:', data);
    });
});


