import Card from './../Card/Card';

class NextPlayer {
    constructor(app) {
        this.container = app;                                                   // 玩家区的父节点
        this.ele = null;                                                        // 玩家区的dom结构
        this.cards = [];                                                        // 玩家区的牌
        this.cardData = [];                                                     // 玩家区的牌数据
        this.playerInfo = { id: null, name: null, score: 0, isLord: false };    // 玩家信息
        this.clockPos = {                                                       // 轮到nextPlayer时，倒计时钟的位置
            top: '170px',
            left: '180px',
        }

        this._init();
    }

    /************************************************************************************************************************* */
    /****************************************       以下为私有函数(以下划线开头)      ****************************************** */
    /****************************************       仅在本类内部被调用                ***************************************** */
    /************************************************************************************************************************ */

    _init() {
        let nPlayer = document.createElement('div');
        nPlayer.id = 'nextPlayer';
        this.ele = nPlayer;

        this._render();
    }

    _render() {
        this.container.ele.append(this.ele);
    }

    /**
     * 清除手牌区域
     */
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
     * 每张牌的高度是176px，每张牌比上一张移动25px，那么所有牌的总高度是176+(n-1)*25
     * 对手区(上、下玩家区)的高度设置为600px
     * 那么第一张牌的top值应为 (600/2 - (176+(n-1)*25)/2)，以后每张牌递增25
     */
    _arrangeCards() {
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
     * 刷新牌，首先重新排序，然后重新生成牌，并重新计算位置
     */
    _refresh() {
        this._clearCardContainer();
        this._sortCards();
        this._renderCards();
        this._arrangeCards();
    }

    /**
     * 通过设置div的playername和lord属性来更新值
     * css中伪元素的content属性可以通过content: attr(playername)的方式，动态的更新content内容
     */
    _updatePlayerInfo() {
        this.ele.setAttribute('playername', this.playerInfo.name ? this.playerInfo.name : this.playerInfo.id);
        this.ele.setAttribute('lord', this.playerInfo.isLord ? '地主' : '农民');
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
        let i = 0;
        let len = data.length;
        let itv = setInterval(() => {
            if (i <= len - 1) {
                this.cardData = this.cardData.concat([data[i]]);
                this._refresh();
                i = i + 1;
            } else {
                clearInterval(itv);
            }
        }, 300);
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

        this._refresh();
    }

    /**
     * 设置玩家的信息
     * @param {*} info 
     */
    setPlayerInfo(info) {
        this.playerInfo = Object.assign(this.playerInfo, info);
        this._updatePlayerInfo();
    }

    /**
     * 重置信息
     */
    reset() {
        this._clearCardContainer();
        this.cards = [];
        this.cardData = [];
        this.setPlayerInfo({ isLord: false });
    }
}

export default NextPlayer;