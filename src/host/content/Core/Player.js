"use strict";
var MSGCODE = require('GLOBAL/content/MessageCode.js');

/**
 * Player instance. 
 * Contains player information and manage all player's connection.
 * 
 * @param {number} id 
 * @param {number} number 
 * @param {string} name 
 */
var Player = function (id, number, name, playerIdx) {
    this.id = id;
    this.playerIdx = playerIdx;
    this.number = number;
    this.name = name;
    this.onUpdate = null;
    this.onAction = null;
};

/**
 * Update player's status & action to client side
 * @param {object} opts 
 */
Player.prototype.update = function (opts) {
    this.onUpdate([this.id], [
            MSGCODE.HOST.UPDATE,
            opts.phase,
            opts.actived,
            opts.alive,
            opts.status,
            opts.action || [],
            opts.result || []
        ]
    );
};

/**
 * Show end screen at client side
 * @param {object} isWin whether this player win
 */
Player.prototype.end = function (isWin) {
    this.onUpdate([this.id], [
            MSGCODE.HOST.END,
            isWin?1:0
        ]
    );
};

/**
 * Receive message from client
 * @param {object} dat action data
 */
Player.prototype.receiveAction = function (dat) {
    this.onAction(this.playerIdx, dat);
};

module.exports = Player;
