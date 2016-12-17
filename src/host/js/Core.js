/* TODO:
    This is the primary part of this game.
    - It setups the game with initial options and create setup data.
    - It receives and run user's operation.
    - It keeps sending game data to renderer, server and clients.
    - It monitors game process and decides the next status of the game.
*/﻿

var charactor = function (id, role, name) {
    this.id = id;
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
        _playerPos = [];

    var playerNum = 0;

    var GamePhase = [];
    var playerList = {};
    var phaseIdx = 0;
    var dayNum = 0;
    battlelog = [];

    var werewolfVote = {};

    var AliveWerewolf = [];
    var AliveGods = [];
    var AliveMortal = [];
    var AliveChara = [];

    var MarkOfTheWolf = "";
    var seerID;
    var witchID;
    var hunterID;

    // witch
    var reserruction = true;
    var destruction = true;

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
        _color = para.color;

        for (var i = 0, count = playerData.length; i < count; i++) {
            if (playerData[i] == null) continue;
            playerNum++;
        }

        for (var i = 0, count = playerData.length; i < count; i++) {
            if (playerData[i] == null) continue;

            var playerObj={
              id: playerData[i].id,
              name: playerData[i].name
            }
            _players.push(playerObj);
            _playersId.push(playerObj.id);

            // changed
            _playerMap[playerObj.id] = playerData[i].name;

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

    // game component --------------------------------------
    var setupRole = function (playerId, dat) {
      if (playerId == null || dat == null) { return 0; }

//      console.log(JSON.stringify(_playerMap));
      console.log("player " + playerId + ", " + _playerMap[playerId] + " set to role " + dat);
      // get user instructions
      if ( dat == "witch") {
        witchID = playerId;
        var p = new charactor(playerId,"witch",_playerMap[playerId]);
      }

      else if ( dat == "seer" ) {
        seerID = playerId;
        var p = new charactor(playerId,"seer",_playerMap[playerId]);
      }

      else if ( dat == "villiger" ) {
        var p = new charactor(playerId,"villiger",_playerMap[playerId]);
      }

      else if ( dat == "werewolf" ) {
        var p = new charactor(playerId,"werewolf",_playerMap[playerId]);
      }

      else if ( dat == "hunter" ) {
        hunterID = playerId;
        var p = new charactor(playerId,"hunter",_playerMap[playerId]);
      }
      else { return; }

      playerList[playerId] = p;

//      console.log(JSON.stringify(playerList));

      that.onUpdated({ playerInfo: playerList});
//      console.log(Object.keys(playerList).length, Object.keys(_playerMap).length);


      if (Object.keys(playerList).length == Object.keys(_playerMap).length) {
          // go to preNight
          // ...
          phaseIdx = 2;
          GamePhase[phaseIdx]();
          return;
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
          if (playerList[key].role == "werewolf" && playerList[key].alive) {
              AliveWerewolf.push(key);
          }
          else if (playerList[key].role == "witch" && playerList[key].alive) {
              AliveGods.push(key);
          }
          else if (playerList[key].role == "hunter" && playerList[key].alive) {
              AliveGods.push(key);
          }
          else if (playerList[key].role == "seer" && playerList[key].alive) {
              AliveGods.push(key);
          }
          else if (playerList[key].role == "villiger" && playerList[key].alive){
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

    var CheckIfEnd = function() {

    }

    var daytime = function () {
        console.log("function: daytime");

        phaseIdx = 2;
        GamePhase[phaseIdx]();
    }

    var preNight = function () {
        console.log("entering preNight");

        GetAliveStatus();

        phaseIdx = 3;
        GamePhase[phaseIdx]();

    }

    var werewolf = function (playerId, dat) {
//        console.log("function: Werewolf");

        // tell all alive werewolfs who can be voted
        that.clientUpdate(AliveWerewolf,AliveChara);

        if (playerId == null) {
          console.log("=========================");
          console.log("=       狼人请睁眼       =");
          console.log("=========================");
          return 0;
        }

        if (!(AliveWerewolf.indexOf(playerId) > -1)) {
          console.log(playerId + " is not in alive werewolf list");
          return 0;
        }

        if (!(_playersId.indexOf(dat) > -1)) {
          console.log(dat + " is not in playerID list");
          return 0;
        }
        //if (!_playersId.include(dat)) { return 0; }
        if (playerList[dat].alive){
            werewolfVote[playerId] = dat;
        }
        else {
            console.log("player ",dat," is already dead");
        }

        that.clientUpdate(AliveWerewolf, werewolfVote);
//        console.log(werewolfVote);

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
//            console.log(JSON.stringify(playerList[val]));
            CheckIfEnd();

            phaseIdx = 4;
            GamePhase[phaseIdx]();

          }
        }

    }

    var seer = function (playerId, dat) {
//        console.log("function: Seer");

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

    var witch_res = function (playerId, dat) {
//        console.log("function: Witch_res");
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

    var witch_des = function (playerId, dat) {
        console.log("function: Witch_Des");
        // if we go here, assume witch is alive
        if (playerId == null) {
          console.log("== 你有一瓶毒药要不要用 ==");
          if (destruction){
              that.clientUpdate([witchID],AliveChara);
          }else{

              phaseIdx = 1;
              GamePhase[phaseIdx]();
              return;
          }

          return;
        }
        if (playerList[playerId].role != "witch") { return 0; }

        // die insect
        if (destruction){

            that.clientUpdate([witchID],AliveChara);

            //console.log("do you want to use poison?");
            if ((_playersId.indexOf(dat) > -1)) {
                // if dat is a valid playerID, set alive to false
                playerList[dat].alive = false;
                console.log(playerList[dat], " is destroyed");

                destruction = false;

                console.log("== 女巫请闭眼 ==");

                phaseIdx = 1;
                GamePhase[phaseIdx]();
                return;

            }
            else if (dat == "N") {
                // go to day time
                phaseIdx = 1;
                GamePhase[phaseIdx]();
                return;
            }
        }
        else {
            console.log("Witch doesn't have potion of destruction");

            console.log("== 女巫请闭眼 ==");
            phaseIdx = 1;
            GamePhase[phaseIdx]();
            return;
        }
    }

    // setup -----------------------------------------------
    var _init = function () {
        //that.handler.win = win;
        GamePhase = [setupRole, daytime, preNight, werewolf, seer, witch_res, witch_des, end];
    }();
};

module.exports = Core;
