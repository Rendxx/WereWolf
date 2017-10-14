"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.SAVIOR,
    Type: CHARACTER_TYPE.SPECIAL,
    Name: 'Savior',
    Description: 'Protect somebody from werewolf.',
    Instruction: 'Protect somebody from werewolf.',
    Portrait: require('./Image/Portrait.png'),
    CssName: 'savior'
};

module.exports = Data;
