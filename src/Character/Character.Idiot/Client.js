"use strict";

var Basic= require('../Character.Basic/Client.js');

var Idiot = function () {
    Basic.call(this);
};
Idiot.prototype = Object.create(Basic.prototype);
Idiot.prototype.constructor = Idiot;
Idiot.DATA = require('./Data.js');

Idiot.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].classList.add('_roleInfo_idiot');
};
module.exports = Idiot;
