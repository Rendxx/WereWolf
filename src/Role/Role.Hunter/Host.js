"use strict";

var Basic= require('../Role.Basic/Host.js');
var ROLEDATA = require('./Data.js');

var Hunter = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
    this.portrait = ROLEDATA.Portrait;
    this.isGood = ROLEDATA.IsGood;

    this.status = [1];  // [canShot]
};
Hunter.prototype = Object.create(Basic);
Hunter.prototype.constructor = Hunter;

Hunter.prototype.updateStatus = function (opts){
    if (opts.hasOwnProperty('canShot')) this.status[0] = opts['canShot']?1:0;
};

module.exports = Hunter;
