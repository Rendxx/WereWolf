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
var ACTIVECODE = require('GLOBAL/js/ActiveCode.js');
var Charactor = require('./Charactor.js');

var Core = function(opts) {
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
    // TIME COUNTER
    var cd = null;

    // PLAYER INFO
    var playerNum = 0;
    var playerList = [];

    // GAME PROGRESS INFO
    var GamePhase = {};
    var GamePhaseOrder = [];
    var battlelog = [];

    // PER NIGHT INFO
    var werewolfVote = {};
    var AliveWerewolf = [];
    var AliveGods = [];
    var AliveMortal = [];
    var AliveChara = [];

    // CACHE FOR UPDATE MESSAGE
    var _timeoutFunc = null;
    var _gameData = {
        // GAME PROGRESS INFO
        roleList: [],
        phaseIdx: -1,
        dayNum:0,
        // LOCK PHASECODE
        lockSetup: false,
        // SPECIAL ID INFO
        WolfMark: -1,
        seerID: -1,
        witchID: -1,
        hunterID: -1,
        // CACHE
        cacheAlive: '',
    };

    // message -----------------------------------------------
    this.send = null; /* TODO: this.send(code, content): This function should be set by Host-Manager, it is used to send message out */
    this.handler = {
        skip:function (){
            phaseIncreament(0);
        },
        setAlive:function (playerIdx, isAlive){
            playerList[playerIdx].alive = isAlive;
            generalUpdate();
        },
        setStatus:function (role, status){
            for (var i = 0;i<playerList.length;i++){
                if (playerList[i].role===role){
                    playerList[i].status = status;
                }
            }
            generalUpdate();
        },
        win:function (isVillager){
            win(isVillager);
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
    var _onEnd = null;

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
            _playerIDtoIDX = {};
            _playerIDXtoID = {};
            playerList=[];
            playerNum = basicDat.length;

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

            var infoList = setupData[1];
            for (var i = 0; i < infoList.length; i++) {
                var number = infoList[i][0];
                var name = infoList[i][1];
                var role = infoList[i][2];
                var idx = i;
                var clientName = basicDat[i].name;
                addCharacter(idx, clientName, number, name, role);
            }
        }
        if (gameData != null) {
          var aliveList = gameData[1];
          var statusList = gameData[2];
          for (var i=0;i<playerList.length;i++){
              playerList[i].alive = (aliveList[i]==='1');
              playerList[i].status = statusList[i];
          }
        }
    };

    this.setup = function(playerData, para) {
        /* TODO:
            setup the game with player data and initial options.
            then send the setup data out
        */
        _gameData.roleList = para.roleList;
        _gameData.phaseIdx = -1;

        _gameData.lockSetup = false;

        _players = [];
        _playersId = [];
        _playerMap = {};
        _playerIDtoIDX = {};
        _playerIDXtoID = {};
        playerList=[];
        _gameData.dayNum=0;

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

        for (var i = 0, count = playerData.length; i < count; i++) {
            setupRole( playerData[i].id, [1, i+1,  playerData[i].name, para.roleArrange[i]]);
        }

        console.log("setup", JSON.stringify(_playerMap));

        var basicDat = [];
        for (var i = 0; i < _players.length; i++) {
            basicDat[i] = [_players[i].id, _players[i].name, _players[i].idx];
        }
    };

    // game ------------------------------------------------
    this.start = function() {
        /* TODO: game start */
        start = true;
        // _gameData.phaseIdx=-1;
        // GamePhase[PHASECODE.INIT]();
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
    var win = function(isVillager) {
        that.onUpdated([
            PHASECODE.END,
            getAliveStr(),
            getStatusArr(),
            isVillager?1:0,
            _gameData
        ]);
        _send[MSGCODE.HOST.END](_playersId, isVillager?1:0);
        _onEnd && _onEnd();
        start = false;
    };

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

    var getPlayerInfoArr = function(hasRole) {
        var allPlayerList = [];
        for (var i = 0; i < playerList.length; i++) {
            allPlayerList[i] = [playerList[i].number, playerList[i].name, playerList[i].role];
            if (!hasRole) allPlayerList[i].length=2;
        }
        return allPlayerList;
    };

    var checkRoleSetuped = function() {
        for (var i = 0; i < playerNum; i++) {
            if (playerList[i] == null) return false;
        }
        return true;
    };

    var addCharacter = function (idx, clientName, number, name, role){
        var p = new Charactor(idx, number, role, name, clientName);
        if (role == ROLECODE.WITCH) {
            _gameData.witchID = idx;
            p.status = [1, 1];
        } else if (role == ROLECODE.SEER) {
            _gameData.seerID = idx;
            p.status = [-1, -1];
        } else if (role == ROLECODE.HUNTER) {
            _gameData.hunterID = idx;
            p.status = [1];
        } else if (role == ROLECODE.IDIOT) {
            p.status = [1];
        }

        playerList[idx] = p;
        console.log(playerList);
    };

    var setupRole = function(clientId, dat) {
        if (_gameData.lockSetup) {
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
        addCharacter(idx, clientName, number, name, role);

        if (checkRoleSetuped()) {
            // tell all player game setuped
            _gameData.lockSetup = true;

            var infoList = getPlayerInfoArr(true);
            that.onSetuped([getBasicDataArr(), infoList]);
            for (var i = 0; i < playerList.length; i++) {
                that.clientSetup([_players[i].id], [
                    _players[i].idx,
                    infoList[i],
                    getPlayerInfoArr(false)
                ]);
            }
            phaseIncreament(0);
            //waitingForStart();
        }
    };

    var waitingForStart = function (){
        GetAliveStatus();
        generalUpdate();
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
        _gameData.cacheAlive = getAliveStr();

        console.log("AliveWerewolf", AliveWerewolf);
        console.log("AliveGods", AliveGods);
        console.log("AliveMortal", AliveMortal);
        console.log("AliveCharacters", AliveChara);
    }

    var generalUpdate = function() {
        // phase= GamePhaseOrder[phaseId_in];
        // for (var idx = 0; idx < playerList.length; idx++) {
        //     var active = (phase!=PHASECODE.DAY && ROLEDATA[playerList[idx].role].activedPhase.indexOf(phase)>0)?1:0;
        //
        //     _send[MSGCODE.HOST.UPDATE]([_playerIDXtoID[idx]],{
        //        actived: active,
        //        alive: _gameData.cacheAlive,
        //        status: playerList[idx].status,
        //        action:[]
        //      });
        // }
        that.onUpdated([
            (_gameData.phaseIdx===-1?PHASECODE.NONE:GamePhaseOrder[_gameData.phaseIdx]),
            getAliveStr(),
            getStatusArr(),
            -1,
            _gameData
        ]);

        for (var i=0;i<playerList.length;i++){
            _send[MSGCODE.HOST.UPDATE]([_playerIDXtoID[i]],{
               actived: ACTIVECODE.NO,
               alive: _gameData.cacheAlive,
               status: playerList[i].status,
               action:[]
            });
        }
    };

    var CheckIfEnd = function() {
        return false;
    }

    var preDay = function() {
        console.log("entering preDay");
        GetAliveStatus();
        phaseIncreament(1000);
    };

    var daytime = function() {
        console.log("function: daytime");

        //phaseIncreament();
    }

    var preNight = function() {
        _gameData.dayNum++;
        console.log("entering preNight");

        GetAliveStatus();
        phaseIncreament(8000);
    }

    var werewolf = function(playerIdx, dat) {
        // tell all alive werewolfs who can be voted

        var wolfIdList = [];
        for (var i = 0;i<AliveWerewolf.length;i++){
          wolfIdList.push(_playerIDXtoID[AliveWerewolf[i]]);
        }

        if (playerIdx == null) {
            console.log("=========================");
            console.log("=       狼人请睁眼       =");
            console.log("=========================");


            _send[MSGCODE.HOST.UPDATE](wolfIdList,{
               actived: ACTIVECODE.YES,
               alive: _gameData.cacheAlive,
               status: playerList[AliveWerewolf[0]].status,
               action:werewolfVote
            });
            return 0;
        }

        if (GamePhaseOrder[_gameData.phaseIdx] !== PHASECODE.WOLF) {
            console.log("Not in correct phase");
            return;
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
        _send[MSGCODE.HOST.UPDATE](wolfIdList,{
           actived: ACTIVECODE.YES,
           alive: _gameData.cacheAlive,
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
            _gameData.WolfMark = val;
            if (val!=-1) playerList[val].alive = false;
            for (var i=0;i<AliveWerewolf.length;i++){
                playerList[AliveWerewolf[i]].status = [val];
            }

            _send[MSGCODE.HOST.UPDATE](wolfIdList,{
               actived: ACTIVECODE.RESULT,
               alive: _gameData.cacheAlive,
               status: playerList[playerIdx].status,
               action:werewolfVote,
               result: [val]
            });
            CheckIfEnd();
            phaseIncreament();
        }
    }

    var seer = function(playerIdx, dat) {
        if (playerIdx == null) {
            console.log("=========================");
            console.log("=      预言家请睁眼      =");
            console.log("=========================");

            if (!(AliveGods.indexOf(_gameData.seerID) > -1)) {
                console.log("seer is dead");
                console.log("== 预言家请验人 ==");
                console.log("== 预言家请闭眼 ==");
                phaseIncreament(~~(Math.random()*10000)+6000);

            } else {
                // tell seer who can be tested
                _send[MSGCODE.HOST.UPDATE]([_playerIDXtoID[_gameData.seerID]],{
                   actived: ACTIVECODE.YES,
                   alive: _gameData.cacheAlive,
                   status: playerList[_gameData.seerID].status,
                   action:[]
                });
            }
            return 0;
        }

        if (GamePhaseOrder[_gameData.phaseIdx] !== PHASECODE.SEER) {
            console.log("Not in correct phase");
            return;
        }

        if (playerList[playerIdx].role != ROLECODE.SEER || dat == null) {
            console.log("not a seer");
            return;
        }

        var testIdx = dat[1][0];
        var testRst = 0;
        console.log("seer choose to test " + dat);
        if (testIdx===-1){
            console.log("Seer did not check");
            testRst = -1;
        } else if (playerList[testIdx].role != ROLECODE.WEREWOLF) {
            console.log("player " + testIdx + " is a good guy");
            testRst = 0;
        } else {
            console.log("player " + testIdx + " is a bad guy");
            testRst = 1;
        }
        playerList[playerIdx].status = [testIdx, testRst];

        _send[MSGCODE.HOST.UPDATE]([_playerIDXtoID[playerIdx]],{
           actived: ACTIVECODE.RESULT,
           alive: _gameData.cacheAlive,
           status: playerList[playerIdx].status,
           action:werewolfVote,
           result: [testIdx, testRst]
        });
        console.log("== 预言家请闭眼 ==");
        phaseIncreament();
    }

    var witch = function(playerIdx, dat) {
        if (playerIdx == null) {
            console.log("=========================");
            console.log("=       女巫请睁眼       =");
            console.log("=========================");

            if (!(AliveGods.indexOf(_gameData.witchID) > -1)) {
                console.log("witch is dead");
                console.log("== @#%#……&%%…… 死了你要不要救 ==");
                console.log("== 你有一瓶毒药要不要用 ==");
                phaseIncreament(~~(Math.random()*10000)+6000);
            }else{
                _send[MSGCODE.HOST.UPDATE]([_playerIDXtoID[_gameData.witchID]],{
                   actived: ACTIVECODE.YES,
                   alive: _gameData.cacheAlive,
                   status: playerList[_gameData.witchID].status,
                   action:[playerList[_gameData.witchID].status[0]>0?_gameData.WolfMark:-1]
                });
            }
            return;
        }

        if (GamePhaseOrder[_gameData.phaseIdx] !== PHASECODE.WITCH) {
            console.log("Not in correct phase");
            return;
        }

        if (playerList[playerIdx].role != ROLECODE.WITCH || dat==null) {
            return 0;
        }

        var healIdx=dat[1][0];
        var poisonIdx=dat[1][1];

        if (playerList[playerIdx].status[0]>0 && healIdx!==-1 && _gameData.WolfMark!==-1){
            playerList[_gameData.WolfMark].alive = true;
            playerList[playerIdx].status[0] = 0;
            console.log("use potion saved ", playerList[_gameData.WolfMark]);
        }
        if (playerList[playerIdx].status[1]>0 && poisonIdx!==-1){
            playerList[poisonIdx].alive = false;
            playerList[playerIdx].status[1] = 0;
            console.log("use potion kill ", playerList[poisonIdx]);
        }

        _send[MSGCODE.HOST.UPDATE]([_playerIDXtoID[playerIdx]],{
           actived: ACTIVECODE.RESULT,
           alive: _gameData.cacheAlive,
           status: playerList[playerIdx].status,
           action:werewolfVote,
           result: [healIdx, poisonIdx]
        });
        phaseIncreament();
    }

    var phaseIncreament = function(timeout) {
        if (timeout==null) timeout=5000;
        if (_timeoutFunc!==null){
            clearTimeout(_timeoutFunc);
        }
        _gameData.phaseIdx = (_gameData.phaseIdx+1) %GamePhaseOrder.length;

        _timeoutFunc = setTimeout(function(){
            console.log("_gameData.phaseIdx", _gameData.phaseIdx);
            generalUpdate();
            GamePhase[GamePhaseOrder[_gameData.phaseIdx]]();
        }, timeout);
    }

    var gameEnd = function (){
        GamePhase[PHASECODE.END]();
    };

    // setup -----------------------------------------------

    var _setupMsg = function() {
        _msg={};
        _msg[MSGCODE.CLIENT.SET_INIT] = function(clientId, dat) {
            //setupRole(clientId, dat);
        };

        _msg[MSGCODE.CLIENT.DECISION] = function(clientId, dat) {
            GamePhase[GamePhaseOrder[_gameData.phaseIdx]](_playerIDtoIDX[clientId], dat);
        };
    };

    var _setupSend = function() {
        _send={};
        _send[MSGCODE.HOST.UPDATE] = function(target, opts) {
            that.clientUpdate(target, [
                MSGCODE.HOST.UPDATE,
                GamePhaseOrder[_gameData.phaseIdx],
                opts.actived,
                opts.alive,
                opts.status,
                opts.action,
                opts.result || []
            ]);
        };
        _send[MSGCODE.HOST.END] = function(target, rst) {
            that.clientUpdate(target, [
                MSGCODE.HOST.END,
                rst
            ]);
        };
    };

    var _init = function(opts) {
        //that.handler.win = win;
        cd = new countdown(5000, phaseIncreament);
        GamePhase = {}
        GamePhase[PHASECODE.INIT] = function(){};
        GamePhase[PHASECODE.DAY] = daytime;
        GamePhase[PHASECODE.PRENIGHT] = preNight;
        GamePhase[PHASECODE.WOLF] = werewolf;
        GamePhase[PHASECODE.SEER] = seer;
        GamePhase[PHASECODE.WITCH] = witch;
        GamePhase[PHASECODE.PREDAY] = preDay;
        GamePhase[PHASECODE.END] = end;
        GamePhaseOrder=[
          PHASECODE.PREDAY,
          PHASECODE.DAY,
          PHASECODE.PRENIGHT,
          PHASECODE.WOLF,
          PHASECODE.SEER,
          PHASECODE.WITCH
        ];
        _setupMsg();
        _setupSend();
        _onEnd = opts && opts.onEnd;
    }(opts);

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
