var Character = require('CHARACTER/Character.Host.js');

var CharacterManager = function() {
  this.list = [];

  this.setup = function(players, characterCode, phase) {
    const sCharacterCode = _shuffle(characterCode);
    for (let i = 0; i < players.length; i++) {
      var character = new(Character(sCharacterCode[i]))(this, phase);
      character.setup(players[i]);
      this.list[i] = character;
    }
  };

  this.reset = function(players, characterCode, phase, characterData) {
    for (let i = 0; i < players.length; i++) {
      var character = new(Character(characterCode[i]))(this, phase);
      character.setup(players[i]);
      character.reset(characterData[i]);
      this.list[i] = character;
    }
  };

  this.getAliveStr = function() {
    var str = '';
    for (var i = 0; i < this.list.length; i++) {
      str += (this.list[i].alive ? '1' : '0');
    }
    return str;
  };

  this.getData = function() {
    var arr = [];
    for (var i = 0; i < this.list.length; i++) {
      arr.push(this.list[i].getData());
    }
    return arr;
  };

  // ----------------

  var _shuffle = function(input) {
    var output = [];
    var copy = input.slice();

    for (var i = input.length; i > 0; i--) {
      var k = ~~(Math.random() * i);
      output.push(copy[k]);
      copy[k] = copy[i - 1];
    }
    return output;
  };
};

module.exports = CharacterManager;
