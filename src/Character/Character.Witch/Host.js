"use strict";

var Basic = require('../Character.Basic/Host.js');
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

Witch.prototype.active = function() {
  let dat = [
    this.phaseManager.actionStamp,
    0, -1
  ];
  let actionDat = this.phaseManager.roundData;
  let victim = actionDat.werewolf || -1;
  if (this.goodPotionNumber>0) {
    dat[1] = victim;
    dat[0] = this.canHeal(victim)? 1: 0;
  }

  this.sendActive(dat);
};

Witch.prototype.onAction = function(actionDat) {
  if (!this.phaseManager.checkActionValid(actionDat[0])) return;
  const healIdx = actionDat[1];
  const poisonIdx = actionDat[2];
  if (healIdx !== -1 && this.goodPotionNumber() > 0) {
    this.useGoodPotion();
    this.phaseManager.roundData['witchHeal'] = actionDat[1];
  } else {
    this.phaseManager.roundData['witchHeal'] = -1;
  }
  if (poisonIdx !== -1 && this.badPotionNumber() > 0) {
    this.useBadPotion();
    this.phaseManager.roundData['witchPoison'] = actionDat[2];
  } else {
    this.phaseManager.roundData['witchPoison'] = -1;
  }

  this.phaseManager.actionResult([actionDat[1], actionDat[2]]);
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

Witch.prototype.canHeal = function(playerIdx) {
  if (this.status[0] <= 0 || playerIdx === -1) return false;
  let roundNumber = this.phaseManager.roundNumber;
  if (playerIdx === this.player.playerIdx) {
    if (this.status[2] === ATTR.SELFHEAL.NO) return false;
    else if (this.status[2] === ATTR.SELFHEAL.NIGHTONE && roundNumber > 1) return false;
  }
  return true;
};

Witch.prototype.canPoison = function(playerIdx) {
  return (this.status[1] > 0 && playerIdx !== -1);
};

Witch.prototype.knowVictim = function() {
  return this.status[0] > 0;
};

module.exports = Witch;
