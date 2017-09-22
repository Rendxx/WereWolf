/* TODO:
    This is the primary part of this game.
    - It setups the game with initial options and create setup data.
    - It receives and run user's operation.
    - It keeps sending game data to renderer, server and clients.
    - It monitors game process and decides the next status of the game.
*/

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
  var _onEnd = null;

  // message -----------------------------------------------
  this.send = null; /* TODO: this.send(code, content): This function should be set by Host-Manager, it is used to send message out */
  this.handler = {
    nextPhase: function() {
      phaseManager.nextPhase();
    },
    setAlive: function(playerIdx, isAlive) {
      characterManager.list[playerIdx].setAlive(isAlive);
    },
    setStatus: function(role, status) {

    },
    win: function(isVillager) {
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
    if (dat == null || _players[clientId] == null) return;
    _players[clientId].receiveAction(dat);
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
      _players = _createPlayer(playerSetupData);
      characterManager.setup(_players, characterCode, phaseManager);
      phaseManager.setup(characterManager.list);
    }
    if (gameData != null) {
      var phaseData = gameData[0];
      var characterData = gameData[1];
      phaseManager.reset(phaseData);
      characterManager.reset(characterData);
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

    var characterCode = _shuffle(para.characterList);
    var clientNumber = para.clientNumber;
    var playerSetupData = [];
    for (var i = 0, count = playerData.length; i < count; i++) {
      if (playerData[i] == null) continue;
      const id = playerData[i].id;
      const number = clientNumber[id];
      const name = playerData[i].name;
      const idx = i;
      playerSetupData.push([id, number, name, idx]);
    }
    phaseManager = _createPhase();
    characterManager = new CharacterManager();
    _players = _createPlayer(playerSetupData);
    characterManager.setup(_players, characterCode, phaseManager);
    phaseManager.setup(characterManager.list);

    that.onSetuped([playerSetupData, characterCode]);

    for (var i = 0; i < characterManager.list.length; i++) {
      const c = characterManager.list[i];
      that.clientSetup([playerSetupData[i].id], [
        playerSetupData[i].idx,
        c.getMetadata().Code,
        playerSetupData
      ]);
    }

    this.onUpdated([
      phaseManager.getGameData(),
      characterManager.getGameData(),
    ]);
  };

  var _createPlayer = function(playerSetupData) {
    let playerMap = {};
    for (var i = 0, count = playerSetupData.length; i < count; i++) {
      const id = playerSetupData[i][0];
      const number = playerSetupData[i][1];
      const name = playerSetupData[i][2];
      const idx = playerSetupData[i][3];

      var p = new Player(id, number, name, idx);
      p.onUpdate = this.clientUpdate.bind(this);
      playerMap[id] = p;
    }
    return playerMap;
  }.bind(this);

  var _createPhase = function() {
    const phaseManager = new PhaseManager();
    phaseManager.onPhaseEnd = function() {
      this.onUpdated([
        phaseManager.getGameData(),
        characterManager.getGameData(),
      ]);
    }.bind(this);
    return phaseManager;
  }.bind(this);

  var _shuffle = function(input) {
    var output = [];
    var copy = input.slice();

    for (var i = input.length; i > 0; i--) {
      var k = ~~(Math.random() * i);
      output.push(copy[k]);
      copy[k] = copy[i - 1];
    }
    return output;
  }.bind(this);

  var win = function(isVillager) {
    that.onUpdated([
      phaseManager.getGameData(),
      characterManager.getGameData(),
      isVillager ? 1 : 0,
    ]);

    _onEnd && _onEnd();
    start = false;
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
