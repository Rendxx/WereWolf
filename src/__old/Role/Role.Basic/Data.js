"use strict";
var ROLECODE = require('GLOBAL/content/RoleCode.js');

var Data = {
    Code: ROLECODE.NONE,
    Name: 'Basic',
    Description: 'This is a basic role. Descrip the role function here in HTML format.',
    Instruction: 'Tell player about what he can do in simple words.',
    Portrait: require('./Image/Portrait.png'),
    IsGood: true,
    Status:{
        /* name: number */
    }
};

module.exports = Data;
