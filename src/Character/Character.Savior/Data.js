"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.SAVIOR,
    Type: CHARACTER_TYPE.SAVIOR,
    Name: 'Savior',
    Description: 'Protect somebody from werewolf.',
    Instruction: 'Protect somebody from werewolf.',
    IsGood: true,
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
