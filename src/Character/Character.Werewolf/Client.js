"use strict";

var Basic = require('../Character.Basic/Client.js');
var Util = require('SRC/Util.js');
var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
var INFO2 = require('./Info.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
var Action = {
  PlayerList: require('CLIENT/content/Action/Action.PlayerList.js')
};

require('./Client.less');
require('./Action.less');

var Werewolf = function() {
  Basic.call(this);
};
Werewolf.prototype = Object.create(Basic.prototype);
Werewolf.prototype.constructor = Werewolf;
Werewolf.DATA = require('./Data.js');

Werewolf.prototype.active = function(aliveListArr, dat) {
  if (!this.alive) return;
  this._actionStamp = dat[0];
  let actionDat = {
    werewolf: dat[1],
    vote: dat[2]
  };
  if (!this.actived) {
    this.actived = true;
    InfoBox.phase({
      title: 'Werewolf',
      content: 'Choose the victim with your companions.',
      className: 'info_client_phase_werewolf'
    });
    this._action.show();
    this._action.components['playerList'].reset({
      playerAlive: aliveListArr,
      isAvailable: true,
      className: 'action_playerList_werewolf',
      content: 'Choose a victim. The player will be attacked after all werewolf choosing the same target.'
    });
    this._action.components['playerList'].show();
  }
  this._action.components['playerList'].update(actionDat);
};

Werewolf.prototype.actionResult = function(dat) {
  this.inactive();
  if (dat[0] == -1) {
    InfoBox.actionResult({
      content: 'You did not murder anyone this night',
      className: 'info_client_result_werewolf_hideNumber',
      callback: function() {
        this._action.hide();
      }.bind(this)
    });
  } else {
    let p = this._playerInfo[dat[0]];
    InfoBox.actionResult({
      content: 'This player has been murdered',
      number: p.number,
      name: p.name,
      className: 'info_client_result_werewolf',
      callback: function() {
        this._action.hide();
      }.bind(this)
    });
  }
};

Werewolf.prototype.initInfoPanel = function(container) {
  Basic.prototype.initInfoPanel.call(this, container);
  this._html['wrap'].classList.add('_roleInfo_werewolf');
};

Werewolf.prototype.initActionPanel = function(actionPanel, playerInfo) {
  Basic.prototype.initActionPanel.call(this, actionPanel, playerInfo);
  let playerList = new Action.PlayerList(this.playerIdx, playerInfo, 'Choose your target');
  let that = this;
  playerList.onSelect = function(idx, number, name) {
    if (!that.actived) return;
    InfoBox.check({
      content: 'Do you want to kill <br/><b>[' + number + '] ' + name + '</b>?',
      callbackYes: function() {
        this._action.hide();
        that.onActionEnd && that.onActionEnd([this._actionStamp, idx]);
      }.bind(that)
    });
  };
  playerList.onAbstain = function() {
    if (!that.actived) return;
    InfoBox.check({
      content: 'Do you want to skip this turn?',
      callbackYes: function() {
        this._action.hide();
        that.onActionEnd && that.onActionEnd([this._actionStamp, -1]);
      }.bind(that)
    });
  };
  this._action.reset({
    'playerList': playerList
  });
};

module.exports = Werewolf;
