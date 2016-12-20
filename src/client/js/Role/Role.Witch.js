var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var Basic = require('./Role.Basic.js');
require('CLIENT/less/Role/Role.Witch.less');


var Witch = function () {
    Basic.call(this);
    this.code = ROLECODE.WITCH;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this.potion = [0, 0];
};
Witch.prototype = Object.create(Basic.prototype);
Witch.prototype.constructor = Basic;

Witch.prototype.active = function (dat){

};

Witch.prototype.update = function (dat){
    this.potion = dat;
};

Witch.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html.info['healer'] = $('<div class="_potion _healer">?</div>').appendTo(this._html.info['wrap']);
    this._html.info['poison'] = $('<div class="_potion _poison">?</div>').appendTo(this._html.info['wrap']);
    this._html.info['wrap'].addClass('_role_witch');
};

module.exports = Witch;
