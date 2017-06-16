"use strict";
var PHASECODE = require('./PhaseCode.js');

var Phase = {};
Phase[PHASECODE.BASIC] = require('./Phase.Basic/Host.js');
Phase[PHASECODE.DAY] = require('./Phase.Day/Host.js');
Phase[PHASECODE.HUNTER] = require('./Phase.Hunter/Host.js');
Phase[PHASECODE.IDIOT] = require('./Phase.Idiot/Host.js');
Phase[PHASECODE.NIGHTCOMING] = require('./Phase.NightComing/Host.js');
Phase[PHASECODE.SEER] = require('./Phase.Seer/Host.js');
Phase[PHASECODE.SUNRAISE] = require('./Phase.SunRaise/Host.js');
Phase[PHASECODE.VILLAGER] = require('./Phase.Villager/Host.js');
Phase[PHASECODE.WEREWOLF] = require('./Phase.Werewolf/Host.js');
Phase[PHASECODE.WITCH] = require('./Phase.Witch/Host.js');

var PhaseFacory = function (phaseId, dataPkg){
    if (!Phase.hasOwnProperty(phaseId)) throw new Error('Unexpect Phase: '+phaseId);
    return new Phase[phaseId](dataPkg);
};

module.exports = PhaseFacory;
