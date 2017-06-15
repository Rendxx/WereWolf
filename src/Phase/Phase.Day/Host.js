"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var Day = function (dataPkg) {
    Basic.call(this, dataPkg);
    this.data = DATA;
};
Day.prototype = Object.create(Basic);
Day.prototype.constructor = Day;

module.exports = Day;