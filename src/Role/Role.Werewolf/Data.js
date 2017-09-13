"use strict";
var ROLECODE = require('GLOBAL/content/RoleCode.js');

var Data = {
    Code: ROLECODE.WEREWOLF,
    Name: 'Werewolf',
    Description: 'Wake up at night and murder somebody.',
    Instruction: 'Wake up at night and murder somebody.',
    IsGood: false,
    Portrait: require('./Image/Portrait.png'),
    Status:{
        /* name: number */
    }
};

module.exports = Data;
