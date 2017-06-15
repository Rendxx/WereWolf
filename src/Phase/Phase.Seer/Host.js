"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var Seer = function (dataPkg) {
    Basic.call(this, dataPkg);
    this.data = DATA;
};
Seer.prototype = Object.create(Basic);
Seer.prototype.constructor = Seer;

Seer.prototype.active = function (){
    if (!this._setuped) return;
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
    
    let isBad = false;
    if (targetIdx===-1){
        isBad = false;
    } else {
        isBad = !this.dataPkg.getCharacter(targetIdx).isGood;
    }
    this.characters[0].actionResult(this.generalDat, {
        testIdx:targetIdx, 
        isBad:isBad
    });
    this.onActionComplete && this.onActionComplete();
};
module.exports = Seer;