class NameInput {
    constructor(connector) {
        this.connector = connector;
        this.create();
    }

    create() {
        let div = document.createElement('div');
        div.className = 'nameInput';
        div.innerHTML = `
            <div class='inputBox'>
                <p class='inputTip'>请输入你的昵称</p>
                <input type='text' class='input'>
                <button class='nameInputBtn'>确认</button>
            </div>
        `;

        let body = document.getElementsByTagName('body')[0];
        let btn = Array.from(div.getElementsByClassName('nameInputBtn'));
        btn.forEach((item) => {
            item.addEventListener('click', (e) => {
                let ipt = e.target.previousElementSibling;
                if (ipt.value.length === 0) {
                    return;
                } else {
                    this.connector.sendPlayerName({ playerName: ipt.value });
                    body.removeChild(div);
                }
            });
        });        
        body.append(div);
    }
}

NameInput.show = function (connector) {
    if (!NameInput.instance) {
        let ipt = new NameInput(connector);
        NameInput.instance = ipt;
    }
    return NameInput.instance;
}

export default NameInput;