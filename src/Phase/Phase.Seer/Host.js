"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var Seer = function (phaseManager) {
    Basic.call(this);
    this.data = DATA;

    this.actionDat = {
        seer: [],
        vote: {}
    };
};
Seer.prototype = Object.create(Basic);
Seer.prototype.constructor = Seer;

Seer.prototype.setup = function (playerList){
    Basic.prototype.setup.call(this, playerList);
    this.actionDat.seer = [];
    for (let i=0; i<playerList.length; i++){
        this.actionDat.seer.push(playerList[i].playerIdx);
    }
};

Seer.prototype.active = function (){
    if (!this._setuped) return;
    this.actionDat.vote={};
    Basic.prototype.active.call(this);
};

Seer.prototype.actionHandler = function (playerIdx, dat){
    if (!this._setuped) return;
    let targetIdx = dat[1][0];
    if (targetIdx>-1 ){
        if (this.characters[targetIdx]==null || !this.characters[targetIdx].alive) {
            console.log('[' + targetIdx + '] is not a valuable target');
            return 0;
        }
    }
    this.actionDat.vote[playerIdx] = targetIdx;
    for (let i=0;i<this.characters.length;i++){
        this.characters[i].active(this.data.Id, this.actionDat);
    }
    
    // check whether complete
    let vote = {};
    let val = -1;
    let isBad = false;
    for (let key in this.actionDat.vote) {
        val = this.actionDat.vote[key];
        vote[val]= (vote[val]||0)+1;
    }
    if (vote[val] === this.aliveNumber) {
        if (val===-1){
            isBad = false;
        } else {
            isBad = !this.characters[val].isGood;
        }
        this.characters[i].actionResult(this.data.Id, {
            testIdx:val, 
            isBad:isBad
        });
        this.onActionComplete && this.onActionComplete();
    }    
};
module.exports = Seer;