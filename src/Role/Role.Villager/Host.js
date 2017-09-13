"use strict";

var Basic= require('../Role.Basic/Host.js');
var ROLEDATA = require('./Data.js');

var Villager = function () {
    Basic.call(this);
    this._setData(ROLEDATA);
};
Villager.prototype = Object.create(Basic.prototype);
Villager.prototype.constructor = Villager;

module.exports = Villager;
