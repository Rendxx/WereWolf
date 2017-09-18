"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.HUNTER,
    Type: CHARACTER_TYPE.SPECIAL,
    Name: 'Hunter',
    Description: 'You can shot someone when you die if you are not killed by poison.',
    Instruction: 'Shot someone when you die.',
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
