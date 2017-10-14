"use strict";

var Basic = require('../Character.Basic/Client.js');
var Util = require('SRC/Util.js');
var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
var INFO2 = require('./Info.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
var Action = {
  PlayerList: require('CLIENT/content/Action/Action.PlayerList.js'),
  SinglePlayer: require('CLIENT/content/Action/Action.SinglePlayer.js')
};

require('./Client.less');
require('./Action.less');

var Witch = function() {
  Basic.call(this);
  this.potion = [1, 1];
};
Witch.prototype = Object.create(Basic.prototype);
Witch.prototype.constructor = Witch;
Witch.DATA = require('./Data.js');

Witch.prototype.active = function(aliveListArr, dat) {
  if (!this.alive) return;
  if (!this.actived) {
    this.actived = true;
    InfoBox.phase({
      title: 'Witch',
      content: 'Heal a player or eliminate one instead.',
      className: 'info_client_phase_witch'
    });
    this._action.show();
    //this._action.components['playerList'].show();
  }
  this._actionStamp = dat[0];
  let canHeal = Number(dat[1]),
    victim = Number(dat[2]);

  this._showPotionGood(aliveListArr, canHeal, victim);
};

Witch.prototype._showPotionGood = function(aliveListArr, canHeal, victim) {
  if (this.potion[0] === 0) {
    this._action.components['potionGood'].update({
      className: 'action_singlePlayer_witch_noPotion',
      content: 'You don\'t have potion to heal.',
      isAvailable: false,
      onOk: function() {
        this._showPotionBad(aliveListArr, true, false);
      }.bind(this)
    });
  } else if (victim === -1) {
    this._action.components['potionGood'].update({
      className: 'action_singlePlayer_witch_cantHeal',
      content: 'No player was killed.',
      isAvailable: false,
      onOk: function() {
        this._showPotionBad(aliveListArr, true, false);
      }.bind(this)
    });
  } else if (canHeal === 0) {
    let p = this._playerInfo[victim];
    this._action.components['potionGood'].update({
      className: 'action_singlePlayer_witch_cantHeal',
      content: 'You can not heal this player.',
      number: p.number,
      name: p.name,
      isAvailable: false,
      onOk: function() {
        this._showPotionBad(aliveListArr, true, false);
      }.bind(this)
    });
  } else {
    let p = this._playerInfo[victim];
    this._action.components['potionGood'].update({
      className: 'action_singlePlayer_witch_heal',
      content: 'Do you want to heal this victim with your healing character?',
      number: p.number,
      name: p.name,
      isAvailable: true,
      onYes: function() {
        this._action.hide();
        this.onActionEnd && this.onActionEnd([this._actionStamp, victim, -1]);
      }.bind(this),
      onNo: function() {
        this._showPotionBad(aliveListArr, true, false);
      }.bind(this)
    });
  }
  this._action.components['potionGood'].show();
};

Witch.prototype._showPotionBad = function(aliveListArr, canPoison, isHealed) {
  this._action.components['potionGood'].hide();
  if (!canPoison) {
    this._action.components['potionBad'].reset({
      className: 'action_singlePlayer_witch_cantPoison',
      content: 'You have already used a character tonight.',
      playerAlive: aliveListArr,
      isAvailable: false
    });
  } else if (this.potion[1] === 0) {
    this._action.components['potionBad'].reset({
      className: 'action_singlePlayer_witch_noPoison',
      content: 'You don\'t have potion to poison.',
      playerAlive: aliveListArr,
      isAvailable: false
    });
  } else {
    this._action.components['potionBad'].reset({
      className: 'action_singlePlayer_witch_poison',
      content: 'You can poison a player with your character. Choose one from the list or select "cancel" to do nothing.',
      playerAlive: aliveListArr,
      isAvailable: true
    });
  }
  this._action.components['potionBad'].update();
  this._action.components['potionBad'].show();
};

Witch.prototype.actionResult = function(dat) {
  this.inactive();
  if (dat[0] != -1) {
    let p = this._playerInfo[dat[0]];
    InfoBox.actionResult({
      content: 'This player has been healed',
      number: p.number,
      name: p.name,
      className: 'info_client_result_witch_healed',
      callback: function() {
        this._action.hide();
      }.bind(this)
    });
  } else if (dat[1] != -1) {
    let p = this._playerInfo[dat[1]];
    InfoBox.actionResult({
      content: 'This player has been poisoned',
      number: p.number,
      name: p.name,
      className: 'info_client_result_witch_poisoned',
      callback: function() {
        this._action.hide();
      }.bind(this)
    });
  } else {
    InfoBox.actionResult({
      content: 'You did nothing this night',
      className: 'info_client_result_witch_hideNumber',
      callback: function() {
        this._action.hide();
      }.bind(this)
    });
  }
};

Witch.prototype.update = function(aliveListArr, dat) {
  Basic.prototype.update.call(this, aliveListArr, dat);
  this.potion = [dat[0], dat[1]];
  this._html['potion'][0].innerHTML = this.potion[0];
  this._html['potion'][1].innerHTML = this.potion[1];
};

Witch.prototype.initInfoPanel = function(container) {
  Basic.prototype.initInfoPanel.call(this, container);
  this._html['wrap'].classList.add('_roleInfo_witch');
  let potionWrap = Util.CreateDom('<div class="_potionWrap"></div>', this._html['wrap']);
  let potion = [];
  potion[0] = Util.CreateDom('<div class="_potion _potionGood"></div>', potionWrap);
  potion[1] = Util.CreateDom('<div class="_potion _potionBad"></div>', potionWrap);
  this._html['potionWrap'] = potionWrap;
  this._html['potion'] = potion;
};

Witch.prototype.initActionPanel = function(actionPanel, playerInfo) {
  Basic.prototype.initActionPanel.call(this, actionPanel, playerInfo);
  let potionGood = new Action.SinglePlayer();
  let potionBad = new Action.PlayerList(this.playerIdx, playerInfo, 'Choose your target');
  potionBad.onSelect = function(idx, number, name) {
    if (!this.actived) return;
    InfoBox.check({
      content: 'Do you want to poison <br/><b>[' + number + '] ' + name + '</b>?',
      callbackYes: function() {
        this._action.hide();
        this.onActionEnd && this.onActionEnd([this._actionStamp, -1, idx]);
      }.bind(this)
    });
  }.bind(this);
  potionBad.onAbstain = function() {
    if (!this.actived) return;
    InfoBox.check({
      content: 'Do you want to skip poisoning?',
      callbackYes: function() {
        this._action.hide();
        this.onActionEnd && this.onActionEnd([this._actionStamp, -1, -1]);
      }.bind(this)
    });
  }.bind(this);
  this._action.reset({
    'potionGood': potionGood,
    'potionBad': potionBad
  });
};

module.exports = Witch;
