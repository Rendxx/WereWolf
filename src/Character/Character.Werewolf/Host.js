"use strict";

var Basic = require('../Character.Basic/Host.js');

var Werewolf = function(characterManager, phaseManager) {
  Basic.call(this, characterManager, phaseManager);
};
Werewolf.prototype = Object.create(Basic.prototype);
Werewolf.prototype.constructor = Werewolf;
Werewolf.DATA = require('./Data.js');

Werewolf.prototype.onAction = function(actionDat) {
  if (!this.phaseManager.checkActionValid(actionDat[0])) return;
  this.phaseManager.roundData['werewolf'] = actionDat[1];
  this.actionResult(actionDat);
  this.phaseManager.nextPhase();
};

module.exports = Werewolf;
