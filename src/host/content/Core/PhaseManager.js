"use strict";
var PHASECODE = require('./PhaseCode.js');
var Phase = require('./Phase.Host.js');

var PhaseManager = function () {
    this.list = [];
    this.characters = [];
    this.roundNumber = 0;
    this.roundData = {};
    this.phaseIdx = 0;
    this._setuped = false;

    this.onPhaseStart = null;
    this.onRoundStart = null;
    this.send = null;

    this._dataPkg = {
        getCharacter: function (playerIdx) {
            if (playerIdx < 0 || playerIdx >= this.characters.length) return null;
            return this.characters[playerIdx];
        }.bind(this),
        getRoundNumber: function () {
            return this.roundNumber;
        }.bind(this),
    };
};
PhaseManager.prototype = Object.create(null);
PhaseManager.prototype.constructor = PhaseManager;

PhaseManager.prototype.add = function (phaseId) {
    if (this._setuped) return;
};

PhaseManager.prototype.remove = function (idx) {
    if (this._setuped) return;
};

PhaseManager.prototype.setup = function (playerList) {
    if (this._setuped) return;
};

PhaseManager.prototype.reset = function (basicData, gameData) {
    this.list = [];
    this.phaseIdx = opt.phase;
    this.roundNumber = opt.round;
    this._setuped = opt.setuped;
};

PhaseManager.prototype.getBasicData = function () {
};

PhaseManager.prototype.getGameData = function () {
};

PhaseManager.prototype._onActionComplete = function () {
    this.phaseIdx = (this.phaseIdx + 1) % this.list.length;
    if (this.phaseIdx === 0) this._onRoundEnd();
    this.onPhaseStart && this.onPhaseStart(this.phaseIdx);
};

PhaseManager.prototype._onRoundEnd = function () {
    this.onRoundStart && this.onRoundStart(this.roundNumber);
};

module.exports = PhaseManager;
