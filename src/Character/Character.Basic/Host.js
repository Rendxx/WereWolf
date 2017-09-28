"use strict";

var ATTR = require('./Attr.js');
var ACTIVECODE = require('GLOBAL/content/ActiveCode.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

/**
 * Role instance for host.
 */
var Basic = function(characterManager, phaseManager) {
  this.data = this.constructor.DATA;
  this.status = null;
  this.player = null;
  this.alive = true;
  this.actived = false;
  this.characterManager = characterManager;
  this.phaseManager = phaseManager;
};
Basic.prototype = Object.create(null);
Basic.prototype.constructor = Basic;
Basic.DATA = require('./Data.js');

/**
 * set role attribute
 * @param {number} attr attribute bit-array
 */
Basic.prototype.setAttr = function(attr) {};

/**
 * setup player instance
 * @param {Player} player player instance
 */
Basic.prototype.setup = function(player) {
  this.player = player;
  this.player.onAction = function(playerIdx, dat) {
    if (!this.alive) return;
    this.onAction(dat);
  }.bind(this);
};

/**
 * reset Role instance
 * @param {object} dat role data options
 */
Basic.prototype.reset = function(dat) {
  this.alive = (dat[0] == 1);
  this.actived = (dat[1] == 1);
  this.status = dat[2];
};

/**
 * get role metadata
 * @param {object} data role metadata package
 */
Basic.prototype.getMetadata = function() {
  return this.constructor.DATA;
};

/**
 * handle character action
 * @param {object} data action data
 */
Basic.prototype.onAction = function(data) {};

/**
 * get Role instance data
 */
Basic.prototype.getData = function() {
  return [
    this.alive ? 1 : 0,
    this.actived ? 1 : 0,
    this.status,
  ];
};

/**
 * Send active message.
 * @param {object} actionDat action data
 */
Basic.prototype.active = function() {
  this.sendActive([this.phaseManager.actionStamp]);
};

Basic.prototype.sendActive = function(actionDat) {
 this.actived = ACTIVECODE.YES;
 this.player.update({
   phase: this.phaseManager.phaseIdx,
   alive: this.characterManager.getAliveStr(),
   actived: this.actived,
   status: this.status,
   action: actionDat
 });
};

/**
 * Send inactive message.
 */
Basic.prototype.inactive = function() {
  this.actived = ACTIVECODE.NO;
  this.player.update({
    phase: this.phaseManager.phaseIdx,
    alive: this.characterManager.getAliveStr(),
    actived: this.actived,
    status: this.status
  });
};

/**
 * Send action result message.
 * @param {object} rstDat result data
 */
Basic.prototype.actionResult = function(rstDat) {
  this.actived = ACTIVECODE.RESULT;
  this.player.update({
    phase: this.phaseManager.phaseIdx,
    alive: this.characterManager.getAliveStr(),
    actived: this.actived,
    status: this.status,
    result: rstDat
  });
};

/**
 * Update player status.
 * @param {object} opts
 */
Basic.prototype.updateStatus = function(opts) {};

/**
 * Set the player alive or not.
 * @param {boolean} isAlive
 */
Basic.prototype.setAlive = function(isAlive) {
  this.alive = isAlive;
};

Basic.prototype.isGood = function() {
  return this.data.Type !== CHARACTER_TYPE.WEREWOLF;
};

Basic.prototype.werewolfKill = function() {
  this.setAlive(false);
};

Basic.prototype.witchPoison = function() {
  this.setAlive(false);
};

/**
 * Dispose resource.
 */
Basic.prototype.dispose = function() {};

module.exports = Basic;
