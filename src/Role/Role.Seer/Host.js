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
};
Seer.prototype = Object.create(Basic);
Seer.prototype.constructor = Seer;

module.exports = Seer;
