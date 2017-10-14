"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.WEREWOLF,
    Type: CHARACTER_TYPE.WEREWOLF,
    Name: 'Werewolf',
    Description: 'Wake up at night and murder somebody.',
    Instruction: 'Wake up at night and murder somebody.',
    Portrait: require('./Image/Portrait.png'),
    CssName: 'werewolf'
};

module.exports = Data;
