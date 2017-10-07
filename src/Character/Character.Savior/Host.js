"use strict";

var Basic = require('../Character.Basic/Host.js');

var Savior = function(characterManager, phaseManager) {
  Basic.call(this, characterManager, phaseManager);
  this.status = [-1]; // [last protected player idx]
};
Savior.prototype = Object.create(Basic.prototype);
Savior.prototype.constructor = Savior;
Savior.DATA = require('./Data.js');

Savior.prototype.onAction = function(actionDat) {
  if (!this.phaseManager.checkActionValid(actionDat[0])) return;
  this.status[0] = actionDat[1];
  this.phaseManager.roundData['savior'] = actionDat[1];
  this.phaseManager.actionResult([actionDat[1]]);
};

module.exports = Savior;
