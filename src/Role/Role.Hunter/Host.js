"use strict";

var Basic= require('../Role.Basic/Host.js');
var ROLEDATA = require('./Data.js');

var Hunter = function () {
    Basic.call(this);
    this._setData(ROLEDATA);

    this.status = [1];  // [canShot]
};
Hunter.prototype = Object.create(Basic.prototype);
Hunter.prototype.constructor = Hunter;

Hunter.prototype.updateStatus = function (opts){
    if (opts.hasOwnProperty('canShot')) this.status[0] = opts['canShot']?1:0;
};

module.exports = Hunter;
