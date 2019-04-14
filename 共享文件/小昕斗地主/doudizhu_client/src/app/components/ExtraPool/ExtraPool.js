import Card from './../Card/Card';

class ExtraPool {
    constructor(app) {
        this.container = app;
        this.ele = null;
        this.cards = [];
        this.cardData = [];

        this.init();
    }

    init() {
        let extraPool = document.createElement('div');
        extraPool.id = 'extraPool';
        this.ele = extraPool;

        this.render();
    }

    /**
     * 重置信息
     */
    reset() {
        this.clearCardContainer();
        this.cards = [];
        this.cardData = [];
    }

    clearCardContainer() {
        this.ele.innerHTML = '';
    }

    /**
     * 收到牌，将原有的牌数据数组与新收到的数据相结合，并刷新
     * @param {*} data 
     */
    receiveCards(data) {
        this.cardData = this.cardData.concat(data);

        this.refresh();

        // let i = 0;
        // let len = data.length;
        // let itv = setInterval(() => {
        //     if (i < len - 1) {
        //         this.cardData = this.cardData.concat([data[i]]);
        //         this.refresh();
        //         i = i + 1;
        //     } else {
        //         clearInterval(itv);
        //     }
        // }, 500);
    }

    /**
     * 刷新牌，首先重新排序，然后重新生成牌，并重新计算位置
     */
    refresh() {
        this.sortCards();
        this.renderCards();
        this.arrangeCards();
    }

    /**
     * 对牌进行排列
     * 每张牌的宽度是114px，三张底牌平铺，间隔15px，那么总宽度是(114x3 + 15x2)=372 px
     * 底牌区宽度设置为400px
     * 那么第一张牌的left值应为 (400/2 - 372/2)，以后每张牌递增114+15
     */
    arrangeCards() {
        const len = this.cards.length;
        const cardW = 114;
        const deltaW = 15;
        const W = 400;
        let left = (W / 2 - (cardW * len +  deltaW * (len - 1)) / 2);
        this.cards.forEach((item) => {
            item.ele.style.left = left + 'px';
            left = left + cardW + deltaW;
        });
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
     * 遍历数组，根据数据项实例化牌card的实例
     */
    renderCards() {
        let cards = this.cardData.map((item) => {
            return new Card(this, item);
        });
        this.cards = cards;
    }

    /**
     * 对牌进行排序，按照习惯从左往右依次由大到小
     * 牌的数据中，花色按类型type区分，那么大小王type值最小，放最左侧
     * 同花色的牌，val值大的放左侧
     * 数组的排序函数中，排在前面的返回小于0的值，排在后的返回大于0的值
     */
    sortCards() {
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

    render() {
        this.container.ele.append(this.ele);
    }
}

export default ExtraPool;