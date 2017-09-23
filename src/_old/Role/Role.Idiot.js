var ROLECODE = require('GLOBAL/content/RoleCode.js');
var ROLEDATA = require('GLOBAL/content/RoleData.js');
var Basic = require('./Role.Basic.js');
require('./Role.Idiot.less');

var Idiot = function () {
    Basic.call(this);
    this.code = ROLECODE.IDIOT;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this.stiupid = false;
};
Idiot.prototype = Object.create(Basic.prototype);
Idiot.prototype.constructor = Basic;

Idiot.prototype.update = function (aliveListArr, dat){
  Basic.prototype.update.call(this,aliveListArr, dat);
  this.stiupid = dat[0]===1;
};

Idiot.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html.info['wrap'].addClass('_role_idiot');
};


module.exports = Idiot;
