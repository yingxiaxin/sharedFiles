import MainPlayer from './components/MainPlayer/MainPlayer';
import PrevPlayer from './components/PrevPlayer/PrevPlayer';
import NextPlayer from './components/NextPlayer/NextPlayer';
import CardPool from './components/CardPool/CardPool';
import ExtraPool from './components/ExtraPool/ExtraPool';
import Clock from './components/Clock/Clock';
import ButtonBar from './components/ButtonBar/ButtonBar';
import Connector from './components/Connector/Connector';
import CoreExecutor from './components/CoreExecutor/CoreExecutor';
import ChatBoard from './components/ChatBoard/ChatBoard';
import NameInput from './components/NameInput/NameInput';

class App {
    constructor(id) {
        this.parentId = id;
        this.init();
    }

    init() {
        // 初始化app本身
        this.ele = document.createElement('div');
        this.ele.id = 'x_doudizhu';

        this.initMainPlayer();
        this.initPrevPlayer();
        this.initNextPlayer();
        this.initCardPool();
        this.initExtraPool();
        this.initClock();
        this.initButtonBar();
        this.initChatBoard();
        this.initConnector();
        this.initCoreExecutor();

        this.bindExecutorToConnector();
        this.bindExecutorToButtonBar();
        this.bindExecutorToChatBoard();

        this.render();
    }

    initMainPlayer() {
        const mainPlayer = new MainPlayer(this);
        this.mainPlayer = mainPlayer;
    }

    initPrevPlayer() {
        const prevPlayer = new PrevPlayer(this);
        this.prevPlayer = prevPlayer;
    }

    initNextPlayer() {
        const nextPlayer = new NextPlayer(this);
        this.nextPlayer = nextPlayer;
    }

    initCardPool() {
        const cardPool = new CardPool(this);
        this.cardPool = cardPool;
    }

    initExtraPool() {
        const extraPool = new ExtraPool(this);
        this.extraPool = extraPool;
    }

    initClock() {
        const clock = new Clock(this);
        this.clock = clock;
        setTimeout(() => {
            this.clock.countDown('30s');
        }, 500);
    }

    initButtonBar() {
        const buttonBar = new ButtonBar(this);
        this.buttonBar = buttonBar;
    }

    initChatBoard() {
        const chatBoard = new ChatBoard(this);
        this.chatBoard = chatBoard;
    }

    initConnector() {
        const connector = new Connector();
        this.connector = connector;
    }

    initCoreExecutor() {
        const coreExecutor = new CoreExecutor(
            this,
            this.mainPlayer,
            this.prevPlayer,
            this.nextPlayer,
            this.cardPool,
            this.extraPool,
            this.clock,
            this.buttonBar,
            this.connector,
            this.chatBoard
        );
        this.coreExecutor = coreExecutor;
    }

    bindExecutorToConnector() {
        this.connector.registerExecutor(this.coreExecutor);
    }

    bindExecutorToButtonBar() {
        this.buttonBar.registerExecutor(this.coreExecutor);
    }

    bindExecutorToChatBoard() {
        this.chatBoard.registerExecutor(this.coreExecutor);
    }

    render() {
        const container = document.getElementById(this.parentId);

        this.ele.append(this.mainPlayer.ele);
        this.ele.append(this.prevPlayer.ele);
        this.ele.append(this.nextPlayer.ele);
        this.ele.append(this.cardPool.ele);
        this.ele.append(this.extraPool.ele);
        this.ele.append(this.clock.ele);
        this.ele.append(this.buttonBar.ele);
        this.ele.append(this.chatBoard.ele);
        container.append(this.ele);
        window.app = this;

        NameInput.show(this.connector);
    }
}

export default App;