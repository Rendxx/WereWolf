/* TODO:
    This is the primary part of this game.
    - It setups the game with initial options and create setup data.
    - It receives and run user's operation.
    - It keeps sending game data to renderer, server and clients.
    - It monitors game process and decides the next status of the game.
*/
﻿

var ACTION = require('GLOBAL/js/ActionCode.js');
var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var MSGCODE = require('GLOBAL/js/MessageCode.js');
var PHASECODE = require('GLOBAL/js/PhaseCode.js');
var INITCODE = require('GLOBAL/js/InitCode.js');
var Charactor = require('./Charactor.js');

var Core = function() {
    "use strick";
    // property -----------------------------------------------
    var that = this,
        start = false,
        _players = null,
        _playersId = null,
        _playerMap = null, // hash table player base info
        _playerIDXtoID = null,
        _playerIDtoIDX = null;

    var _msg;
    var _send;
    var roleList = [];
    // TIME COUNTER
    var cd = null;

    // PLAYER INFO
    var playerNum = 0;
    var playerList = [];

    // GAME PROGRESS INFO
    var GamePhase = {};
    var GamePhaseOrder = [];
    var phaseIdx = -1;
    var dayNum = 0;
    var battlelog = [];

    // PER NIGHT INFO
    var werewolfVote = {};
    var AliveWerewolf = [];
    var AliveGods = [];
    var AliveMortal = [];
    var AliveChara = [];

    // SPECIAL ID INFO
    var MarkOfTheWolf = -1;
    var seerID;
    var witchID;
    var hunterID;

    // HERO SKILL INFO
    var reserruction = true;
    var destruction = true;
    var hunterRavage = true;

    // LOCK PHASECODE
    var lockSetup = false;
    var lockWolf = false;
    var lockSeer = false;
    var lockWitch = false;

    // CACHE FOR UPDATE MESSAGE
    var cache_aliveList = '';

    // message -----------------------------------------------
    this.send = null; /* TODO: this.send(code, content): This function should be set by Host-Manager, it is used to send message out */
    this.handler = {
        skip:function (){
            phaseIncreament();
        },
        setAlive:function (playerIdx, isAlive){
            playerList[playerIdx].alive = isAlive;
            if (GamePhaseOrder[phaseIdx]===PHASECODE.DAY) {GetAliveStatus();generalUpdate();}
        }
    }; /* TODO: this is a package of hander for Render.Main */

    this.receive = function(msg) {
        /* TODO:
            receive unordinary message.
            you can use this port to handle customized message format
        */
    };

    this.action = function(clientId, dat) {
        /* TODO:
            will be fired when a client takes a move.
            analysis the action data and handle this change.
        */
        console.log(clientId, dat);
        if (dat == null) return;
        var msgCode = dat[0];
        if (!_msg.hasOwnProperty(msgCode)) return;
        _msg[msgCode](clientId, dat);
    };

    // callback ------------------------------------------
    this.onUpdated = null; // (gameData): becalled when game updates
    this.onSetuped = null; // (setupData): be called when game setups
    this.clientSetup = null; // (target, clientData) setup client, be called when game setups
    this.clientUpdate = null; // (target, clientData) update client side, be called when anything related to that client updates

    // update ---------------------------------------------
    this.reset = function(setupData, gameData) {
        /* TODO:
            reset game with given data.
            the game will be recovered if gameData provided
        */

        if (setupData != null) {
            var basicDat = setupData[0];

            _players = [];
            _playersId = [];
            _playerMap = [];

            for (var i = 0; i < basicDat.length; i++) {
                var id = basicDat[i][0];
                var name = basicDat[i][1];
                var idx = basicDat[i][2];
                var playerObj = {
                    id: id,
                    name: name,
                    idx: idx
                }
                _players[idx] = playerObj;
                _playersId[idx] = (id);
                _playerMap[playerObj.id] = playerObj;
                _playerIDtoIDX[playerObj.id] = playerObj.idx;
                _playerIDXtoID[playerObj.idx] = playerObj.id;
            }
        }
        if (gameData != null) {
            this.onUpdated({
                pos: ''
            });
        }
    };

    this.setup = function(playerData, para) {
        /* TODO:
            setup the game with player data and initial options.
            then send the setup data out
        */
        roleList = para.roleList;

        _players = [];
        _playersId = [];
        _playerMap = {};
        _playerIDtoIDX = {};
        _playerIDXtoID = {};

        playerNum = playerData.length;

        for (var i = 0, count = playerData.length; i < count; i++) {
            if (playerData[i] == null) continue;

            var playerObj = {
                id: playerData[i].id,
                idx: i,
                name: playerData[i].name
            }
            _players.push(playerObj);
            _playersId.push(playerObj.id);
            _playerIDtoIDX[playerObj.id] = playerObj.idx;
            _playerIDXtoID[playerObj.idx] = playerObj.id;
            // changed
            // _playerMap[playerObj.id] = playerData[i].name;
            _playerMap[playerObj.id] = playerObj;

        }

        console.log("setup", JSON.stringify(_playerMap));

        var basicDat = [];
        for (var i = 0; i < _players.length; i++) {
            basicDat[i] = [_players[i].id, _players[i].name, _players[i].idx];
        }

        this.onSetuped([basicDat, []]);
        for (var i = 0; i < _players.length; i++) {
            this.clientSetup([_players[i].id], [
                INITCODE.SETTING,
                _players[i].idx,
                playerNum,
                roleList,
                [],
                []
            ]);
        }
    };

    // game ------------------------------------------------
    this.start = function() {
        /* TODO: game start */
        start = true;
        phaseIdx=-1;
        GamePhase[PHASECODE.INIT]();
    };

    this.end = function() {
        /* TODO: game end */
        start = false;
    };

    this.renew = function() {
        /* TODO: game renew */
        start = false;
        _players = null;
        _playerMap = null;
    };

    this.pause = function() {
        /* TODO: game parse */
    };

    this.continue = function() {
        /* TODO: game continue */
    };

    // private ---------------------------------------------
    var win = function(clientId) {
        // Host select a player to win
        var p = [];
        for (var i = 0; i < _players.length; i++) {
            p[i] = {
                id: _players[i].id,
                name: _players[i].name,
                win: false
            };
        }
        p[_playerMap[clientId]].win = true;
        that.onUpdated({
            end: p
        });
        for (var i = 0; i < _players.length; i++) {
            that.clientUpdate([_players[i].id], {
                end: p[i].win
            });
        }
        window.test.end();
        /* TODO: use the line below in real env
             $.get('/Host/End')
        */
        start = false;
    };

    var hasEmpty = function(list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] == null) {
                return true;
            }
        }
        return false;
    }

    // game component --------------------------------------
    var getBasicDataArr = function() {
        var arr = [];
        for (var i = 0; i < _players.length; i++) {
            arr[i] = [_players[i].id,_players[i].name,_players[i].idx];
        }
        return arr;
    };

    var getAliveStr = function() {
        var str = '';
        for (var i = 0; i < playerList.length; i++) {
            str += (playerList[i].alive ? '1' : '0');
        }
        return str;
    };

    var getStatusArr = function() {
        var arr = [];
        for (var i = 0; i < playerList.length; i++) {
            arr[i] = playerList[i].status;
        }
        return arr;
    };

    var getPlayerInfoArr = function() {
        var allPlayerList = [];
        for (var i = 0; i < playerList.length; i++) {
            allPlayerList[i] = [playerList[i].number, playerList[i].name, playerList[i].role];
        }
        return allPlayerList;
    };

    var checkRoleSetuped = function() {
        for (var i = 0; i < playerNum; i++) {
            if (playerList[i] == null) return false;
        }
        return true;
    };

    var setupRole = function(clientId, dat) {
        if (lockSetup) {
            return;
        }
        if (clientId == null || dat == null) return;
        if (!_playerMap.hasOwnProperty(clientId)) return;

        var number = dat[1];
        var name = dat[2];
        var role = dat[3];

        // console.log("player " + clientId + ", " + _playerMap[clientId] + " set to role " + dat);
        // get user instructions
        var idx = _playerMap[clientId].idx;
        var clientName = _playerMap[clientId].name;
        var p = new Charactor(idx, number, role, name, clientName);
        if (role == ROLECODE.WITCH) {
            witchID = idx;
            p.status = [1, 1];
        } else if (role == ROLECODE.SEER) {
            seerID = idx;
            p.status = [-1, -1];
        } else if (role == ROLECODE.HUNTER) {
            hunterID = idx;
            p.status = [1];
        } else if (role == ROLECODE.IDIOT) {
            p.status = [1];
        }

        playerList[idx] = p;
        console.log(playerList);

        if (checkRoleSetuped()) {
            // tell all player game setuped
            lockSetup = true;

            that.onSetuped([getBasicDataArr(), getPlayerInfoArr()]);
            for (var i = 0; i < playerList.length; i++) {
                that.clientSetup([_players[i].id], [
                    INITCODE.ALLDONE,
                    _players[i].idx,
                    playerNum,
                    roleList,
                    [number, name, role],
                    getPlayerInfoArr()
                ]);
            }
            phaseIncreament();
        } else {
            // tell that player "you are setuped"
            that.clientSetup([clientId], [
                INITCODE.DONE,
                idx,
                playerNum,
                roleList, [number, name, role],
                []
            ]);
        }
    };

    var GetAliveStatus = function() {
        console.log("fucntion: GetAliveStatus")
            // clear alive list
        AliveWerewolf = [];
        AliveGods = [];
        AliveMortal = [];
        werewolfVote = {};

        for (var key = 0; key < playerList.length; key++) {
            if (playerList[key].role == ROLECODE.WEREWOLF && playerList[key].alive) {
                AliveWerewolf.push(key);
            } else if (playerList[key].role == ROLECODE.WITCH && playerList[key].alive) {
                AliveGods.push(key);
            } else if (playerList[key].role == ROLECODE.HUNTER && playerList[key].alive) {
                AliveGods.push(key);
            } else if (playerList[key].role == ROLECODE.SEER && playerList[key].alive) {
                AliveGods.push(key);
            } else if (playerList[key].role == ROLECODE.VILLAGER && playerList[key].alive) {
                AliveMortal.push(key);
            }
        }

        AliveChara = AliveWerewolf.concat(AliveGods).concat(AliveMortal);
        cache_aliveList = getAliveStr();

        console.log("AliveWerewolf", AliveWerewolf);
        console.log("AliveGods", AliveGods);
        console.log("AliveMortal", AliveMortal);
        console.log("AliveCharacters", AliveChara);
    }

    var unlockAllPhase = function() {
        lockSeer = false;
        lockWolf = false;
        lockWitch = false;
    };

    var generalUpdate = function() {
        // phase= GamePhaseOrder[phaseId_in];
        // for (var idx = 0; idx < playerList.length; idx++) {
        //     var active = (phase!=PHASECODE.DAY && ROLEDATA[playerList[idx].role].activedPhase.indexOf(phase)>0)?1:0;
        //
        //     _send[MSGCODE.HOST.UPDATE]([_playerIDXtoID[idx]],{
        //        actived: active,
        //        alive: cache_aliveList,
        //        status: playerList[idx].status,
        //        action:[]
        //      });
        // }
        that.onUpdated([
            GamePhaseOrder[phaseIdx] ,
            cache_aliveList,
            getStatusArr()
        ]);

        for (var i=0;i<playerList.length;i++){
            _send[MSGCODE.HOST.UPDATE]([_playerIDXtoID[i]],{
               actived: 0,
               alive: cache_aliveList,
               status: playerList[i].status,
               action:[]
            });
        }
    };

    var CheckIfEnd = function() {
        return false;
    }

    var daytime = function() {
        console.log("function: daytime");

        //phaseIncreament();
    }

    var preNight = function() {
        dayNum++;
        console.log("entering preNight");

        GetAliveStatus();
        unlockAllPhase();

        phaseIncreament();
    }

    var werewolf = function(playerIdx, dat) {
        // tell all alive werewolfs who can be voted

        if (playerIdx == null) {
            console.log("=========================");
            console.log("=       狼人请睁眼       =");
            console.log("=========================");

            _send[MSGCODE.HOST.UPDATE](AliveWerewolf,{
               actived: 1,
               alive: cache_aliveList,
               status: playerList[AliveWerewolf[0]].status,
               action:werewolfVote
            });
            return 0;
        }

        if (!(AliveWerewolf.indexOf(playerIdx) > -1) || dat==null) {
            console.log(playerIdx + " is not in alive werewolf list");
            return 0;
        }

        var victim = dat[1][0];
        if (victim!==-1 ){
            if (!(_playersId.indexOf(_playerIDXtoID[victim]) > -1)) {
                console.log(dat + " is not in playerID list");
                return 0;
            }
            //if (!_playersId.include(dat)) { return 0; }
            if (playerList[victim].alive) {
                werewolfVote[playerIdx] = victim;
            } else {
                console.log("player ", dat, " is already dead");
                return 0;
            }
        }else{
            werewolfVote[playerIdx] = victim;
        }
        _send[MSGCODE.HOST.UPDATE](AliveWerewolf,{
           actived: 1,
           alive: cache_aliveList,
           status: playerList[playerIdx].status,
           action:werewolfVote
        });
        // finish?
        var vote = {};
        var val = -1;
        for (var key in werewolfVote) {
            val = werewolfVote[key];
            vote[val]= (vote[val]||0)+1;
        }
        console.log(vote);
        //console.log(vote[val],AliveWerewolf.length);
        if (vote[val] == AliveWerewolf.length) {
            console.log("== 狼人请闭眼 ==");
            console.log("werewolfs killed player ", val);
            MarkOfTheWolf = val;
            if (val!=-1) playerList[val].alive = false;
            for (var i=0;i<AliveWerewolf.length;i++){
                playerList[AliveWerewolf[i]].status = [val];
            }
            _send[MSGCODE.HOST.RESULT](AliveWerewolf, [val]);
            CheckIfEnd();
            phaseIncreament();
        }
    }

    var seer = function(playerIdx, dat) {
        if (playerIdx == null) {
            console.log("=========================");
            console.log("=      预言家请睁眼      =");
            console.log("=========================");

            if (!(AliveGods.indexOf(seerID) > -1)) {
                console.log("seer is dead");
                console.log("== 预言家请验人 ==");
                console.log("== 预言家请闭眼 ==");
                phaseIncreament();

            } else {
                // tell seer who can be tested
                _send[MSGCODE.HOST.UPDATE](AliveWerewolf,{
                   actived: 1,
                   alive: cache_aliveList,
                   status: playerList[seerID].status,
                   action:[]
                });
            }
            return 0;
        }

        if (playerList[playerIdx].role != ROLECODE.SEER || dat == null) {
            console.log("not a seer");
            return;
        }

        var testIdx = dat[1][0];
        var testRst = 0;
        console.log("seer choose to test " + dat);
        if (playerList[testIdx].role != ROLECODE.WEREWOLF) {
            console.log("player " + testIdx + " is a good guy");
            testRst = 0;
        } else {
            console.log("player " + testIdx + " is a bad guy");
            testRst = 1;
        }
        playerList[playerIdx].status = [testIdx, testRst];
        _send[MSGCODE.HOST.END]([playerIdx],[testIdx, testRst]);
        console.log("== 预言家请闭眼 ==");
        phaseIncreament();
    }

    var witch = function(playerIdx, dat) {
        if (playerIdx == null) {
            console.log("=========================");
            console.log("=       女巫请睁眼       =");
            console.log("=========================");

            if (!(AliveGods.indexOf(witchID) > -1)) {
                console.log("witch is dead");
                console.log("== @#%#……&%%…… 死了你要不要救 ==");
                console.log("== 你有一瓶毒药要不要用 ==");
                phaseIncreament();
            }else{
                _send[MSGCODE.HOST.UPDATE]([witchID],{
                   actived: 1,
                   alive: cache_aliveList,
                   status: playerList[witchID].status,
                   action:[playerList[witchID].status[0]>0?MarkOfTheWolf:-1]
                });
            }
            return;
        }

        if (playerList[playerIdx].role != ROLECODE.WITCH || dat==null) {
            return 0;
        }

        var healIdx=dat[1][0];
        var poisonIdx=dat[1][1];

        if (playerList[playerIdx].status[0]>0 && healIdx!==-1 && MarkOfTheWolf!==-1){
            playerList[MarkOfTheWolf].alive = true;
            playerList[playerIdx].status[0] = 0;
            console.log("use potion saved ", playerList[MarkOfTheWolf]);
        }
        if (playerList[playerIdx].status[1]>0 && poisonIdx!==-1){
            playerList[poisonIdx].alive = false;
            playerList[playerIdx].status[1] = 0;
            console.log("use potion kill ", playerList[poisonIdx]);
        }
        _send[MSGCODE.HOST.END]([playerIdx],[healIdx, poisonIdx]);
        phaseIncreament();
    }

    var phaseIncreament = function() {
        phaseIdx = (phaseIdx+1) %GamePhaseOrder.length;
        console.log("phaseIdx", phaseIdx);
        generalUpdate();
        GamePhase[GamePhaseOrder[phaseIdx]]();
    }

    var gameEnd = function (){
        GamePhase[PHASECODE.END]();
    };

    // setup -----------------------------------------------

    var _setupMsg = function() {
        _msg={};
        _msg[MSGCODE.CLIENT.SET_INIT] = function(clientId, dat) {
            setupRole(clientId, dat);
        };

        _msg[MSGCODE.CLIENT.DECISION] = function(clientId, dat) {
            GamePhase[GamePhaseOrder[phaseIdx]](_playerIDtoIDX[clientId], dat);
        };
    };

    var _setupSend = function() {
        _send={};
        _send[MSGCODE.HOST.UPDATE] = function(target, opts) {
            that.clientUpdate(target, [
                MSGCODE.HOST.UPDATE,
                GamePhaseOrder[phaseIdx],
                opts.actived,
                opts.alive,
                opts.status,
                opts.action
            ]);
        };
        _send[MSGCODE.HOST.RESULT] = function(target, rst) {
            that.clientUpdate(target, [
                MSGCODE.HOST.RESULT,
                rst
            ], true);
        };
        _send[MSGCODE.HOST.END] = function(target, rst) {
            that.clientUpdate(target, [
                MSGCODE.HOST.END,
                rst
            ]);
        };
    };

    var _init = function() {
        //that.handler.win = win;
        cd = new countdown(5000, phaseIncreament);
        GamePhase = {}
        GamePhase[PHASECODE.INIT] = setupRole;
        GamePhase[PHASECODE.DAY] = daytime;
        GamePhase[PHASECODE.PRENIGHT] = preNight;
        GamePhase[PHASECODE.WOLF] = werewolf;
        GamePhase[PHASECODE.SEER] = seer;
        GamePhase[PHASECODE.WITCH] = witch;
        GamePhase[PHASECODE.END] = end;
        GamePhaseOrder=[
          PHASECODE.PRENIGHT,
          PHASECODE.WOLF,
          PHASECODE.SEER,
          PHASECODE.WITCH,
          PHASECODE.DAY
        ];
        _setupMsg();
        _setupSend();

    }();

};

var countdown = function(time, callback) {
    var that = this;
    var ref = null;
    this.time = time;
    this.callback = callback;

    this.start = function() {
        if (ref != null) clearTimeout(ref);
        ref = setTimeout(function() {
            that.callback();
        }, this.time)
    }

    this.stop = function() {
        if (ref) clearTimeout(ref);
    }

};

module.exports = Core;
