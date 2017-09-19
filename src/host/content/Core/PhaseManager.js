"use strict";
var PHASE_LIST = require('PHASE/PHASE_LIST.js');
var Phase = require('PHASE/Phase.Data.js');

var PhaseManager = function () {
    this.phaseList = [];
    this.characterList = [];
    this.roundNumber = 0;
    this.roundData = {};
    this.phaseIdx = 0;
};
PhaseManager.prototype = Object.create(null);
PhaseManager.prototype.constructor = PhaseManager;

PhaseManager.prototype.setup = function (characterList) {
    this.characterList = characterList;
};

PhaseManager.prototype.reset = function (gameData) {
  this.roundNumber = gameData[0],
  this.roundData = gameData[1],
  this.phaseIdx = gameData[2],
};

PhaseManager.prototype.getGameData = function () {
  return [
    this.roundNumber,
    this.roundData,
    this.phaseIdx,
  ];
};

PhaseManager.prototype._createPhaseList = function () {
  for (let i=0;i<PHASE_LIST.length;i++){
    let phase = new Phase();
  }
};

PhaseManager.prototype._onActionComplete = function () {
    this.phaseIdx = (this.phaseIdx + 1) % this.phaseList.length;
    if (this.phaseIdx === 0) this._onRoundEnd();
    this.onPhaseStart && this.onPhaseStart(this.phaseIdx);
};

PhaseManager.prototype._onRoundEnd = function () {
    this.onRoundStart && this.onRoundStart(this.roundNumber);
};

module.exports = PhaseManager;
