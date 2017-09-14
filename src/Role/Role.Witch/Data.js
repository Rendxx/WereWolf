"use strict";
var ROLECODE = require('../RoleCode.js');
var ROLETYPE = require('../RoleType.js');

var Data = {
    Code: ROLECODE.WITCH,
    Type: ROLETYPE.SPECIAL,
    Name: 'Witch',
    Description: 'You have 2 potions. One to save the werewolves\'s victim, one to eliminate a player. You can only use 1 potion in the same night.',
    Instruction: 'Use potion at night',
    IsGood: true,
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
