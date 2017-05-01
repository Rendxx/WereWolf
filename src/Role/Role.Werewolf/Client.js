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

var Werewolf = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
};
Werewolf.prototype = Object.create(Basic.prototype);
Werewolf.prototype.constructor = Werewolf;

Werewolf.prototype.active = function (aliveListArr, voteArr){
    if (!this.alive) return;
    if (!this.actived){
        this.actived = true;
        InfoBox.phase({
            title: 'Werewolf',
            content: 'Choose the victim with your companions.',
            className: 'info_client_phase_werewolf'
        });
        this._action.show();
        this._action.components['playerList'].show();
    }
    this._action.components['playerList'].update(aliveListArr, voteArr);
};

Werewolf.prototype.actionResult = function (dat){
    this.inactive();
    if (dat[0]==-1){
        InfoBox.actionResult({
            content: 'You did not murder anyone this night',
            className: 'info_client_result_werewolf_hideNumber',
            callback: function() {
                this._action.hide();
            }.bind(this)
        });
    } else {
        var p = this._action.components['playerList'].playerInfo[dat[0]];
        InfoBox.actionResult({
            content: 'This player has been murdered',
            number: p[0],
            name: p[1],
            className: 'info_client_result_werewolf',
            callback: function() {
                this._action.hide();
            }.bind(this)
        });
    }
};

Werewolf.prototype.initActionPanel = function (actionPanel, playerInfo){
    Basic.prototype.initActionPanel.call(this,actionPanel);
    let playerList = new Action.PlayerList(this.playerIdx, playerInfo, 'Choose your target');
    let that = this;
    playerList.onSelect = function (idx, number, name){
        if (!that.actived) return;
        that.onActionEnd && that.onActionEnd([idx]);
    };
    playerList.onAbstain = function (){
        if (!that.actived) return;
        that.onActionEnd && that.onActionEnd([-1]);
    };
    this._action.reset({
        'playerList': playerList
    });
};

module.exports = Werewolf;
