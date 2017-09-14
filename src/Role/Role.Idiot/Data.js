"use strict";
var ROLECODE = require('../RoleCode.js');
var ROLETYPE = require('../RoleType.js');

var Data = {
    Code: ROLECODE.IDIOT,
    Type: ROLETYPE.SPECIAL,
    Name: 'Idiot',
    Description: 'You are can not be voted to die, instead, you shows your role to everybody. After that, you can no longer vote,, but you can talk whenever you want.',
    Instruction: 'Can not be voted to die.',
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
