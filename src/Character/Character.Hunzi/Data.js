"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.HUNZI,
    Type: CHARACTER_TYPE.SPECIAL,
    Name: 'Hun Zi',
    Description: 'Find your dad on the 1st night. You will be on the same side.',
    Instruction: 'Find your dad on the 1st night. You will be on the same side.',
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
