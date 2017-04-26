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
        InfoBox.alert2({
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
        InfoBox.alert({
            content: 'You did not murder anyone this night',
            callback: function() {
              this._html.action['container'].fadeOut(200);
            }.bind(this)
        });
    } else {
        var p = this._playerInfo[dat[0]];
        InfoBox.alert({
            content: INFO.SHOWPLAYER(p[0], p[1],'This player has been murdered'),
            callback: function() {
              this._html.action['container'].fadeOut(200);
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
        InfoBox.check({
            content: INFO.SHOWPLAYER(number, name),
            callbackYes: function() {
                that.onActionEnd && that.onActionEnd([idx]);
            }
        });
    };
    playerList.onAbstain = function (){
        if (!that.actived) return;
        InfoBox.check({
            content: 'Are you sure you want to do nothing?<br/>Noobdy will be murdered in this case.',
            callbackYes: function() {
                that.onActionEnd && that.onActionEnd([-1]);
            }
        });
    };
    this._action.reset({
        'playerList': playerList
    });
};

module.exports = Werewolf;
