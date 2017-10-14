"use strict";

var Werewolf = require('../Character.Werewolf/Client.js');

var WerewolfKing = function() {
  Werewolf.call(this);
};
WerewolfKing.prototype = Object.create(Werewolf.prototype);
WerewolfKing.prototype.constructor = WerewolfKing;
WerewolfKing.DATA = require('./Data.js');

WerewolfKing.prototype.initInfoPanel = function(container) {
  Werewolf.prototype.initInfoPanel.call(this, container);
  this._html['wrap'].classList.add('_roleInfo_werewolfKing');
};
module.exports = WerewolfKing;
