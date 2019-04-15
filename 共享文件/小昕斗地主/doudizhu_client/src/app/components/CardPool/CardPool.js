import Card from './../Card/Card';

class CardPool {
    constructor(app) {
        this.container = app;
        this.ele = null;
        this.cards = [];
        this.cardData = [];

        this._init();
    }

    /************************************************************************************************************************* */
    /****************************************       以下为私有函数(以下划线开头)      ****************************************** */
    /****************************************       仅在本类内部被调用                ***************************************** */
    /************************************************************************************************************************ */

    _init() {
        let cardPool = document.createElement('div');
        cardPool.id = 'cardPool';
        this.ele = cardPool;

        this._render();
    }

    _render() {
        this.container.ele.append(this.ele);
    }

    /**
     * 清除中央的牌区
     */
    _clearPool() {
        this.ele.innerHTML = '';
    }

    /**
     * 将牌翻转
     */
    _turnOverCards() {
        this.cards.forEach((item) => {
            item.setBackFace(false);
        })
    }

    /**
     * 对牌进行排列
     * 每张牌的高度是114px，每张牌比上一张移动80px，那么所有牌的总宽度是114+(n-1)*80
     * 玩家牌区的宽度设置为1650px
     * 那么第一张牌的left值应为 (1650/2 - (114+(n-1)*80)/2)，以后每张牌递增80
     */
    _arrangeCards() {
        const len = this.cards.length;
        const cardW = 114;
        const deltaW = 80;
        const W = 1650;
        let left = (W / 2 - (cardW + (len - 1) * deltaW) / 2);
        this.cards.forEach((item) => {
            item.ele.style.left = left + 'px';
            left = left + deltaW;
        });
    }

    /**
     * 遍历数组，根据数据项实例化牌card的实例
     */
    _renderCards() {
        let cards = this.cardData.map((item) => {
            return new Card(this, item);
        });
        this.cards = cards;
    }

    /**
     * 刷新牌，清除牌区，重新生成牌
     */
    _refresh() {
        this._clearPool();
        this._renderCards();
        this._turnOverCards();
        this._arrangeCards();
    }

    /************************************************************************************************************************ */
    /****************************************       以下为公有函数           ************************************************* */
    /****************************************       开放供外部调用函数       ************************************************** */
    /************************************************************************************************************************ */

    /**
     * 收到牌，唯独出牌区，收到牌后，直接赋予给cardData，而不是将两个数据连起来
     * @param {*} data 
     */
    receiveCards(data) {
        this.cardData = data;
        this._refresh();
    }

    /**
     * 重置信息
     */
    reset() {
        this._clearPool();
        this.cards = [];
        this.cardData = [];
    }
}

export default CardPool;