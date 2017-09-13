"use strict";
var ROLECODE = require('GLOBAL/content/RoleCode.js');

var Data = {
    Code: ROLECODE.ELDER,
    Name: 'Elder',
    Description: 'Werewolf should attack you twice to kill you. All the special characters will lose their ability if you are dead and not killed by werewolf.',
    Instruction: '',
    IsGood: true,
    Portrait: require('./Image/Portrait.png'),
    Status:{}
};

module.exports = Data;
