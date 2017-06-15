"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var Idiot = function (dataPkg) {
    Basic.call(this, dataPkg);
    this.data = DATA;
};
Idiot.prototype = Object.create(Basic);
Idiot.prototype.constructor = Idiot;

module.exports = Idiot;