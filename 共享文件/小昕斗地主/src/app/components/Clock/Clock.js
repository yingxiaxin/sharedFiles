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
        this.init();
    }

    init() {
        this.ele = document.createElement('div');
        this.ele.id = 'clock';
        // this.ele.innerHTML = `<span>30</span>`;
        this.particleBoard = new ParticleBoard(this.ele, 150, 100, 100, 400, 4, 3);


        this.setOnClockTick(this.updateText.bind(this));
        this.render();
    }

    render() {
        this.container.ele.append(this.ele);
    }

    setOnClockStop(fn) {
        this.timer.setOnTimerStop(fn);
        return this;
    }

    setOnClockTick(fn) {
        this.timer.setOnTimerTick(fn);
        return this;
    }

    updateText() {
        // this.ele.innerHTML = `<span>${Math.floor(this.timer.countdown / 1000)}</span>`;
        this.particleBoard.draw(Math.floor(this.timer.countdown / 1000));
    }

    countDown(timeStr) {
        this.timer.setTime(timeStr);
        this.timer.start();
        return this;
    }
}

export default Clock;