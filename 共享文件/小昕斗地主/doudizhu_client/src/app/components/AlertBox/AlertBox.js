import Util from '../../utils/Util';

class AlertBox {

}

AlertBox.show = function (msg, type = 'info') {
    let div = document.createElement('div');
    div.className = 'alertBox';
    Util.addClassName(div, type);
    div.innerHTML = msg;
    let body = document.getElementsByTagName('body')[0];
    body.append(div);

    setTimeout(() => {
        body.removeChild(div);
    }, 2500);
}

export default AlertBox;