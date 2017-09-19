"use strict";

var PHASE_ATTR = require('./PHASE_ATTR.js');

var Phase = function(data) {
  this.data = data;

  this.characters = [];
  this.enabled = false;
  var _actionCountDownFunc = null;

  this.setup = function(characterList) {
    for (let i = 0; i < characterList.length; i++) {
      const code = characterList[i].data.Code;
      if (this.data.Role.hasOwnProperty(code)) {
        this.characters.push(characterList[i]);
      }
    }
    this.enabled = this.characters.length > 0;
  };

  this.active = function() {
    if (_actionCountDownFunc !== null) {
      clearTimeout(_actionCountDownFunc);
      _actionCountDownFunc = null;
    }
    if (this.data.Action === PHASE_ATTR.ACTION.SKIP) {
      this.onActionComplete && this.onActionComplete();
    } else if (this.data.Action === PHASE_ATTR.ACTION.NO) {
      if (this.data.Sound !== null) this.data.Sound.play();
      _actionCountDownFunc = setTimeout(function() {
        this.onActionComplete && this.onActionComplete();
        _actionCountDownFunc = null;
      }, 5000);
    } else {
      if (this.data.Timeout > 0) {
        _actionCountDownFunc = setTimeout(function() {
          this.onActionComplete && this.onActionComplete();
          _actionCountDownFunc = null;
        }, this.data.Timeout);
      }

      let aliveNumber = 0;
      for (let i = 0; i < this.characters.length; i++) {
        if (this.characters[i].alive) aliveNumber++;
        this.characters[i].active(this.generalDat, this.actionDat);
      }

      if (aliveNumber===0){
        _actionCountDownFunc = setTimeout(function() {
          this.onActionComplete && this.onActionComplete();
          _actionCountDownFunc = null;
        }, 3000);
      }
    }
  };
};

module.exports = Phase;
