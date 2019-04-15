import Util from './../../utils/Util';
import Constants from './../../utils/Constants';

class ButtonBar {
    constructor(app) {
        this.ele = null;
        this.container = app;
        this.coreExecutor = null;

        this._init();
    }

    /************************************************************************************************************************* */
    /****************************************       以下为私有函数(以下划线开头)      ****************************************** */
    /****************************************       仅在本类内部被调用                ***************************************** */
    /************************************************************************************************************************ */

    /**
     * 1、初始化dom结构
     * 2、增加按钮点击监听
     * 3、渲染dom
     * 4、先隐藏所有内容
     */
    _init() {
        let btnBar = document.createElement('div');
        btnBar.id = 'buttonBar';
        btnBar.innerHTML = `
            <div class='readyBtn'>
                <span id='ready'>准备</span>
                <span id='cancelReady'>取消准备</span>
            </div>
            <div class='competeBtn'>
                <span id='one'>1分</span>
                <span id='two'>2分</span>
                <span id='three'>3分</span>
                <span id='zero'>不叫</span>
            </div>
            <div class='dealCardBtn'>
                <span id='noDeal'>不出牌</span>
                <span id='cancelDeal'>取消</span>
                <span id='deal'>出牌</span>
            </div>`;

        this.ele = btnBar;

        this._addListeners();
        this._render();
        this.hideAll();         // 起初先隐藏所有内容
    }

    /**
     * 将此class内的dom结构挂载到游戏主容器div中
     */
    _render() {
        this.container.ele.append(this.ele);
    }

    /**
     * 事件代理，通过监听父节点点击情况，确定实际点击target来执行相应的内容
     */
    _addListeners() {
        // 增加点击事件的监听
        const readyDom = this.ele.getElementsByClassName('readyBtn')[0];
        const competeDom = this.ele.getElementsByClassName('competeBtn')[0];
        const dealDom = this.ele.getElementsByClassName('dealCardBtn')[0];

        readyDom.addEventListener('click', this._readyBtnClick.bind(this));
        competeDom.addEventListener('click', this._competeBtnClick.bind(this));
        dealDom.addEventListener('click', this._dealBtnClick.bind(this));

        // 增加button按钮的mousedown和mouseup监听，主要用来改变样式
        const spans = Array.from(this.ele.getElementsByTagName('span'));
        spans.forEach((item) => {
            item.addEventListener('mousedown', (e) => {
                let dom = e.target;
                Util.addClassName(dom, 'mousedown');
            });

            item.addEventListener('mouseup', (e) => {
                let dom = e.target;
                Util.removeClassName(dom, 'mousedown');
            });
        });
    }

    /**
     * 准备状态按钮的点击处理函数
     * @param {*} e 
     */
    _readyBtnClick(e) {
        const event = e || window.event;
        const target = event.target;
        if (target.id === 'ready') {
            // 如果“准备”按钮已经被点击了，那么禁用它
            this.disableReady();

            // 调用coreExecutor的方法发送准备状态信息
            this._clickReadyStatus({ isReady: true });
        } else if (target.id === 'cancelReady') {
            // 如果“取消准备”按钮被点击，那么取消“准备”按钮的禁用状态
            this.resetReady();

            // 调用coreExecutor的方法发送准备状态信息
            this._clickReadyStatus({ isReady: false });
        }
    }

    /**
     * 抢地主状态的点击处理函数
     * 此函数中不对抢地主按钮进行禁用处理，而是由executor根据收到的上家抢地主分数，来调用函数处理
     * @param {*} e 
     */
    _competeBtnClick(e) {
        const event = e || window.event;
        const target = event.target;
        switch (target.id) {
            case 'one': {
                // 调用coreExecutor的方法发送抢地主信息
                this._clickCompeteStatue({ compete: Constants.SCORE_ONE });
                break;
            }
            case 'two': {
                // 调用coreExecutor的方法发送抢地主信息
                this._clickCompeteStatue({ compete: Constants.SCORE_TWO });
                break;
            }
            case 'three': {
                // 调用coreExecutor的方法发送抢地主信息
                this._clickCompeteStatue({ compete: Constants.SCORE_THREE });
                break;
            }
            case 'zero': {
                // 调用coreExecutor的方法发送抢地主信息
                this._clickCompeteStatue({ compete: Constants.SCORE_ZERO });
                break;
            }
        }
    }

