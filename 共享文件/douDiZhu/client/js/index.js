import G from './global';
import PlayUI from './PlayUI';
import RobBtnUI from './RobBtnUI';
import StartBtnUI from './StartBtnUI';




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
                document.detachEvent('onreadystatechange', arguments.callee);
                fn();
            }
        };

        document.attachEvent('onreadystatechange', addlistener);
    }
}


ready(function()
{
    G.init();

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





    
    G.socket = socket;
    StartBtnUI.show();
    RobBtnUI.show();

    let play = new PlayUI();
    play.initPlayers();
    play.shuffleNewCardList();
    play.dealCards(play.cardList);
<<<<<<< HEAD
    
=======
>>>>>>> 228c7267828bc5959c4ddd3a9957d024db417efb
    
});



