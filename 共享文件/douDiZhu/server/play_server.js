let GameRule = require('./GameRule');
let G = require('./global');
let CardData = require('./CardData');
let Player = require('./Player');

class play_server
{    
    constructor(io)
    {
        this.playerGenerator = null;
        this.leftPlayer = null;
        this.rightPlayer = null;
        this.ownPlayer = null;
        this.playerList = [];

        this.io = io;
        this.initSocketListener();
    }

    initSocketListener()
    {
        this.io.on('connection', (socket)=>
        {
            global.console.log('player connected');

            this.io.sockets.emit(G.SOCKETIO_NEWS_BROADCAST, 'new player connected!');

            socket.emit(G.SOCKETIO_NEWS_PRIVATE, 'successfully connected!');
            
            //接收到消息
            socket.on(G.SOCKETIO_NEWS_BROADCAST, (data)=>
            {
                this.io.sockets.emit(G.SOCKETIO_NEWS_BROADCAST, data); 
            });

            //加入房间
            socket.on(G.SOCKETIO_JOINROOM, ()=>
            {
                let flag = this.joinRoom(socket.id);

                if(flag == true)
                {
                    socket.join('room1');
                    global.console.log(socket.id + ' 加入了房间:' + 'room1');
                }
                else
                {
                    socket.emit(G.SOCKETIO_JOINROOM, '房间已满，请稍后刷新页面重试！');
                }                
            });

            //玩家准备
            socket.on(G.SOCKETIO_PLAYERREADY, (data)=>
            {
                global.console.log('server收到玩家准备的消息：' + socket.id + '-' + data);
                let status = data == '准备' ? true : false;
                this.setPlayerReadyStatus(socket.id, status);

                let isAllReady = this.isPlayerAllReady();
                if(isAllReady == true)
                {
                    this.initPlayerGenerator();
                    this.startRobLord();
                }
            });

            //玩家抢地主
            socket.on(G.SOCKETIO_ROBLORD, (data)=>
            {
                if(data == '3分')
                {
                    socket.emit(G.SOCKETIO_ASSIGNLORD);
                    let p = this.getCurrentPlayer();
                    p.isLord = true;
                }
                else
                {
                    let p = this.getCurrentPlayer();
                    if(data == '不叫')
                    {
                        p.giveUpLord = true;
                    }
                   
                    let nxtP = this.nextPlayer();
                    if(nxtP.giveUpLord != true)
                    {
                        this.setCurrentPlayer(nxtP);
                        let nxtsocket = this.getSocket(nxtP.uid);

                        let index = 0;
                        for(let i=0; i<G.ROBPOINT_CURRENT.length; i++)
                        {
                            if(G.ROBPOINT_CURRENT[i] == data)
                            {
                                index = i;
                            }
                        }
                        G.ROBPOINT_CURRENT = G.ROBPOINT_CURRENT.slice(index+1);
                        nxtsocket.emit(G.SOCKETIO_ASSIGNROBLORD_ON, G.ROBPOINT_CURRENT.join('_'));
                    }
                    else
                    {
                        let nxt_nxtP = this.nextPlayer();

                        if(nxt_nxtP.giveUpLord != true)
                        {
                            this.setCurrentPlayer(nxt_nxtP);
                            let nxt_nxtsocket = this.getSocket(nxt_nxtP);

                            let index = 0;
                            for(let i=0; i<G.ROBPOINT_CURRENT.length; i++)
                            {
                                if(G.ROBPOINT_CURRENT[i] == data)
                                {
                                    index = i;
                                }
                            }
                            G.ROBPOINT_CURRENT = G.ROBPOINT_CURRENT.slice(index+1);
                            nxt_nxtsocket.emit(G.SOCKETIO_ASSIGNROBLORD_ON, G.ROBPOINT_CURRENT.join('_'));
                        }
                        else
                        {
                            let nxt_nxt_nxtP = this.nextPlayer();
                            this.setCurrentPlayer(nxt_nxt_nxtP);
                            let nxt_nxt_nxtsocket = this.getSocket(nxt_nxt_nxtP);

                            nxt_nxt_nxtsocket.emit(G.SOCKETIO_ASSIGNLORD);
                        }
                    }
                }
            });

            //玩家出牌
            socket.on(G.SOCKETIO_DRAWCARD, (data)=>
            {
                
            });

        });
    }

    /******************************************* 等待阶段 ***********************************************/

    joinRoom(socketid)
    {
        if(this.playerList.length > 3)
        {
            return false;
        }
        else
        {
            if(this.hasPlayer(socketid) == false)
            {
                let newPlayer = new Player(socketid, socketid);
                this.playerList.push(newPlayer);
            }
            return true;
        }
    }

    getPlayer(socketid)
    {
        for(let p of this.playerList)
        {
            if(p.uid == socketid)
            {
                return p;
            }
        }
        return null;
    }

    hasPlayer(socketid)
    {
        for(let p of this.playerList)
        {
            if(p.uid == socketid)
            {
                return true;
            }
        }
        return false;
    }

    /**
     * 设置玩家的准备状态
     * @param {*} socketid 
     * @param {*} status 
     */
    setPlayerReadyStatus(socketid, status)
    {
        let p = this.getPlayer(socketid);
        p.isReady = status;
    }

