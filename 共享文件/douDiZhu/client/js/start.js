window.G = {};
G.init = function()
{
    let leftPlayerContainer = document.getElementsByClassName('leftPlayer')[0];
    let rightPlayerContainer = document.getElementsByClassName('rightPlayer')[0];
    let ownPlayerContainer = document.getElementsByClassName('player')[0];
    let mainAreaContainer = document.getElementsByClassName('mainArea')[0];
    let scoreAreaContainer = document.getElementsByClassName('scoreArea')[0];
    let timerAreaContainer = document.getElementsByClassName('timer')[0];
    let dipaiAreaContainer = document.getElementsByClassName('dipai')[0];
    let startBtn = document.getElementById('startBtn');

    G.leftPlayerContainer = leftPlayerContainer;
    G.rightPlayerContainer = rightPlayerContainer;
    G.ownPlayerContainer = ownPlayerContainer;
    G.mainAreaContainer = mainAreaContainer;
    G.scoreAreaContainer = scoreAreaContainer;
    G.timerAreaContainer = timerAreaContainer;
    G.dipaiAreaContainer = dipaiAreaContainer;
    G.startBtn = startBtn;

    G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR = 'ltr';    //插入玩家区域的牌的方向，从左往右插
    G.PLAYER_CONTAINER_INSERT_DIRECTION_TTB =  'ttb';   //插入玩家区域的牌的方向，从上往下插
    G.CARD_CLASSNAME = 'card';  //卡牌div的类名

    G.CONTAINER_CLICK = 'auto';     //是否在某块区域上禁止鼠标操作
    G.CONTAINER_NO_CLICK = 'none';

    G.DEALCARD_RATE = 100;  //发牌的快慢速率，默认100毫秒

    G.players = [];
}