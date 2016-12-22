var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var INFO = require('CLIENT/js/Info.js');
var InfoBox = require('CLIENT/js/InfoBox.js');
var Basic = require('./Role.Basic.js');
require('CLIENT/less/Role/Role.Hunter.less');

var Hunter = function () {
    Basic.call(this);
    this.code = ROLECODE.HUNTER;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this.gun = true;
};
Hunter.prototype = Object.create(Basic.prototype);
Hunter.prototype.constructor = Basic;

Hunter.prototype.update = function (aliveListArr, dat){
    this.gun = dat[0]===1;
    var t = aliveListArr[this.playerIdx]==='1';
    if (t===false && this.alive){
        InfoBox.alert({
            content: (this.gun ? INFO.DAED_HUNTER : INFO.DAED_HUNTER2),
        });
    }
    this.alive = t;
};

Hunter.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html.info['gun'] = $('<div class="_gun">You can shot someone when you die.</div>').appendTo(this._html.info['wrap']);
    this._html.info['wrap'].addClass('_role_hunter');
};


module.exports = Hunter;
