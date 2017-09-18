"use strict";

var Basic = require('../Role.Basic/Host.js');

var Hunter = function(characterManager, phaseManager) {
  Basic.call(this, characterManager, phaseManager);

  this.status = [1]; // [canShot]
};
Hunter.prototype = Object.create(Basic.prototype);
Hunter.prototype.constructor = Hunter;
Hunter.DATA = require('./Data.js');

Hunter.prototype.updateStatus = function(opts) {
  if (opts.hasOwnProperty('canShot')) this.status[0] = opts['canShot'] ? 1 : 0;
};

module.exports = Hunter;
