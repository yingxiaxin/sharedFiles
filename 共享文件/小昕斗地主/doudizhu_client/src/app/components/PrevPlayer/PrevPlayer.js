import Card from './../Card/Card';

class PrevPlayer {
    constructor(app) {
        this.container = app;
        this.ele = null;
        this.cards = [];
        this.cardData = [];
        this.selectedCards = [];
        this.playerInfo = { id: null, name: null, score: 0, isLord: false };

        this.init();
    }

    /**
     * 重置信息
     */
    reset() {
        this.cards = [];
        this.cardData = [];
        this.selectedCards = [];
        this.playerInfo = { id: null, name: null, score: 0, isLord: false };
    }

    init() {
        let pPlayer = document.createElement('div');
        pPlayer.id = 'prevPlayer';
        this.ele = pPlayer;

        this.render();
    }

    /**
     * 收到牌，将原有的牌数据数组与新收到的数据相结合，并刷新
     * @param {*} data 
     */
    receiveCards(data) {
        // this.cardData = this.cardData.concat(data);

        // this.refresh();

        let i = 0;
        let len = data.length;
        let itv = setInterval(() => {
            if (i <= len - 1) {
                this.cardData = this.cardData.concat([data[i]]);
                this.refresh();
                i = i + 1;
            } else {
                clearInterval(itv);
            }
        }, 500);
    }

    /**
     * 清除手牌区域
     */
    clearCardContainer() {
        this.ele.innerHTML = '';
    }

    /**
     * 刷新牌，首先重新排序，然后重新生成牌，并重新计算位置
     */
    refresh() {
        this.clearCardContainer();
        this.sortCards();
        this.renderCards();
        this.arrangeCards();
    }

    dealCards(cards) {
        cards.forEach((card) => {
            this.cardData = this.cardData.filter((item) => {
                if (item.type === card.type && item.val === card.val) {
                    return false;
                } else {
                    return true;
                }
            });
        });

        this.refresh();
    }

    /**
     * 对牌进行排列
     * 每张牌的高度是176px，每张牌比上一张移动25px，那么所有牌的总高度是176+(n-1)*25
     * 对手区(上、下玩家区)的高度设置为600px
     * 那么第一张牌的top值应为 (600/2 - (176+(n-1)*25)/2)，以后每张牌递增25
     */
    arrangeCards() {
        const len = this.cards.length;
        const cardH = 176;
        const deltaH = 25;
        const H = 600;
        let top = (H / 2 - (cardH + (len - 1) * deltaH) / 2);
        this.cards.forEach((item) => {
            item.ele.style.top = top + 'px';
            top = top + deltaH;
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
            if (pval < nval) {
                return 1;
            } else if (pval === nval) {
                if (ptype > ntype) {
                    return -1;
                }
            } else {
                return -1;
            }
        });
    }

    /**
     * 设置玩家的信息
     * @param {*} info 
     */
    setPlayerInfo(info) {
        this.playerInfo = Object.assign(this.playerInfo, info);
    }

    render() {
        this.container.ele.append(this.ele);
    }
}

export default PrevPlayer;