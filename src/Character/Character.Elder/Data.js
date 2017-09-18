"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.ELDER,
    Type: CHARACTER_TYPE.SPECIAL,
    Name: 'Elder',
    Description: 'Werewolf should attack you twice to kill you. All the special characters will lose their ability if you are dead and not killed by werewolf.',
    Instruction: '',
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
