"use strict";

var Util = require('SRC/Util.js');
var ROLEDATA = require('./Data.js');
var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
require('./Client.less');

var Basic = function () {
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
    this.playerIdx = -1;
    this.onActionEnd = null;
    this._html = {
    };
    this._action = null;
    this.status = {};
    this.alive = true;
    this.actived = false;
};
Basic.prototype = Object.create(null);
Basic.prototype.constructor = Basic;

Basic.prototype.setup = function (playerIdx){
    this.playerIdx = playerIdx;
};

Basic.prototype.dayTime = function (){
    if (this.alive){
        InfoBox.alert({
            content: INFO.DAY,
        });
    }
    this.inactive();
};

Basic.prototype.active = function (aliveListArr, dat){
    this.actived = true;
};

Basic.prototype.inactive = function (){
    this.actived = false;
    this._action.hide();
    InfoBox.hide();
};

Basic.prototype.update = function (aliveListArr, dat){
    var t = aliveListArr[this.playerIdx]==='1';
    if (t===false && this.alive){
        InfoBox.alert({
            content: INFO.DAED,
        });
    }
    this.alive = t;
};

Basic.prototype.actionResult = function (dat){
};

Basic.prototype.initInfoPanel = function (container){
    let wrap = Util.CreateDom('<div class="_roleInfo"></div>', container);
    let icon = Util.CreateDom('<div class="_icon"></div>', wrap);
    let name = Util.CreateDom('<div class="_name">{ '+this.name+' }</div>', wrap);
    let instruction = Util.CreateDom('<div class="_instruction">'+this.instruction+'</div>', wrap);

    this._html['wrap'] = wrap;
    this._html['icon'] = icon;
    this._html['name'] = name;
    this._html['instruction'] = instruction;
};

Basic.prototype.initActionPanel = function (actionPanel, playerInfo){
    this._action = actionPanel;
};

Basic.prototype.dispose=function(){
}; 

module.exports = Basic;
