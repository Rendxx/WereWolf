var Character = require('CHARACTER/Character.Host.js');

var CharacterManager = function() {
  this.list = [];

  this.setup = function(players, characterCode, phase) {
    for (let i = 0; i < players.length; i++) {
      var character = new(Character(characterCode[i]))(this, phase);
      character.setup(players[i]);
      this.list[i] = character;
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
