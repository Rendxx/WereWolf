"use strict";

var Basic = require('../Role.Basic/Host.js');

var Elder = function(characterManager, phaseManager) {
  Basic.call(this, characterManager, phaseManager);
};
Elder.prototype = Object.create(Basic.prototype);
Elder.prototype.constructor = Elder;
Elder.DATA = require('./Data.js');

module.exports = Elder;
