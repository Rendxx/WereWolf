"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.KNIGHT,
    Type: CHARACTER_TYPE.ORDINARY,
    Name: 'Knight',
    Description: 'You can put a player to a trial. The player will be killes if he/she is a werewolf. This will end this turn. Otherwise you will die.',
    Instruction: 'You can put a player to a trial. The player will be killes if he/she is a werewolf. This will end this turn. Otherwise you will die.',
    IsGood: true,
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
