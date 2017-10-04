"use strict";

var Basic = require('../Character.Basic/Host.js');

var Knight = function(characterManager, phaseManager) {
  Basic.call(this, characterManager, phaseManager);
};
Knight.prototype = Object.create(Basic.prototype);
Knight.prototype.constructor = Knight;
Knight.DATA = require('./Data.js');

module.exports = Knight;
