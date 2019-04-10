import Timer from './Timer';

export const getTimerInstance = (function() {
    let instance;
    return function() {
        if (!instance) {
            instance = new Timer();
        }
        return instance;
    }
})();