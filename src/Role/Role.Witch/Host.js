"use strict";

var Basic = require('../Role.Basic/Host.js');
var ATTR = require('./Attr.js');
var ROLEDATA = require('./Data.js');

var Witch = function () {
    Basic.call(this);
    this._setData(ROLEDATA);

    this.status = [1, 1, 0];  // [good potion #, bad potion #, self-healing]
};
Witch.prototype = Object.create(Basic.prototype);
Witch.prototype.constructor = Witch;

Witch.prototype.setAttr = function (attr) {
    if (opts.hasOwnProperty('SELFHEAL')) this.status[2] = opts['SELFHEAL'];
};

Witch.prototype.active = function (generalDat, actionDat){
    let dat = [
        actionDat.canHeal?1:0,
        actionDat.victim
    ];
    Basci.prototype.active.call(this, generalDat, dat);
};

Witch.prototype.actionResult = function (generalDat, rstDat){
    let dat = [
        rstDat.healIdx,
        rstDat.poisonIdx
    ];
    Basci.prototype.actionResult.call(this, generalDat, dat);
};

/**
 * Update player status.
 * @param {object} opts {good: good potion #, bad: bad potion #}
 */
Witch.prototype.updateStatus = function (opts) {
    if (opts.hasOwnProperty('good')) this.status[0] = opts['good'];
    if (opts.hasOwnProperty('bad')) this.status[1] = opts['bad'];
};

Witch.prototype.goodPotionNumber = function () {
    return this.status[0];
};

Witch.prototype.badPotionNumber = function () {
    return this.status[1];
};

Witch.prototype.useGoodPotion = function () {
    this.status[0]--;
};

Witch.prototype.useBadPotion = function () {
    this.status[1]--;
};

Witch.prototype.canHeal = function (roundNumber, playerIdx) {
    if (this.status[0] <= 0 || playerIdx === -1) return false;
    if (playerIdx === this.player.playerIdx) {
        if (this.status[2] === ATTR.SELFHEAL.NO) return false;
        else if (this.status[2] === ATTR.SELFHEAL.NIGHTONE && roundNumber > 1) return false;
    }
    return true;
};

Witch.prototype.canPoison = function (roundNumber, playerIdx) {
    return (this.status[1] > 0 && playerIdx !== -1) ;
};

Witch.prototype.knowVictim = function () {
    return this.status[0] > 0;
};

module.exports = Witch;
