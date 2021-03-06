"use strict";
var PHASECODE = require('../PhaseCode.js');
var ATTR = require('../PhaseAttr.js');
var ROLECODE = require('ROLE/RoleCode.js');

var Data = {
    Code: PHASECODE.SEER,
    Name: 'Seer',
    Description: '',
    Icon: null,
    Sound: new Howl({
        src: require('./Seer.mp3'),
            loop: false,
            volume: 1
        }),
    MinPlayer: 1,
    MaxPlayer: 1,
    Timeout: 0,
    Action: ATTR.ACTION.YES,
    Role:[ROLECODE.SEER]
};

module.exports = Data;
