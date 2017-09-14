"use strict";

var Basic= require('../Role.Basic/Host.js');

var Elder = function () {
    Basic.call(this);
};
Elder.prototype = Object.create(Basic.prototype);
Elder.prototype.constructor = Elder;
Elder.DATA = require('./Data.js');

module.exports = Elder;
