"use strict";

var Basic= require('../Character.Basic/Client.js');
var ROLEDATA = require('./Data.js');
require('./Client.less');

var Knight = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
};
Knight.prototype = Object.create(Basic.prototype);
Knight.prototype.constructor = Knight;

Knight.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].classList.add('_roleInfo_knight');
};
module.exports = Knight;
