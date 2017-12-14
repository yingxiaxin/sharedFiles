class Player
{
    constructor(name='robot'+Math.random()*100, isLord=false, uid=null, nextPlayer=null, isReady=false, isLeave=false, cardList=[], isOwn=false, selectedCardList=[])
    {
        this.name = name;
        this.isLord = isLord;
        this.uid = uid;
        this.nextPlayer = nextPlayer;
        this.isReady = isReady;
        this.isLeave = isLeave;
        this.cardList = cardList;
        this.isOwn = isOwn;
        this.selectedCardList = selectedCardList;
    }
}