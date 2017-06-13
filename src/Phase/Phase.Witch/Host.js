"use strict";

var Basic= require('../Phase.Basic/Host.js');
var DATA = require('./Data.js');

var Witch = function (phaseManager) {
    Basic.call(this);
    this.data = DATA;
};
Witch.prototype = Object.create(Basic);
Witch.prototype.constructor = Witch;

Witch.prototype.actionHandler = function (playerIdx, dat){  
    let healIdx=dat[1][0];
    let poisonIdx=dat[1][1];
    if (playerList[playerIdx].status[0]>0 && healIdx!==-1 && _gameData.WolfMark!==-1){
        playerList[_gameData.WolfMark].alive = true;
        playerList[playerIdx].status[0] = 0;
        console.log("use potion saved ", playerList[_gameData.WolfMark]);
    }
    if (playerList[playerIdx].status[1]>0 && poisonIdx!==-1){
        playerList[poisonIdx].alive = false;
        playerList[playerIdx].status[1] = 0;
        console.log("use potion kill ", playerList[poisonIdx]);
    }
};
module.exports = Witch;