const Player = require('./Player');
const Constants = require('./Constants');
const CardData = require('./CardData');

class ServerCore {
    constructor() {
        this.playerList = [];       // 游戏玩家的列表
        this.waitingList = [];      // 等待玩家的列表
        this.isPlaying = false;     // 当前服务器是否正在进行游戏的标识符
        this.currentIndex = 0;      // 当前的玩家的索引
        this.allReady = false;      // 玩家是否全部准备好的标识符

        // 抢地主相关
        this.lastCompete = 0;       // 上次叫地主的分数
        this.lastCompetor = null;   // 上次叫地主的玩家

        // 出牌相关
        this.lastDeal = null;       // 上次出的牌数据，数组
        this.lastDealer = null;     // 上次出牌的玩家

        // 输赢相关
        this.winner = [];           // 本局游戏的获胜者
        this.loser = [];            // 本局游戏的失败者
    }

    /**
     * 获取当前要抢地主、出牌等的玩家的index，在0，1，2之间循环
     */
    getCurrentIndex() {
        if (this.currentIndex == 3) {
            this.currentIndex = 0;
        }
        return this.currentIndex++;
    }

    /**
     * 添加玩家
     * 1、如果玩家在列表中存在，说明是断线重连的，那么将新id赋值给列表中的数据项，其他保持不变
     * 2、如果列表中不存在，并且玩家列表不足3人，那么加入玩家列表
     * 3、否则，加入等待列表
     * @param {*} player 
     */
    addPlayer(player) {
        let isExist = this.isPlayerExist(player);
        if (isExist) {
            let p = this.findPlayer(player);
            p.id = player.id;
        } else if (this.playerList.length == 2) {
            this.playerList.push(player);
            this.onPlayerConnected(player);
        } else if (this.playerList.length < 3) {
            this.playerList.push(player);
            this.onPlayerConnected(player);
        } else {
            this.waitingList.push(player);
        }
    }

    /**
     * 获取除了某位玩家之外的其他玩家
     * @param {*} player 
     */
    getPlayersExcept(player) {
        // return this.playerList.filter((item) => {
        //     if (item.origin === player.origin && item.address === player.address) {
        //         return false;
        //     } else {
        //         return true;
        //     }
        // });

        return this.playerList.filter((item) => {
            if (item.id === player.id) {
                return false;
            } else {
                return true;
            }
        });
    }

    /**
     * 根据player的origin和address，找到数组中匹配的项并返回
     * @param {*} player 
     */
    findPlayer(player) {
        return this.playerList.find((item) => {
            return (item.origin === player.origin && item.address === player.address);
        });
    }

    /**
     * 根据player实例，返回它在数组中的index
     * @param {*} player 
     */
    findPlayerIndex(player) {
        return this.playerList.findIndex((item) => {
            return item.id === player.id;
        });
    }

    /**
     * 根据socket找到所发的player
     * 因为findPlayer是根据origin和address来确定是否是一个玩家，在那之后，更新了重连玩家的id(也就是socket的id)
     * 所以这里根据socket来匹配玩家，只需要判断id是否相等就可以
     * @param {*} socket 
     */
    findPlayerBySocket(socket) {
        return this.playerList.find((item) => {
            return (item.id === socket.id);
        });
    }

    /**
     * 判断这个玩家是否已经存在
     * 有可能有些玩家在游戏过程中掉线，然后重连，服务器将等待30秒
     * 若是连接的玩家的origin和address均和列表中的不一样，那么说明是新的链接
     * 有符合条件的，findIndex的返回就不是-1
     * @param {} player 
     */
    isPlayerExist(player) {
        // return this.playerList.findIndex((item) => {
        //     return (player.origin === item.origin && player.address === item.address);
        // }) !== -1;
        return false;
    }

    /**
     * 有玩家连接，转换成player实例
     * @param {*} socket 
     */
    playerConnect(socket) {
        let p = new Player(socket);
        this.addPlayer(p);
    }

    /**
     * 有玩家断开连接，游戏终止
     * @param {*} socket 
     */
    playerDisconnect(socket) {
        let playerid = socket.id;
        this.playerList = this.playerList.filter((item) => {
            if (item.id === playerid) {
                return false;
            } else {
                return true;
            }
        });

        // 终止游戏
        this.abortGame();
    }

    /**
     * 判断玩家人数是否到3个，并且是否正在进行游戏。
     */
    checkPlayerNum() {
        if (this.playerList.length === 3 && this.isPlaying === false) {
            return true;
        } else {
            return false;
        }
    }

