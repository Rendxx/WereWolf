"use strict";

var Basic= require('../Role.Basic/Host.js');
var ROLEDATA = require('./Data.js');

var Werewolf = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
    this.portrait = ROLEDATA.Portrait;
    this.isGood = ROLEDATA.IsGood;
};
Werewolf.prototype = Object.create(Basic);
Werewolf.prototype.constructor = Werewolf;

Werewolf.prototype.active = function (phase, actionDat){
    let dat = [
        actionDat.werewolf,
        actionDat.vote
    ];
    Basci.prototype.active.call(this, phase, dat);
};

Werewolf.prototype.actionResult = function (phase, rstDat){
    let dat = [
        rstDat.victim
    ];
    Basci.prototype.actionResult.call(this, phase, dat);
};

module.exports = Werewolf;
