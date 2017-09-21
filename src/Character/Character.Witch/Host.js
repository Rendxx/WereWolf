"use strict";

var Basic = require('../Role.Basic/Host.js');
var ATTR = require('./Attr.js');

var Witch = function(characterManager, phaseManager) {
  Basic.call(this, characterManager, phaseManager);

  this.status = [1, 1, 0]; // [good potion #, bad potion #, self-healing]
};
Witch.prototype = Object.create(Basic.prototype);
Witch.prototype.constructor = Witch;
Witch.DATA = require('./Data.js');

Witch.prototype.setAttr = function(attr) {
  if (opts.hasOwnProperty('SELFHEAL')) this.status[2] = opts['SELFHEAL'];
};

Witch.prototype.active = function(generalDat, actionDat) {
  let dat = [
    actionDat.canHeal ? 1 : 0,
    actionDat.victim
  ];
  Basic.prototype.active.call(this, generalDat, dat);
};

Witch.prototype.onAction = function(actionDat) {
  const healIdx = actionDat[0];
  const poisonIdx = actionDat[1];
  this.phaseManager.roundData['witch'] = actionDat;
  this.actionResult(actionDat);
  this.phaseManager.nextPhase();
};

/**
 * Update player status.
 * @param {object} opts {good: good potion #, bad: bad potion #}
 */
Witch.prototype.updateStatus = function(opts) {
  if (opts.hasOwnProperty('good')) this.status[0] = opts['good'];
  if (opts.hasOwnProperty('bad')) this.status[1] = opts['bad'];
};

Witch.prototype.goodPotionNumber = function() {
  return this.status[0];
};

Witch.prototype.badPotionNumber = function() {
  return this.status[1];
};

Witch.prototype.useGoodPotion = function() {
  this.status[0]--;
};

Witch.prototype.useBadPotion = function() {
  this.status[1]--;
};

Witch.prototype.canHeal = function(roundNumber, playerIdx) {
  if (this.status[0] <= 0 || playerIdx === -1) return false;
  if (playerIdx === this.player.playerIdx) {
    if (this.status[2] === ATTR.SELFHEAL.NO) return false;
    else if (this.status[2] === ATTR.SELFHEAL.NIGHTONE && roundNumber > 1) return false;
  }
  return true;
};

Witch.prototype.canPoison = function(roundNumber, playerIdx) {
  return (this.status[1] > 0 && playerIdx !== -1);
};

Witch.prototype.knowVictim = function() {
  return this.status[0] > 0;
};

module.exports = Witch;
