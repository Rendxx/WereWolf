"use strict";

var Basic = function (sendFunction) {
    this.id = 0;
    this.name = '';
    this.icon = '';
    this.description = '';
    this.timeout = 60000;
    this.skip = false;


    this.playerList = [];
    this.phasePlayerIdx = [];
    this.playerNumber = 1;
    this._CharacterClass = null;

    this._setuped = false;
    this._send = sendFunction;
};
Basic.prototype = Object.create(null);
Basic.prototype.constructor = Basic;

/**
 * Increase the player of phase number by 1
 * Only available before setup
 */
Basic.prototype.increasePlayer = function (){
    if (this._setuped) return;
    this.playerNumber++;
};

/**
 * Decrease the player of phase number by 1
 * Only available before setup
 */
Basic.prototype.decreasePlayer = function (){
    if (this._setuped) return;
    this.playerNumber--;
};

/**
 * Setup all palyer in this phase
 */
Basic.prototype.setup = function (playerList){
    if (this._setuped) return;
    this.playerList = playerList;
    this.phasePlayerIdx = [];
    for (let i=0;i<playerList.length;i++){
        if (playerList[i] instanceof this._CharacterClass){
            this.phasePlayerIdx.push(i);
            playerList[i].onAction = this.actionHandler.bind(this);
        }
    }
    this._setuped = true;
};

/**
 * Reset the phase
 */
Basic.prototype.reset = function (number, playerList){
    this.playerNumber = number;
    this.setup(playerList);
};

/**
 * Active all player in this phase
 */
Basic.prototype.active = function (){
    if (!this._setuped) return;
};

/**
 * Inactive all player in this phase
 */
Basic.prototype.inactive = function (){
    if (!this._setuped) return;
};

/**
 * Update message
 */
Basic.prototype.update = function (){
    if (!this._setuped) return;
};

/**
 * Handle action from player
 */
Basic.prototype.actionHandler = function (playerIdx, dat){
    if (!this._setuped) return;
};


module.exports = Basic;