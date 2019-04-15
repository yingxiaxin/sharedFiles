import Card from './../Card/Card';

class ExtraPool {
    constructor(app) {
        this.container = app;       // 底牌区的父节点
        this.ele = null;            // 底牌区的dom结构
        this.cards = [];            // 底牌区的牌
        this.cardData = [];         // 底牌区的牌数据

        this._init();
    }

    /************************************************************************************************************************* */
    /****************************************       以下为私有函数(以下划线开头)      ****************************************** */
    /****************************************       仅在本类内部被调用                ***************************************** */
    /************************************************************************************************************************ */

    _init() {
        let extraPool = document.createElement('div');
        extraPool.id = 'extraPool';
        this.ele = extraPool;

        this._render();
    }

    _render() {
        this.container.ele.append(this.ele);
    }    

    _clearCardContainer() {
        this.ele.innerHTML = '';
    }

    /**
     * 对牌进行排序，按照习惯从左往右依次由大到小
     * 牌的数据中，花色按类型type区分，那么大小王type值最小，放最左侧
     * 同花色的牌，val值大的放左侧
     * 数组的排序函数中，排在前面的返回小于0的值，排在后的返回大于0的值
     */
    _sortCards() {
        this.cardData.sort((prev, next) => {
            const ptype = parseInt(prev.type);
            const pval = parseInt(prev.val);
            const ntype = parseInt(next.type);
            const nval = parseInt(next.val);
            if (ptype < ntype) {
                return -1;
            } else if (ptype === ntype) {
                if (pval > nval) {
                    return -1;
                }
            } else {
                return 1;
            }
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
     * 对牌进行排列
     * 每张牌的宽度是114px，三张底牌平铺，间隔15px，那么总宽度是(114x3 + 15x2)=372 px
     * 底牌区宽度设置为400px
     * 那么第一张牌的left值应为 (400/2 - 372/2)，以后每张牌递增114+15
     */
    _arrangeCards() {
        const len = this.cards.length;
        const cardW = 114;
        const deltaW = 15;
        const W = 400;
        let left = (W / 2 - (cardW * len + deltaW * (len - 1)) / 2);
        this.cards.forEach((item) => {
            item.ele.style.left = left + 'px';
            left = left + cardW + deltaW;
        });
    }

    /**
     * 刷新牌，首先重新排序，然后重新生成牌，并重新计算位置
     */
    _refresh() {
        this._sortCards();
        this._renderCards();
        this._arrangeCards();
    }

    /************************************************************************************************************************ */
    /****************************************       以下为公有函数           ************************************************* */
    /****************************************       开放供外部调用函数       ************************************************** */
    /************************************************************************************************************************ */

    /**
     * 收到牌，将原有的牌数据数组与新收到的数据相结合，并刷新
     * @param {*} data 
     */
    receiveCards(data) {
        this.cardData = this.cardData.concat(data);
        this._refresh();
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
     * 重置信息
     */
    reset() {
        this._clearCardContainer();
        this.cards = [];
        this.cardData = [];
    }
}

export default ExtraPool;