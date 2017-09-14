"use strict";
var ROLECODE = require('../RoleCode.js');
var ROLETYPE = require('../RoleType.js');

var Data = {
    Code: ROLECODE.NONE,
    Type: ROLETYPE.ORDINARY,
    Name: 'Basic',
    Description: 'This is a basic role. Descrip the role function here in HTML format.',
    Instruction: 'Tell player about what he can do in simple words.',
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
