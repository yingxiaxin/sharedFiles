const Constants = require('./Constants');
const core = require('./ServerCore')();

class Connector {
    constructor(io) {
        this.io = io;
        this.initSocketListener();
    }

    initSocketListener() {
        this.io.on('connection', (socket) => {

            global.console.log('player connected, socket id: ' + socket.id);
            // 一个玩家连接到服务器
            core.playerConnect(socket);

            // 反馈连接消息
            // this.io.sockets.emit(Constants.SEND_ALL_CONNECTED, 'new player connected!');
            socket.emit(Constants.SEND_ONE_CONNECTED, JSON.stringify({ message: 'connected', data: '' }));

            // 监听接收玩家断开连接消息
            socket.on('disconnect', (reason) => {
                console.log('oooops! A player disconnected');
            });

            // 监听接收玩家消息
            socket.on(Constants.LISTEN_MESSAGE, (data) => {
                
            });

            // 监听接收玩家准备信息
            socket.on(Constants.LISTEN_READY, (data) => {
                core.rcvPlayerReady(socket, data);
            });

            // 监听玩家抢地主信息
            socket.on(Constants.LISTEN_COMPETE, (data) => {
                core.rcvPlayerCompete(socket, data);
            });

            // 监听玩家出牌信息
            socket.on(Constants.LISTEN_DEAL, (data) => {
                core.rcvPlayerDealCards(socket, data);
            });

        });
    }
}

module.exports = Connector;