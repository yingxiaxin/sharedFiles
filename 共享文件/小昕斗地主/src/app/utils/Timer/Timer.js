class Timer {
    constructor(time = '10s') {
        this.time = null;
        this.onStartFn = null;
        this.onStopFn = null;
        this.onTickFn = null;
        
        this._uid = null;
        this._itvUid = null;
        this.countdown = null;
        this._validateParam(time);   // 定时器的定时时间，若设置的是纯数字，则以毫秒为单位，若是“xs”的字符串形式，则表明是多少秒
    }

    _validateParam(param) {
        // 若param是number，表明输入的是纯数字，纯数字以毫秒为单位
        const type = typeof param;
        if (type === 'number') {
            this.time = param;
            this.countdown = this.time;
        } else if (type === 'string') {
            const reg = /^\d+s$/g;
            if (reg.test(param)) {
                this.time = parseInt(param) * 1000;
                this.countdown = this.time;
            } else {
                throw new Error('Timer类要求设定的时间是毫秒为单位的数字，或秒为单位以英文"s"结尾的数字字符串');
            }
        } else {
            throw new Error('Timer类要求设定的时间是毫秒为单位的数字，或秒为单位以英文"s"结尾的数字字符串');
        }
    }

    setTime(time) {
        this._validateParam(time);
    }

    start() {
        if (this.onStartFn) {
            this.onStartFn();
        }

        this._startTime = new Date().getTime();
        this._uid = setTimeout(() => {
            if (this._itvUid) {
                clearInterval(this._itvUid);
                this._itvUid = null;
            }
            this._uid = null;
            this.countdown = this.time;

            if (this.onStopFn) {
                this.onStopFn();
            }
        }, this.time);

        this._itvUid = setInterval(() => {
            this._timerTick();
        }, 1000);
    }

    stop() {
        if (this._uid) clearTimeout(this._uid);
        if (this._itvUid) clearInterval(this._itvUid);
        this._uid = null;
        this._itvUid = null;
        this.countdown = this.time;

        if (this.onStopFn) {
            this.onStopFn();
        }
    }

    _timerTick() {
        this._updateCountdown();
        if (this.onTickFn) {
            this.onTickFn();
        }
    }
    _updateCountdown() {
        this.countdown = this.countdown - 1000;
    }

    setOnTimerStart(fn) {
        this.onStartFn = fn;
    }

    setOnTimerStop(fn) {
        this.onStopFn = fn;
    }

    setOnTimerTick(fn) {
        this.onTickFn = fn;
    }
}

export default Timer;