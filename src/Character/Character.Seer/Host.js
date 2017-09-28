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
  if (!this.phaseManager.checkActionValid(actionDat[0])) return;
  const playerIdx = actionDat[1];
  const isGood = this.characterManager.list[playerIdx].isGood()?0:1;
  const rst = [playerIdx,isGood];
  this.phaseManager.roundData['seer'] = rst;
  this.phaseManager.actionResult(rst);
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
