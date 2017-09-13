"use strict";

var Basic= require('../Role.Basic/Host.js');
var ROLEDATA = require('./Data.js');

var Elder = function () {
    Basic.call(this);
    this._setData(ROLEDATA);
};
Elder.prototype = Object.create(Basic.prototype);
Elder.prototype.constructor = Elder;

module.exports = Elder;
