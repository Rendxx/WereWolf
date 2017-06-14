"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var Day = function (phaseManager) {
    Basic.call(this);
    this.data = DATA;
};
Day.prototype = Object.create(Basic);
Day.prototype.constructor = Day;

module.exports = Day;