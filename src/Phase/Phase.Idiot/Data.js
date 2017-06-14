"use strict";
var PHASECODE = require('../PhaseCode.js');
var ATTR = require('../PhaseAttr.js');
var ROLECODE = require('ROLE/RoleCode.js');

var Data = {
    Code: PHASECODE.IDIOT,
    Name: 'Idiot',
    Description: '',
    Icon: null,
    Sound: null,
    MinPlayer: 1,
    MaxPlayer: 100,
    Timeout: 0,
    Action: ATTR.ACTION.SKIP,
    Role:[ROLECODE.IDIOT]
};

module.exports = Data;
