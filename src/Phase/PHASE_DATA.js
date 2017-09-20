var PHASE_CODE = require('./PHASE_CODE.js');
var PHASE_ATTR = require('./PHASE_ATTR.js');
var CHARACTER_CODE = require('CHARACTER/CHARACTER_CODE.js');

var PHASE_DATA = {};

PHASE_DATA[PHASE_CODE.DAY] = {
  Code: PHASE_CODE.DAY,
  Name: 'Day Time',
  Description: '',
  Icon: null,
  Sound: null,
  Timeout: 0,
  Action: PHASE_ATTR.ACTION.YES,
  Role: []
};

PHASE_DATA[PHASE_CODE.NIGHTCOMING] = {
  Code: PHASE_CODE.NIGHTCOMING,
  Name: 'Night Coming',
  Description: '',
  Icon: null,
  Sound: new Howl({
    src: require('./Sound/NightComing.mp3'),
    loop: false,
    volume: 1
  }),
  Timeout: 0,
  Action: PHASE_ATTR.ACTION.NO,
  Role: []
};

PHASE_DATA[PHASE_CODE.WEREWOLF] = {
  Code: PHASE_CODE.WEREWOLF,
  Name: 'Werewolf',
  Description: '',
  Icon: null,
  Sound: new Howl({
    src: require('./Sound/Werewolf.mp3'),
    loop: false,
    volume: 1
  }),
  Timeout: 0,
  Action: PHASE_ATTR.ACTION.YES,
  Role: [CHARACTER_CODE.WEREWOLF]
};

PHASE_DATA[PHASE_CODE.WITCH] = {
  Code: PHASE_CODE.WITCH,
  Name: 'Witch',
  Description: '',
  Icon: null,
  Sound: new Howl({
    src: require('./Sound/Witch.mp3'),
    loop: false,
    volume: 1
  }),
  Timeout: 0,
  Action: PHASE_ATTR.ACTION.YES,
  Role: [CHARACTER_CODE.WITCH]
};

PHASE_DATA[PHASE_CODE.SEER] = {
  Code: PHASE_CODE.SEER,
  Name: 'Seer',
  Description: '',
  Icon: null,
  Sound: new Howl({
    src: require('./Sound/Seer.mp3'),
    loop: false,
    volume: 1
  }),
  Timeout: 0,
  Action: PHASE_ATTR.ACTION.YES,
  Role: [CHARACTER_CODE.SEER]
};

PHASE_DATA[PHASE_CODE.SUNRAISE] = {
  Code: PHASE_CODE.SUNRAISE,
  Name: 'Sun Raise',
  Description: '',
  Icon: null,
  Sound: new Howl({
    src: require('./Sound/SunRaise.mp3'),
    loop: false,
    volume: 1
  }),
  Timeout: 0,
  Action: PHASE_ATTR.ACTION.YES,
  Role: []
};

module.exports = PHASE_DATA;
