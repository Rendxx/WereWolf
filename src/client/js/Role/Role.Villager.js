var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var Basic = require('./Role.Basic.js');
require('CLIENT/less/Role/Role.Villager.less');

var Villager = function () {
    Basic.call(this);
    this.code = ROLECODE.VILLAGER;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;

};
Villager.prototype = Object.create(Basic.prototype);
Villager.prototype.constructor = Basic;

Villager.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html.info['wrap'].addClass('_role_villager');
};

module.exports = Villager;
