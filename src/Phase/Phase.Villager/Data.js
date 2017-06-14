"use strict";
var PHASECODE = require('../PhaseCode.js');
var ATTR = require('../PhaseAttr.js');
var ROLECODE = require('ROLE/RoleCode.js');

var Data = {
    Code: PHASECODE.VILLAGER,
    Name: 'Idiot',
    Description: '',
    Icon: null,
    Sound: null,
    MinPlayer: 0,
    MaxPlayer: 100,
    Timeout: 0,
    Action: ATTR.ACTION.SKIP,
    Role:[ROLECODE.VILLAGER]
};

module.exports = Data;
