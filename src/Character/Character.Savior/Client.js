 "use strict";

 var Basic = require('../Character.Basic/Client.js');
 var Util = require('SRC/Util.js');
 var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
 var INFO2 = require('./Info.js');
 var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
 var Action = {
   PlayerList: require('CLIENT/content/Action/Action.PlayerList.js')
 };

 require('./Action.less');

 var Savior = function() {
   Basic.call(this);
   this.lastProtectIdx = -1;
 };
 Savior.prototype = Object.create(Basic.prototype);
 Savior.prototype.constructor = Savior;
 Savior.DATA = require('./Data.js');

 Savior.prototype.update = function(aliveListArr, dat) {
   Basic.prototype.update.call(this, aliveListArr, dat);
   this.lastProtectIdx = dat[0];
 };

 Savior.prototype.active = function(aliveListArr, dat) {
   if (!this.alive) return;
   this._actionStamp = dat[0];
   if (!this.actived) {
     this.actived = true;
     InfoBox.phase({
       title: 'Savior',
       content: 'Choose the player you want to protect.',
       className: 'info_client_phase_savior'
     });
     this._action.show();
     this._action.components['playerList'].reset({
       playerAlive: aliveListArr,
       isAvailable: true,
       className: 'action_playerList_savior',
       content: 'Choose a player. The player will be protected from werewolf. However the player will die if being save by Witch'
     });
     this._action.components['playerList'].show();
   }
   this._action.components['playerList'].update();
 };

 Savior.prototype.actionResult = function(dat) {
   this.inactive();
   if (dat[0] == -1) {
     InfoBox.actionResult({
       content: 'You did not protect anyone this night',
       className: 'info_client_result_savior_hideNumber',
       callback: function() {
         this._action.hide();
       }.bind(this)
     });
   } else {
     let p = this._playerInfo[dat[0]];
     InfoBox.actionResult({
       content: 'This player has been protected',
       number: p.number,
       name: p.name,
       className: 'info_client_result_savior',
       callback: function() {
         this._action.hide();
       }.bind(this)
     });
   }
 };

 Savior.prototype.update = function(aliveListArr, dat) {
   Basic.prototype.update.call(this, aliveListArr, dat);
   this.lastProtectIdx = dat[0];
   if (this.lastProtectIdx === -1) {
     this._html['contentWrap'].innerHTML = "You did not protect anyone last night.";
   } else {
     let p = this._playerInfo[dat[0]];
     this._html['contentWrap'].innerHTML = "You protected:<br/><b>[" + p.number + "] " + p.name + "</b>";
   }
 };

 Savior.prototype.initInfoPanel = function(container) {
   Basic.prototype.initInfoPanel.call(this, container);
   this._html['wrap'].classList.add('_roleInfo_savior');
   let contentWrap = Util.CreateDom('<div style="margin-top:10px"></div>', this._html['wrap']);
   this._html['contentWrap'] = contentWrap;
 };

 Savior.prototype.initActionPanel = function(actionPanel, playerInfo) {
   Basic.prototype.initActionPanel.call(this, actionPanel, playerInfo);
   let playerList = new Action.PlayerList(this.playerIdx, playerInfo, 'Choose your target');
   let that = this;
   playerList.onSelect = function(idx, number, name) {
     if (!that.actived) return;
     if (that.lastProtectIdx === idx) {
       InfoBox.alert({
         content: 'You can not protect <br/><b>[' + number + '] ' + name + '</b> in this night.'
       });
     } else {
       InfoBox.check({
         content: 'Do you want to protect <br/><b>[' + number + '] ' + name + '</b>?',
         callbackYes: function() {
           this._action.hide();
           that.onActionEnd && that.onActionEnd([this._actionStamp, idx]);
         }.bind(that)
       });
     }
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

 module.exports = Savior;
