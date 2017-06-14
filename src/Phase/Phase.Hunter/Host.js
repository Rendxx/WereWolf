"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var Hunter = function (phaseManager) {
    Basic.call(this);
    this.data = DATA;
};
Hunter.prototype = Object.create(Basic);
Hunter.prototype.constructor = Hunter;

module.exports = Hunter;