"use strict";

var Basic= require('../Role.Basic/Host.js');

var Villager = function () {
    Basic.call(this);
};
Villager.prototype = Object.create(Basic.prototype);
Villager.prototype.constructor = Villager;
Villager.DATA = require('./Data.js');

module.exports = Villager;
