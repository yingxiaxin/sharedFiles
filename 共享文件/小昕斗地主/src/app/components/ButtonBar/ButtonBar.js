import Util from './../../utils/Util';
import * as Constants from './../../utils/Constants';

class ButtonBar {
    constructor(app) {
        this.ele = null;
        this.container = app;
        this.coreExecutor = null;

        this.init();
    }

    init() {
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

        this.addListeners();
        this.render();
    }

    /**
     * 事件代理，通过监听父节点点击情况，确定实际点击target来执行相应的内容
     */
    addListeners() {
        const readyDom = this.ele.getElementsByClassName('readyBtn')[0];
        const competeDom = this.ele.getElementsByClassName('competeBtn')[0];
        const dealDom = this.ele.getElementsByClassName('dealCardBtn')[0];

        readyDom.addEventListener('click', this.readyBtnClick.bind(this));
        competeDom.addEventListener('click', this.competeBtnClick.bind(this));
        dealDom.addEventListener('click', this.dealBtnClick.bind(this));
    }

    /**
     * 出牌模式的点击处理函数
     * @param {*} e 
     */
    dealBtnClick(e) {
        const event = e || window.event;
        const target = event.target;
        const childs = Array.from(target.parentElement.children);

        // 禁用所按的按钮
        Util.doFnAll(childs, Util.addClassName, 'disabled');
        Util.doFnExcept(childs, target, Util.removeClassName, 'disabled');
        switch (target.id) {
            case 'noDeal': {
                // 调用coreExecutor的方法发送抢地主信息
                this.clickDealStatus({ deal: Constants.NO_DEAL });
            }
            case 'cancelDeal': {
                // 调用coreExecutor的方法发送抢地主信息
                this.clickDealStatus({ deal: Constants.CANCEL_DEAL });
            }
            case 'deal': {
                // 调用coreExecutor的方法发送抢地主信息
                this.clickDealStatus({ deal: Constants.DEAL });
            }
        }
    }

    /**
     * 通过coreExecutor来调度其他模块执行出牌
     * @param {*} dealStatus 
     */
    clickDealStatus(dealStatus) {
        console.log(dealStatus);
        this.coreExecutor.deal(dealStatus);
    }

    /**
     * 抢地主状态的点击处理函数
     * @param {*} e 
     */
    competeBtnClick(e) {
        const event = e || window.event;
        const target = event.target;
        const childs = Array.from(target.parentElement.children);

        // 禁用所按的按钮
        Util.doFnAll(childs, Util.addClassName, 'disabled');
        Util.doFnExcept(childs, target, Util.removeClassName, 'disabled');
        switch (target.id) {
            case 'one': {
                // 调用coreExecutor的方法发送抢地主信息
                this.clickCompeteStatue({ compete: Constants.SCORE_ONE });
            }
            case 'two': {
                // 调用coreExecutor的方法发送抢地主信息
                this.clickCompeteStatue({ compete: Constants.SCORE_TWO });
            }
            case 'three': {
                // 调用coreExecutor的方法发送抢地主信息
                this.clickCompeteStatue({ compete: Constants.SCORE_THREE });
            }
            case 'zero': {
                // 调用coreExecutor的方法发送抢地主信息
                this.clickCompeteStatue({ compete: Constants.SCORE_ZERO });
            }
        }
    }

    /**
     * 通过coreExecutor来调度其他模块执行抢地主后的内容
     * @param {*} competeStatus 
     */
    clickCompeteStatue(competeStatus) {
        console.log(competeStatus);
        this.coreExecutor.compete(competeStatus);
    }

    /**
     * 准备状态按钮的点击处理函数
     * @param {*} e 
     */
    readyBtnClick(e) {
        const event = e || window.event;
        const target = event.target;
        const childs = Array.from(target.parentElement.children);

        // 禁用所按的按钮
        Util.doFnAll(childs, Util.addClassName, 'disabled');
        Util.doFnExcept(childs, target, Util.removeClassName, 'disabled');
        if (target.id === 'ready') {
            // 调用coreExecutor的方法发送准备状态信息
            this.clickReadyStatus({ isReady: true });
        } else if (target.id === 'cancelReady') {
            // 调用coreExecutor的方法发送准备状态信息
            this.clickReadyStatus({ isReady: false });
        }
    }

    /**
     * 通过coreExecutor来调度其他模块执行
     * @param {*} status 
     */
    clickReadyStatus(status) {
        console.log(status);
        this.coreExecutor.sendReadyToServer(status);
    }

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

    render() {
        this.container.ele.append(this.ele);
    }
}

export default ButtonBar;

