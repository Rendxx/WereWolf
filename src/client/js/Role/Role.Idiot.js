var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var Basic = require('./Role.Basic.js');
require('CLIENT/less/Role/Role.Idiot.less');

var Idiot = function () {
    Basic.call(this);
    this.code = ROLECODE.IDIOT;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this.stiupid = false;
};
Idiot.prototype = Object.create(Basic.prototype);
Idiot.prototype.constructor = Basic;

Idiot.prototype.actived = function (dat){

};

Idiot.prototype.update = function (dat){
  this.stiupid = dat[0]===1;
};

Idiot.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].addClass('_role_idiot');
};


module.exports = Idiot;
