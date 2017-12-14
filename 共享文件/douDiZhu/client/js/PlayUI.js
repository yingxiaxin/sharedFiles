// import GameRule from './GameRule';
// import CardUI from './CardUI';

class PlayUI
{
    /**
     * 构造函数内移除除了本玩家手牌区域的鼠标事件
     */
    constructor()
    {
        let noclickContainers = [G.leftPlayerContainer, G.ownPlayerContainer, G.rightPlayerContainer, G.mainAreaContainer, G.scoreAreaContainer, G.timerAreaContainer, G.dipaiAreaContainer];

        for(let dom of noclickContainers)
        {
            this.disableClick(dom, G.CONTAINER_NO_CLICK);
        }

        this.enableRightClick();
    }

    /**
     * 在容器内生成牌
     * @param {*} container 
     * @param {*} cardList 
     * @param {*} direction 
     */
    renderCards(container, cardList, direction=G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR)
    {
        this.removeAllCards(container);
        Array.prototype.sort.call(cardList, GameRule.cardSort);

        let left = 0,
            top = 0;
        let overlapFactor = 0.75,
            overlapFactor_TTB = 0.07;   //两张牌不重叠的宽度比例
        for(let i=0; i<cardList.length; i++)
        {
            let num = cardList[i].val;
            let type = cardList[i].type;
            let card = new CardUI(num, type.toString(), container);
            container.appendChild(card.domInstance);

            let len = cardList.length;
            let cardwidth = card.domInstance.offsetWidth,
                cardheight = card.domInstance.offsetHeight;

            let cardsWidth = cardwidth + cardwidth*overlapFactor*(len-1),
                cardsHeight = cardheight + cardheight*overlapFactor_TTB*(len-1);
            let gapwidth_ltr = (container.offsetWidth - cardsWidth)/2,
                gapheight_ltr = (container.offsetHeight - cardheight)/2,
                gapwidth_ttb = (container.offsetWidth - cardwidth)/2,
                gapheight_ttb = (container.offsetHeight - cardsHeight)/2;

            switch (direction)
            {
                case G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR:
                {
                    if(i == 0)
                    {
                        left = left + gapwidth_ltr;
                    }
                    card.domInstance.style.left = left + 'px';
                    card.domInstance.style.bottom = gapheight_ltr + 'px';
                    left = left + cardwidth*overlapFactor;
                    break;
                }
                case G.PLAYER_CONTAINER_INSERT_DIRECTION_TTB:
                {
                    if(i == 0)
                    {
                        top = top + gapheight_ttb;
                    }
                    card.domInstance.style.top = top + 'px';
                    card.domInstance.style.left = gapwidth_ttb + 'px';
                    top = top + cardheight*overlapFactor_TTB;
                    break;
                }
            }
            
        }
    }

    /**
     * 清楚容器内的所有牌
     * @param {*} container 
     */
    removeAllCards(container)
    {
        let cards = Array.from(container.getElementsByClassName(G.CARD_CLASSNAME));
        for(let card of cards)
        {
            container.removeChild(card);
        }
    }


    shuffleNewCardList()
    {
        this.cardList = CardData.getNewCard();
    }

    /**
     * 从一个总的牌数组中随机抽取指定数量的牌
     * @param {需要分发掉的总的牌的数据数组} array 
     * @param {需要从总牌中发多少张出来} num 
     * @param {发出来的牌的数据数组} targetArray 
     */
    randomShuffleCards(array, num, targetArray)
    {
        let len = array.length;
        let self = this;
        if(targetArray.length < num)
        {
            let deleteIndex = Math.floor(Math.random()*len);
            let item = array[deleteIndex];
            Array.prototype.splice.call(array, deleteIndex, 1);
            targetArray.push(item);
            this.randomShuffleCards(array, num, targetArray);
        }
        return [targetArray,array];
    }

    dealCards(cardList)
    {                
        let [player1, player2, player3] = G.players;
        let self = this;
        
        let dealer = function* ()
        {
            while(1)
            {
                {
                    let onecard = self.randomShuffleCards(cardList, 1, [])[0];
                    Array.prototype.push.call(player1.cardList, onecard[0]);
                    if(player1.isOwn == true)
                    {
                        self.renderCards(G.ownPlayerContainer, player1.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
                    }
                    else
                    {
                        self.renderCards(G.leftPlayerContainer, player1.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_TTB);
                    }
                }
                yield;
                
                {
                    let onecard = self.randomShuffleCards(cardList, 1, [])[0];
                    Array.prototype.push.call(player2.cardList, onecard[0]);
                    if(player2.isOwn == true)
                    {
                        self.renderCards(G.ownPlayerContainer, player2.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
                    }
                    else
                    {
                        self.renderCards(G.leftPlayerContainer, player2.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_TTB);
                    }
                }
                yield;
                
                {                
                    let onecard = self.randomShuffleCards(cardList, 1, [])[0];
                    Array.prototype.push.call(player3.cardList, onecard[0]);
                    if(player3.isOwn == true)
                    {
                        self.renderCards(G.ownPlayerContainer, player3.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
                    }
                    else
                    {
                        self.renderCards(G.rightPlayerContainer, player3.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_TTB);
                    }
                }
                yield;
            }
        };

        let d = dealer();
        
        let itv = setInterval(()=>
        {
            if(player1.cardList.length == 17 && player2.cardList.length == 17 && player3.cardList.length == 17)
            {
                clearInterval(itv);
                this.renderCards(G.dipaiAreaContainer, cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
                this.disableClick(G.ownPlayerContainer, G.CONTAINER_CLICK);
            }
            else
            {
                d.next();
            }
        }, G.DEALCARD_RATE);
    }


    rightClickDrawCards(e)
    {
        this.drawCards();
        window.event.returnValue=false;
        e.stopPropagation(); //阻止事件冒泡
        return false;
    }

    drawCards()
    {
        let dom = G.ownPlayerContainer;
        let cardsArray = Array.from(dom.getElementsByClassName(G.CARD_CLASSNAME));

        let selectedCards = []; //被选中的牌的div元素
        for(let div of cardsArray)
        {
            if(div.getAttribute('selected') == 'true')
            {
                selectedCards.push(div);
            }
        }

        let selectedCardList = [];  //被选中的牌的数据
        let ownPlayer;
        for(let p of G.players)
        {
            if(p.isOwn == true)
            {
                ownPlayer = p;
            }
        }

        for(let card of selectedCards)
        {
            for(let [index,carddata] of ownPlayer.cardList.entries())
            {
                if(carddata.val == card.getAttribute('val') && carddata.type == card.getAttribute('type'))
                {
                    selectedCardList.push(carddata);
                    ownPlayer.cardList.splice(index, 1);
                }
            }
        }

        this.renderCards(G.mainAreaContainer, selectedCardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
        this.renderCards(G.ownPlayerContainer, ownPlayer.cardList, G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
    }



    initPlayers()
    {
        let p1 = new Player('A'),
        p2 = new Player('B'),
        p3 = new Player('C');

        p1.isOwn = true;

        G.players = [p1, p2, p3];
    }

    disableClick(container, clicktype)
    {
        container.style.pointerEvents = clicktype;
    }

    /**
     * 启用新的右键单击监听处理函数，右键出牌
     */
    enableRightClick()
    {
        let bd = document.getElementsByTagName('body')[0];

        bd.addEventListener('contextmenu', (e)=>{
            this.drawCards();
            window.event.returnValue=false;
            e.stopPropagation(); //阻止事件冒泡
            return false;
        });        
    }

}