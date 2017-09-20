"use strict";
var PHASE_LIST = require('PHASE/PHASE_LIST.js');
var PHASE_DATA = require('PHASE/PHASE_DATA.js');
var Phase = require('PHASE/Phase.Host.js');

var PhaseManager = function() {
  this.phaseList = [];
  this.characterList = [];
  this.roundNumber = 0;
  this.roundData = {};
  this.phaseIdx = 0;
  this.onPhaseEnd = null;
  this.onRoundEnd = null;
};
PhaseManager.prototype = Object.create(null);
PhaseManager.prototype.constructor = PhaseManager;

PhaseManager.prototype.setup = function(characterList) {
  this.characterList = characterList;
  this.phaseList = [];
  this.roundNumber = 0;
  this.roundData = {};
  this.phaseIdx = 0;

  for (let i = 0; i < PHASE_LIST.length; i++) {
    const p = new Phase(PHASE_DATA[PHASE_LIST[i]]);
    p.setup(characterList);
    if (p.enabled) {
      this.phaseList.push(p);
    }
  }
};

PhaseManager.prototype.reset = function(gameData) {
  this.roundNumber = gameData[0];
  this.roundData = gameData[1];
  this.phaseIdx = gameData[2];
};

PhaseManager.prototype.getGameData = function() {
  return [
    this.roundNumber,
    this.roundData,
    this.phaseIdx,
  ];
};

PhaseManager.prototype.phaseEnd = function() {
  this.phaseIdx = (this.phaseIdx + 1) % this.phaseList.length;
  this.onPhaseEnd();
  if (this.phaseIdx === 0) this.onRoundEnd();
};

module.exports = PhaseManager;
