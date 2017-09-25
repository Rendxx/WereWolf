"use strict";

var Basic = require('../Character.Basic/Host.js');

var Idiot = function(characterManager, phaseManager) {
  Basic.call(this, characterManager, phaseManager);

  this.status = [0]; // [exposed?1:0]
};
Idiot.prototype = Object.create(Basic.prototype);
Idiot.prototype.constructor = Idiot;
Idiot.DATA = require('./Data.js');

/**
 * Update player status.
 * @param {object} opts {exposed: true/false}
 */
Idiot.prototype.updateStatus = function(opts) {
  if (opts.hasOwnProperty('exposed')) this.status[0] = opts['exposed'] ? 1 : 0;
};

module.exports = Idiot;
