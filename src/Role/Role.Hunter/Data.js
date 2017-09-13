"use strict";
var ROLECODE = require('GLOBAL/content/RoleCode.js');

var Data = {
    Code: ROLECODE.HUNTER,
    Name: 'Hunter',
    Description: 'You can shot someone when you die if you are not killed by poison.',
    Instruction: 'Shot someone when you die.',
    IsGood: true,
    Portrait: require('./Image/Portrait.png'),
    Status:{}
};

module.exports = Data;
