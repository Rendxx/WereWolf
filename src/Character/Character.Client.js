"use strict";
var CHARACTER_CODE = require('./CHARACTER_CODE.js');

var Character = {};
Character[CHARACTER_CODE.NONE] = require('./Character.Basic/Client.js');
Character[CHARACTER_CODE.VILLAGER] = require('./Character.Villager/Client.js');
Character[CHARACTER_CODE.WEREWOLF] = require('./Character.Werewolf/Client.js');
Character[CHARACTER_CODE.WITCH] = require('./Character.Witch/Client.js');
Character[CHARACTER_CODE.SEER] = require('./Character.Seer/Client.js');
Character[CHARACTER_CODE.HUNTER] = require('./Character.Hunter/Client.js');
Character[CHARACTER_CODE.IDIOT] = require('./Character.Idiot/Client.js');
Character[CHARACTER_CODE.SAVIOR] = require('./Character.Savior/Client.js');
Character[CHARACTER_CODE.KNIGHT] = require('./Character.Knight/Client.js');
Character[CHARACTER_CODE.HUNZI] = require('./Character.Hunzi/Client.js');
Character[CHARACTER_CODE.WEREWOLFKING] = require('./Character.WerewolfKing/Client.js');

var CharacterFacory = function (roleId){
    if (!Character.hasOwnProperty(roleId)) throw new Error('Unexpect Character: '+roleId);
    return new Character[roleId]();
};

module.exports = CharacterFacory;
