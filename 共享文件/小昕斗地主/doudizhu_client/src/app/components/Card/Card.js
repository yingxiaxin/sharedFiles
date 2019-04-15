import Util from './../../utils/Util';
import CardData from './../../utils/CardData';

class Card {
    constructor(container, cardData) {
        this.container = container;     // 本张牌的父容器
        this.cardData = cardData;       // 本张牌的数据
        this.ele = null;                // 本张牌的dom元素
        this.isBackFace = true;         // 本张牌是否显示背面
        this.isSelected = true;         // 本张牌是否被选中
        this.pos = null;                // 本张牌的位置

        this._init();
    }

    /************************************************************************************************************************* */
    /****************************************       以下为私有函数(以下划线开头)      ****************************************** */
    /****************************************       仅在本类内部被调用                ***************************************** */
    /************************************************************************************************************************ */

    _init() {
        this.ele = document.createElement('div');
        this.ele.className = 'card';

        this._setStyle();
        this._render();
    }

    _setStyle() {
        // 通过设置背景图片位置，来显示具体牌面
        const bgPos = CardData.getIconPos(this.cardData.type, this.cardData.val);
        this.ele.style.backgroundPosition = bgPos;

        // 设置是否背面
        this.setBackFace(this.isBackFace);

        // 设置是否选中
        this.setSelected();
    }

    _render() {
        this.container.ele.append(this.ele);
    }

    /************************************************************************************************************************ */
    /****************************************       以下为公有函数           ************************************************* */
    /****************************************       开放供外部调用函数       ************************************************** */
    /************************************************************************************************************************ */

    /**
     * 设置牌是否反面朝上
     * @param {*} isback 
     */
    setBackFace(isback) {
        this.isBackFace = isback;
        if (isback) {
            Util.addClassName(this.ele, 'isback');
        } else {
            Util.removeClassName(this.ele, 'isback');
        }
    }

    /**
     * 设置选中属性
     * 此函数没有参数，每次调用对上次的选中状态取反，然后再根据新的选中状态设置样式
     */
    setSelected() {
        this.isSelected = !this.isSelected;
        if (this.isSelected) {
            Util.addClassName(this.ele, 'selected');
        } else {
            Util.removeClassName(this.ele, 'selected');
        }
    }

    
}

export default Card;