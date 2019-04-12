import Card from './../Card/Card';
import { getSoundEffect } from './../../utils/SoundEffect';
import Constants from '../../utils/Constants';

class MainPlayer {
    constructor(app) {
        this.container = app;
        this.ele = null;
        this.cards = [];
        this.cardData = [];
        this.selectedCards = [];
        this.playerInfo = { id: null, name: null, score: 0, isLord: false };
        this.soundEffect = null;

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
        let mPlayer = document.createElement('div');
        mPlayer.id = 'mainPlayer';
        this.ele = mPlayer;
        this.soundEffect = getSoundEffect();

        this.addListeners();
        this.render();
    }

    /**
     * 增加选择牌的鼠标监听事件
     */
    addListeners() {
        this.ele.addEventListener('mousedown', onMouseDown.bind(this));
        this.ele.addEventListener('mouseup', onMouseUp.bind(this));

        let downX = 0;
        let mouseDownLeft = 0;      // 鼠标按下时相对于此容器的left值
        let mouseUpLeft = 0;        // 鼠标松开时相对于此容器的left值，pos内left介于这两个值之间的牌，被选中
        function onMouseDown(e) {
            downX = e.clientX;
        }

        function onMouseUp(e) {
            let upX = e.clientX;

            // ！！！注意！！！
            // 此处conX表示容器距离页面边缘的left值，因为在CSS中，使用了transform将容器平移自身宽度的50%来居中
            // 而transform的效果是不会改变offsetLeft值的，所以offsetLeft实际上是left: 50%的结果
            // 要得到真正的left距离，还需要减去自身宽度的50%
            let conX = (this.ele.offsetLeft - this.ele.offsetWidth * 0.5);
            mouseDownLeft = downX > conX ? (downX - conX) : 0;
            mouseUpLeft = upX > conX ? (upX - conX) : 0;

            let swiped = this.judgeSwipedCards(mouseDownLeft, mouseUpLeft);
            this.handleSwipedCards(swiped);
            this.setSelectedCards();
        }
    }

    /**
     * 判断牌是否被选中
     * 如果一张牌的右边缘，在min、max之间，那么这张牌被选中。min总之指较小的那个值，因为当鼠标从右向左划的时候
     * 鼠标抬起时候的left要比按下时候小
     * 牌的宽度是114px
     * @param {*} min 鼠标按下时距离容器的left距离
     * @param {*} max 鼠标抬起时距离容器的left距离
     */
    judgeSwipedCards(mLeft, mRight) {
        let min = Math.min(mLeft, mRight);
        let max = Math.max(mLeft, mRight);
        let swipedCards = this.cards.filter((item) => {
            let leftRim = item.pos.left;
            let rightRim = item.pos.left + 114;
            // 当牌的右边缘大于min，并且牌的左边缘小于max，判断牌被鼠标扫过
            if ((rightRim >= min && leftRim <= max)) {
                return true;
            } else {
                return false;
            }
        });
        return swipedCards;
    }

    /**
     * 对鼠标划中的牌进行处理
     * 也就是对上次的选中状态取反
     * @param {*} cardsArray 
     */
    handleSwipedCards(cardsArray) {
        cardsArray.forEach((item) => {
            item.setSelected();
        });
    }

    /**
     * 更新选中的牌数组
     * 遍历每张牌，根据牌的isSelected属性，来判断是否被选中
     */
    setSelectedCards() {
        this.selectedCards = this.cards.filter((item) => {
            if (item.isSelected) {
                return true;
            } else {
                return false;
            }
        })
    }

    /**
     * 将所有选中的牌取消
     * 用于在出牌阶段，点击“取消”按钮的时候
     */
    cancelSelectedCards() {
        this.selectedCards.forEach((item) => {
            item.setSelected();
        });
        this.setSelectedCards();
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
                // 每一次动画，播放一次音效
                this.soundEffect.play(Constants.CHUPAI);
                this.cardData = this.cardData.concat([data[i]]);
                this.refresh();
                i = i + 1;
            } else {
                clearInterval(itv);
            }
        }, 300);
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
        this.turnOverCards();
    }

    /**
     * 出牌
     * 1、将选中牌的牌数据与cardData相比较，通过filter函数得到新的cardData
     * 2、将选中牌区的牌的数据对象加入数组返回
     * 3、通过新的cardData重新生成手牌
     * 4、重置选中牌数组
     */
    dealCards() {
        this.selectedCards.forEach((card) => {
            this.cardData = this.cardData.filter((item) => {
                // 根据判断返回cardData里剩余的牌
                if (item.type === card.cardData.type && item.val === card.cardData.val) {
                    return false;
                } else {
                    return true;
                }
            });
        });

        // 2、刷新手牌区
        this.refresh();

        // 3、重置选中牌数组
        this.setSelectedCards();
    }

    /**
     * 获取准备出的牌，返回给executor进行判断
     */
    prepareToDeal() {
        let dealcardData = [];
        this.selectedCards.forEach((card) => {
            // 将选中牌区的牌的数据对象放入数组
            let obj = Object.assign({}, card.cardData);
            dealcardData.push(obj);
        });
        return dealcardData;
    }

    /**
     * 玩家区的牌是明牌，需要将遮盖去掉
     */
    turnOverCards() {
        this.cards.forEach((item) => {
            item.setBackFace(false);
        });
    }

    /**
     * 对牌进行排列
     * 每张牌的高度是114px，每张牌比上一张移动60px，那么所有牌的总宽度是114+(n-1)*60
     * 玩家牌区的宽度设置为1650px
     * 那么第一张牌的left值应为 (1650/2 - (114+(n-1)*60)/2)，以后每张牌递增60
     */
    arrangeCards() {
        const len = this.cards.length;
        const cardW = 114;
        const deltaW = 60;
        const W = 1650;
        let left = (W / 2 - (cardW + (len - 1) * deltaW) / 2);
        this.cards.forEach((item) => {
            // 将牌的left值记入，等到将来鼠标选牌的时候判断是否选中可以用到
            item.pos = { left: left };
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

    /**
     * 对牌进行排序，按照习惯从左往右依次由大到小
     * 牌的数据中，花色按类型type区分，那么大小王value值最大，放最左侧
     * 同val的牌，type值大的放左侧
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
            } else if (pval == nval) {
                if (ptype > ntype) {
                    return -1;
                } else {
                    return 1;
                }
            } else if (pval > nval) {
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
        this.updatePlayerInfo();
    }

    /**
     * 通过设置div的playername和lord属性来更新值
     * css中伪元素的content属性可以通过content: attr(playername)的方式，动态的更新content内容
     */
    updatePlayerInfo() {
        this.ele.setAttribute('playername', this.playerInfo.id);
        this.ele.setAttribute('lord', this.playerInfo.isLord ? '地主' : '农民');
    }

    render() {
        this.container.ele.append(this.ele);
    }
}

export default MainPlayer;