class Player
{
    constructor(name='robot'+Math.random()*100, uid=null)
    {
        this.name = name;
        this.uid = uid;
        this.isLord = false;        
        this.nextPlayer = null;
        this.isReady = false;
        this.isLeave = false;
        this.cardList = [];
        this.isOwn = false;
        this.selectedCardList = [];
        this.isCurrentPlayer = false;
    }
}

module.exports = Player;