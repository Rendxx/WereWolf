"use strict";

var Basic= require('../Role.Basic/Client.js');
var Util = require('SRC/Util.js');
var ROLEDATA = require('./Data.js');
var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
var INFO2 = require('./Info.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
var Action = {
    PlayerList : require('CLIENT/content/Action/Action.PlayerList.js'),
    SinglePlayer : require('CLIENT/content/Action/Action.SinglePlayer.js')
};

require('./Client.less');

var Witch = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
    this.potion = [1, 1];
};
Witch.prototype = Object.create(Basic.prototype);
Witch.prototype.constructor = Witch;

Witch.prototype.active = function (aliveListArr, dat){
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
    let canHeal = Number(dat[0]),
        victim = Number(dat[1]);


    this._action.components['potionGood'].update(dat[0]);
    this._action.components['potionBad'].update(aliveListArr);
};

Witch.prototype._showPotionGood = function (aliveListArr, canHeal, victim){
    if (this.potion[0]===0){
        this._action.components['potionGood'].update({
            className: 'action_singlePlayer_witch_noPotion',
            content: 'You don\'t have potion to heal.',
            isAvailable: false,
            isOk: function (){
                this._showPotionBad(aliveListArr, true, false);
            }.bind(this)
        });
    } else if (canHeal===0){
        let p = this._playerInfo[victim];
        this._action.components['potionGood'].update({
            className: 'action_singlePlayer_witch_cantHeal',
            content: 'You can not heal this player.',
            number: p[0],
            name: p[1],
            isAvailable: false,
            isOk: function (){
                this._showPotionBad(aliveListArr, true, false);
            }.bind(this)
        });
    } else{
        let p = this._playerInfo[victim];
        this._action.components['potionGood'].update({
            className: 'action_singlePlayer_witch_heal',
            content: 'Do you want to heal this victim with your healing potion?',
            number: p[0],
            name: p[1],
            isAvailable: true,
            isYes: function (){
                this._showPotionBad(aliveListArr, false, true);
            }.bind(this),
            isNo: function (){
                this._showPotionBad(aliveListArr, true, false);
            }.bind(this)
        });
    }
};

Witch.prototype._showPotionGood = function (aliveListArr, canPoison, isHealed){
    if (!canPoison){
        this._action.components['potionBad'].update({
            className: 'action_singlePlayer_witch_cantPoison',
            content: 'You have already used a potion tonight.',
            aliveListArr: aliveListArr,
            isAvailable: false
        });
    } else if (this.potion[1]===0){
        this._action.components['potionBad'].update({
            className: 'action_singlePlayer_witch_noPoison',
            content: 'You don\'t have potion to poison.',
            aliveListArr: aliveListArr,
            isAvailable: false
        });
    } else{
        this._action.components['potionBad'].update({
            className: 'action_singlePlayer_witch_poison',
            content: 'You can poison a player with your potion. Choose one from the list or select "cancel" to do nothing.',
            aliveListArr: aliveListArr,
            isAvailable: true
        });
    }
};


Witch.prototype.actionResult = function (dat){
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
    this.potion = [dat[0], dat[1]];
    this._html['potion'][0].innerHTML = 'x '+this.potion[0];
    this._html['potion'][1].innerHTML = 'x '+this.potion[1];
};

Witch.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    let potionWrap = Util.CreateDom('<div class="_potionWrap"></div>', this._html['wrap']);
    let potion = [];
    potion[0] = Util.CreateDom('<div class="_potion _potionGood"></div>', potionWrap);
    potion[1] = Util.CreateDom('<div class="_potion _potionBad"></div>', potionWrap);
    this._html['potionWrap'] = potionWrap;
    this._html['potion'] = potion;
};

Witch.prototype.initActionPanel = function (actionPanel, playerInfo){
    Basic.prototype.initActionPanel.call(this,actionPanel, playerInfo);
    let potionGood = new Action.SinglePlayer();
    let potionBad = new Action.PlayerList(this.playerIdx, playerInfo, 'Choose your target');
    potionBad.onSelect = function (idx, number, name){
        if (!this.actived) return;
        this.onActionEnd && this.onActionEnd([idx]);
    }.bind(this);
    potionBad.onAbstain = function (){
        if (!this.actived) return;
        this.onActionEnd && this.onActionEnd([-1]);
    }.bind(this);
    this._action.reset({
        'potionGood': potionGood,
        'potionBad': potionBad
    });
};

module.exports = Witch;