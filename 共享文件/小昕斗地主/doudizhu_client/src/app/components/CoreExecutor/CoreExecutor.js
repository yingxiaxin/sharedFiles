import Constants from "../../utils/Constants";

class CoreExecutor {
    constructor(app, mainPlayer, prevPlayer, nextPlayer, cardPool, extraPool, clock, buttonBar, connector) {
        this.app = app;
        this.mainPlayer = mainPlayer;
        this.prevPlayer = prevPlayer;
        this.nextPlayer = nextPlayer;
        this.cardPool = cardPool;
        this.extraPool = extraPool;
        this.clock = clock;
        this.buttonBar = buttonBar;
        this.connector = connector;

        this._playerList = [];
        this.lastCompete = 0;
        this.lastCompetor = null;
        this.playerDealLock = true;
    }

    /***************************************************************************************************************************** */
    /**************第一步：接收玩家信息********************************************************************************************* */
    /***************************************************************************************************************************** */

    /**
     * 接收到服务端发来的所有玩家列表的消息
     * @param {*} playerList 
     */
    rcvPlayerList(info) {
        let playerList = info.data.playerList;
        this._playerList = playerList;
        this._setPlayerInfo();
    }

    /**
     * 内部函数，仅在本class中被其他函数调用
     * 当玩家人数足够，准备开始之前，向所有客户端广播信息，客户端接收到后将玩家信息设置，以便在牌桌上显示
     */
    _setPlayerInfo() {
        let selfIndex = this._playerList.findIndex((item) => {
            return (item.id === this.connector.socket.id);
        });

        // 如果上一玩家index小于0，也就是说自己index是0，那么上一玩家是2
        // 如果下一玩家index大于2，也就是说自己index是2，那么下一玩家是0
        let prevIndex = (selfIndex - 1) < 0 ? 2 : (selfIndex - 1);
        let nextIndex = (selfIndex + 1) > 2 ? 0 : (selfIndex + 1);

        this.prevPlayer.setPlayerInfo(this._playerList[prevIndex]);
        this.nextPlayer.setPlayerInfo(this._playerList[nextIndex]);
    }

    /***************************************************************************************************************************** */
    /**************第二步：玩家到齐，界面切换到点击准备按钮界面*********************************************************************** */
    /***************************************************************************************************************************** */

    /**
     * 有足够玩家连接到服务器，游戏准备开始
     * 将玩家页面切换到准备状态
     */
    startGame() {
        this.buttonBar.toReadyState();
    }

    /**
     * 将准备状态通过connector发送至服务端
     */
    sendReadyToServer(status) {
        this.connector.sendReadyStatus(status);
    }

    /***************************************************************************************************************************** */
    /**************第三步：所有玩家准备，服务端开始发牌****************************************************************************** */
    /***************************************************************************************************************************** */

    /**
     * 接收到发牌的数据
     * 接收到数据的同时，将buttonBar切换到全隐藏状态
     * @param {*} info 
     */
    rcvShuffledCards(info) {
        // 切换buttonBar到全隐藏状态
        this.buttonBar.hideAll();

        // 然后将牌加入手牌区域
        let cardData = info.data.cards;
        this.mainPlayer.receiveCards(cardData);
    }

    /**
     * 接收到服务器发来的底牌数据
     * @param {*} info 
     */
    rcvExtraCards(info) {
        let cardData = info.data.cards;
        this.extraPool.receiveCards(cardData);
    }

    /***************************************************************************************************************************** */
    /**************第四步：发牌结束，根据服务端提示开始叫地主************************************************************************* */
    /***************************************************************************************************************************** */

    /**
     * 服务端提示，开始叫地主
     * 把界面切换到叫地主状态
     */
    shouldCompete() {
        this.buttonBar.toCompeteState();
    }

    /**
     * 通过connector，向服务端发送抢地主信息
     * 如果抢地主的分数小于等于上次抢地主的分数，那么无效，不做下一步处理
     * 否则，发送给服务端，并且将按钮隐藏
     * @param {*} compete 
     */
    compete(status) {
        let score = parseInt(status.compete);
        if (score <= this.lastCompete) {
            return;
        } else {
            this.buttonBar.hideAll();
            this.connector.sendCompeteStatus(status);
        }
    }

