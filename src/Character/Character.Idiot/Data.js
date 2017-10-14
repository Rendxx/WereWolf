"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.IDIOT,
    Type: CHARACTER_TYPE.SPECIAL,
    Name: 'Idiot',
    Description: 'You are can not be voted to die, instead, you shows your role to everybody. After that, you can no longer vote,, but you can talk whenever you want.',
    Instruction: 'Can not be voted to die.',
    Portrait: require('./Image/Portrait.png'),
    CssName: 'idiot'
};

module.exports = Data;
