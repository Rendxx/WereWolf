var ROLECODE = require('./js/RoleCode.js')
var ROLE = {};

ROLE[ROLECODE.VILLAGER]={
  code:ROLECODE.VILLAGER,
  name:'Villager',
  description:'Villager'
};

ROLE[ROLECODE.WEREWOLF]={
  code:ROLECODE.WEREWOLF,
  name:'Were Wolf',
  description:'Were Wolf'
};

ROLE[ROLECODE.SEER]={
  code:ROLECODE.SEER,
  name:'Seer',
  description:'Seer'
};

ROLE[ROLECODE.WITCH]={
  code:ROLECODE.WITCH,
  name:'Witch',
  description:'Witch'
};

ROLE[ROLECODE.HUNTER]={
  code:ROLECODE.HUNTER,
  name:'Hunter',
  description:'Hunter'
};

ROLE[ROLECODE.IDIOT]={
  code:ROLECODE.IDIOT,
  name:'Idiot',
  description:'Idiot'
};

ROLE[ROLECODE.ELDER]={
  code:ROLECODE.ELDER,
  name:'Elder',
  description:'Elder'
};

module.exports = ROLE;
