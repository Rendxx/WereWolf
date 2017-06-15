"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var Villager = function (dataPkg) {
    Basic.call(this, dataPkg);
    this.data = DATA;
};
Villager.prototype = Object.create(Basic);
Villager.prototype.constructor = Villager;

module.exports = Villager;