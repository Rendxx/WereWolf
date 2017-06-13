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
    this.isGood = ROLEDATA.IsGood;

    this.status = [0]; // [exposed?1:0]
};
Idiot.prototype = Object.create(Basic);
Idiot.prototype.constructor = Hunter;

/**
 * Update player status. 
 * @param {object} opts {exposed: true/false}
 */
Idiot.prototype.updateStatus = function (opts){
    if (opts.hasOwnProperty('exposed')) this.status[0] = opts['exposed']?1:0;
};

module.exports = Idiot;
