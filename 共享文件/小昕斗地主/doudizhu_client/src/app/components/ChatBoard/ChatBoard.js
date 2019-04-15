import Util from './../../utils/Util';

class ChatBoard {
    constructor(app) {
        this.container = app;
        this.ele = null;
        this.coreExecutor = null;
        this.colorMap = new Map();                              // 颜色和id的映射map
        this.colors = ['orange', 'purple', 'green'];            // 颜色原始数组
        this.systemColor = 'red';                               // 系统消息的颜色
        this.leftColor = this.colors.slice(0);                  // 剩余的颜色

        this._init();
    }

    /************************************************************************************************************************* */
    /****************************************       以下为私有函数(以下划线开头)      ****************************************** */
    /****************************************       仅在本类内部被调用                ***************************************** */
    /************************************************************************************************************************ */

    _init() {
        let chatBoard = document.createElement('div');
        chatBoard.id = 'chatBoard';
        chatBoard.innerHTML = `
            <div class='chatDisplay'></div>
            <input type="text" class='chatInput'>
            <span>输入</span>
        `;
        this.ele = chatBoard;

        this._addListener();
        this._render();
    }

    _addListener() {
        // 监听span按钮的mousedown、mouseup和click事件
        let span = this.ele.getElementsByTagName('span')[0];
        span.addEventListener('mousedown', (e) => {
            let dom = e.target;
            Util.addClassName(dom, 'mousedown');
        });

        span.addEventListener('mouseup', (e) => {
            let dom = e.target;
            Util.removeClassName(dom, 'mousedown');
        });

        span.addEventListener('click', this._onClick.bind(this));

        // 监听input元素的键盘事件
        let input = this.ele.getElementsByClassName('chatInput')[0];
        input.addEventListener('keydown', this._onInputKeydown.bind(this));
    }

    _render() {
        this.container.ele.append(this.ele);
    }

    /**
     * 按下回车键，等同于点击按钮
     * @param {*} e 
     */
    _onInputKeydown(e) {
        if (e && e.keyCode == 13) {
            console.log('keydown');
            this._onClick();
        }
    }

    /**
     * 点击按钮，提交发送的内容或者进行某种操作
     * 然后清除输入框内的文本
     */
    _onClick() {
        this._submitInput();
        this._clearInput();
    }

    /**
     * 清除输入框内文本
     */
    _clearInput() {
        let ipt = this.ele.getElementsByClassName('chatInput')[0];
        ipt.value = '';
    }

    /**
     * 提交输入框中的内容
     * 1、首先进行额外操作检测，检测到特殊命令输入的，执行特殊命令
     * 2、若不是特殊命令，那么向服务端发送文本信息
     */
    _submitInput() {
        let input = this.ele.getElementsByClassName('chatInput')[0];
        let val = input.value;

        // 检测是否进行特殊命令执行
        let shouldOp = this._shouldDoExtraOps(val);
        if (shouldOp) {
            return;
        } else {
            let msgObj = {
                senderId: this.container.mainPlayer.playerInfo.id,
                content: val
            }
            this._sendMessage(msgObj);
        }
    }

    /**
     * 针对某些特殊输入，做一定的操作
     * @param {*} val 
     */
    _shouldDoExtraOps(val) {
        switch (val) {
            case '-clear': {
                let dom = this.ele.getElementsByClassName('chatDisplay')[0];
                dom.innerHTML = '';
                return true;
            }
        }
    }

    /**
     * 由coreExecutor发送消息
     */
    _sendMessage(msgObj) {
        this.coreExecutor.sendPlayerMessage(msgObj);
    }

    /************************************************************************************************************************ */
    /****************************************       以下为公有函数           ************************************************* */
    /****************************************       开放供外部调用函数       ************************************************** */
    /************************************************************************************************************************ */

    /**
     * 接收到消息数据后，根据id值显示不同的发送者id颜色
     * 同时滚动至最新消息处
     * @param {*} msg 
     */
    rcvMessage(msg) {
        // 获取发送者的id和发送的内容
        let senderId = msg.senderId;
        let content = msg.content;

        // 如果颜色映射map中有次id作为key值，说明以前显示过这个id发来的消息，那么直接将它的颜色值类名获取
        // 如果没有，那么从数组中获取第一个颜色值类名，放入map，同时删除数组第一个元素
        let classname = '';
        if (senderId === '系统消息') {
            classname = this.systemColor;
        } else {
            if (this.colorMap.has(senderId)) {
                classname = this.colorMap.get(senderId);
            } else {
                classname = this.leftColor[0];
                this.colorMap.set(senderId, classname);
                this.leftColor = this.leftColor.slice(1);
            }
        }

        // 将消息内容和发送者以不同的类名标记好，放入p标签中
        let p = document.createElement('P');
        p.innerHTML = `<span class=${classname}>${senderId}</span>: <span class='content'>${content}</span>`;

        // 将p标签加入到消息显示框内
        let wrapper = this.ele.getElementsByClassName('chatDisplay')[0];
        wrapper.append(p);

        // 消息显示框始终显示最新消息
        wrapper.scrollTop = wrapper.scrollHeight;
    }

    registerExecutor(executor) {
        this.coreExecutor = executor;
    }


}

export default ChatBoard;