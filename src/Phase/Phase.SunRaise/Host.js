"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var SunRaise = function (dataPkg) {
    Basic.call(this, dataPkg);
    this.data = DATA;
};
SunRaise.prototype = Object.create(Basic);
SunRaise.prototype.constructor = SunRaise;

module.exports = SunRaise;