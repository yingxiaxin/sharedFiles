let G = global.G = {};

G.players = [];

//socketio的事件
G.SOCKETIO_PLAYERREADY = 'playerReady';
G.SOCKETIO_JOINROOM = 'room_1';
G.SOCKETIO_ROBLORD = 'robLord'; //客户端发送
G.SOCKETIO_DRAWCARD = 'drawCard';   //客户端发送



G.SOCKETIO_NEWS_PRIVATE = 'news_private'; //服务端、客户端都可发送
G.SOCKETIO_NEWS_BROADCAST = 'news_broadcast'; //服务端、客户端都可发送
G.SOCKETIO_ASSIGNROBLORD_ON = 'assignRobLord_on';   //服务端发送
G.SOCKETIO_ASSIGNROBLORD_OFF = 'assignRobLord_off'; //服务端发送
G.SOCKETIO_ASSIGNLORD = 'assignLord';   //服务端发送
G.SOCKETIO_ASSIGNWINNER = 'assignWinner';   //服务端发送
G.SOCKETIO_ASSIGNLOSER = 'assignLoser'; //服务端发送
G.SOCKETIO_ASSIGNDRAWCARD_ON = 'assignDrawCard_on'; //服务端发送
G.SOCKETIO_ASSIGNDRAWCARD_OFF = 'assignDrawCard_off';   //服务端发送

G.ROBPOINT = ['1分', '2分', '3分'];
G.ROBPOINT_CURRENT = [];
G.POINT = '';   //抢地主最终的分值


module.exports = G;
