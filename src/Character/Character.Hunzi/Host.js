"use strict";

var Basic = require('../Character.Basic/Host.js');

var Hunzi = function(characterManager, phaseManager) {
  Basic.call(this, characterManager, phaseManager);

  this.status = [-1]; // list of [dad]
};
Hunzi.prototype = Object.create(Basic.prototype);
Hunzi.prototype.constructor = Hunzi;
Hunzi.DATA = require('./Data.js');

Hunzi.prototype.onAction = function(actionDat) {
  if (!this.phaseManager.checkActionValid(actionDat[0])||  this.status[0]!==-1) return;
  const playerIdx = actionDat[1];
  const rst = [playerIdx];
  this.status[0] = playerIdx;
  this.phaseManager.actionResult(rst);
};

module.exports = Hunzi;
