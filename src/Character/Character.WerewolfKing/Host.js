"use strict";

var Werewolf = require('../Character.Werewolf/Host.js');

var WerewolfKing = function(characterManager, phaseManager) {
  Werewolf.call(this, characterManager, phaseManager);
};
WerewolfKing.prototype = Object.create(Werewolf.prototype);
WerewolfKing.prototype.constructor = WerewolfKing;
WerewolfKing.DATA = require('./Data.js');

module.exports = WerewolfKing;
