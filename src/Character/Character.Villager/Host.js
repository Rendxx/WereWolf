"use strict";

var Basic = require('../Role.Basic/Host.js');

var Villager = function(characterManager, phaseManager) {
  Basic.call(this, characterManager, phaseManager);
};
Villager.prototype = Object.create(Basic.prototype);
Villager.prototype.constructor = Villager;
Villager.DATA = require('./Data.js');

module.exports = Villager;
