"use strict";

var Basic= require('../Character.Basic/Client.js');

var Elder = function () {
    Basic.call(this);
};
Elder.prototype = Object.create(Basic.prototype);
Elder.prototype.constructor = Elder;
Elder.DATA = require('./Data.js');

Elder.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].classList.add('_roleInfo_elder');
};
module.exports = Elder;
