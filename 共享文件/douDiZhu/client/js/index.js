import G from './start';
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
    socket.on('news', function(data) 
    {
        console.log(data);
        socket.emit('private_message', { my: 'data' });
        console.log('emit private message');
    });
    
});