    /*************************************************玩家发送自己的昵称****************************************************************** */

    /**
     * 接收玩家发送的昵称消息
     * @param {*} socket 
     * @param {*} data 
     */
    rcvPlayerName(socket, data) {
        let player = this.findPlayerBySocket(socket);
        let info = JSON.parse(data);
        player.name = info.playerName;

        let hasAllName = this.judgeRcvAllPlayerName();
        if (hasAllName) {
            // 人到齐，并且都发送了昵称，那么发送玩家列表信息
            // 然后发送游戏可以开始的通知，客户端切换到准备按钮界面
            this.readyToStart();
        }
    }

    /**
     * 判断是否所有玩家都发送了昵称信息
     */
    judgeRcvAllPlayerName() {
        // 如果玩家数小于3个，人没齐，毫无疑问没有收到全部的玩家昵称信息
        if (this.playerList.length < 3) {
            return false;
        } else {
            return this.playerList.reduce((prev, current) => {
                return (prev && current.name);
            }, true);
        }
    }

    /*************************************************等待准备部分************************************************************************ */
    /**
     * 接收到玩家发送的ready消息
     * 首先根据socket找到该玩家
     * 然后将玩家的ready设置为发送过来的值
     * 每次接收ready消息，都进行判断是否所有玩家都准备
     * @param {*} socket 
     * @param {*} data 
     */
    rcvPlayerReady(socket, data) {
        let player = this.findPlayerBySocket(socket);
        let info = JSON.parse(data);
        player.ready = info.isReady;

        this.allReady = this.judgeAllReady();
        let isPlayerEnough = this.checkPlayerNum();
        // 如果玩家都准备好，并且玩家有3个人了，那么开始游戏
        if (this.allReady && isPlayerEnough) {
            this.startGame();
        }
    }

    /**
     * 判断是否所有的玩家都已经准备好
     */
    judgeAllReady() {
        return this.playerList.reduce((prev, current) => {
            return (prev && current.ready);
        }, true);
    }

    /*****************************************游戏开始*********************************************************************************** */

    /**
     * 玩家满3人，游戏可以开始
     */
    readyToStart() {
        // 发送玩家列表
        this.sendPlayerList();

        // 发送游戏可以开始的事件
        this.onStartGame();
    }

    /**
    * 开始游戏，将标识符设为true
    */
    startGame() {
        // 先刷新数据
        this.refresh();

        this.isPlaying = true;
        global.console.log('游戏开始');

        // 发牌
        this.shuffleCards();
    }

    /**
     * 重新开始之前，清除旧数据
     */
    refresh() {
        // 恢复原始数据
        this.isPlaying = false;
        this.lastCompete = 0;
        this.lastCompetor = null;
        this.currentIndex = 0;
        this.lastDeal = null;
        this.lastDealer = null;
        this.winner = [];
        this.loser = [];

        // 恢复每个玩家的原始数据
        this.playerList.forEach((item) => {
            item.refresh();
        })
    }

    /**
     * 向客户端发送玩家列表信息，使得客户端能够确定上家和下家
     */
    sendPlayerList() {
        let pList = this.playerList.map((item) => {
            let p = {};
            p.id = item.id;
            p.origin = item.origin;
            p.address = item.address;
            p.name = item.name;
            return p;
        });

        this.playerList.forEach((item) => {
            item.socket.emit(Constants.SEND_ALL_PLAYERLIST, JSON.stringify({ message: '玩家列表', data: { playerList: pList } }));
        })
    }

    /***************************************开始发牌*********************************************************************************** */
    /**
     * 洗牌，并向所有玩家发牌，以及发送底牌
     */
    shuffleCards() {
        let rst = CardData.shuffle();
        let extra = rst[3];         // 底牌

        let shuffled = [];

        for (let i = 0; i < 3; i++) {
            // 把玩家的牌记入实例
            let player = this.playerList[i];
            player.receiveCards(rst[i]);

            // 将玩家及牌的对应做成对象数组
            let obj = {};
            obj.playerid = player.id;
            obj.cards = rst[i];
            shuffled.push(obj);
        }

        this.playerList.forEach((item) => {
            item.socket.emit(Constants.SEND_ONE_SHUFFLE_CARDS, JSON.stringify({ message: '发牌', data: { shuffled: shuffled } }));
            item.socket.emit(Constants.SEND_ALL_EXTRACARDS, JSON.stringify({ message: '底牌', data: { cards: extra } }));
        });

        // 发完牌1秒钟后，开始抢地主
        setTimeout(() => {
            this.startCompete();
        }, 12000);
    }

