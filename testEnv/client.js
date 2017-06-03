// test -----------------------------------------------------------------
(function(){
  var playerNum = 6;
  var playerInfo = [
    [1, '王狗能'],
    [2, '雕胸'],
    [3, '土豪'],
    [4, '包包包'],
    [5, '小红帽'],
    [6, '高俊敏'],
    [7, '皇马球迷'],
    [8, '飙车的老司机'],
    [9, 'Test Player'],
    [10, '不说话的草莓味'],
  ];
  var playerAlive =  '1101111101';
  var wolvies = [0,5,6,9];
  var playerVote = [5,-2,-2,-2,-2,5,-2,-2,-2,3];
  var roleList = [1,2,3,4,5];

  window.test={
    reset : function (){
      window.msg('1|1|SERVER|4|null');
    },
    start : function (){
      window.msg('1|3|SERVER|12|null');
    },
    init : function (role){
      role=role||2;
      window.msg('2|4|HOST|1|[5,[6,"高俊敏",'+role+'],'+JSON.stringify(playerInfo)+']');
    },
    update2 : function (phase){
      phase=phase||3;
      window.msg('2|5|HOST|2|[0,'+phase+',0,'+playerAlive+',[],[]]');
    },
    update : {
      0: function (){   // not active
        window.msg('2|5|HOST|2|[1,2,0,"'+playerAlive+'",[],[]]');
      },
      1: function (){   // villager
        window.msg('2|5|HOST|2|[1,1,0,"'+playerAlive+'",[],[]]');
      },
      2: function (){   // werewolf
        window.msg('2|5|HOST|2|[1,2,1,"'+playerAlive+'",[],'+JSON.stringify([wolvies,playerVote])+']');
      },
      3: function (k){   // seer
        if (k===1) window.msg('2|5|HOST|2|[1,2,0,"'+playerAlive+'",[2,3],[]]');
        else window.msg('2|5|HOST|2|[1,3,1,"'+playerAlive+'",[2,3],[]]');
      },
      4: function (k){   // witch
        if (k===0) window.msg('2|5|HOST|2|[1,4,0,"'+playerAlive+'",[0,1],[]]');
        else if (k===1) window.msg('2|5|HOST|2|[1,4,1,"'+playerAlive+'",[0,1],[1,1]]');
        else if (k===2) window.msg('2|5|HOST|2|[1,4,1,"'+playerAlive+'",[0,0],[1,1]]');
        else if (k===3) window.msg('2|5|HOST|2|[1,4,1,"'+playerAlive+'",[1,1],[1,5]]');
        else if (k===4) window.msg('2|5|HOST|2|[1,4,1,"'+playerAlive+'",[1,1],[0,5]]');
        else window.msg('2|5|HOST|2|[1,4,1,"'+playerAlive+'",[1,1],[1,2]]');
      },
      5: function (){   // hunter
        window.msg('2|5|HOST|2|[1,5,1,"'+playerAlive+'",[1],[]]');
      },
      6: function (){   // idiot
        window.msg('2|5|HOST|2|[1,6,1,"'+playerAlive+'",[1],[]]');
      },
      7: function (){   // elder
        window.msg('2|5|HOST|2|[1,7,1,"'+playerAlive+'",[],[]]');
      },
    },
    rst : {
        2: function (id){
          id=id||4;
          window.msg('2|5|HOST|2|[1,2,2,"'+playerAlive+'",[],'+JSON.stringify([wolvies,playerVote])+',['+id+']]');
        },
        3: function (isGood){
          var t = isGood===1?0:1;
          window.msg('2|5|HOST|2|[1,3,2,"'+playerAlive+'",[2,3],[],[4,'+t+']]');
        },
        4: function (k){
          k=k||0;
          if (k==1) window.msg('2|5|HOST|2|[1,4,2,"'+playerAlive+'",[0,1],[],[1,-1]]');
          else if (k==2) window.msg('2|5|HOST|2|[1,4,2,"'+playerAlive+'",[0,1],[],[-1,1]]');
          else window.msg('2|5|HOST|2|[1,4,2,"'+playerAlive+'",[0,1],[],[-1,-1]]');
        }
    },
    die : function (gun){
      gun=gun||0;
      window.msg('2|5|HOST|2|[1,2,0,"1111001101",['+gun+'],[]]');
    },
    end : function (isWin){
      window.msg('2|5|HOST|2|[0,'+(isWin?1:0)+']');
      window.msg('1|6|SERVER|13|null');
    },
    renew : function (){
      window.msg('1|7|SERVER|14|null');
    }
  };

  console.group("%c COMMAND FOR PROGRAM", 'background: #eeeeee; color: #666666;');
  console.groupEnd();
  console.log('');

  console.group("%c TEST COMMAND ", 'background: #ddeeff; color: #003399;');
  console.log("%c test.init() ", 'color: #003399;');
  console.log('');

  console.log("%c test.update[1]() ", 'color: #330099;');
  console.log("%c test.update[2]() ", 'color: #330099;');
  console.log("%c test.update[3]() ", 'color: #330099;');
  console.log("%c test.update[4]() ", 'color: #330099;');
  console.log("%c test.update[5]() ", 'color: #330099;');
  console.log("%c test.update[6]() ", 'color: #330099;');
  console.log("%c test.update[7]() ", 'color: #330099;');
  console.log("%c test.update2() ", 'color: #330099;');
  console.log('');
  console.log("%c test.rst[2](4) ", 'color: #330099;');
  console.log("%c test.rst[3](1) ", 'color: #330099;');
  console.log("%c test.rst[4](1) ", 'color: #330099;');
  console.log('');
  console.log("%c test.die(1) ", 'color: #330099;');
  console.log('');

  console.log("%c test.reset() ", 'color: #009933;');
  console.log("%c test.start() ", 'color: #009933;');
  console.log("%c test.end(true) ", 'color: #009933;');
  console.log("%c test.renew() ", 'color: #009933;');
  console.groupEnd();
  console.log('');
})();

