"use strict";
var PHASECODE = require('../PhaseCode.js');
var ATTR = require('../PhaseAttr.js');
var ROLECODE = require('ROLE/RoleCode.js');

var Data = {
    Code: PHASECODE.WITCH,
    Name: 'Witch',
    Description: '',
    Icon: null,
    Sound: new Howl({
        src: require('./Witch.mp3'),
            loop: false,
            volume: 1
        }),
    MinPlayer: 1,
    MaxPlayer: 1,
    Timeout: 0,
    Action: ATTR.ACTION.YES,
    Role:[ROLECODE.WITCH]
};

module.exports = Data;
