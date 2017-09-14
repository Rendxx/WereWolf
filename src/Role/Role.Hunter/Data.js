"use strict";
var ROLECODE = require('../RoleCode.js');
var ROLETYPE = require('../RoleType.js');

var Data = {
    Code: ROLECODE.HUNTER,
    Type: ROLETYPE.SPECIAL,
    Name: 'Hunter',
    Description: 'You can shot someone when you die if you are not killed by poison.',
    Instruction: 'Shot someone when you die.',
    Portrait: require('./Image/Portrait.png')
};

module.exports = Data;
