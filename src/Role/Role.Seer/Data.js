"use strict";
var ROLECODE = require('GLOBAL/content/RoleCode.js');

var Data = {
    Code: ROLECODE.SEER,
    Name: 'Seer',
    Description: 'Check whether a player is a werewolf or not.',
    Instruction: 'Check whether a player is a werewolf or not.',
    IsGood: true,
    Portrait: require('./Image/Portrait.png'),
    Status:{
        /* name: number */
    }
};

module.exports = Data;
