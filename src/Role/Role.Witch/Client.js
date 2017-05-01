"use strict";

var Basic= require('../Role.Basic/Client.js');
var Util = require('SRC/Util.js');
var ROLEDATA = require('./Data.js');
var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
var INFO2 = require('./Info.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
var Action = {
    PlayerList : require('CLIENT/content/Action/Action.PlayerList.js'),
    Item : require('CLIENT/content/Action/Action.Item.js')
};

require('./Client.less');

var Witch = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
};
Witch.prototype = Object.create(Basic.prototype);
Witch.prototype.constructor = Witch;

Witch.prototype.active = function (aliveListArr, voteArr){
    if (!this.alive) return;
    if (!this.actived){
        this.actived = true;
        InfoBox.phase({
            title: 'Witch',
            content: 'Save a player with good potion. Or eliminate one with bad potion.',
            className: 'info_client_phase_witch'
        });
        this._action.show();
        //this._action.components['playerList'].show();
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

Witch.prototype.update = function (aliveListArr, dat){
    Basic.prototype.update.call(this,aliveListArr, dat);
    this._html['potion'][0].innerHTML = 'x '+dat[0];
    this._html['potion'][1].innerHTML = 'x '+dat[1];
    this._action.components['potionGood'].update(dat[0]);
    this._action.components['potionBad'].update(dat[1]);
};

Witch.prototype.initInfoPanel = function (container){
    Basic.prototype.initActionPanel.call(this,actionPanel);
    let potionWrap = Util.CreateDom('<div class="_potionWrap"></div>', this._html['wrap']);
    let potion = [];
    potion[0] = Util.CreateDom('<div class="_potion _potionGood"></div>', potionWrap);
    potion[1] = Util.CreateDom('<div class="_potion _potionBad"></div>', potionWrap);
    this._html['potionWrap'] = potionWrap;
    this._html['potion'] = potion;
};

Witch.prototype.initActionPanel = function (actionPanel, playerInfo){
    Basic.prototype.initActionPanel.call(this,actionPanel);
    let playerList = new Action.PlayerList(this.playerIdx, playerInfo, 'Choose your target');
    let potionGood = new Action.Item(this.playerIdx, playerInfo, 'Choose your target');
    let potionBad = new Action.Item(this.playerIdx, playerInfo, 'Choose your target');
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
