"use strict";

var Basic= require('../Role.Basic/Host.js');
var ROLEDATA = require('./Data.js');

var Idiot = function () {
    Basic.call(this);
    this._setData(ROLEDATA);

    this.status = [0]; // [exposed?1:0]
};
Idiot.prototype = Object.create(Basic.prototype);
Idiot.prototype.constructor = Idiot;

/**
 * Update player status.
 * @param {object} opts {exposed: true/false}
 */
Idiot.prototype.updateStatus = function (opts){
    if (opts.hasOwnProperty('exposed')) this.status[0] = opts['exposed']?1:0;
};

module.exports = Idiot;
