"use strict";

var Basic= require('../Character.Basic/Client.js');

var Knight = function () {
    Basic.call(this);
};
Knight.prototype = Object.create(Basic.prototype);
Knight.prototype.constructor = Knight;
Knight.DATA = require('./Data.js');

Knight.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].classList.add('_roleInfo_knight');
};
module.exports = Knight;
