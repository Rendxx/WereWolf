"use strict";
var PHASECODE = require('../PhaseCode.js');
var ATTR = require('../PhaseAttr.js');

var Data = {
    Code: PHASECODE.NONE,
    Name: 'Basic',
    Description: '',
    Icon: null,
    Sound: null,
    MinPlayer: 0,
    MaxPlayer: 0,
    Timeout: 0,
    Action: ATTR.SKIP,
    Role:[]
};

module.exports = Data;
