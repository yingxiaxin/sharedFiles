import G from './global';

class StartBtnUI
{
    static show()
    {
        if(StartBtnUI.instance == null)
        {
            let startBtnContainer = document.createElement('div');
            startBtnContainer.style.position = 'absolute';
            startBtnContainer.style.width = '1000px';
            startBtnContainer.style.height = '40px';
            startBtnContainer.style.top = '50%';
            startBtnContainer.style.left = '50%';
            startBtnContainer.style.transform = 'translate(-50%)';
            startBtnContainer.style.display = 'flex';
            startBtnContainer.style.justifyContent = 'space-around';
            startBtnContainer.style.alignItems = 'center';

            let startBtn = document.createElement('button');
            startBtn.innerHTML = '准备';

            startBtnContainer.appendChild(startBtn);
            startBtn.onclick = function()
            {
                StartBtnUI.sendReadyStatus(startBtn.innerHTML);
            };

            let bd = document.getElementsByTagName('body')[0];
            bd.appendChild(startBtnContainer);
            StartBtnUI.instance = startBtnContainer;
        }
        else
        {
            StartBtnUI.instance.style.display = 'flex';
        }
    }

    static hide()
    {
        if(StartBtnUI.instance != null)
        {
            StartBtnUI.instance.style.display = 'none';
        }
    }

    static remove()
    {
        if(StartBtnUI.instance != null)
        {
            let body = document.getElementsByTagName('body')[0];
            body.removeChild(StartBtnUI.instance);
            StartBtnUI.instance = null;
        }
    }

    static sendReadyStatus(status)
    {
        let socket = G.socket;
        socket.emit(G.SOCKETIO_PLAYERREADY, status);
        StartBtnUI.hide();
    }

}

StartBtnUI.instance = null;

export default StartBtnUI;