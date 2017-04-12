"use strict";

var Util = require('SRC/Util.js');
var ROLEDATA = require('./Data.js');
var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');

var Basic= require('./Panel.Basic.js');
require('./Client.less');

var WereWolf = function () {
    Basic.call(this);
    this._html.action = {
        playerList :new Action.PlayerList()
    };
};
WereWolf.prototype = Object.create(Basic.prototype);
WereWolf.prototype.constructor = WereWolf;

WereWolf.prototype.active = function (dat){
    if (!this.alive) return;
    if (!this.actived){
        this.actived = true;
        InfoBox.alert({
            content: INFO.WEREWOLF,
        });
        this._action.playerList.show();
    }
    this._action.playerList.update(aliveListArr, voteArr);
};

WereWolf.prototype.inactive = function (){
    this.actived = false;
};

WereWolf.prototype.update = function (aliveListArr, dat){
    var t = aliveListArr[this.playerIdx]==='1';
    if (t===false && this.alive){
        InfoBox.alert({
            content: INFO.DAED,
        });
    }
    this.alive = t;
    this.updateInfoPanel();
    this.updateActionPanel();
};

WereWolf.prototype.showRst = function (dat){
};

WereWolf.prototype.initInfoPanel = function (container){
    let wrap = Util.CreateDom('<div class="_roleInfo"></div>', container);
    let icon = Util.CreateDom('<div class="_icon"></div>', wrap);
    let name = Util.CreateDom('<div class="_name">{ '+this.name+' }</div>', wrap);
    let instruction = Util.CreateDom('<div class="_instruction">'+this.instruction+'</div>', wrap);

    this._html.info['wrap'] = wrap;
    this._html.info['icon'] = icon;
    this._html.info['name'] = name;
    this._html.info['instruction'] = instruction;
};

WereWolf.prototype.updateInfoPanel = function (container){
};

WereWolf.prototype.initActionPanel = function (container){
};

WereWolf.prototype.updateActionPanel = function (container){
};

WereWolf.prototype.dispose=function(){
};

module.exports = WereWolf;
