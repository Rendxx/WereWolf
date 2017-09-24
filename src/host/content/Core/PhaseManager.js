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

  this._nextPhaseTimeout = null;
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
    p.onActionComplete = this.nextPhase.bind(this);
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
    this.phaseList[this.phaseIdx].data.Code,
  ];
};

PhaseManager.prototype.nextPhase = function(delay) {
  if (delay == null) delay = 8000;
  if (this._nextPhaseTimeout!==null) clearTimeout(this._nextPhaseTimeout);

  this._nextPhaseTimeout = setTimeout(function(){
    this._nextPhaseTimeout = null;
    this.phaseIdx = (this.phaseIdx + 1) % this.phaseList.length;
    if (this.phaseIdx === 0) {
      this.roundStart();
    } else {
      this.onPhaseEnd();
    }
    this.phaseList[this.phaseIdx].active();
  }.bind(this), delay);
};

PhaseManager.prototype.roundStart = function() {
  this.roundNumber++;
  // werewolf & witch heal
  if (this.roundData['werewolf'] != null && this.roundData['werewolf'] != -1 && this.roundData['werewolf'] != this.roundData['witchHeal']) {
    const victim = this.roundData['werewolf'];
    this.characterList[victim].werewolfKill();
  }
  // witch poison
  if (this.roundData['witchPoison'] != null && this.roundData['witchPoison'] != -1) {
    const victim = this.roundData['witchPoison'];
    this.characterList[victim].witchPoison();
  }

  this.roundData = {};
  this.onPhaseEnd();
};

module.exports = PhaseManager;
