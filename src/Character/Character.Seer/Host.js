"use strict";

var Basic = require('../Character.Basic/Host.js');

var Seer = function(characterManager, phaseManager) {
  Basic.call(this, characterManager, phaseManager);

  this.status = []; // list of [playerIdx, werewolf?1:0]
};
Seer.prototype = Object.create(Basic.prototype);
Seer.prototype.constructor = Seer;
Seer.DATA = require('./Data.js');

Seer.prototype.onAction = function(actionDat) {
  const playerIdx = actionDat[0];
  const isGood = this.characterManager.list[playerIdx].isGood()?0:1;
  const rst = [playerIdx,isGood];
  this.phaseManager.roundData['seer'] = rst;
  this.actionResult(rst);
  this.phaseManager.nextPhase();
};

/**
 * Update player status.
 * @param {object} opts {playerIdx: is werewolf}
 */
Seer.prototype.updateStatus = function(opts) {
  for (let i in opts)
    this.status.push([i, opts[i] ? 1 : 0]);
};

module.exports = Seer;
