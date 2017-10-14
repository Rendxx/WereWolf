"use strict";
var CHARACTER_CODE = require('../CHARACTER_CODE.js');
var CHARACTER_TYPE = require('../CHARACTER_TYPE.js');

var Data = {
    Code: CHARACTER_CODE.WEREWOLFKING,
    Type: CHARACTER_TYPE.WEREWOLF,
    Name: 'Werewolf King',
    Description: 'Wake up at night and murder somebody. You can kill one player when self-sacrifice in day time.',
    Instruction: 'Wake up at night and murder somebody. You can kill one player when self-sacrifice in day time.',
    Portrait: require('./Image/Portrait.png'),
    CssName: 'werewolfking'
};

module.exports = Data;
