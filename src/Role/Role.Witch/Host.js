"use strict";

var Basic= require('../Role.Basic/Host.js');
var ROLEDATA = require('./Data.js');

var Witch = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
    this.portrait = ROLEDATA.Portrait;

    this.status = [1,1];  // [good potion #, bad potion #]
};
Witch.prototype = Object.create(Basic);
Witch.prototype.constructor = Witch;

Witch.prototype.updateStatus = function (opts){
    if (opts.hasOwnProperty('good')) this.status[0] = opts['good'];
    if (opts.hasOwnProperty('bad')) this.status[1] = opts['bad'];
};

module.exports = Witch;
