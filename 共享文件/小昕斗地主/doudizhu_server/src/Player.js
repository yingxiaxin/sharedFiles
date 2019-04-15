class Player {
    constructor(socket) {
        this.id = socket.id;                                        // 玩家的socketid
        this.name = null;                                           // 玩家的昵称
        this.origin = socket.handshake.headers.origin;              // 玩家的连接origin
        this.address = socket.handshake.address;                    // 玩家的ip address
        this.socket = socket;

        this.cards = [];                                            // 玩家的手牌
        this.compete = 0;                                           // 玩家抢地主信息
        this.giveUpCompete = false;                                 // 是否放弃抢地主
        this.ready = false;                                         // 玩家准备信息
        this.isLord = false;                                        // 是否是地主

        this.playing = true;                                        // 此玩家是否在进行游戏
    }

    refresh() {
        this.cards = [];
        this.compete = 0;
        this.giveUpCompete = false;
        this.isLord = false;
        this.ready = false;
    }

    /**
     * 玩家收到发牌，将 牌存入手牌数组
     * @param {*} dataArray 
     */
    receiveCards(dataArray) {
        this.cards = [...this.cards, ...dataArray];
    }

    /**
     * 玩家出牌，从手牌中移除所出的牌
     * @param {*} dataArray 
     */
    dealCards(dataArray) {
        // 如果手牌中的某张牌，是出牌数据中有的，那么此牌不保留，filter函数return false
        // 若出牌数据中没有跟这张手牌一样的数据，说明还未打，保留这张手牌，filter函数return true
        dataArray.forEach((dealItem) => {
            this.cards = this.cards.filter((item) => {
                if (dealItem.type === item.type && dealItem.val === item.val) {
                    return false;
                } else {
                    return true;
                }
            });
        })
    }
}

module.exports = Player;