// ---------------------------------------------------------------------

Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};

/*
 * Host Main
 */

(function (Game) {
    // ROOM STATUS
    DATA= {
        ROOMSTATUS: {
            'READY': 1,
            'PLAYING': 2,
            'END': 3,
            1: 'READY',
            2: 'PLAYING',
            3: 'END'
        }
    };
    Game.DATA = DATA;
})(Rendxx.Game);
var Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};

// Websocket Handler
(function (Game) {
    var TYPE = {
        SERVER: 1,
        HOST: 2,
        CLIENT: 3,
        OBSERVER: 4
    };
    var MyWebSocket = function (opts_in) {
        'use strict';
        var that = this;
        var ws = null;
        var wsConnStr;

        this.onopen = null;
        this.onmessage = null;
        this.onerror = null;
        this.onclose = null;

        this.start = function () {
            ws = {conn:wsConnStr};
            ws.onopen = function (evt) {
                if (that.onopen != null) that.onopen(evt);
            };
            ws.onmessage = function (evt) {
                if (that.onmessage != null) that.onmessage(evt);
            };
            ws.onerror = function (evt) {
                if (that.onerror != null) that.onerror(evt);
            };
            ws.onclose = function (evt) {
                if (that.onclose != null) that.onclose(evt);
            };
            window.msg = function (msg){
              console.log("%c"+msg, "color:#000066; background: #ddddff");
              ws.onmessage({data:msg});
            };
            ws.onopen();
        };
        this.stop = function () {
          console.log("%c ws: [close] ", "color:#660000; background: #ffdddd");
        };
        this.send = function (msg) {
          console.log("%c ws: "+ msg+" ",  "color:#006600; background: #ddffdd");
        }

        var _init = function (opts) {
            window.onbeforeunload = function () {
            };
            if (opts == null || opts.type == null || opts.id == null) throw new Error('WebSocket Parameter Missing');

            var hostName = opts.host || window.location.hostname;
            wsConnStr = "ws://" + hostName + "/api/Conn/" + opts.type + '?id=' + opts.id;
        }(opts_in);
    };
    Game.WebSocket = MyWebSocket;
    Game.WebSocket.TYPE = TYPE;
})(Rendxx.Game);

Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};

