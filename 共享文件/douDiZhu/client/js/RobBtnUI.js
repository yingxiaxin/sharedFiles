import G from './global';

class RobBtnUI
{
    static show()
    {
        if(RobBtnUI.instance == null)
        {
            let robBtnContainer = document.createElement('div');
            robBtnContainer.style.position = 'absolute';
            robBtnContainer.style.width = '1000px';
            robBtnContainer.style.height = '40px';
            robBtnContainer.style.top = '50%';
            robBtnContainer.style.left = '50%';
            robBtnContainer.style.transform = 'translate(-50%)';
            robBtnContainer.style.display = 'flex';
            robBtnContainer.style.justifyContent = 'space-around';
            robBtnContainer.style.alignItems = 'center';

            let one_Btn = document.createElement('button');
            let two_Btn = document.createElement('button');
            let three_Btn = document.createElement('button');

            one_Btn.innerHTML = '1分';
            two_Btn.innerHTML = '2分';
            three_Btn.innerHTML = '3分';

            robBtnContainer.appendChild(one_Btn);
            robBtnContainer.appendChild(two_Btn);
            robBtnContainer.appendChild(three_Btn);

            one_Btn.onclick = function()
            {
                RobBtnUI.sendPoint(one_Btn.innerHTML);
                RobBtnUI.hide();
            };
            two_Btn.onclick = function()
            {
                RobBtnUI.sendPoint(two_Btn.innerHTML);
                RobBtnUI.hide();
            };
            three_Btn.onclick = function()
            {
                RobBtnUI.sendPoint(three_Btn.innerHTML);
                RobBtnUI.hide();
            };

            let bd = document.getElementsByTagName('body')[0];
            bd.appendChild(robBtnContainer);
            RobBtnUI.instance = robBtnContainer;

            RobBtnUI.hide();
            RobBtnUI.addSocketListener();
        }
        else
        {
            RobBtnUI.instance.style.display = 'flex';
        }
    }

    static hide()
    {
        if(RobBtnUI.instance != null)
        {
            RobBtnUI.instance.style.display = 'none';
        }
    }

    static remove()
    {
        if(RobBtnUI.instance != null)
        {
            let body = document.getElementsByTagName('body')[0];
            body.removeChild(RobBtnUI.instance);
            RobBtnUI.instance = null;
        }
    }

    static addSocketListener()
    {
        let socket = G.socket;

        socket.on(G.SOCKETIO_ASSIGNROBLORD_OFF, ()=>
        {
            RobBtnUI.hide();
        });

        socket.on(G.SOCKETIO_ASSIGNROBLORD_ON, (data)=>
        {
            window.console.log('socket 收到叫地主事件: ' + data);
            RobBtnUI.show();
            RobBtnUI.activateBtn(data);
        });
    }

    static sendPoint(point)
    {
        let socket = G.socket;
        socket.emit(G.SOCKETIO_ROBLORD, point);
    }

    static activateBtn(text)
    {
        let btns = Array.from(RobBtnUI.instance.getElementsByTagName('button'));
        for(let btn of btns)
        {
            if(text.includes(btn.innerHTML))
            {
                btn.disabled = false;
                btn.style.backgroundColor = 'blue';
            }
            else
            {
                btn.disabled = true;
                btn.style.backgroundColor = 'grey';
            }
        }
    }
}

RobBtnUI.instance = null;

export default RobBtnUI;