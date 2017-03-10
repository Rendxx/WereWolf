var ROLECODE = require('GLOBAL/content/RoleCode.js');
var ROLEDATA = require('GLOBAL/content/RoleData.js');
var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
require('./Role.Basic.less');

var Basic = function () {
    this.code = ROLECODE.NONE;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this.playerIdx = -1;
    this.onActionEnd = null;
    this._html = {
        info:{},
        action:{}
    };
    this.status = {};
    this.alive = true;
    this.actived = false;
};
Basic.prototype = Object.create(null);
Basic.prototype.constructor = Basic;

Basic.prototype.setup = function (playerIdx){
    this.playerIdx = playerIdx;
};

Basic.prototype.dayTime = function (dat){
    if (this.alive){
        InfoBox.alert({
            content: INFO.DAY,
        });
    }
    this.inactive();
};

Basic.prototype.active = function (dat){
    this.actived = true;
};

Basic.prototype.inactive = function (){
    this.actived = false;
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

Basic.prototype.showRst = function (dat){
};

Basic.prototype.initInfoPanel = function (container){
    var container = $(container);
    this._html.info['wrap'] = $('<div class="_roleInfo"></div>').appendTo(container);
    this._html.info['icon'] = $('<div class="_icon"></div>').appendTo(this._html.info['wrap']);
    this._html.info['name'] = $('<div class="_name"></div>').text('{ '+this.name+' }').appendTo(this._html.info['wrap']);
};

Basic.prototype.initActionPanel = function (container){
};

Basic.prototype.dispose=function(){

};

module.exports = Basic;