    /***************************************抢地主部分*********************************************************************************** */
    /**
     * 游戏开始，指派任意一个人抢地主
     */
    startCompete() {
        let random = Math.floor(Math.random() * 3);
        this.currentIndex = random;

        this.assignCompete();
    }

    /**
     * 接收到玩家的叫分信息
     * @param {*} socket 
     * @param {*} data 
     */
    rcvPlayerCompete(socket, data) {
        let player = this.findPlayerBySocket(socket);
        let info = JSON.parse(data);
        let score = parseInt(info.compete);

        // 向其他玩家广播抢地主的最新信息
        this.broadcastCompeteInfo(player, score);

        // 如果叫分为0，说明放弃抢地主
        if (score === 0) {
            player.compete = score;
            player.giveUpCompete = true;

            // 判断是否所有玩家都放弃抢地主，如果是，那么重新开始游戏，重新发拍
            // 否则，叫下一个人抢地主
            let allGiveup = this.judgeAllGiveUpCompete();
            if (allGiveup) {
                this.startGame();
            } else {
                this.assignCompete();
            }

            // 判断是否有两人放弃抢地主
            let twoGiveup = this.judgeOthersGiveUpCompete();
            if (twoGiveup) {
                this.endCompete(this.lastCompetor);
            } else {
                this.assignCompete();
            }
        } else if (score === 3) {           // 如果叫分为3，直接成为地主，抢地主结束
            player.compete = score;
            this.lastCompete = score;
            this.lastCompetor = player;
            this.endCompete(player);
        } else {                            // 否则，下一个人抢地主
            player.compete = score;
            this.lastCompete = score;
            this.lastCompetor = player;
            this.assignCompete();
        }
    }

    /**
     * 判断是否所有玩家都放弃叫地主
     */
    judgeAllGiveUpCompete() {
        return this.playerList.reduce((prev, current) => {
            return (prev && current.giveUpCompete);
        }, true);
    }

    /**
     * 判断是否有两个玩家放弃抢地主
     * 当且仅当有2个玩家放弃时，返回true，此时应该直接给第三个玩家当地主
     * 注意：如果开局连续两玩家放弃抢地主，不在此列。只有当有人叫分后，另外有2人放弃，才符合此函数判断
     */
    judgeOthersGiveUpCompete() {
        let num = 0;
        this.playerList.forEach((item) => {
            if (item.giveUpCompete) {
                num = num + 1;
            }
        });
        return (num === 2 && this.lastCompetor !== null);
    }

    /**
     * 抢地主结束
     * 1、广播消息，说明某玩家成为了地主，地主玩家获得底牌
     * 2、将currentIndex调到地主玩家的index上
     * 3、通知地主玩家，准备出牌
     */
    endCompete(player) {
        // 1、地主玩家的标识isLord设置为true，将currentIndex调到他的index上
        player.isLord = true;
        this.currentIndex = this.findPlayerIndex(player);

        // 2、通知其他玩家，有人成为了地主
        this.playerList.forEach((item) => {
            item.socket.emit(Constants.SEND_ALL_COMPETE_END, JSON.stringify({ message: '抢地主结束', data: { lord: player.id } }));
        })

        // 3、开始通知出牌
        this.assignDealCard();
    }

    /**
     * 指派某位玩家抢地主
     * @param {*} player 
     * @param {*} lastCompete 
     */
    assignCompete() {
        let assignedPlayer = this.playerList[this.getCurrentIndex()];
        if (assignedPlayer.giveUpCompete) {
            this.assignCompete();
        } else {
            // 广播现在是轮到了哪位玩家
            this.playerList.forEach((item) => {
                item.socket.emit(Constants.SEND_ALL_PLAYER_TURN, JSON.stringify({ message: '现在轮到某位玩家', data: { playerId: assignedPlayer.id } }));
            });
            assignedPlayer.socket.emit(Constants.SEND_ONE_COMPETE, JSON.stringify({ message: '请叫分', data: { lastCompete: this.lastCompete } }));
        }
    }

    /**
     * 每次收到抢地主信息时，广播给其他玩家
     * @param {*} player 
     * @param {*} score 
     */
    broadcastCompeteInfo(player, score) {
        let players = this.getPlayersExcept(player);
        players.forEach((item) => {
            item.socket.emit(Constants.SEND_ALL_COMPETE, JSON.stringify({ message: '其他玩家叫地主', data: { id: player.id, score: score } }));
        });
    }

