import Card from './../Card/Card';

class CardPool {
    constructor(app) {
        this.container = app;
        this.ele = null;
        this.cards = [];
        this.cardData = [];

        this.init();
    }

    init() {
        let cardPool = document.createElement('div');
        cardPool.id = 'cardPool';
        this.ele = cardPool;

        this.render();
    }

    /**
     * 收到牌，唯独出牌区，收到牌后，直接赋予给cardData，而不是将两个数据连起来
     * @param {*} data 
     */
    receiveCards(data) {
        this.cardData = data;

        this.refresh();
    }

    /**
     * 刷新牌，清除牌区，重新生成牌
     */
    refresh() {
        this.clearPool();
        this.renderCards();
        this.turnOverCards();
        this.arrangeCards();
    }

    /**
     * 清除中央的牌区
     */
    clearPool() {
        this.ele.innerHTML = '';
    }

    /**
     * 将牌翻转
     */
    turnOverCards() {
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
    arrangeCards() {
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
    renderCards() {
        let cards = this.cardData.map((item) => {
            return new Card(this, item);
        });
        this.cards = cards;
    }

    render() {
        this.container.ele.append(this.ele);
    }
}

export default CardPool;