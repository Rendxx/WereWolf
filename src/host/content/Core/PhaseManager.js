"use strict";
var PHASECODE = require('./PhaseCode.js');
var Phase = require('./Phase.Host.js');
var Role = require('ROLE/Role.Host.js');

var PhaseManager = function () {
    this.phaseList = [];
    this.characters = [];
    this.roundNumber = 0;
    this.roundData = {};
    this.phaseIdx = 0;

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

PhaseManager.prototype.setup = function (playerList) {
    this.playerList = playerList;
};

PhaseManager.prototype.reset = function (basicData, gameData, playerList) {
    this.phaseIdx = gameData[0];
    this.roundNumber = gameData[1];

    let roleCode = basicData[0],
        characterPhase = basicData[1],
        phaseCode = basicData[2],
        roleData = gameData[2];

    let characterGrp = [];
    for (let i=0; i<phaseCode.length; i++){
        characterGrp[i]=[];
    }
    // characters
    this.characters = [];
    for (let i=0; i<playerList.length; i++){
        this.characters[i] = Role(roleCode[i]);
        this.characters[i].reset(playerList[i], roleData[i]);
        characterGrp[characterPhase[i]].push(this.characters[i]);
    }

    // phase
    this.phaseList = [];
    for (let i=0; i<phaseCode.length; i++){
        this.phaseList[i] = Phase(phaseCode[i], this._dataPkg);
        this.phaseList[i].reset(characterGrp[i]);
    }
};

PhaseManager.prototype.getBasicData = function () {
    let basicData = [[],[],[],[]];
    for (let i=0;i<this.characters.length;i++){
        basicData[0][i] = this.characters.code;
    }
    for (let i=0;i<this.phaseList.length;i++){
        basicData[1][i] = this.phaseList[i].data.Id;
        for (let j=0;j<this.phaseList[i].characters.length;j++){
            basicData[2][this.phaseList[i].characters[j].player.playerIdx] = i;
        }
    }
    return basicData;
};

PhaseManager.prototype.getGameData = function () {
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
