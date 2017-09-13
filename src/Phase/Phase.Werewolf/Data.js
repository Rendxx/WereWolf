"use strict";
var PHASECODE = require('../PhaseCode.js');
var ATTR = require('../PhaseAttr.js');
var ROLECODE = require('ROLE/RoleCode.js');

var Data = {
    Code: PHASECODE.WEREWOLF,
    Name: 'Werewolf',
    Description: '',
    Icon: null,
    Sound: new Howl({
        src: require('./Werewolf.mp3'),
            loop: false,
            volume: 1
        }),
    MinPlayer: 1,
    MaxPlayer: 100,
    Timeout: 0,
    Action: ATTR.ACTION.YES,
    Role:[ROLECODE.WEREWOLF]
};

module.exports = Data;
