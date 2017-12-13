// import GameRule from './GameRule';
// import CardUI from './CardUI';

class PlayUI
{
    
    sortPlayerCards(cardList)
    {
        let oneCard = cardUIs[1];
        let container = oneCard.parentNode;

        Array.prototype.sort.call(cardUIs, GameRule.cardSort);
    }

    renderCards(container, cardList)
    {
        this.removeAllCards(container);
        Array.prototype.sort.call(cardList, GameRule.cardSort);

        let left = 0;
        let overlapFactor = 0.75;   //两张牌不重叠的宽度比例
        for(let i=0; i<cardList.length; i++)
        {
            let num = cardList[i].val;
            let type = cardList[i].type;
            let card = new CardUI(num, type.toString(), container);
            container.appendChild(card.domInstance);

            let len = cardList.length;
            let cardwidth = card.domInstance.offsetWidth,
                cardheight = card.domInstance.offsetHeight;

            let cardsWidth = cardwidth + cardwidth*overlapFactor*(len-1);
            let gapwidth = (container.offsetWidth - cardsWidth)/2,
                gapheight = (container.offsetHeight - cardheight)/2;

            if(i == 0)
            {
                left = left + gapwidth;
            }
            card.domInstance.style.left = left + 'px';
            card.domInstance.style.bottom = gapheight + 'px';
            left = left + cardwidth*overlapFactor;
        }
    }

    removeAllCards(container)
    {
        let cards = Array.from(container.getElementsByClassName('card'));
        for(let card of cards)
        {
            container.removeChild(card);
        }
    }


}