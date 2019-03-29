import Util from './../../utils/Util';
import CardData from './../../utils/CardData';

class Card {
    constructor(container, cardData) {
        this.container = container;
        this.cardData = cardData;
        this.ele = null;
        this.isBackFace = true;
        this.isSelected = true;
        this.pos = null;

        this.init();
    }

    init() {
        this.ele = document.createElement('div');
        this.ele.className = 'card';

        this.setStyle();
        this.render();
    }

    setStyle() {
        // 通过设置背景图片位置，来显示具体牌面
        const bgPos = CardData.getIconPos(this.cardData.type, this.cardData.val);
        this.ele.style.backgroundPosition = bgPos;

        // 设置是否背面
        this.setBackFace(this.isBackFace);

        // 设置是否选中
        this.setSelected();
    }

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

    render() {
        this.container.ele.append(this.ele);
    }
}

export default Card;