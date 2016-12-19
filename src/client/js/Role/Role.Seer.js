var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var Basic = require('./Role.Basic.js');
require('CLIENT/less/Role/Role.Seer.less');


var Seer = function () {
    Basic.call(this);
    this.code = ROLECODE.SEER;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this.potion = [0, 0];
};
Seer.prototype = Object.create(Basic.prototype);
Seer.prototype.constructor = Basic;

Seer.prototype.actived = function (dat){

};

Seer.prototype.update = function (dat){
    this.potion = dat;
};

Seer.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['msg'] = $('<div class="_msg">[You haven\'t seen yet]</div>').appendTo(this._html['wrap']);
    this._html['wrap'].addClass('_role_seer');
};

module.exports = Seer;
