"use strict";
var ROLECODE = require('./RoleCode.js');

var Role = {};
Role[ROLECODE.VILLAGER] = require('./Role.Villager/Host.js');
Role[ROLECODE.WEREWOLF] = require('./Role.Werewolf/Host.js');
Role[ROLECODE.WITCH] = require('./Role.Witch/Host.js');
Role[ROLECODE.SEER] = require('./Role.Seer/Host.js');
Role[ROLECODE.HUNTER] = require('./Role.Hunter/Host.js');
Role[ROLECODE.IDIOT] = require('./Role.Idiot/Host.js');
Role[ROLECODE.ELDER] = require('./Role.Elder/Host.js');

var RoleFactory = function (roleId){
    if (!Role.hasOwnProperty(roleId)) throw new Error('Unexpect Role: '+roleId);
    return new Role[roleId]();
};

RoleFactory.CODE = ROLECODE;
module.exports = RoleFactory;
