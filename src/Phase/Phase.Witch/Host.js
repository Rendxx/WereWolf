"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var Witch = function (phaseManager) {
    Basic.call(this);
    this.data = DATA;
    
    this.actionDat = {
        canHeal: false,
        victim: -1
    };
};
Witch.prototype = Object.create(Basic);
Witch.prototype.constructor = Witch;

Witch.prototype.active = function (){
    if (!this._setuped) return;
    
    let victimIdx = this.phaseManager.getVictim();
    this.actionDat = {
        canHeal: this.characters[0].canHeal(this.phaseManager.getRoundNumber(), victimIdx),
        victim: this.characters[0].knowVictim()? victimIdx:-1
    };
    Basic.prototype.active.call(this);
};

Witch.prototype.actionHandler = function (playerIdx, dat){  
    let healIdx=dat[1][0];
    let poisonIdx=dat[1][1];
    let rst = {
        healIdx: -1,
        poisonIdx: -1
    };

    if (healIdx!==-1 && healIdx===this.phaseManager.getVictim() && this.characters[0].canHeal(this.phaseManager.getRoundNumber(), healIdx)){
        this.phaseManager.getCharacters(healIdx).setAlive(true);
        this.characters[0].useGoodPotion();
        rst.healIdx = healIdx;
    }
    if (poisonIdx!==-1 && this.phaseManager.getCharacters(poisonIdx).alive && this.characters[0].canPoison(this.phaseManager.getRoundNumber(), poisonIdx)){
        this.phaseManager.getCharacters(poisonIdx).setAlive(false);
        this.characters[0].useBadPotion();
        rst.poisonIdx = poisonIdx;
    }

    this.characters[0].actionResult(this.data.Id, rst);
    this.onActionComplete && this.onActionComplete();
};
module.exports = Witch;