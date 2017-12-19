// 引入 express 模块
var express = require('express');

// 创建 express 实例
var app = express();

app.use(express.static('../client'));

// 响应HTTP的GET方法
app.get('/', function (req, res) {
  res.send('Fuck World!');
  console.log('request received');
});

// 监听到8000端口
app.listen(8000, function () {
  console.log('Hello World is listening at port 8000');
});