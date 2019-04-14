import Util from './../../utils/Util';

class ChatBoard {
    constructor(app) {
        this.container = app;
        this.ele = null;
        this.coreExecutor = null;
        this.colorMap = new Map();                              // 颜色和id的映射map
        this.colors = ['orange', 'purple', 'green'];            // 颜色原始数组
        this.leftColor = this.colors.slice(0);                  // 剩余的颜色

        this.init();
    }

    init() {
        let chatBoard = document.createElement('div');
        chatBoard.id = 'chatBoard';
        chatBoard.innerHTML = `
            <div class='chatDisplay'></div>
            <input type="text" class='chatInput'>
            <span>输入</span>
        `;
        this.ele = chatBoard;

        this.addListener();
        this.render();
    }

    addListener() {
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

        span.addEventListener('click', this.onClick.bind(this));

        // 监听input元素的键盘事件
        let input = this.ele.getElementsByClassName('chatInput')[0];
        input.addEventListener('keydown', this.onInputKeydown.bind(this));
    }

    /**
     * 按下回车键，等同于点击按钮
     * @param {*} e 
     */
    onInputKeydown(e) {
        if (e && e.keyCode == 13) { 
            console.log('keydown');
            this.onClick();
        }
    }

    /**
     * 点击按钮，提交发送的内容或者进行某种操作
     * 然后清除输入框内的文本
     */
    onClick() {
        this.submitInput();
        this.clearInput();
    }

    submitInput() {
        let input = this.ele.getElementsByClassName('chatInput')[0];
        let val = input.value;

        let shouldOp = this.shouldDoExtraOps(val);
        if (shouldOp) {
            return;
        } else {
            let msgObj = {
                senderId: this.container.mainPlayer.playerInfo.id,
                content: val
            }
            this.sendMessage(msgObj);
        }
    }

    /**
     * 由coreExecutor发送消息
     */
    sendMessage(msgObj) {
        this.coreExecutor.sendPlayerMessage(msgObj);
    }

    clearInput() {
        let ipt = this.ele.getElementsByClassName('chatInput')[0];
        ipt.value = '';
    }

    /**
     * 针对某些特殊输入，做一定的操作
     * @param {*} val 
     */
    shouldDoExtraOps(val) {
        switch (val) {
            case '-clear': {
                let dom = this.ele.getElementsByClassName('chatDisplay')[0];
                dom.innerHTML = '';
                break;
            }
        }
    }

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
        if (this.colorMap.has(senderId)) {
            classname = this.colorMap.get(senderId);
        } else {
            classname = this.leftColor[0];
            this.colorMap.set(senderId, classname);
            this.leftColor = this.leftColor.slice(1);
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

    render() {
        this.container.ele.append(this.ele);
    }
}

export default ChatBoard;