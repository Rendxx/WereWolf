"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.WITCH,
    Type: CHARACTER_TYPE.SPECIAL,
    Name: 'Witch',
    Description: 'You have 2 potions. One to save the werewolves\'s victim, one to eliminate a player. You can only use 1 potion in the same night.',
    Instruction: 'Use potion at night',
    Portrait: require('./Image/Portrait.png'),
    CssName: 'witch'
};

module.exports = Data;
