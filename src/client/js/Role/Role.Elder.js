var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var Basic = require('./Role.Basic.js');
require('CLIENT/less/Role/Role.Elder.less');

var Elder = function () {
    Basic.call(this);
    this.code = ROLECODE.ELDER;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
};
Elder.prototype = Object.create(Basic.prototype);
Elder.prototype.constructor = Basic;

Elder.prototype.actived = function (dat){

};

Elder.prototype.update = function (dat){
};

Elder.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].addClass('_role_elder');
};


module.exports = Elder;
