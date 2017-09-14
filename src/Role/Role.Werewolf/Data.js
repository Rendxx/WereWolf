"use strict";
var ROLECODE = require('../RoleCode.js');
var ROLETYPE = require('../RoleType.js');

var Data = {
    Code: ROLECODE.WEREWOLF,
    Type: ROLETYPE.WEREWOLF,
    Name: 'Werewolf',
    Description: 'Wake up at night and murder somebody.',
    Instruction: 'Wake up at night and murder somebody.',
    IsGood: false,
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