    /**
     * 出牌模式的点击处理函数
     * @param {*} e 
     */
    _dealBtnClick(e) {
        const event = e || window.event;
        const target = event.target;
        switch (target.id) {
            case 'noDeal': {
                // 调用coreExecutor的方法发送出牌信息
                this._clickDealStatus({ deal: Constants.NO_DEAL });
                break;
            }
            case 'cancelDeal': {
                // 调用coreExecutor的方法发送出牌信息
                this._clickDealStatus({ deal: Constants.CANCEL_DEAL });
                break;
            }
            case 'deal': {
                // 调用coreExecutor的方法发送出牌信息
                this._clickDealStatus({ deal: Constants.DEAL });
                break;
            }
        }
    }

    /**
     * 通过coreExecutor来调度其他模块执行出牌
     * @param {*} dealStatus 
     */
    _clickDealStatus(dealStatus) {
        this.coreExecutor.deal(dealStatus);
    }



    /**
     * 通过coreExecutor来调度其他模块执行抢地主后的内容
     * @param {*} competeStatus 
     */
    _clickCompeteStatue(competeStatus) {
        this.coreExecutor.compete(competeStatus);
    }



    /**
     * 通过coreExecutor来调度其他模块执行
     * @param {*} status 
     */
    _clickReadyStatus(status) {
        this.coreExecutor.sendReadyToServer(status);
    }

    /************************************************************************************************************************ */
    /****************************************       以下为公有函数           ************************************************* */
    /****************************************       开放供外部调用函数       ************************************************** */
    /************************************************************************************************************************ */

    /**
     * 重置函数
     * 所有按钮移除禁用class类名，并且隐藏
     */
    reset() {
        let spans = Array.from(this.ele.getElementsByTagName('span'));
        Util.doFnAll(spans, Util.removeClassName, 'disabled');
        this.hideAll();
    }

    /***************************************    准备按钮栏，对外开放的函数     ************************************************ */

    /**
     * 切换到准备状态，即只有“准备”和“取消准备”按钮
     */
    toReadyState() {
        let btnBarChilds = this.ele.children;
        let readyBtn = document.getElementsByClassName('readyBtn')[0];
        let array = Array.from(btnBarChilds);

        Util.doFnAll(array, Util.removeClassName, 'hide');
        Util.doFnExcept(array, readyBtn, Util.addClassName, 'hide');
    }

    /**
     * 禁用准备按钮
     */
    disableReady() {
        let span = document.getElementById('ready');
        Util.addClassName(span, 'disabled');
    }

    /**
     * 重置准备按钮
     */
    resetReady() {
        let span = document.getElementById('ready');
        Util.removeClassName(span, 'disabled');
    }

    /***************************************    叫分按钮栏，对外开放的函数     ************************************************ */

    /**
     * 切换到抢地主状态，即只有“1分”、“2分”、“3分”和“不叫”按钮
     */
    toCompeteState() {
        let btnBarChilds = this.ele.children;
        let competeBtn = document.getElementsByClassName('competeBtn')[0];
        let array = Array.from(btnBarChilds);

        Util.doFnAll(array, Util.removeClassName, 'hide');
        Util.doFnExcept(array, competeBtn, Util.addClassName, 'hide');
    }

    /**
     * 禁用1分按钮
     */
    disableOne() {
        let span = document.getElementById('one');
        Util.addClassName(span, 'disabled');
    }

    /**
     * 禁用1分、2分按钮
     */
    disableTwo() {
        let span1 = document.getElementById('one');
        let span2 = document.getElementById('two');
        Util.addClassName(span1, 'disabled');
        Util.addClassName(span2, 'disabled');
    }

    /**
     * 重置叫分按钮的禁用状态
     */
    resetCompete() {
        let span1 = document.getElementById('one');
        let span2 = document.getElementById('two');
        Util.removeClassName(span1, 'disabled');
        Util.removeClassName(span2, 'disabled');
    }

    /**
     * 切换到出牌状态，即只有“出牌”、“取消出牌”和“不出牌”按钮
     */
    toDealCardState() {
        let btnBarChilds = this.ele.children;
        let dealCardBtn = document.getElementsByClassName('dealCardBtn')[0];
        let array = Array.from(btnBarChilds);

        Util.doFnAll(array, Util.removeClassName, 'hide');
        Util.doFnExcept(array, dealCardBtn, Util.addClassName, 'hide');
    }

    /**
     * 隐藏所有按钮
     */
    hideAll() {
        let btnBarChilds = this.ele.children;
        Util.doFnAll(Array.from(btnBarChilds), Util.addClassName, 'hide');
    }

    /**
     * 注册核心调度模块executor
     * @param {*} executor 
     */
    registerExecutor(executor) {
        this.coreExecutor = executor;
    }
}

export default ButtonBar;

