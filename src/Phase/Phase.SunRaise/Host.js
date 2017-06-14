"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var SunRaise = function (phaseManager) {
    Basic.call(this);
    this.data = DATA;
};
SunRaise.prototype = Object.create(Basic);
SunRaise.prototype.constructor = SunRaise;

module.exports = SunRaise;