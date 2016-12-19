var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
require('CLIENT/less/Role/Role.Basic.less');

var Basic = function () {
    this.code = ROLECODE.NONE;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this.onActionEnd = null;
    this._html = {};
    this.status = {};
    this.alive = true;
};
Basic.prototype = Object.create(null);
Basic.prototype.constructor = Basic;

Basic.prototype.actived = function (dat, onDecision){

};

Basic.prototype.update = function (dat){
};

Basic.prototype.die = function (){
    this.alive = false;
};

Basic.prototype.initInfoPanel = function (container){
    var container = $(container);
    this._html['wrap'] = $('<div class="_roleInfo"></div>').appendTo(container);
    this._html['icon'] = $('<div class="_icon"></div>').appendTo(this._html['wrap']);
    this._html['name'] = $('<div class="_name"></div>').text('{ '+this.name+' }').appendTo(this._html['wrap']);
};

module.exports = Basic;
