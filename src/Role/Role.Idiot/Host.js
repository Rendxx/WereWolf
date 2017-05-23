"use strict";

var Basic= require('../Role.Basic/Host.js');
var ROLEDATA = require('./Data.js');

var Idiot = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
    this.portrait = ROLEDATA.Portrait;
};
Idiot.prototype = Object.create(Basic);
Idiot.prototype.constructor = Hunter;

module.exports = Idiot;
