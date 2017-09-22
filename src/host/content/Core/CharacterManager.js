var Character = require('CHARACTER/Character.Host.js');

var CharacterManager = function() {
  this.list = [];

  this.setup = function(players, characterCode, phase) {
    for (let id in players) {
      var p = players[id];
      var character = new(Character(characterCode[p.playerIdx]))(this, phase);
      character.setup(p);
      this.list[p.playerIdx] = character;
    }
  };

  this.reset = function(characterData) {
    for (let i = 0; i < players.length; i++) {
      this.list[i].reset(characterData[i]);
    }
  };

  this.getAliveStr = function() {
    var str = '';
    for (var i = 0; i < this.list.length; i++) {
      str += (this.list[i].alive ? '1' : '0');
    }
    return str;
  };

  this.getGameData = function() {
    var arr = [];
    for (var i = 0; i < this.list.length; i++) {
      arr.push(this.list[i].getData());
    }
    return arr;
  };
};

module.exports = CharacterManager;
