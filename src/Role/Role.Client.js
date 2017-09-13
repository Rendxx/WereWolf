"use strict";
var ROLECODE = require('./RoleCode.js');

var Role = {};
Role[ROLECODE.NONE] = require('./Role.Basic/Client.js');
Role[ROLECODE.VILLAGER] = require('./Role.Villager/Client.js');
Role[ROLECODE.WEREWOLF] = require('./Role.Werewolf/Client.js');
Role[ROLECODE.WITCH] = require('./Role.Witch/Client.js');
Role[ROLECODE.SEER] = require('./Role.Seer/Client.js');
Role[ROLECODE.HUNTER] = require('./Role.Hunter/Client.js');
Role[ROLECODE.IDIOT] = require('./Role.Idiot/Client.js');

var RoleFacory = function (roleId){
    if (!Role.hasOwnProperty(roleId)) throw new Error('Unexpect Role: '+roleId);
    return new Role[roleId]();
};

module.exports = RoleFacory;