(function (Game) {
    var TYPE = {
        'SERVER': 1,
        'HOST': 2,
        'CLIENT': 3,
        1: 'SERVER',
        2: 'HOST',
        3: 'CLIENT'
    };

    var TARGET = {
        'SERVER': 'SERVER',
        'HOST': 'HOST'
    };

    var CODE = {
        SERVER:{
            'NO_CODE': 0,
            'HOST_RESET_REQUEST' : 1,
            'HOST_RESET' : 2,
            'CLIENT_RESET_REQUEST' : 3,
            'CLIENT_RESET' : 4,
            'OB_RESET_REQUEST' : 5,
            'OB_RESET' : 6,
            'HOST_SETUPED' : 7,
            'HOST_UPDATE_CLIENTLIST' : 8,
            'HOST_UPDATE_OBLIST' : 9,
            'CACHE_GAME_SETUP' : 10,
            'CACHE_GAME' : 11,
            'GAME_START' : 12,
            'GAME_END' : 13,
            'GAME_RENEW': 14,
            'GAME_PAUSE': 15,
            'GAME_CONTINUE': 16,
            'GAME_SETUP': 17,
            'GAME_UPDATE': 18,
            'CACHE_OB': 18
        },
        HOST: {
            'NO_CODE': 0,
            'CLIENT_SETUP': 1,
            'CLIENT_UPDATE': 2,
            'ACTION': 3
        },
        CUSTOMIZED: 'CUSTOMIZED'
    };

    var timeStamp = function () {
        return Date.now() + "";
    };

    var messageDecode = function (msgStr) {
        var msg = {};
        try {
            var tmp = msgStr.split('|');
            msg['type'] = TYPE[Number(tmp[0])];
            msg['timestamp'] = tmp[1];
            msg['source'] = tmp[2];
            msg['code'] = Number(tmp[3]);
            msg['content'] = $.parseJSON(tmp[4]);
            return msg;
        } catch (e) {
            throw new Error("Illegal command");
        }
    };

    var messageEncode = function (msg) {
        if (msg == null || msg.type == null || msg.code == null) return;
        var d1 = Game.Message.DELIMITER.PART,
            d2 = Game.Message.DELIMITER.TARGET;
        return msg['type'] + d1
            + ('timestamp' in msg ? msg['timestamp'] : timeStamp()) + d1
            + (('target' in msg && msg['target'].length > 0) ? msg['target'].join(d2) : '') + d1
            + msg['code'] + d1
            + ('content' in msg ? msg['content'] : '');
    };

    // create JS hack
    if (!Date.now) {
        Date.now = function () { return new Date().getTime(); }
    }

    Game.Message = {
        TYPE: TYPE,
        TARGET: TARGET,
        CODE: CODE,
        DELIMITER: {
            PART: '|',
            TARGET: ','
        },
        Decode: messageDecode,
        Encode: messageEncode
    };
})(Rendxx.Game);
Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};

/*
 * Client Main
 */

