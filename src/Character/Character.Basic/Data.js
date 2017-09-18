"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.NONE,
    Type: CHARACTER_TYPE.ORDINARY,
    Name: 'Basic',
    Description: 'This is a basic role. Descrip the role function here in HTML format.',
    Instruction: 'Tell player about what he can do in simple words.',
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
