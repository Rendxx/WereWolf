"use strict";

var Basic= require('../Role.Basic/Host.js');
var ROLEDATA = require('./Data.js');

var Seer = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
    this.portrait = ROLEDATA.Portrait;
    this.isGood = ROLEDATA.IsGood;

    this.status = [];   // list of [playerIdx, werewolf?1:0]
};
Seer.prototype = Object.create(Basic);
Seer.prototype.constructor = Seer;

Seer.prototype.active = function (phase, actionDat){
    let dat = [
        actionDat.seer,
        actionDat.vote
    ];
    Basci.prototype.active.call(this, phase, dat);
};

/**
 * Update player status. 
 * @param {object} opts {playerIdx: is werewolf}
 */
Seer.prototype.updateStatus = function (opts){
    for (let i in opts) 
        this.status.push([i, opts[i]?1:0]);
};

module.exports = Seer;
