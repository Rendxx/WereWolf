"use strict";

var Basic= require('../Role.Basic/Client.js');
var ROLEDATA = require('./Data.js');
require('./Client.less');

var Idiot = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
};
Idiot.prototype = Object.create(Basic.prototype);
Idiot.prototype.constructor = Idiot;

Idiot.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].classList.add('_roleInfo_idiot');
};
module.exports = Idiot;
