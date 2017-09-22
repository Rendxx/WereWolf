"use strict";

var Basic = require('../Character.Basic/Host.js');

var Werewolf = function(characterManager, phaseManager) {
  Basic.call(this, characterManager, phaseManager);
};
Werewolf.prototype = Object.create(Basic.prototype);
Werewolf.prototype.constructor = Werewolf;
Werewolf.DATA = require('./Data.js');

Werewolf.prototype.onAction = function(actionDat) {
  this.phaseManager.roundData['werewolf'] = actionDat[0];
  this.actionResult(actionDat);
  this.phaseManager.nextPhase();
};

module.exports = Werewolf;
