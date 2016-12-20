var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var INFO = require('CLIENT/js/Info.js');
var InfoBox = require('CLIENT/js/InfoBox.js');
require('CLIENT/less/Role/Role.Basic.less');

var Basic = function () {
    this.code = ROLECODE.NONE;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
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

Basic.prototype.dayTime = function (dat){
    InfoBox.alert({
        content: INFO.DAY,
    });
};

Basic.prototype.active = function (dat){
    this.actived = true;
};

Basic.prototype.inactive = function (){
    this.actived = false;
};

Basic.prototype.update = function (dat){
};

Basic.prototype.die = function (){
    this.alive = false;
};

Basic.prototype.initInfoPanel = function (container){
    var container = $(container);
    this._html.info['wrap'] = $('<div class="_roleInfo"></div>').appendTo(container);
    this._html.info['icon'] = $('<div class="_icon"></div>').appendTo(this._html.info['wrap']);
    this._html.info['name'] = $('<div class="_name"></div>').text('{ '+this.name+' }').appendTo(this._html.info['wrap']);
};

Basic.prototype.initActionPanel = function (container){
};

module.exports = Basic;
