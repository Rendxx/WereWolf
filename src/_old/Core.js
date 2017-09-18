/* TODO:
    This is the primary part of this game.
    - It setups the game with initial options and create setup data.
    - It receives and run user's operation.
    - It keeps sending game data to renderer, server and clients.
    - It monitors game process and decides the next status of the game.
*/

var ACTION = require('GLOBAL/content/ActionCode.js');
var ROLECODE = require('GLOBAL/content/RoleCode.js');
var ROLEDATA = require('GLOBAL/content/RoleData.js');
var MSGCODE = require('GLOBAL/content/MessageCode.js');
var PHASECODE = require('GLOBAL/content/PhaseCode.js');
var ACTIVECODE = require('GLOBAL/content/ActiveCode.js');
var Role = require('ROLE/Role.Host.js');
var Player = require('./Player.js')

var Core = function(opts) {
    "use strick";
    // property -----------------------------------------------
    var that = this,
        start = false,
        _players = null;

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
        phaseIdx: -1,
        dayNum:0,
        // SPECIAL ID INFO
        WolfMark: -1,
        seerID: -1,
        witchID: -1,
        hunterID: -1,
        passed: 0
    };

    var cacheAlive = '';

    // message -----------------------------------------------
    this.send = null; /* TODO: this.send(code, content): This function should be set by Host-Manager, it is used to send message out */
    this.handler = {
        skip:function (){
            phaseIncreament(0);
        },
        setAlive:function (playerIdx, isAlive){
            playerList[playerIdx].alive = isAlive;
            if (GamePhaseOrder[_gameData.phaseIdx] === PHASECODE.DAY
              || GamePhaseOrder[_gameData.phaseIdx] === PHASECODE.PREDAY
              || GamePhaseOrder[_gameData.phaseIdx] === PHASECODE.PRENIGHT)
                GetAliveStatus(true);
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
            _playerIDXtoID = {};
            playerList=[];
            playerNum = basicDat.length;

            var infoList = setupData[1];
            for (var i = 0; i < basicDat.length; i++) {
                var id = basicDat[i][0];
                var name = basicDat[i][1];
                var idx = basicDat[i][2];
                var number = infoList[i][1];
                var playerObj = new Player(id, number, name, idx);
                _players[idx] = playerObj;
                _playersId[idx] = (id);
                _playerMap[playerObj.id] = playerObj;
                _playerIDXtoID[playerObj.idx] = playerObj.id;
            }

            var numberList = [];
            for (var i = 0; i < infoList.length; i++) {
                var role = infoList[i][2];
                addCharacter(_players[i], role);
            }
        }
        if (gameData != null) {
            var aliveList = gameData[1];
            var statusList = gameData[3];
            cacheAlive = gameData[2];
            _gameData = gameData[5];
            for (var i=0;i<playerList.length;i++){
                playerList[i].alive = (aliveList[i]==='1');
                playerList[i].status = statusList[i];
            }
            GetAliveStatus(false);
            if (_gameData.passed===1)phaseIncreament(0);
        }
    };

    this.setup = function(playerData, para) {
        /* TODO:
            setup the game with player data and initial options.
            then send the setup data out
        */
        console.log("playerdata");
        console.log(playerData);

        console.log("para");
        console.log(para);

        _players = [];

        // random give player roles
        var roleDistribute = shuffleRole(para.roleList);

        for (var i = 0, count = playerData.length; i < count; i++) {
            if (playerData[i] == null) continue;
            const id = playerData[i].id;
            const number = _gameData.clientNumber[id];
            const name = playerData[i].name;
            const idx = i;

            var playerObj = new Player(id, number, name, idx);
            _players.push(playerObj);
        }

        for (var i = 0, count = _players.length; i < count; i++) {
            addCharacter(_players[i], roleDistribute[i]);
        }
        GetAliveStatus(true);

        var infoList = getPlayerInfoArr(true);
        var infoList2 = getPlayerInfoArr(false);
        that.onSetuped([getBasicDataArr(), infoList]);
        for (var i = 0; i < playerList.length; i++) {
            that.clientSetup([_players[i].id], [
                _players[i].idx,
                infoList[i],
                infoList2
            ]);
        }
        phaseIncreament(0);
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
            cacheAlive,
            getStatusArr(),
            isVillager?1:0,
            _gameData
        ]);
        _send[MSGCODE.HOST.END](_playersId, isVillager?1:0);
        _onEnd && _onEnd();
        start = false;
    };

    // game component --------------------------------------
    var shuffleRole = function (roleList){
        var roleDistribute = [];
        var copy = roleList.slice();

        for (var i=roleList.length;i>0;i--){
            var k = ~~(Math.random()*i);
            roleDistribute.push(copy[k]);
            copy[k] = copy[i-1];
        }
        return roleDistribute;
    };

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

    var addCharacter = function (player, roleCode){
        var p = new (Role(roleCode))();
        p.setup(player);
        playerList[player.playerIdx] = p;
        console.log(playerList);
    };

    var GetAliveStatus = function(refreshAlive) {
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
        if (refreshAlive)cacheAlive = getAliveStr();

        console.log("AliveWerewolf", AliveWerewolf);
        console.log("AliveGods", AliveGods);
        console.log("AliveMortal", AliveMortal);
        console.log("AliveCharacters", AliveChara);
    }

    var generalUpdate = function() {
        that.onUpdated([
            (_gameData.phaseIdx===-1?PHASECODE.NONE:GamePhaseOrder[_gameData.phaseIdx]),
            getAliveStr(),
            cacheAlive,
            getStatusArr(),
            -1,
            _gameData
        ]);

        for (var i=0;i<playerList.length;i++){
            _send[MSGCODE.HOST.UPDATE]([_playerIDXtoID[i]],{
               actived: ACTIVECODE.NO,
               alive: cacheAlive,
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
        GetAliveStatus(true);
    };

    var daytime = function() {
        console.log("function: daytime");

        //phaseIncreament();
    }

    var preNight = function() {
        _gameData.dayNum++;
        console.log("entering preNight");

        GetAliveStatus(true);
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

            _gameData.WolfMark = -1;
            _send[MSGCODE.HOST.UPDATE](wolfIdList,{
               actived: ACTIVECODE.YES,
               alive: cacheAlive,
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
           alive: cacheAlive,
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
               alive: cacheAlive,
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
                   alive: cacheAlive,
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
           alive: cacheAlive,
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
                   alive: cacheAlive,
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
           alive: cacheAlive,
           status: playerList[playerIdx].status,
           action:werewolfVote,
           result: [healIdx, poisonIdx]
        });
        phaseIncreament();
    }

    var phaseIncreament = function(timeout) {
        var cb = function(){
            _gameData.passed=0;
            console.log("_gameData.phaseIdx", _gameData.phaseIdx);
            generalUpdate();
            GamePhase[GamePhaseOrder[_gameData.phaseIdx]]();
        };

        if (timeout==null) timeout=5000;
        if (_timeoutFunc!==null){
            clearTimeout(_timeoutFunc);
            _timeoutFunc=null;
            // cb();
            // return;
        }
        _gameData.passed=1;
        that.onUpdated([
            (_gameData.phaseIdx===-1?PHASECODE.NONE:GamePhaseOrder[_gameData.phaseIdx]),
            getAliveStr(),
            cacheAlive,
            getStatusArr(),
            -1,
            _gameData
        ]);
        _gameData.phaseIdx = (_gameData.phaseIdx+1) %GamePhaseOrder.length;
        _timeoutFunc = setTimeout(cb, timeout);
    }

    var gameEnd = function (){
        GamePhase[PHASECODE.END]();
    };

    // setup -----------------------------------------------

    var _setupMsg = function() {
        _msg={};

        _msg[MSGCODE.CLIENT.DECISION] = function(clientId, dat) {
            GamePhase[GamePhaseOrder[_gameData.phaseIdx]](_player[clientId].playerIdx, dat);
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
          PHASECODE.DAY,
          PHASECODE.PRENIGHT,
          PHASECODE.WOLF,
          PHASECODE.SEER,
          PHASECODE.WITCH,
          PHASECODE.PREDAY,
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
