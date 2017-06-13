"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var NightComing = function (phaseManager) {
    Basic.call(this);
    this.data = DATA;
};
NightComing.prototype = Object.create(Basic);
NightComing.prototype.constructor = NightComing;

module.exports = NightComing;