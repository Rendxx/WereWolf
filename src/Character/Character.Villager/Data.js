"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.VILLAGER,
    Type: CHARACTER_TYPE.ORDINARY,
    Name: 'Villager',
    Description: 'You don\'t have any special power except thinking and the right to vote.',
    Instruction: '',
    IsGood: true,
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
