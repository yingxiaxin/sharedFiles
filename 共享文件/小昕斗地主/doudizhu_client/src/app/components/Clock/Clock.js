import { getTimerInstance } from './Timer/SingletonTimer';
import ParticleBoard from './ParticleBoard/ParticleBoard';

class Clock {
    constructor(app) {
        this.ele = null;
        this.container = app;
        this.timer = getTimerInstance();
        this.onClockStopFn = this.timer.onTimerStop;
        this.onClockTickFn = this.timer.onTimerTick;
        this.particleBoard = null;
        this.defaultPos = {                                     // 倒计时钟默认的位置
            top: '20px',
            right: '300px',
        }
        this._init();
    }

    /************************************************************************************************************************* */
    /****************************************       以下为私有函数(以下划线开头)      ****************************************** */
    /****************************************       仅在本类内部被调用                ***************************************** */
    /************************************************************************************************************************ */

    _init() {
        this.ele = document.createElement('div');
        this.ele.id = 'clock';
        // this.ele.innerHTML = `<span>30</span>`;
        this.particleBoard = new ParticleBoard(this.ele, 60, 40, 40, 400, 2, 2);


        this.setOnClockTick(this.updateText.bind(this));
        this._render();
    }

    _render() {
        this.container.ele.append(this.ele);
        this.setDefaultPos();
    }

    /************************************************************************************************************************ */
    /****************************************       以下为公有函数           ************************************************* */
    /****************************************       开放供外部调用函数       ************************************************** */
    /************************************************************************************************************************ */

    setOnClockStop(fn) {
        this.timer.setOnTimerStop(fn);
        return this;
    }

    setOnClockTick(fn) {
        this.timer.setOnTimerTick(fn);
        return this;
    }

    updateText() {
        this.particleBoard.draw(Math.floor(this.timer.countdown / 1000));
    }

    countDown(timeStr = '30s') {
        this.timer.setTime(timeStr);
        this.timer.start();
        return this;
    }

    setPosition(posObj) {
        // 首先要清除top、bottom、left和right的值，不然top和bottom共存时按top值，left和right共存时按left值来渲染
        this.ele.style.top = '';
        this.ele.style.bottom = '';
        this.ele.style.left = '';
        this.ele.style.right = '';
        for (let attr in posObj) {
            this.ele.style[attr] = posObj[attr];
        }
    }

    setDefaultPos() {
        this.setPosition(this.defaultPos);
    }
}

export default Clock;