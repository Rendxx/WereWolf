"use strict";
var ROLECODE = require('../RoleCode.js');
var ROLETYPE = require('../RoleType.js');

var Data = {
    Code: ROLECODE.SEER,
    Type: ROLETYPE.SPECIAL,
    Name: 'Seer',
    Description: 'Check whether a player is a werewolf or not.',
    Instruction: 'Check whether a player is a werewolf or not.',
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
