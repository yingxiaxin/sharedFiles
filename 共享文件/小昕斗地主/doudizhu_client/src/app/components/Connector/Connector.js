import io from 'socket.io-client';
import config from './../../config/config';
import Constants from './../../utils/Constants';

class Connector {
    constructor() {
        this.coreExecutor = null;
        this.socket = io(config.server);

        this.initListeners();
    }

    registerExecutor(executor) {
        this.coreExecutor = executor;
    }

    initListeners() {
        const socket = this.socket;

        // 1、服务端发送的本客户端连接的反馈
        socket.on(Constants.SEND_ONE_CONNECTED, this.onConnect.bind(this));

        // 2、服务端发送的有其他玩家连接入房间的通知
        socket.on(Constants.SEND_ALL_CONNECTED, this.onNotifyConnect.bind(this));

        // 3、服务端在人齐了之后，游戏开始前，给客户端发送玩家列表信息
        socket.on(Constants.SEND_ALL_PLAYERLIST, this.onRcvPlayerList.bind(this));

        // 4、服务端在人齐了之后发送，提示游戏开始
        socket.on(Constants.SEND_ALL_BEGIN, this.onBegin.bind(this));

        // 5、服务端发送的游戏开始时发牌，有17张牌
        socket.on(Constants.SEND_ONE_SHUFFLE_CARDS, this.onShuffleCards.bind(this));

        // 6、服务端发送的底牌，每个玩家都会收到，3张
        socket.on(Constants.SEND_ALL_EXTRACARDS, this.onExtraCards.bind(this));

        // 7、服务端发送的要求客户端抢地主叫分
        socket.on(Constants.SEND_ONE_COMPETE, this.onCompete.bind(this));

        // 8、服务端发送的其他玩家的抢地主信息
        socket.on(Constants.SEND_ALL_COMPETE, this.onCompeteInfo.bind(this));

        // 9、服务端发送的抢地主结束，发送地主信息
        socket.on(Constants.SEND_ALL_COMPETE_END, this.onCompeteEnd.bind(this));

        // 10、服务端发送指示某位玩家出牌
        socket.on(Constants.SEND_ONE_DEAL, this.onPlayerDeal.bind(this));

        // 11、服务端发送的玩家出牌信息
        socket.on(Constants.SEND_ALL_DEAL, this.onOthersDeal.bind(this));

        // 12、服务端发送的输赢信息
        socket.on(Constants.SEND_ALL_WIN, this.onWin.bind(this));

        // 13、服务端发送的输赢信息
        socket.on(Constants.SEND_ALL_LOSE, this.onLose.bind(this));

        // 14、服务端广播转发的玩家聊天信息
        socket.on(Constants.SEND_ALL_MESSAGE, this.onPlayerMessage.bind(this));
    }

    /********************************************以下是监听的处理函数******************************************************************** */

    // 本客户端连接的反馈
    onConnect(data) {
        console.log('服务端反馈: ' + JSON.parse(data).message);
    }

    // 服务端通知有其他玩家连接的处理函数
    onNotifyConnect(data) {
        let info = JSON.parse(data);
        console.log('服务端通知: ' + info.message + ' player: ' + info.data.id);
    }

    // 收到玩家列表信息
    onRcvPlayerList(data) {
        let info = JSON.parse(data);
        console.log('收到玩家列表信息: ' + info.data.playerList);

        this.coreExecutor.rcvPlayerList(info);
    }

    // 游戏开始处理函数
    onBegin(data) {
        let info = JSON.parse(data);
        console.log(info.message);

        this.coreExecutor.startGame();
    }

    // 收到服务端发牌
    onShuffleCards(data) {
        let info = JSON.parse(data);
        console.log('收到发牌: ' + info.data.cards);

        this.coreExecutor.rcvShuffledCards(info);
    }

    // 收到服务端发送的底牌
    onExtraCards(data) {
        let info = JSON.parse(data);
        console.log('收到底牌: ' + info.data.cards);

        this.coreExecutor.rcvExtraCards(info);
    }

    // 收到服务端叫地主提示
    onCompete(data) {
        let info = JSON.parse(data);
        console.log('服务端提示抢地主: ' + info.message);

        this.coreExecutor.shouldCompete();
    }

    // 收到服务端发送的其他玩家抢地主信息
    onCompeteInfo(data) {
        let info = JSON.parse(data);
        console.log('其他玩家抢地主: ' + info.data.score);

        this.coreExecutor.rcvCompeteInfo(info);
    }

    // 收到服务端发送的地主玩家信息
    onCompeteEnd(data) {
        let info = JSON.parse(data);
        console.log('地主是: ' + info.data.lord);

        this.coreExecutor.rcvCompeteEnd(info);
    }

    // 收到服务端发送指示某位玩家出牌
    onPlayerDeal(data) {
        console.log('收到服务端信息，要求出牌');

        this.coreExecutor.rcvPlayerDeal();
    }

    // 收到服务端发出的其他玩家的出牌信息
    onOthersDeal(data) {
        let info = JSON.parse(data);
        console.log('其他玩家出牌: ' + info.data.deal);

        this.coreExecutor.rcvOthersDeal(info);
    }

    // 收到服务端发送的获胜信息
    onWin(data) {
        let info = JSON.parse(data);
        console.log(info.message);

        this.coreExecutor.rcvWin();
    }

    // 收到服务端发送的失败信息
    onLose(data) {
        let info = JSON.parse(data);
        console.log(info.message);

        this.coreExecutor.rcvLose();
    }

    // 收到服务端转发广播的玩家聊天信息
    onPlayerMessage(data) {
        let info = JSON.parse(data);
        this.coreExecutor.rcvPlayerMessage(info);
    }

    /********************************************以下是主动往服务端发送的函数*********************************************************** */

    /**
     * 发送准备的状态
     * @param {*} status 
     */
    sendReadyStatus(status) {
        let data = JSON.stringify(status);
        this.socket.emit(Constants.LISTEN_READY, data);
    }

    /**
     * 发送抢地主信息
     * @param {*} status 
     */
    sendCompeteStatus(status) {
        let data = JSON.stringify(status);
        this.socket.emit(Constants.LISTEN_COMPETE, data);
    }

    /**
     * 发送出牌信息
     * @param {*} status 
     */
    sendDealStatus(status) {
        let data = JSON.stringify(status);
        this.socket.emit(Constants.LISTEN_DEAL, data);
    }

    /**
     * 发送玩家聊天信息
     * @param {*} message 
     */
    sendPlayerMessage(message) {
        let data = JSON.stringify(message);
        this.socket.emit(Constants.LISTEN_MESSAGE, data);
    }
}

export default Connector;