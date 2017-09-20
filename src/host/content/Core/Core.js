/* TODO:
    This is the primary part of this game.
    - It setups the game with initial options and create setup data.
    - It receives and run user's operation.
    - It keeps sending game data to renderer, server and clients.
    - It monitors game process and decides the next status of the game.
*/

var Role = require('ROLE/Role.Host.js');
var CharacterManager = require('./CharacterManager.js');
var PhaseManager = require('./PhaseManager.js');
var Player = require('./Player.js');

var Core = function(opts) {
  "use strick";
  // property -----------------------------------------------
  var that = this,
    start = false,
    _players = null;

  var _msg;
  var _send;
  var phaseManager = null;
  var characterManager = null;

  // message -----------------------------------------------
  this.send = null; /* TODO: this.send(code, content): This function should be set by Host-Manager, it is used to send message out */
  this.handler = {
    skip: function() {
      phaseManager.skip();
    },
    setAlive: function(playerIdx, isAlive) {
      characterManager.list[playerIdx].setAlive(isAlive);
    },
    setStatus: function(role, status) {

    },
    win: function(isVillager) {
      phaseManager.win(isVillager);
    }
  }; /* TODO: this is a package of hander for Render.Main */

  this.receive = function(msg) {
    /* TODO:
        receive unordinary message.
        you can use this port to handle customized message format
    */
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
      const playerSetupData = setupData[0];
      const characterCode = setupData[1];
      phaseManager = _createPhase();
      characterManager = new CharacterManager();
      var playerList = _createPlayer(playerSetupData);
      characterManager.setup(playerList, characterCode, phaseManager);
    }
    if (gameData != null) {
      var aliveList = gameData[1];
      var statusList = gameData[3];
      cacheAlive = gameData[2];
      _gameData = gameData[5];
      for (var i = 0; i < playerList.length; i++) {
        playerList[i].alive = (aliveList[i] === '1');
        playerList[i].status = statusList[i];
      }
      GetAliveStatus(false);
      if (_gameData.passed === 1) phaseIncreament(0);
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

    var characterCode = para.characterList;
    var playerSetupData = [];
    for (var i = 0, count = playerData.length; i < count; i++) {
      if (playerData[i] == null) continue;
      const id = playerData[i].id;
      const number = _gameData.clientNumber[id];
      const name = playerData[i].name;
      const idx = i;
      playerSetupData.push([id, number, name, idx]);
    }
    phaseManager = _createPhase();
    characterManager = new CharacterManager();
    var playerList = _createPlayer(playerSetupData);
    characterManager.setup(playerList, characterCode, phaseManager);

    that.onSetuped([playerSetupData, characterCode]);

    for (var i = 0; i < characterManager.list.length; i++) {
      const c = characterManager.list[i];
      that.clientSetup([playerSetupData[i].id], [
        playerSetupData[i].idx,
        c.getMetadata().Code,
        playerSetupData
      ]);
    }
  };

  var _createPlayer = function(playerSetupData) {
    let playerList = [];
    for (var i = 0, count = playerSetupData.length; i < count; i++) {
      const id = playerSetupData[i][0];
      const number = playerSetupData[i][1];
      const name = playerSetupData[i][2];
      const idx = playerSetupData[i][3];

      var p = new Player(id, number, name, idx);
      p.onUpdate = this.clientUpdate.bind(this);
      playerList.push(p);
    }
    return playerList;
  };

  var _createPhase = function (){
    const phaseManager = new PhaseManager();
    phaseManager.onPhaseEnd = function (){
      this.onUpdated([
        phaseManager.getData(),
        characterManager.getData(),
      ]);
    }.bind(this);
    phaseManager.onRoundEnd = function (){
      this.onUpdated([
        phaseManager.getData(),
        characterManager.getData(),
      ]);
    }.bind(this);
    return phaseManager;
  };

  // game ------------------------------------------------
  this.start = function() {
    /* TODO: game start */
    start = true;
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

  var _init = function(opts) {
    _onEnd = opts && opts.onEnd;
  }(opts);
};

module.exports = Core;
