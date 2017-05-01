"use strict";
var ROLECODE = require('GLOBAL/content/RoleCode.js');

var Data = {
    Code: ROLECODE.WITCH,
    Name: 'Witch',
    Description: 'You have 2 potions. One to save the werewolves\'s victim, one to eliminate a player. You can only use 1 potion in the same night.',
    Instruction: 'Wake up at night and murder somebody.',
    Status:{
        /* name: number */
    }
};

module.exports = Data;
