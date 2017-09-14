"use strict";
var ROLECODE = require('../RoleCode.js');
var ROLETYPE = require('../RoleType.js');

var Data = {
    Code: ROLECODE.VILLAGER,
    Type: ROLETYPE.ORDINARY,
    Name: 'Villager',
    Description: 'You don\'t have any special power except thinking and the right to vote.',
    Instruction: '',
    IsGood: true,
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
