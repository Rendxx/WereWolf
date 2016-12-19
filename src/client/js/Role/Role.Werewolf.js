var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var Basic = require('./Role.Basic.js');
require('CLIENT/less/Role/Role.Werewolf.less');

var WereWolf = function () {
    Basic.call(this);
    this.code = ROLECODE.WEREWOLF;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
};
WereWolf.prototype = Object.create(Basic.prototype);
WereWolf.prototype.constructor = Basic;

WereWolf.prototype.actived = function (dat){

};

WereWolf.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].addClass('_role_werewolf');
};

module.exports = WereWolf;
