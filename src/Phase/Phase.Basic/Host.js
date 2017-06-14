"use strict";

var DATA = require('./Data.js');
var ATTR = require('../PhaseAttr.js');
var Role = require('ROLE/Role.Host.js');

var Basic = function (phaseManager) {
    this._phaseManager = phaseManager;

    this.data = DATA;
    this.characters = [];

    this._setuped = false;
    this._actionCountDownFunc = null;
    this.aliveNumber = 0;
    this.actionDat = {};
    this.onActionComplete = null;

    if (this.data.Role.length>0){
        for (let i=0;i<this.data.MinPlayer;i++){
            this.characters.push(Role(this.data.Role[0]));
        }
    }
};
Basic.prototype = Object.create(null);
Basic.prototype.constructor = Basic;

/**
 * Increase the player of phase number by 1
 * Only available before setup
 */
Basic.prototype.addCharacter = function (roleIdx){
    if (this._setuped || this.characters.length>=this.data.MaxPlayer) return;
    if (roleIdx>=this.data.Role.length || roleIdx<0) return;
    this.characters.push(Role(this.data.Role[roleIdx]));
};

/**
 * Remove the selected charactor instance
 * Only available before setup
 */
Basic.prototype.removeCharacter = function (idx){
    if (this._setuped || this.characters.length<=this.data.MinPlayer) return;
    if (idx<0 || idx>= this.characters.length) return;
    this.characters.splice(idx,1);
};

/**
 * Setup all player in this phase
 */
Basic.prototype.setup = function (playerList){
    if (this._setuped) return;
    if (playerList.length!==characters.length) throw new Error('Player number not match.');
    for (let i=0; i<playerList.length; i++){
        characters[i].setup(playerList[i]);
        characters[i].onAction = this.actionHandler.bind(this);
    }
    this._setuped = true;
};

/**
 * Active all player in this phase
 */
Basic.prototype.active = function (){
    if (!this._setuped) return;
    if (this._actionCountDownFunc!==null) {
        clearTimeout(this._actionCountDownFunc);
        this._actionCountDownFunc = null;
    }
    if (this.data.Action === ATTR.ACTION.SKIP) {
        this.onActionComplete && this.onActionComplete();
    } else if (this.data.Action === ATTR.ACTION.NO){
        if (this.data.Sound!==null) this.data.Sound.play();
        this._actionCountDownFunc = setTimeout(function(){
            this.onActionComplete && this.onActionComplete();
            this._actionCountDownFunc = null;
        },5000);
    } else {
        if (this.data.Timeout>0){
            this._actionCountDownFunc = setTimeout(function(){
                this.onActionComplete && this.onActionComplete();
                this._actionCountDownFunc = null;
            },this.data.Timeout);
        }
        this.aliveNumber = 0;
        for (let i=0;i<this.characters.length;i++){
            if (this.characters[i].alive) this.aliveNumber++;
            this.characters[i].active(this.data.Id, this.actionDat);
        }
    }
};

/**
 * Inactive all player in this phase
 */
Basic.prototype.inactive = function (){
    if (!this._setuped) return;
    if (this._actionCountDownFunc!==null) {
        clearTimeout(this._actionCountDownFunc);
        this._actionCountDownFunc = null;
    }
    
    for (let i=0;i<this.characters.length;i++){
        this.characters[i].inactive(this.data.Id);
    }
};

/**
 * Handle action from player
 */
Basic.prototype.actionHandler = function (playerIdx, dat){
    if (!this._setuped) return;
};

module.exports = Basic;