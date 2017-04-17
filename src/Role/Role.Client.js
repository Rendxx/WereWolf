"use strict";
var ROLECODE = require('./RoleCode.js');

var Role = {};
Role[ROLECODE.NONE] = require('./Role.Basic/Client.js');
Role[ROLECODE.WEREWOLF] = require('./Role.Werewolf/Client.js');

var RoleFacory = function (roleId){
    if (!Role.hasOwnProperty(roleId)) throw new Error('Unexpect Role: '+roleId);
    return new Role[roleId]();
};

module.exports = RoleFacory;
