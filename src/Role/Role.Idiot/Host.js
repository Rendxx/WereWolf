"use strict";

var Basic= require('../Role.Basic/Host.js');

var Idiot = function () {
    Basic.call(this);

    this.status = [0]; // [exposed?1:0]
};
Idiot.prototype = Object.create(Basic.prototype);
Idiot.DATA = require('./Data.js');

/**
 * Update player status.
 * @param {object} opts {exposed: true/false}
 */
Idiot.prototype.updateStatus = function (opts){
    if (opts.hasOwnProperty('exposed')) this.status[0] = opts['exposed']?1:0;
};

module.exports = Idiot;