    /******************************************出牌阶段********************************************************************************** */
    /**
     * 指示某玩家出牌
     */
    assignDealCard() {
        let assignedPlayer = this.playerList[this.getCurrentIndex()];

        // 广播现在是轮到了哪位玩家
        this.playerList.forEach((item) => {
            item.socket.emit(Constants.SEND_ALL_PLAYER_TURN, JSON.stringify({ message: '现在轮到某位玩家', data: { playerId: assignedPlayer.id } }));
        });
        assignedPlayer.socket.emit(Constants.SEND_ONE_DEAL, JSON.stringify({ message: '请出牌', data: {} }));
    }

    /**
     * 接收玩家的出牌信息
     * @param {*} socket 
     * @param {*} data 
     */
    rcvPlayerDealCards(socket, data) {
        let player = this.findPlayerBySocket(socket);
        let info = JSON.parse(data);
        let cardArray = info.data.deal;
        this.lastDealer = player;
        this.lastDeal = cardArray;

        player.dealCards(cardArray);
        this.broadcastDealInfo(player);
        let win = this.judgeWin(player);
        if (win) {
            this.judgewinnerAndLoser(player);
            this.endGame();
        } else {
            this.assignDealCard();
        }
    }

    /**
     * 每次收到出牌信息时，广播给其他玩家
     * @param {*} player 
     */
    broadcastDealInfo(player) {
        let players = this.getPlayersExcept(player);
        players.forEach((item) => {
            item.socket.emit(Constants.SEND_ALL_DEAL, JSON.stringify({ message: '其他玩家出牌', data: { playerid: player.id, deal: this.lastDeal } }));
        });
    }

    /**
     * 判断某个玩家是否出完了牌，获得胜利
     * 在每次收到玩家出牌的时候，判断所出牌的玩家是否获胜
     * @param {*} player 
     */
    judgeWin(player) {
        return player.cards.length === 0;
    }

    /**
     * 根据最先出完牌的玩家，来判断赢家和输家分别是谁
     * @param {*} player 
     */
    judgewinnerAndLoser(player) {
        // 如果出完牌的这个人是地主，那么他是赢家，其他两个是输家
        if (player.isLord) {
            this.winner = [player];
            this.loser = this.getPlayersExcept(player);
        } else {
            this.playerList.forEach((item) => {
                if (item.isLord) {
                    this.loser = [item];
                } else {
                    this.winner.push(item);
                }
            })
        }
    }

    /**
     * 一局游戏结束
     * 通知玩家输赢结果
     * 重置所有数据
     */
    endGame() {
        // 通知玩家输赢结果
        this.winner.forEach((item) => {
            item.socket.emit(Constants.SEND_ALL_WIN, JSON.stringify({ message: '你赢了', data: {} }));
        })
        this.loser.forEach((item) => {
            item.socket.emit(Constants.SEND_ALL_LOSE, JSON.stringify({ message: '你输了', data: {} }));
        })

        // 将所有数据重置
        this.refresh();
    }

    /**
     * 因意外终止游戏，如玩家掉线等
     */
    abortGame() {
        this.playerList.forEach((item) => {
            item.socket.emit(Constants.SEND_ALL_ABORT_GAME, JSON.stringify({ message: '玩家断线，游戏终止', data: {} }));
        });

        // 将所有数据重置
        this.refresh();
    }

    /******************************************玩家消息发送、聊天******************************************************** */

    /**
     * 每次收到LISTEN_MESSAGE的消息，都进行广播，发送给所有玩家
     */
    rcvPlayerMessage(socket, data) {
        this.playerList.forEach((item) => {
            item.socket.emit(Constants.SEND_ALL_MESSAGE, data);
        });
    }

    /******************************************需要进行通知广播********************************************************** */
    /**
     * 当玩家连接，并且加入了playerList中时，通知其他玩家
     */
    onPlayerConnected(player) {
        this.playerList.forEach((item) => {
            item.socket.emit(Constants.SEND_ALL_CONNECTED, JSON.stringify({
                message: `有新玩家连接，房间当前在线玩家数: ${this.playerList.length}`,
                data: { id: player.id, origin: player.origin, address: player.address, name: player.name }
            }));
        });
    }

    /**
     * 向所有玩家通知，游戏开始
     */
    onStartGame() {
        this.playerList.forEach((item) => {
            item.socket.emit(Constants.SEND_ALL_BEGIN, JSON.stringify({ message: '游戏开始', data: {} }));
        });
    }
}

const getServerCore = (function () {
    let core;
    return function () {
        if (!core) {
            core = new ServerCore();
        }
        return core;
    }
})();

module.exports = getServerCore;