    /**
     * 判断是否所有玩家完成准备
     */
    isPlayerAllReady()
    {
        for(let p of this.playerList)
        {
            if(p.isReady == false)
            {
                return false;
            }
        }
        return true;
    }

    initPlayerGenerator()
    {
        let list = this.playerList;
        let generator = function* ()
        {
            while(1)
            {
                yield list[0];
                yield list[1];
                yield list[2];
            }
        };
        this.playerGenerator = generator();
    }

    /******************************************* 抢地主阶段 ***********************************************/

    startRobLord()
    {
        G.ROBPOINT_CURRENT = G.ROBPOINT.slice(0); //当前局的叫分

        let randomIndex = GameRule.random(0,2);
        this.setCurrentPlayer(this.playerList[randomIndex]);

        let socket = this.getSocket(this.getCurrentPlayer().uid);   //获取当前player的socket
        socket.emit(G.SOCKETIO_ASSIGNROBLORD_ON, G.ROBPOINT_CURRENT.join('_'));

        let others = this.getOtherPlayers();
        others.forEach((item) => 
        {
            let skt = this.getSocket(item.uid);
            skt.emit(G.SOCKETIO_ASSIGNROBLORD_OFF);
        });
    }

    getSocket(socketid)
    {
        for(let key in this.io.sockets.connected)
        {
            if(key == socketid)
            {
                return this.io.sockets.connected[key];
            }
        }
        return null;
    }

    /******************************************* 发牌阶段 ***********************************************/

    /******************************************* 打牌阶段 ***********************************************/



    shuffleNewCardList()
    {
        this.cardList = CardData.getNewCard();
    }

    /**
     * 从一个总的牌数组中随机抽取指定数量的牌
     * @param {需要分发掉的总的牌的数据数组} array 
     * @param {需要从总牌中发多少张出来} num 
     * @param {发出来的牌的数据数组} targetArray 
     */
    randomShuffleCards(array, num, targetArray)
    {
        let len = array.length;
        if(targetArray.length < num)
        {
            let deleteIndex = Math.floor(Math.random()*len);
            let item = array[deleteIndex];
            Array.prototype.splice.call(array, deleteIndex, 1);
            targetArray.push(item);
            this.randomShuffleCards(array, num, targetArray);
        }
        return [targetArray,array];
    }

    dealCards(cardList)
    {
        let [player1, player2, player3] = G.players;
        let self = this;
        
        let dealer = function* ()
        {
            while(1)
            {
                {
                    let onecard = self.randomShuffleCards(cardList, 1, [])[0];
                    Array.prototype.push.call(player1.cardList, onecard[0]);
                    if(player1.isOwn == true)
                    {
                        self.renderCards(G.ownPlayerContainer, player1.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
                    }
                    else
                    {
                        self.renderCards(G.leftPlayerContainer, player1.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_TTB);
                    }
                }
                yield;
                
                {
                    let onecard = self.randomShuffleCards(cardList, 1, [])[0];
                    Array.prototype.push.call(player2.cardList, onecard[0]);
                    if(player2.isOwn == true)
                    {
                        self.renderCards(G.ownPlayerContainer, player2.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
                    }
                    else
                    {
                        self.renderCards(G.leftPlayerContainer, player2.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_TTB);
                    }
                }
                yield;
                
                {                
                    let onecard = self.randomShuffleCards(cardList, 1, [])[0];
                    Array.prototype.push.call(player3.cardList, onecard[0]);
                    if(player3.isOwn == true)
                    {
                        self.renderCards(G.ownPlayerContainer, player3.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
                    }
                    else
                    {
                        self.renderCards(G.rightPlayerContainer, player3.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_TTB);
                    }
                }
                yield;
            }
        };

        let d = dealer();
        
        let itv = setInterval(()=>
        {
            if(player1.cardList.length == 17 && player2.cardList.length == 17 && player3.cardList.length == 17)
            {
                clearInterval(itv);
                this.renderCards(G.dipaiAreaContainer, cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
                this.disableClick(G.ownPlayerContainer, G.CONTAINER_CLICK);
                this.enableSwipeSelect();
            }
            else
            {
                d.next();
            }
        }, G.DEALCARD_RATE);
    }

    nextPlayer()
    {
        let p = this.playerGenerator.next().value;
        return p;
    }

    setCurrentPlayer(player)
    {
        let flag = true;
        while(flag)
        {
            let p = this.nextPlayer();
            if(p.name == player.name && p.uid == player.uid)
            {
                p.isCurrentPlayer = true;
                flag = false;
            }
        }
    }

    getCurrentPlayer()
    {
        // let players = this.playerList;
        // for(let p of players)
        // {
        //     if(p.isCurrentPlayer == true)
        //     {
        //         return p;
        //     }
        // }

        let flag = true;
        while(flag)
        {
            let p = this.nextPlayer();
            if(p.isCurrentPlayer == true)
            {
                flag = false;
                return p;
            }
        }
    }

    getOtherPlayers()
    {
        let otherPlayerArray = [],
            players = this.playerList;
        for(let p of players)
        {
            if(p.isCurrentPlayer != true)
            {
                otherPlayerArray.push(p);
            }
        }
        return otherPlayerArray;
    }


}

module.exports = play_server;