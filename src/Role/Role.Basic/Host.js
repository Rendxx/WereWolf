"use strict";

var ROLEDATA = require('./Data.js');
var ATTR = require('./Attr.js');
var ACTIVECODE = require('GLOBAL/content/ActiveCode.js');

/**
 * Role instance for host.
 */
var Basic = function () {
    this._setData(ROLEDATA);

    this.status = null;
    this.player = null;
    this.alive = true;
    this.actived = false;

    this.onAction = null;
};
Basic.prototype = Object.create(null);
Basic.prototype.constructor = Basic;

/**
 * set role data
 * @param {object} data role data package
 */
Basic.prototype._setData = function (data){
    this.code = data.Code;
    this.name = data.Name;
    this.description = data.Description;
    this.instruction = data.Instruction;
    this.portrait = data.Portrait;
    this.isGood = data.IsGood;
};


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
 * @param {object} dat role data options
 */
Basic.prototype.reset = function (player, dat){
    this.setup(player);
    this.alive = (dat[0]==1);
    this.actived = (dat[1]==1);
    this.status = dat[2];
};

/**
 * get Role instance data
 */
Basic.prototype.getData = function (){
    return [
        this.alive ? 1: 0,
        this.actived ? 1: 0,
        this.status,
    ];
};

/**
 * Send active message.
 * @param {object} generalDat general data
 * @param {object} actionDat action data
 */
Basic.prototype.active = function (generalDat, actionDat){
    this.actived = ACTIVECODE.YES;
    this.player.update({
        phase: generalDat.phase,
        alive: generalDat.aliveList,
        actived: this.actived,
        status: this.status,
        action: actionDat
    });
};

/**
 * Send inactive message.
 * @param {object} generalDat general data
 */
Basic.prototype.inactive = function (generalDat){
    this.actived = ACTIVECODE.NO;
    this.player.update({
        phase: generalDat.phase,
        alive: generalDat.aliveList,
        actived: this.actived,
        status: this.status
    });
};

/**
 * Send action result message.
 * @param {object} generalDat general data
 * @param {object} rstDat result data
 */
Basic.prototype.actionResult = function (generalDat, rstDat){
    this.actived = ACTIVECODE.RESULT;
    this.player.update({
        phase: generalDat.phase,
        alive: generalDat.aliveList,
        actived: this.actived,
        status: this.status,
        result: rstDat
    });
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
