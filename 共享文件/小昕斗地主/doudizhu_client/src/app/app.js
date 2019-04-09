import MainPlayer from './components/MainPlayer/MainPlayer';
import PrevPlayer from './components/PrevPlayer/PrevPlayer';
import NextPlayer from './components/NextPlayer/NextPlayer';
import CardPool from './components/CardPool/CardPool';
import ExtraPool from './components/ExtraPool/ExtraPool';
import Clock from './components/Clock/Clock';
import ButtonBar from './components/ButtonBar/ButtonBar';
import Connector from './components/Connector';
import CoreExecutor from './components/CoreExecutor';
import Card from './components/Card/Card';

import io from 'socket.io-client';

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
        // this.initPrevPlayer();
        this.initNextPlayer();
        this.initCardPool();
        this.initExtraPool();
        this.initClock();
        this.initButtonBar();
        // this.initConnector();
        // this.initCoreExecutor();
        // this.bindExecutorToConnector();

        this.render();
    }

    initMainPlayer() {
        const mainPlayer = new MainPlayer(this);
        mainPlayer.render();
        this.mainPlayer = mainPlayer;
    }

    initPrevPlayer() {
        const prevPlayer = new PrevPlayer(this);
        prevPlayer.render();
        this.prevPlayer = prevPlayer;
    }

    initNextPlayer() {
        const nextPlayer = new NextPlayer(this);
        nextPlayer.render();
        this.nextPlayer = nextPlayer;
    }

    initCardPool() {
        const cardPool = new CardPool(this);
        cardPool.render();
        this.cardPool = cardPool;
    }

    initExtraPool() {
        const extraPool = new ExtraPool(this);
        extraPool.render();
        this.extraPool = extraPool;
    }

    initClock() {
        const clock = new Clock(this);
        this.clock = clock;
        setTimeout(() => {
            this.clock.countDown('20s');
        }, 500);
    }

    initButtonBar() {
        const buttonBar = new ButtonBar(this);
        buttonBar.render();
        this.buttonBar = buttonBar;
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
            this.connector
        );
        this.coreExecutor = coreExecutor;
    }

    bindExecutorToConnector() {
        this.connector.setExecutor(this.coreExecutor);
    }

    render() {
        const container = document.getElementById(this.parentId);

        // this.ele.append(this.mainPlayer.ele);
        // this.ele.append(this.prevPlayer.ele);
        // this.ele.append(this.nextPlayer.ele);
        // this.ele.append(this.cardPool.ele);
        // this.ele.append(this.extraPool.ele);
        // this.ele.append(this.clock.ele);
        // this.ele.append(this.buttonBar.ele);
        container.append(this.ele);

        // this.buttonBar.toReadyState();
        // let data = [{iconPos: '-1729px -100px', type: '0', val: 17},
        // {iconPos: '-1860px -100px', type: '0', val: 16},
        // {iconPos: '-35px -100px', type: '1', val: 14},
        // {iconPos: '-166px -100px', type: '1', val: 15},
        // {iconPos: '-297px -100px', type: '1', val: 3},
        // {iconPos: '-556px -100px', type: '1', val: 4}];

        let data = [{ iconPos: '-1729px -100px', type: '0', val: 17 },
        { iconPos: '-1860px -100px', type: '0', val: 16 },
        { iconPos: '-35px -100px', type: '1', val: 14 }];

        // this.mainPlayer.receiveCards(data);
        // this.mainPlayer.turnOverCards();

        // this.extraPool.receiveCards(data);
        // this.extraPool.turnOverCards();
        window.app = this;

        const socket = io('http://localhost:3000');
        socket.on('SEND_ONE_CONNECTED', onConnect);
        socket.on('SEND_ALL_CONNECTED', onNotifyConnect);
        socket.on('SEND_ONE_SHUFFLE_CARDS', onShuffleCards);
        socket.on('SEND_ALL_EXTRACARDS', onExtraCards);
        socket.on('SEND_ONE_COMPETE', onCompete);

        function onConnect(data) {
            console.log('connect ' + socket.id + '   msg: ' + JSON.parse(data).message);
        }

        function onNotifyConnect(data) {
            let info = JSON.parse(data);
            console.log('msg: ' + info.message + ' player: ' + info.data.id);
        }

        function onShuffleCards(data) {
            let info = JSON.parse(data);
            console.log('shuffle cards: ' + info.data.cards);
        }

        function onExtraCards(data) {
            let info = JSON.parse(data);
            console.log('extra cards: ' + info.data.cards);
        }

        function onCompete(data) {
            let info = JSON.parse(data);
            console.log('on compete: ' + info.message);
        }
    }
}

export default App;