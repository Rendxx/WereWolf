"use strict";

var Basic= require('../Role.Basic/Client.js');
var Util = require('SRC/Util.js');
var ROLEDATA = require('./Data.js');
var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
var INFO2 = require('./Info.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
var Action = {
    PlayerList : require('CLIENT/content/Action/Action.PlayerList.js')
};

require('./Client.less');
require('./Action.less');

var Seer = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
};
Seer.prototype = Object.create(Basic.prototype);
Seer.prototype.constructor = Seer;

Seer.prototype.active = function (aliveListArr, dat){
    if (!this.alive) return;
    let actionDat = {
        werewolf: dat[0],
        vote: dat[1]
    };
    if (!this.actived){
        this.actived = true;
        InfoBox.phase({
            title: 'Seer',
            content: 'Expose the real role of the werewolvies.',
            className: 'info_client_phase_seer'
        });
        this._action.show();
        this._action.components['playerList'].reset({
            playerAlive: aliveListArr,
            isAvailable: true,
            className: 'action_playerList_seer',
            content: 'Choose a player to see whether this one is a werewolf or not.'
        });
        this._action.components['playerList'].show();
    }
    this._action.components['playerList'].update(actionDat);
};

Seer.prototype.actionResult = function (dat){
    this.inactive();
    if (dat[0]==-1){
        InfoBox.actionResult({
            content: 'You did not see anyone',
            className: 'info_client_result_seer_hideNumber',
            callback: function() {
                this._action.hide();
            }.bind(this)
        });
    } else {
        let p = this._playerInfo[dat[0]],
            isGood = dat[1]==0;
        InfoBox.actionResult({
            content: 'This player is '+(isGood?'NOT ':'')+'a werewolf',
            number: p[0],
            name: p[1],
            className: isGood?'info_client_result_seer_good':'info_client_result_seer_bad',
            callback: function() {
                this._action.hide();
            }.bind(this)
        });
    }
};

Seer.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].classList.add('_roleInfo_seer');
};

Seer.prototype.initActionPanel = function (actionPanel, playerInfo){
    Basic.prototype.initActionPanel.call(this,actionPanel, playerInfo);
    let playerList = new Action.PlayerList(this.playerIdx, playerInfo, 'Choose your target');
    let that = this;
    playerList.onSelect = function (idx, number, name){
        if (!that.actived) return;
        InfoBox.check({
            content: 'Do you want to check <br/><b>['+number+'] '+name+'</b>?',
            callbackYes: function (){
                that.onActionEnd && that.onActionEnd([idx]);
            }
        });
    };
    playerList.onAbstain = function (){
        if (!that.actived) return;
        InfoBox.check({
            content: 'Do you want to skip this turn?',
            callbackYes: function (){
                that.onActionEnd && that.onActionEnd([-1]);
            }
        });
    };
    this._action.reset({
        'playerList': playerList
    });
};

module.exports = Seer;
