import MainPlayer from './components/MainPlayer';
import PrevPlayer from './components/PrevPlayer';
import NextPlayer from './components/NextPlayer';
import CardPool from './components/CardPool';
import ExtraPool from './components/ExtraPool';
import Clock from './components/Clock';
import ButtonBar from './components/ButtonBar';
import Connector from './components/Connector';
import CoreExecutor from './components/CoreExecutor';

class App {
    constructor() {
        this.ele = document.createElement('div');
        this.mainPlayer = new MainPlayer();
        this.prevPlayer = new PrevPlayer();
        this.nextPlayer = new NextPlayer();
        this.cardPool = new CardPool();
        this.extraPool = new ExtraPool();
        this.clock = new Clock();
        this.buttonBar = new ButtonBar();
        this.connector = new Connector();
        this.coreExecutor = new CoreExecutor();

        this.init();
    }

    init() {
        this.ele.id = 'x_doudizhu';

        // this.mainPlayer.init();
        // this.prevPlayer.init();
        // this.nextPlayer.init();
        // this.cardPool.init();
        // this.extraPool.init();
        // this.clock.init();
        // this.buttonBar.init();
        // this.connector.init();
        // this.coreExecutor.init();

        this.render();
    }

    render() {
        const body = document.getElementsByTagName('body');

        // this.ele.append(this.mainPlayer.ele);
        // this.ele.append(this.prevPlayer.ele);
        // this.ele.append(this.nextPlayer.ele);
        // this.ele.append(this.cardPool.ele);
        // this.ele.append(this.extraPool.ele);
        // this.ele.append(this.clock.ele);
        // this.ele.append(this.buttonBar.ele);
        body.append(this.ele);
    }
}

const app = new App();