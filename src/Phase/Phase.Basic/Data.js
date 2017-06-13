"use strict";
var PHASECODE = require('../PhaseCode.js');
var ATTR = require('../PhaseAttr.js');

var Data = {
    Code: PHASECODE.NONE,
    Name: 'Basic',
    Description: '',
    Icon: null,
    Sound: null,
    Timeout: 0,
    Action: ATTR.SKIP,
    Role:[]
};

module.exports = Data;
