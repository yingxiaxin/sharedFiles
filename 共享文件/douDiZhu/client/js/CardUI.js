import G from './start';

class CardUI
{
    constructor(num, type, iconPos, parentCon)
    {
        this.cardNum = num;
        this.cardType = type;
        this.parentContainer = parentCon;

        //纸牌的最外层容器
        let instanceDiv = document.createElement('div');
        instanceDiv.style.position = 'absolute';
        instanceDiv.style.cursor = 'pointer';
        instanceDiv.style.userSelect = 'none';

        //如果不是玩家区域的牌，则显示牌背面
        instanceDiv.style.backgroundPosition = (this.parentContainer === G.ownPlayerContainer ? iconPos : G.CARD_BACK_POS);
        
        instanceDiv.setAttribute('class', 'card');

        this.domInstance = instanceDiv;

        this.domInstance.setAttribute('type', this.cardType);
        this.domInstance.setAttribute('val', this.cardNum);
    }
}

export default CardUI;