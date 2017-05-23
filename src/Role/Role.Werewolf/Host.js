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
};
Werewolf.prototype = Object.create(Basic);
Werewolf.prototype.constructor = Werewolf;

module.exports = Werewolf;