(function (Game) {
    var STATUS = Game.DATA.ROOMSTATUS;
    var Main = function (components_in) {
        // Data ------------------------------------------------------
        var that = this,
            Message = Game.Message;

        var component = {
            renderer: null,
            websocket: null
        };

        var controller = {};

        var _status = STATUS.READY,
            _setuped = false,           // true if host is ready to use
            _msgReceive = {};        // message handleing functions on received message

        // Public function --------------------------------------------
        // setup and start working
        this.setup = function () {
            _setupConn();
        };

        // Private function -------------------------------------------
        // reset game data
        var _reset = function (dat) {
            var status = STATUS.READY;
            var setupData = null;
            var clientData = null;
            if (dat != null) {
                status = dat.status;
                setupData = dat.setup;
                clientData = dat.client;
            }

            component.renderer.reset(setupData);
            component.renderer.updateGame(clientData);
            if (status == STATUS.READY) _renew();
            else if (status == STATUS.PLAYING) _start();
            else _end();
        };

        // game ------------------------------------------------
        var _renew = function () {
            _status = STATUS.READY;
            component.renderer.renew();
        };

        var _start = function () {
            component.websocket.send(Message.Encode({
                type: Message.TYPE.SERVER,
                code: Message.CODE.SERVER.OB_RESET_REQUEST
            }));
            _status = STATUS.PLAYING;
            component.renderer.start();
        };

        var _end = function () {
            _status = STATUS.END;
            component.renderer.end();
        };

        var _pause = function () {
            component.renderer.pause();
        };

        var _continue = function () {
            component.renderer.continue();
        };

        // Setup ------------------------------------------------------
        var _setupComponent = function (components_in) {
            try {
                component.renderer = components_in.renderer;
                component.websocket = new Game.WebSocket({
                    type: Game.WebSocket.TYPE.CLIENT,
                    id: window.parent.CLIENTID,
                    host: null
                });

                component.renderer.message.send = function (code, content) {
                    component.websocket.send(Message.Encode({
                        type: Message.TYPE.HOST,
                        target: [Message.TARGET.HOST],
                        code: code,
                        content: JSON.stringify(content)
                    }));
                };
                component.renderer.message.action = function (content) {
                    component.websocket.send(Message.Encode({
                        type: Message.TYPE.HOST,
                        target: [Message.TARGET.HOST],
                        code: Message.CODE.HOST.ACTION,
                        content: JSON.stringify(content)
                    }));
                };
            } catch (e) {
                throw new Error('Unexpected Error in setuping components: '+e.message);
            }
        };

        var _setupMessageHandler = function () {
            _msgReceive = {
                SERVER: {},
                HOST: {},
                CLIENT: {}
            };

            // SERVER
            _msgReceive.SERVER[Message.CODE.SERVER.CLIENT_RESET] = function (dat) { _reset(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_START] = function (dat) { _start(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_UPDATE] = function (dat) { component.renderer.updateGame(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_END] = function (dat) { _end(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_RENEW] = function (dat) { _renew(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_PAUSE] = function (dat) { _pause(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_CONTINUE] = function (dat) { _continue(dat); };
            // HOST
            _msgReceive.HOST[Message.CODE.HOST.CLIENT_SETUP] = function (dat) { component.renderer.reset(dat); };
            _msgReceive.HOST[Message.CODE.HOST.CLIENT_UPDATE] = function (dat) { component.renderer.updateGame(dat); };
            _msgReceive.HOST[Message.CODE.CUSTOMIZED] = function (msg) { component.renderer.receive(msg); };
        };

        var _setupConn = function () {
            component.websocket.onopen = function () {
                console.log('[ OPEN ]');
                component.websocket.send(Message.Encode({
                    type: Message.TYPE.SERVER,
                    code: Message.CODE.SERVER.NO_CODE,
                    content: null
                }));
            };
            component.websocket.onmessage = function (evt) {
                //console.log(evt.data);
                var msg = Message.Decode(evt.data);
                if (_msgReceive[msg.type].hasOwnProperty(msg.code)) _msgReceive[msg.type][msg.code](msg.content);
                else if (msg.type == Message.TYPE.HOST) _msgReceive[msg.type][Message.CODE.CUSTOMIZED](msg);
            };
            component.websocket.onerror = function () {
                console.log('[ ERROR ]');
            };
            component.websocket.onclose = function () {
                console.log('[ CLOSE ]');
            };
            component.websocket.start();
        };

        var _init = function (components_in) {
            _setupComponent(components_in);
            _setupMessageHandler();
        }(components_in);
    };
    Game.Client = Game.Client || {};
    Game.Client.Main = Main;
})(Rendxx.Game);
Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};

/*
 * Client Renderer
 */

(function (Game) {
    var Renderer = function (components_in) {
        // Data ------------------------------------------------------
        var that = this,
            current = null,             // component currently use
            _cache_game = null,         // cache for latest game data
            playing = false;

        var component = {
            prepare: null,
            main: null,
            end: null
        };

        // Callback -----------------------------------------------------------
        this.message = {};

        // public function ----------------------------------------------------
        this.reset = function (setupData) {
            if (setupData) component.main.reset(setupData);
        };

        // Status Change ------------------------------------------------------
        this.renew = function () {
            playing = false;
            _cache_game = null;
            current = component.prepare;
            current.updateGame(_cache_game);

            component.prepare.show();
            component.main.hide();
            component.end.hide();
        };

        this.start = function () {
            playing= true;
            current = component.main;
            current.updateGame(_cache_game);

            component.prepare.hide();
            component.main.show();
            component.end.hide();
        };

        this.end = function () {
            playing= false;
            current = component.end;
            current.updateGame(_cache_game);

            component.prepare.hide();
            component.main.hide();
            component.end.show();
        };

        this.pause = function () {
            if (!playing) return;
            current.pause();
        };

        this.continue = function () {
            if (!playing) return;
            current.continue();
        };

        // Update -----------------------------------------------------
        this.updateGame = function (data) {
            _cache_game = data;
            current.updateGame(data);
        };

        // Setup ------------------------------------------------------
        var _setupComponent = function (components_in) {
            try {
                component.prepare = components_in.prepare;
                component.main = components_in.main;
                component.end = components_in.end;
                current = component.prepare;

                component.main.message = that.message;

            } catch (e) {
                throw new Error('Unexpected Error in setuping components: '+e.message);
            }
        };

        var _init = function (components_in) {
            _setupComponent(components_in);
        }(components_in);
    };
    Game.Client = Game.Client || {};
    Game.Client.Renderer = Renderer;
})(Rendxx.Game);
//# sourceMappingURL=client.js.map
