import G from './global';
// import CardData from './CardData';
import PlayUI from './PlayUI';




function ready(fn)
{
    if(document.addEventListener)
    {
        let addlistener = function()
        {
            document.removeEventListener('DOMContentLoaded', addlistener, false);
            fn();
        };

        document.addEventListener('DOMContentLoaded', addlistener, false);
    }
    else if(document.attachEvent)
    {
        let addlistener = function()
        {
            if(document.readyState == 'complete')
            {
                document.detachEvent('onreadystatechange', arguments.callee)
                fn();
            }
        };

        document.attachEvent('onreadystatechange', addlistener);
    }
}


ready(function()
{
    G.init();
    // let newcard = CardData.getNewCard();
    let play = new PlayUI();
    play.initPlayers();
    play.shuffleNewCardList();
    play.dealCards(play.cardList);



    let socket = io.connect('http://localhost:3000');

    socket.on(G.SOCKETIO_NEWS_PRIVATE, (data)=>
    {
        window.console.log('receive server message: ' + data);
        socket.emit(G.SOCKETIO_JOINROOM);
        window.console.log('client emit join room event');    
    });

    socket.on(G.SOCKETIO_JOINROOM, (data)=>
    {
        alert(data); 
    });

    
    
});



