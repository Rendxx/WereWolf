"use strict";
var PHASECODE = require('../PhaseCode.js');
var ATTR = require('../PhaseAttr.js');

var Data = {
    Code: PHASECODE.NIGHTCOMING,
    Name: 'Sun Raise',
    Description: '',
    Icon: null,
    Sound: new Howl({
        src: require('./SunRaise.mp3'),
            loop: false,
            volume: 1
        }),
    MinPlayer: 0,
    MaxPlayer: 0,
    Timeout: 0,
    Action: ATTR.ACTION.NO,
    Role:[]
};

module.exports = Data;
