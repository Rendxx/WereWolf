"use strict";

var Basic= require('../Role.Basic/Host.js');
var ROLEDATA = require('./Data.js');

var Werewolf = function () {
    Basic.call(this);
    this._setData(ROLEDATA);
};
Werewolf.prototype = Object.create(Basic.prototype);
Werewolf.prototype.constructor = Werewolf;

Werewolf.prototype.active = function (generalDat, actionDat){
    let dat = [
        actionDat.werewolf,
        actionDat.vote
    ];
    Basci.prototype.active.call(this, generalDat, dat);
};

Werewolf.prototype.actionResult = function (generalDat, rstDat){
    let dat = [
        rstDat.victim
    ];
    Basci.prototype.actionResult.call(this, generalDat, dat);
};

module.exports = Werewolf;
