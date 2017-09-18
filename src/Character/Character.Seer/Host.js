"use strict";

var Basic = require('../Role.Basic/Host.js');

var Seer = function(characterManager, phaseManager) {
  Basic.call(this, characterManager, phaseManager);

  this.status = []; // list of [playerIdx, werewolf?1:0]
};
Seer.prototype = Object.create(Basic.prototype);
Seer.prototype.constructor = Seer;
Seer.DATA = require('./Data.js');

Seer.prototype.active = function(generalDat, actionDat) {
  let dat = [
    actionDat.seer,
    actionDat.vote
  ];
  Basci.prototype.active.call(this, generalDat, dat);
};

/**
 * Update player status.
 * @param {object} opts {playerIdx: is werewolf}
 */
Seer.prototype.updateStatus = function(opts) {
  for (let i in opts)
    this.status.push([i, opts[i] ? 1 : 0]);
};

Seer.prototype.actionResult = function(phase, rstDat) {
  let dat = [
    rstDat.testIdx,
    rstDat.isBad ? 1 : 0
  ];
  Basci.prototype.actionResult.call(this, phase, dat);
};

module.exports = Seer;
