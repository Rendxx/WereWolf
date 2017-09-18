"use strict";

var DATA = require('./Data.js');
var ATTR = require('../PhaseAttr.js');
var Role = require('ROLE/Role.Host.js');

var Basic = function(dataPkg) {
  this.dataPkg = dataPkg;

  this.data = DATA;
  this.phaseCharacters = [];
  this.allCharacters = [];

  this._setuped = false;
  this._actionCountDownFunc = null;
  this.aliveNumber = 0;
  this.actionDat = {};
  this.generalDat = {
    phase: this.data.Id,
    aliveList: this.dataPkg.getAliveStr()
  };
  this.onActionComplete = null;

  if (this.data.Role.length > 0) {
    for (let i = 0; i < this.data.MinPlayer; i++) {
      this.characters.push(Role(this.data.Role[0]));
    }
  }
};
Basic.prototype = Object.create(null);
Basic.prototype.constructor = Basic;

/**
 * Setup with all player
 * Pickup the interactive player and
 */
Basic.prototype.setup = function(characterList) {
  this.allCharacters = characterList;
  for (let i = 0; i < characterList.length; i++) {
    const c = characterList[i];
    if (c.getMetadata().Code in this.data.Role) {
      this.phaseCharacters.push(c);
    }
  }
};

/**
 * Reset phase
 */
Basic.prototype.reset = function(characters) {
  this.characters = characters;

  this._setuped = true;
  this.actionDat = {};
  this.aliveNumber = 0;
  this.generalDat = {
    phase: this.data.Id,
    aliveList: this.dataPkg.getAliveStr()
  };
};

/**
 * Active all player in this phase
 */
Basic.prototype.active = function() {
  if (!this._setuped) return;
  if (this._actionCountDownFunc !== null) {
    clearTimeout(this._actionCountDownFunc);
    this._actionCountDownFunc = null;
  }
  if (this.data.Action === ATTR.ACTION.SKIP) {
    this.onActionComplete && this.onActionComplete();
  } else if (this.data.Action === ATTR.ACTION.NO) {
    if (this.data.Sound !== null) this.data.Sound.play();
    this._actionCountDownFunc = setTimeout(function() {
      this.onActionComplete && this.onActionComplete();
      this._actionCountDownFunc = null;
    }, 5000);
  } else {
    if (this.data.Timeout > 0) {
      this._actionCountDownFunc = setTimeout(function() {
        this.onActionComplete && this.onActionComplete();
        this._actionCountDownFunc = null;
      }, this.data.Timeout);
    }
    this.generalDat.aliveList = this.dataPkg.getAliveStr();
    this.aliveNumber = 0;
    for (let i = 0; i < this.characters.length; i++) {
      if (this.characters[i].alive) this.aliveNumber++;
      this.characters[i].active(this.generalDat, this.actionDat);
    }
  }
};

/**
 * Inactive all player in this phase
 */
Basic.prototype.inactive = function() {
  if (!this._setuped) return;
  if (this._actionCountDownFunc !== null) {
    clearTimeout(this._actionCountDownFunc);
    this._actionCountDownFunc = null;
  }
  this.generalDat.aliveList = this.dataPkg.getAliveStr();
  for (let i = 0; i < this.characters.length; i++) {
    this.characters[i].inactive(this.generalDat);
  }
};

/**
 * Handle action from player
 */
Basic.prototype.actionHandler = function(playerIdx, dat) {
  if (!this._setuped) return;
};

module.exports = Basic;
