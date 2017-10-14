"use strict";

var Basic= require('../Character.Basic/Client.js');

var Villager = function () {
    Basic.call(this);
};
Villager.prototype = Object.create(Basic.prototype);
Villager.prototype.constructor = Villager;
Villager.DATA = require('./Data.js');

Villager.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].classList.add('_roleInfo_villager');
};
module.exports = Villager;
