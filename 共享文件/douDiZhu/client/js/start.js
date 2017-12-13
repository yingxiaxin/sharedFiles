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
}