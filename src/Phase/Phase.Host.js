"use strict";

var PHASE_ATTR = require('./PHASE_ATTR.js');

var Phase = function(data) {
  this.data = data;

  this.characters = [];
  this.allCharacters = [];
  this.enabled = false;
  this.onActionComplete = null;
  var _actionCountDownFunc = null;

  this.setup = function(characterList) {
    this.allCharacters = characterList;
    if (this.data.Role.length === 0) {
      this.enabled = true;
    } else {
      let characterMap = {};
      for (let i = 0; i < this.data.Role.length; i++) {
        characterMap[this.data.Role[i]] = true;
      }
      for (let i = 0; i < characterList.length; i++) {
        const code = characterList[i].data.Code;
        if (characterMap.hasOwnProperty(code)) {
          this.characters.push(characterList[i]);
        }
      }
      this.enabled = this.characters.length > 0;
    }
  };

  this.active = function() {
    if (_actionCountDownFunc !== null) {
      clearTimeout(_actionCountDownFunc);
      _actionCountDownFunc = null;
    }

    for (let i = 0; i < this.allCharacters.length; i++) {
      this.allCharacters[i].inactive();
    }

    if (this.data.Action === PHASE_ATTR.ACTION.SKIP) {
      this.onActionComplete && this.onActionComplete();
    } else if (this.data.Action === PHASE_ATTR.ACTION.NO) {
      _playSound();
      _actionCountDownFunc = setTimeout(function() {
        this.onActionComplete && this.onActionComplete();
        _actionCountDownFunc = null;
      }.bind(this), 8000);
    } else {
      if (this.data.Timeout > 0) {
        _actionCountDownFunc = setTimeout(function() {
          this.onActionComplete && this.onActionComplete();
          _actionCountDownFunc = null;
        }.bind(this), this.data.Timeout);
      }
      _playSound();
      let aliveNumber = 0;
      for (let i = 0; i < this.characters.length; i++) {
        if (this.characters[i].alive) aliveNumber++;
        this.characters[i].active();
      }

      if (aliveNumber === 0 && this.characters.length > 0) {
        _actionCountDownFunc = setTimeout(function() {
          this.onActionComplete && this.onActionComplete();
          _actionCountDownFunc = null;
        }.bind(this), 5000);
      }
    }
  };

  var _playSound = function() {
    setTimeout(function() {
      this.data.Sound && this.data.Sound.play();
    }.bind(this), 2000);
  }.bind(this);
};

module.exports = Phase;
