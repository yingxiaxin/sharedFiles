import G from './start';
import CardData from './CardData';
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

        // document.addEventListener('DOMContentLoaded', function()
        // {
        //     document.removeEventListener('DOMContentLoaded', arguments.callee, false);
        //     fn();
        // }, false);
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

        // document.attachEvent('onreadystatechange', function()
        // {
        //     if(document.readyState == 'complete')
        //     {
        //         document.detachEvent('onreadystatechange', arguments.callee)
        //         fn();
        //     }  
        // });
    }
}


ready(function()
{
    G.init();

    let newcard = CardData.getNewCard();

    let play = new PlayUI();
    play.initPlayers();
    play.shuffleNewCardList();
    play.dealCards(play.cardList);
});



