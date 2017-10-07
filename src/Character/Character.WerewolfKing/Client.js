"use strict";

var Werewolf = require('../Character.Werewolf/Client.js');
var ROLEDATA = require('./Data.js');

require('./Client.less');

var WerewolfKing = function() {
  Werewolf.call(this);
  this.code = ROLEDATA.Code;
  this.name = ROLEDATA.Name;
  this.description = ROLEDATA.Description;
  this.instruction = ROLEDATA.Instruction;
};
WerewolfKing.prototype = Object.create(Werewolf.prototype);
WerewolfKing.prototype.constructor = WerewolfKing;

WerewolfKing.prototype.initInfoPanel = function(container) {
  Werewolf.prototype.initInfoPanel.call(this, container);
  this._html['wrap'].classList.add('_roleInfo_werewolfKing');
};
module.exports = WerewolfKing;
