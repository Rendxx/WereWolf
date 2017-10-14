"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.SEER,
    Type: CHARACTER_TYPE.SPECIAL,
    Name: 'Seer',
    Description: 'Check whether a player is a werewolf or not.',
    Instruction: 'Check whether a player is a werewolf or not.',
    Portrait: require('./Image/Portrait.png'),
    CssName: 'seer'
};

module.exports = Data;
