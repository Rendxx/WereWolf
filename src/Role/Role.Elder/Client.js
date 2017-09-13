"use strict";

var Basic= require('../Role.Basic/Client.js');
var ROLEDATA = require('./Data.js');
require('./Client.less');

var Elder = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
};
Elder.prototype = Object.create(Basic.prototype);
Elder.prototype.constructor = Elder;

Elder.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].classList.add('_roleInfo_elder');
};
module.exports = Elder;
