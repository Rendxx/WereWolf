"use strict";

var ROLEDATA = require('./Data.js');
var ATTR = require('./Attr.js');
var ACTIVECODE = require('GLOBAL/content/ActiveCode.js');

/**
 * Role instance for host.
 */
var Basic = function () {
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
    this.portrait = ROLEDATA.Portrait;
    this.isGood = ROLEDATA.IsGood;

    this.status = null;
    this.player = null;
    this.alive = true;
    this.actived = false;
    this._aliveList = null;

    this.onAction = null;
};
Basic.prototype = Object.create(null);
Basic.prototype.constructor = Basic;

/**
 * set role attribute 
 * @param {number} attr attribute bit-array
 */
Basic.prototype.setAttr = function (attr){
};

/**
 * setup player instance
 * @param {Player} player player instance
 */
Basic.prototype.setup = function (player){
    this.player = player;
    this.player.onAction = function (playerIdx, dat){
        if (!this.alive) return;
        this.onAction && this.onAction(playerIdx, dat);
    };
};

/**
 * reset Role instance
 * @param {object} opts role data options
 */
Basic.prototype.reset = function (opts){
    this.setup(opts.player);
    this.alive = opts.alive;
    this.actived = opts.actived;
    this._aliveList = opts.aliveList;
    this.status = opts.status;
};

/**
 * Send active message. 
 * @param {number} phase phase id
 * @param {object} actionDat action data
 */
Basic.prototype.active = function (phase, actionDat){
    this.actived = ACTIVECODE.YES;
    this.player.update({
        phase: phase,
        actived: this.actived,
        alive: this._aliveList,
        status: this.status,
        action: actionDat
    });
};

/**
 * Send inactive message. 
 * @param {number} phase phase id
 */
Basic.prototype.inactive = function (phase){
    this.actived = ACTIVECODE.NO;
    this.player.update({
        phase: phase,
        actived: this.actived,
        alive: this._aliveList,
        status: this.status
    });
};

/**
 * Send action result message. 
 * @param {number} phase phase id
 * @param {object} rstDat result data
 */
Basic.prototype.actionResult = function (phase, rstDat){
    this.actived = ACTIVECODE.RESULT;
    this.player.update({
        phase: phase,
        actived: this.actived,
        alive: this._aliveList,
        status: this.status,
        result: rstDat
    });
};

/**
 * Update alive list. 
 * @param {string} aliveList
 */
Basic.prototype.updateAliveList = function (aliveList){
    this._aliveList = aliveList;
};

/**
 * Update player status. 
 * @param {object} opts
 */
Basic.prototype.updateStatus = function (opts){
};

/**
 * Set the player alive or not. 
 * @param {boolean} isAlive
 */
Basic.prototype.setAlive = function (isAlive){
    this.alive = isAlive;
};

/**
 * Dispose resource.
 */
Basic.prototype.dispose=function(){
}; 

module.exports = Basic;
