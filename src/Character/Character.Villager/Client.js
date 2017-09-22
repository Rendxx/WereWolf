"use strict";

var Basic= require('../Character.Basic/Client.js');
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

Villager.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].classList.add('_roleInfo_villager');
};
module.exports = Villager;
