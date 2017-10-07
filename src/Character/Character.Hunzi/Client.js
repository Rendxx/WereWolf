"use strict";

var Basic = require('../Character.Basic/Client.js');
var Util = require('SRC/Util.js');
var ROLEDATA = require('./Data.js');
var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
var INFO2 = require('./Info.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
var Action = {
  PlayerList: require('CLIENT/content/Action/Action.PlayerList.js')
};

require('./Client.less');
require('./Action.less');

var Hunzi = function() {
  Basic.call(this);
  this.code = ROLEDATA.Code;
  this.name = ROLEDATA.Name;
  this.description = ROLEDATA.Description;
  this.instruction = ROLEDATA.Instruction;
  this.dad = null;
};
Hunzi.prototype = Object.create(Basic.prototype);
Hunzi.prototype.constructor = Hunzi;

Hunzi.prototype.active = function(aliveListArr, dat) {
  if (!this.alive) return;
  if (!this.actived) {
    this._actionStamp = dat[0];
    this.actived = true;
    InfoBox.phase({
      title: 'Hunzi',
      content: 'Find your dad :)',
      className: 'info_client_phase_hunzi'
    });
    this._action.show();
    this._action.components['playerList'].reset({
      playerAlive: aliveListArr,
      isAvailable: true,
      className: 'action_playerList_hunzi',
      content: 'Find your dad :)'
    });
    this._action.components['playerList'].show();
  }
  this._action.components['playerList'].update();
};

Hunzi.prototype.actionResult = function(dat) {
  this.inactive();
  let p = this._playerInfo[dat[0]];
  InfoBox.actionResult({
    content: 'This player is your dad :) You are on the same side!',
    number: p.number,
    name: p.name,
    className: 'info_client_result_hunzi',
    callback: function() {
      this._action.hide();
    }.bind(this)
  });
};

Hunzi.prototype.update = function(aliveListArr, dat) {
  Basic.prototype.update.call(this, aliveListArr, dat);
  this.dad = dat[0];
  if (this.dad === -1) {
    this._html['contentWrap'].innerHTML = "";
  } else {
    let p = this._playerInfo[dat[0]];
    this._html['contentWrap'].innerHTML = "You dad is: <br/><b>[" + p.number + "] " + p.name + "</b>";
  }
};

Hunzi.prototype.initInfoPanel = function(container) {
  Basic.prototype.initInfoPanel.call(this, container);
  this._html['wrap'].classList.add('_roleInfo_hunzi');
  let contentWrap = Util.CreateDom('<div style="margin-top:10px"></div>', this._html['wrap']);
  this._html['contentWrap'] = contentWrap;
};

Hunzi.prototype.initActionPanel = function(actionPanel, playerInfo) {
  Basic.prototype.initActionPanel.call(this, actionPanel, playerInfo);
  let playerList = new Action.PlayerList(this.playerIdx, playerInfo, 'Choose your dad');
  let that = this;
  playerList.onSelect = function(idx, number, name) {
    if (!that.actived) return;
    if (that.playerIdx === idx) {
      InfoBox.alert({
        content: 'You need to find someone else (not yourself).'
      });
    } else {
      InfoBox.check({
        content: 'Do you want to call <br/><b>[' + number + '] ' + name + '</b><br/>"DAD~"?',
        callbackYes: function() {
          this._action.hide();
          that.onActionEnd && that.onActionEnd([this._actionStamp, idx]);
        }.bind(that)
      });
    }
  };
  playerList.onAbstain = function() {
    if (!that.actived) return;
    InfoBox.alert({
      content: 'You have to find your dad!'
    });
  };
  this._action.reset({
    'playerList': playerList
  });
};

module.exports = Hunzi;
