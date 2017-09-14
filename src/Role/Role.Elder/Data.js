"use strict";
var ROLECODE = require('../RoleCode.js');
var ROLETYPE = require('../RoleType.js');

var Data = {
    Code: ROLECODE.ELDER,
    Type: ROLETYPE.SPECIAL,
    Name: 'Elder',
    Description: 'Werewolf should attack you twice to kill you. All the special characters will lose their ability if you are dead and not killed by werewolf.',
    Instruction: '',
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
