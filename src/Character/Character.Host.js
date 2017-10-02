"use strict";
var CHARACTER_CODE = require('./CHARACTER_CODE.js');

var Character = {};
Character[CHARACTER_CODE.VILLAGER] = require('./Character.Villager/Host.js');
Character[CHARACTER_CODE.WEREWOLF] = require('./Character.Werewolf/Host.js');
Character[CHARACTER_CODE.WITCH] = require('./Character.Witch/Host.js');
Character[CHARACTER_CODE.SEER] = require('./Character.Seer/Host.js');
Character[CHARACTER_CODE.HUNTER] = require('./Character.Hunter/Host.js');
Character[CHARACTER_CODE.IDIOT] = require('./Character.Idiot/Host.js');
Character[CHARACTER_CODE.ELDER] = require('./Character.Elder/Host.js');
Character[CHARACTER_CODE.SAVIOR] = require('./Character.Savior/Host.js');

var RoleFactory = function (roleId){
    if (!Character.hasOwnProperty(roleId)) throw new Error('Unexpect Character: '+roleId);
    return Character[roleId];
};

RoleFactory.CODE = CHARACTER_CODE;
module.exports = RoleFactory;
