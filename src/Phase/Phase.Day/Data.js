"use strict";
var PHASECODE = require('../PhaseCode.js');
var ATTR = require('../PhaseAttr.js');
var ROLECODE = require('ROLE/RoleCode.js');

var Data = {
    Code: PHASECODE.DAY,
    Name: 'Day Time',
    Description: '',
    Icon: null,
    Sound: null,
    MinPlayer: 0,
    MaxPlayer: 0,
    Timeout: 0,
    Action: ATTR.ACTION.YES,
    Role:[]
};

module.exports = Data;
