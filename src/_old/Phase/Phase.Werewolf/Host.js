"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var WereWolf = function (dataPkg) {
    Basic.call(this, dataPkg);
    this.data = DATA;
    
    this.actionDat = {
        werewolf: [],
        vote: {}
    };
};
WereWolf.prototype = Object.create(Basic);
WereWolf.prototype.constructor = WereWolf;

WereWolf.prototype.setup = function (playerList){
    Basic.prototype.setup.call(this, playerList);
    this.actionDat.werewolf = [];
    for (let i=0; i<playerList.length; i++){
        this.actionDat.werewolf.push(playerList[i].playerIdx);
    }
};

WereWolf.prototype.reset = function (characters){
    Basic.prototype.setup.reset(this, characters);
    this.actionDat.werewolf = [];
    for (let i=0; i<this.characters.length; i++){
        this.actionDat.werewolf.push(this.characters[i].player.playerIdx);
    }
};


WereWolf.prototype.active = function (){
    if (!this._setuped) return;
    this.actionDat.vote={};
    Basic.prototype.active.call(this);
};

WereWolf.prototype.inactive = function (){
    if (!this._setuped) return;
    this.actionDat.vote={};
    Basic.prototype.inactive.call(this);
};

WereWolf.prototype.actionHandler = function (playerIdx, dat){
    if (!this._setuped) return;
    let targetIdx = dat[1][0];
    if (targetIdx>-1 ){
        if (this.characters[targetIdx]==null || !this.characters[targetIdx].alive) {
            console.log('[' + targetIdx + '] is not a valuable target');
            return 0;
        }
    }
    this.generalDat.aliveList = this.dataPkg.getAliveStr();
    this.actionDat.vote[playerIdx] = targetIdx;
    for (let i=0;i<this.characters.length;i++){
        this.characters[i].active(this.generalDat, this.actionDat);
    }
    
    // check whether complete
    let vote = {};
    let val = -1;
    for (let key in this.actionDat.vote) {
        val = this.actionDat.vote[key];
        vote[val]= (vote[val]||0)+1;
    }
    if (vote[val] === this.aliveNumber) {
        this.characters[i].actionResult(this.generalDat, [val]);
    this.characters[0].actionResult({
        victim: val
    });
    this.onActionComplete && this.onActionComplete();
    }    
};
module.exports = WereWolf;