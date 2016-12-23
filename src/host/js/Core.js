/* TODO:
    This is the primary part of this game.
    - It setups the game with initial options and create setup data.
    - It receives and run user's operation.
    - It keeps sending game data to renderer, server and clients.
    - It monitors game process and decides the next status of the game.
*/﻿

var ACTION = require('GLOBAL/js/ActionCode.js');
var ROLECODE = require('GLOBAL/js/RoleCode.js');
var MSGCODE = require('GLOBAL/js/MessageCode.js');
var STEPCODE = require('GLOBAL/js/StepCode.js');

var charactor = function (id, number, role, name) {
    this.id = id;
    this.number = number;
    this.role = role;
    this.name = name;
    this.alive = true;
}

var Core = function () {
    "use strick";
    // property -----------------------------------------------
    var that = this,
        start = false,
        _color = null,
        _players = null,
        _playersId = null,
        _playerMap = null,  // hash table player base info
        _playerPos = [],
        _playerIDXtoID = null,
        _playerIDtoIDX = null;

    // TIME COUNTER
    var cd = null;

    // PLAYER INFO
    var playerNum = 0;
    var playerList = {};
    var clientPlayerList = [];

    // GAME PROGRESS INFO
    var GamePhase = [];
    var phaseIdx = 0;
    var dayNum = 0;
    var battlelog = [];

    // PER NIGHT INFO
    var werewolfVote = {};
    var AliveWerewolf = [];
    var AliveGods = [];
    var AliveMortal = [];
    var AliveChara = [];

    // SPECIAL ID INFO
    var MarkOfTheWolf = "";
    var seerID;
    var witchID;
    var hunterID;

    // HERO SKILL INFO
    var reserruction = true;
    var destruction = true;
    var hunterRavage = true;
    var seerLastTest = null;
    var seerLastTestResult = null;

    // LOCK PHASE
    var lockSetup = false;
    var lockWolf = false;
    var lockSeer = false;
    var lockWitch = false;

    // message -----------------------------------------------
    this.send = null;         /* TODO: this.send(code, content): This function should be set by Host-Manager, it is used to send message out */
    this.handler = {};        /* TODO: this is a package of hander for Render.Main */

    this.receive = function (msg) {
        /* TODO:
            receive unordinary message.
            you can use this port to handle customized message format
        */
    };

    this.action = function (clientId, dat) {
        /* TODO:
            will be fired when a client takes a move.
            analysis the action data and handle this change.
        */

        // if (!start) return;
        // //otherwise move the player's marker
        // var pos = _playerPos[_playerMap[clientId]];
        // pos[0]= Math.max(0, Math.min(100,pos[0]+dat[0]));
        // pos[1]= Math.max(0, Math.min(100,pos[1]+dat[1]));
        //
        // this.onUpdated({ pos: _playerPos });
        // this.clientUpdate(_playersId, {
        //     current: _playerMap[clientId]
        // });
        // alert("new coming msg from client");
        console.log(clientId, dat);
        GamePhase[phaseIdx](clientId, dat);

    };

    // callback ------------------------------------------
    this.onUpdated = null;      // (gameData): becalled when game updates
    this.onSetuped = null;      // (setupData): be called when game setups
    this.clientSetup = null;    // (target, clientData) setup client, be called when game setups
    this.clientUpdate = null;   // (target, clientData) update client side, be called when anything related to that client updates

    // update ---------------------------------------------
    this.reset = function (setupData, gameData) {
        /* TODO:
            reset game with given data.
            the game will be recovered if gameData provided
        */

        if (setupData != null) {
            _players = setupData.player;
            _playersId = setupData.playerId;
            _playerMap = setupData.playerMap;
            _playerPos = setupData.playerPos;
            _color = setupData.color;
        }
        if (gameData != null) {
            _playerPos = gameData.pos;
            this.onUpdated({ pos: _playerPos });
        }

    };

    this.setup = function (playerData, para) {
        /* TODO:
            setup the game with player data and initial options.
            then send the setup data out
        */

        _players = [];
        _playersId = [];
        _playerMap = {};
        _playerPos = [];
        _playerIDtoIDX = {};
        _playerIDXtoID = {};
        _color = para.color;

        playerNum = playerData.length;
        // clientPlayerList = new Array(playerNum);

        for (var i = 0, count = playerData.length; i < count; i++) {
            if (playerData[i] == null) continue;

            var playerObj={
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

            _playerPos.push([~~(Math.cos(2*Math.PI*i/playerNum)*35+50), ~~(Math.sin(2*Math.PI*i/playerNum)*35+50)]);

        }

        console.log("setup", JSON.stringify(_playerMap));
        this.onSetuped({
            playerMap: _playerMap,
            player: _players,
            playerId: _playersId,
            playerPos: _playerPos,
            color: _color
        });
        for (var i = 0; i < _players.length; i++) {
            this.clientSetup([_players[i].id], {
                id: i,
                current:-1
            });
        }
    };

    // game ------------------------------------------------
    this.start = function () {
        /* TODO: game start */
        start = true;
        GamePhase[phaseIdx]();
    };

    this.end = function () {
        /* TODO: game end */
        start = false;
    };

    this.renew = function () {
        /* TODO: game renew */
        start = false;
        _color = null;
        _players = null;
        _playerMap = null;
        _playerPos = null;
    };
    this.pause = function () {
        /* TODO: game parse */
    };
    this.continue = function () {
        /* TODO: game continue */
    };

    // private ---------------------------------------------
    var win = function (clientId) {
        // Host select a player to win
        var p = [];
        for (var i = 0; i < _players.length; i++) {
            p[i]  = { id: _players[i].id, name: _players[i].name, win: false };
        }
        p[_playerMap[clientId]].win = true;
        that.onUpdated({
          end: p,
          pos: _playerPos
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
        start=false;
    };

    var hasEmpty = function (list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] == null) {
               return true;
            }
        }
        return false;
    }

    // game component --------------------------------------
    var setupRole = function (playerId, dat) {

      if (lockSetup) { return; }

      if (playerId == null || dat == null) {
          for (var i = 0; i < _players.length; i++) {
              that.clientUpdate([_players[i].id], [
                  0,_players[i].idx,playerNum,[ROLECODE.VILLAGER,ROLECODE.WEREWOLF,ROLECODE.SEER,ROLECODE.WITCH,ROLECODE.HUNTER],[],[]
              ]);
          }
          return;
      }

      var number = dat[1];
      var name = dat[2];
      var role = dat[3];

      // console.log("player " + playerId + ", " + _playerMap[playerId] + " set to role " + dat);
      // get user instructions
      if ( role == ROLECODE.WITCH) {
        witchID = _playerMap[playerId].idx;
      }

      else if ( role == ROLECODE.SEER ) {
        seerID = _playerMap[playerId].idx;
      }

      else if ( role == ROLECODE.HUNTER ) {
        hunterID = _playerMap[playerId].idx;
      }


      var p = new charactor(_playerMap[playerId].idx,number,role,name);

      playerList[_playerMap[playerId].idx] = p;
      clientPlayerList.push([number,name]);

      console.log(clientPlayerList);
      console.log(playerList);

      that.onUpdated({ playerInfo: playerList});

      if (Object.keys(playerList).length == playerNum) {
          // go to preNight
          // ...
          lockSetup = true;

          clientPlayerList.sort(function(a,b){
              return a[0] - b[0];
          });

          for (var i = 0; i < _players.length; i++) {
              that.clientUpdate([_players[i].id], [
                  2,
                  _players[i].idx,
                  playerNum,
                  [ROLECODE.VILLAGER,ROLECODE.WEREWOLF,ROLECODE.SEER,ROLECODE.WITCH,ROLECODE.HUNTER],
                  [playerList[_players[i].idx].number,playerList[_players[i].idx].name,playerList[_players[i].idx].role],
                  clientPlayerList
              ]);
          }

          phaseIdx = 2;
          GamePhase[phaseIdx]();
          return;
      }
      else {
        that.clientUpdate([playerId], [
            1,_playerMap[playerId].idx,playerNum,[ROLECODE.VILLAGER,ROLECODE.WEREWOLF,ROLECODE.SEER,ROLECODE.WITCH,ROLECODE.HUNTER],[number,name,role],[]
        ]);
      }

    }

    var GetAliveStatus = function () {
      console.log("fucntion: GetAliveStatus")
      // clear alive list
      AliveWerewolf = [];
      AliveGods = [];
      AliveMortal = [];
      werewolfVote = {};

      for (var key in playerList) {
        if (playerList.hasOwnProperty(key)) {
          if (playerList[key].role == ROLECODE.WEREWOLF && playerList[key].alive) {
              AliveWerewolf.push(key);
          }
          else if (playerList[key].role == ROLECODE.WITCH && playerList[key].alive) {
              AliveGods.push(key);
          }
          else if (playerList[key].role == ROLECODE.HUNTER && playerList[key].alive) {
              AliveGods.push(key);
          }
          else if (playerList[key].role == ROLECODE.SEER && playerList[key].alive) {
              AliveGods.push(key);
          }
          else if (playerList[key].role == ROLECODE.VILLAGER && playerList[key].alive){
              AliveMortal.push(key);
          }
        }
      }

      AliveChara = AliveWerewolf.concat(AliveGods).concat(AliveMortal);

      console.log("AliveWerewolf", AliveWerewolf);
      console.log("AliveGods", AliveGods);
      console.log("AliveMortal", AliveMortal);
      console.log("AliveCharacters", AliveChara);
    }

    var unlockAllPhase = function () {
        lockSeer = false;
        lockWolf = false;
        lockWitch = false;
    }

    var generalUpdate = function (phase) {
        var liveList = "";
        for (var i = 0; i < clientPlayerList.length; i++) {
            if (playerList[i].alive){
                liveList += "1";
            }
            else{
                liveList += "0";
            }
        }

        for (var idx in playerList) {
            var status = [];
            var active = 0;
            var actionData = [];

            // update status
            if(playerList[idx].role == ROLECODE.WEREWOLF || playerList[idx].role == ROLECODE.VILLAGER){
                status = [];
            }
            else if (playerList[idx].role == ROLECODE.SEER) {
                status = [seerLastTest,seerLastTestResult];
            }
            else if (playerList[idx].role == ROLECODE.WITCH) {
                status = [reserruction,destruction];
            }
            else if (playerList[idx].role == ROLECODE.HUNTER) {
               status = [hunterRavage];
            }

            // update active
            if (phase == STEPCODE.WOLF) {
                if (playerList[idx].role == ROLECODE.WEREWOLF) {
                    active = 1;
                }
            }
            else if (phase == STEPCODE.SEER) {
                if (playerList[idx].role == ROLECODE.SEER) {
                    active = 1;
                }
            }
            else if (phase == STEPCODE.WITCH) {
                if (playerList[idx].role == ROLECODE.WITCH) {
                    active = 1;
                }
            }

            that.clientUpdate([_playerIDXtoID[idx]], [
                1,phase,active,liveList,status,actionData
            ]);

        }
    }
    var CheckIfEnd = function() {
        return false;
    }

    var daytime = function () {
        console.log("function: daytime");

        phaseIdx = 2;
        GamePhase[phaseIdx]();
    }

    var preNight = function () {
        dayNum++;
        console.log("entering preNight");

        GetAliveStatus();
        unlockAllPhase();

        phaseIdx = 3;

        GamePhase[phaseIdx]();

    }

    var werewolf = function (playerId, dat) {
        // tell all alive werewolfs who can be voted

        if (playerId == null) {
          generalUpdate(phaseIdx);
          console.log("=========================");
          console.log("=       狼人请睁眼       =");
          console.log("=========================");
          return 0;
        }

        wolfIdx = _playerIDtoIDX[playerId];

        if (!(AliveWerewolf.indexOf(wolfIdx) > -1)) {
          console.log(playerId + " is not in alive werewolf list");
          return 0;
        }

        victim = dat[1][0];

        if (!(_playersId.indexOf(_playerIDXtoID[victim]) > -1)) {
          console.log(dat + " is not in playerID list");
          return 0;
        }
        //if (!_playersId.include(dat)) { return 0; }
        if (playerList[victim].alive){
            werewolfVote[wolfIdx] = victim;
        }
        else {
            console.log("player ",dat," is already dead");
            return 0;
        }

        that.clientUpdate(AliveWerewolf, werewolfVote);

        // finish?
        var vote = {};
        for (var key in werewolfVote) {
          if (werewolfVote.hasOwnProperty(key)) {
            // get voted victim
            var val = werewolfVote[key];
          }
          if(vote.hasOwnProperty(val)){
            vote[val] += 1;
          }
          else {
            vote[val] = 1;
          }
          console.log(vote);
          //console.log(vote[val],AliveWerewolf.length);
          if (vote[val] == AliveWerewolf.length){

            console.log("== 狼人请闭眼 ==");

            console.log("werewolfs killed player ", val);
            MarkOfTheWolf = val;
            playerList[val].alive = false;
            CheckIfEnd();

            phaseIdx = 4;
            GamePhase[phaseIdx]();

          }
        }

    }

    var seer = function (playerId, dat) {

        if (playerId == null) {
            console.log("=========================");
            console.log("=      预言家请睁眼      =");
            console.log("=========================");

            if (!(AliveGods.indexOf(seerID) > -1)) {
              console.log("seer is dead");
              console.log("== 预言家请验人 ==");
              console.log("== 预言家请闭眼 ==");
              phaseIdx = 5;
              GamePhase[phaseIdx]();

            }else{
                // tell seer who can be tested
                that.clientUpdate([seerID],AliveChara);
            }
            return 0;
        }

        if (playerList[playerId].role != "seer") {
          console.log("not a seer");
          return;
        }

        var test = false;
        console.log("seer choose to test " + dat);
        if (playerList[dat].role != "werewolf") {
            console.log("player " + dat + " is a good guy");
            test = false;
        }
        else{
            console.log("player " + dat + " is a bad guy");
            test = true;
        }

        that.clientUpdate([playerId],{player: dat, role: test});
        console.log("== 预言家请闭眼 ==");
        phaseIdx = 5;
        GamePhase[phaseIdx]();
    }

    var witch = function (playerId, dat) {

        if (playerId == null) {
            console.log("=========================");
            console.log("=       女巫请睁眼       =");
            console.log("=========================");

            if (!(AliveGods.indexOf(witchID) > -1)) {
              console.log("witch is dead");
              console.log("== @#%#……&%%…… 死了你要不要救 ==");
              console.log("== 你有一瓶毒药要不要用 ==");
              phaseIdx = 1;
              GamePhase[phaseIdx]();
              return;
            }

            else {
                if (reserruction) {
                    console.log("== "+ MarkOfTheWolf +" 死了你要不要救 ==");
                    // if witch not dead, and still have potion, tell witch who is dead tonight
                    // console.log(MarkOfTheWolf," is killed tonight, do you want to use potion?");
                    that.clientUpdate([witchID],MarkOfTheWolf);
                    // stay in this phase, wait for witch action
                    if (MarkOfTheWolf == witchID){
                        // cannot res herself
                        console.log("cannot revive yourself")
                        phaseIdx = 6;
                        GamePhase[phaseIdx]();
                        return;
                    }

                }
                else {

                    // if no potion of res, random a time and go to potion of destruction
                    console.log("witch doesn't have potion of reserruction");
                    console.log("== @#%#……&%%…… 死了你要不要救 ==");
                    phaseIdx = 6;
                    GamePhase[phaseIdx]();
                    return;
                }
            }
            return;
        }

        if (playerList[playerId].role != "witch") { return 0; }

        if (dat == "Y" && MarkOfTheWolf != witchID){
            // if use potion, set player to alive, cannot save herself
            playerList[MarkOfTheWolf].alive = true;
            reserruction = false;

            console.log("use potion saved ", playerList[MarkOfTheWolf]);
            // random a potion of destruction time, go to daytime
            console.log("== 你有一瓶毒药要不要用 ==");
            phaseIdx = 1;
            GamePhase[phaseIdx]();
            return;

        }
        else if (dat == "N"){
            // go to potion of destruction
            phaseIdx = 6;
            GamePhase[phaseIdx]();
            return;
        }
    }

    var phaseIncreament = function() {
        if (phaseIdx == 3) {
            phaseIdx = 4;
        }
        else if (phaseIdx == 4) {
            phaseIdx = 5;
        }
        else if (phaseIdx == 5) {
            phaseIdx = 6;
        }
        else if (phaseIdx == 6) {
            phaseIdx = 1;
        }
        console.log("phaseIdx",phaseIdx);
        GamePhase[phaseIdx]();
    }

    // setup -----------------------------------------------
    var _init = function () {
        //that.handler.win = win;
        cd = new countdown(5000,phaseIncreament);
        GamePhase = [setupRole, daytime, preNight, werewolf, seer, witch, end];
    }();

};

var countdown = function (time, callback) {
    var that = this;
    var ref = null;
    this.time = time;
    this.callback = callback;

    this.start = function(){
        if(ref!=null) clearTimeout(ref);
            ref = setTimeout(function(){
            that.callback();
        },this.time)
    }

    this.stop = function(){
      if(ref) clearTimeout(ref);
    }

};

module.exports = Core;
