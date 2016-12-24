var PHASE = require('GLOBAL/js/PhaseCode.js');

var path = window.SoundPath;
var PHASESOUND = {};
PHASESOUND[PHASE.DAY] = new Howl({
    src: [path+'sun_rise_wakeup.mp3'],
    loop: false,
    volume: 1
});
PHASESOUND[PHASE.PRENIGHT] = new Howl({
    src: [path+'night2.mp3'],
    loop: false,
    volume: 1
});
PHASESOUND[PHASE.WOLF] = new Howl({
    src: [path+'werewolf2.mp3'],
    loop: false,
    volume: 1
});
PHASESOUND[PHASE.SEER] = new Howl({
    src: [path+'seer2.mp3'],
    loop: false,
    volume: 1
});
PHASESOUND[PHASE.WITCH] = new Howl({
    src: [path+'witch2.mp3'],
    loop: false,
    volume: 1
});

module.exports = PHASESOUND;