    /**
     * 收到服务端发来的其他玩家抢地主的叫分信息
     * @param {*} info
     */
    rcvCompeteInfo(info) {
        let score = info.data.score;
        let playerid = info.data.id;
        this.lastCompetor = this.findPlayerById(playerid);
        this.lastCompete = score;

        this.lastCompetor.setPlayerInfo({ score: score });
    }

    /**
     * 收到服务端发送的地主玩家信息
     * 1、设置显示地主信息
     * 2、地主玩家接收底牌
     * 3、将底牌翻转过来
     * @param {*} info 
     */
    rcvCompeteEnd(info) {
        // 1、将地主信息显示
        let playerid = info.data.lord;
        let player = this.findPlayerById(playerid);
        player.setPlayerInfo({ isLord: true });

        // 2、底牌给地主玩家
        let extraCardData = this.extraPool.cardData.slice(0);
        player.receiveCards(extraCardData);

        // 3、将底牌区的牌翻转
        this.extraPool.turnOverCards();
    }

    /***************************************************************************************************************************** */
    /**************第五步：开始出牌************************************************************************************************ */
    /***************************************************************************************************************************** */

    /**
     * 收到服务端要求出牌的信息
     * 1、将buttonBar切换到出牌界面
     * 2、将玩家的出牌锁打开
     */
    rcvPlayerDeal() {
        // 1、切换到出牌界面
        this.buttonBar.toDealCardState();

        // 2、打开出牌锁
        this.playerDealLock = false;
    }

    /**
     * 出牌
     * status为buttonBar按钮点击时传过来的状态
     * @param {*} status 
     */
    deal(status) {
        if (this.playerDealLock) {
            return;
        } else {
            switch (status.deal) {
                case Constants.NO_DEAL: {
                    // 放弃出牌的话，出牌数组deal为空数组[]
                    let status = { message: '大不了', data: { deal: [] } };
                    this.connector.sendDealStatus(status);

                    // 放弃出牌，将手牌区锁加回去
                    this.playerDealLock = true;
                    break;
                }
                case Constants.CANCEL_DEAL: {
                    // 取消以前选中的牌
                    this.mainPlayer.cancelSelectedCards();
                    break;
                }
                case Constants.DEAL: {
                    // 出牌
                    let cardData = this.mainPlayer.dealCards();
                    let status = { message: '出牌', data: { deal: cardData } };
                    this.connector.sendDealStatus(status);

                    // 出牌到出牌区
                    this._dealToCardPool(cardData);

                    // 将手牌区锁加上
                    this.playerDealLock = true;
                    break;
                }
            }
        }
    }

    /**
     *  收到其他玩家的出牌信息
     * @param {*} info 
     */
    rcvOthersDeal(info) {
        let playerid = info.data.playerid;
        let cardData = info.data.deal;
        let player = this.findPlayerById(playerid);

        player.dealCards(cardData);
        this._dealToCardPool(cardData);
    }

    /**
     * 将牌打入出牌区域
     * @param {*} cardData 
     */
    _dealToCardPool(cardData) {
        this.cardPool.receiveCards(cardData);
    }

    /***************************************************************************************************************************** */
    /**************第六步：游戏结束，输赢信息显示************************************************************************************ */
    /***************************************************************************************************************************** */

    /**
     * 收到服务端消息，玩家获胜
     */
    rcvWin() {
        alert('恭喜，你赢了！');
        this.reset();
    }

    /**
     * 收到服务端消息，玩家失败
     */
    rcvLose() {
        alert('很遗憾，你输了！');
        this.reset();
    }

    /**
     * 重置标识符等
     */
    reset() {
        // 重置executor里的标识符等
        this._playerList = [];
        this.lastCompete = 0;
        this.lastCompetor = null;
        this.playerDealLock = true;

        // 重置玩家区的信息
        this.mainPlayer.reset();
        this.prevPlayer.reset();
        this.nextPlayer.reset();
    }

    /***************************************************************************************************************************** */
    /**********************************公共函数************************************************************************************ */
    /***************************************************************************************************************************** */

    /**
     * 根据id找到相应的玩家
     * @param {*} id 
     */
    findPlayerById(id) {
        if (this.mainPlayer.playerInfo.id === id) {
            return this.mainPlayer;
        } else if (this.prevPlayer.playerInfo.id === id) {
            return this.prevPlayer;
        } else {
            return this.nextPlayer;
        }
    }
}

export default CoreExecutor;