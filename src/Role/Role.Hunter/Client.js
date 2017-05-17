"use strict";

var Basic= require('../Role.Basic/Client.js');
var ROLEDATA = require('./Data.js');
require('./Client.less');

var Villager = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
};
Villager.prototype = Object.create(Basic.prototype);
Villager.prototype.constructor = Villager;

module.exports = Villager;
