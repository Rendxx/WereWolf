var ROLECODE = require('GLOBAL/js/RoleCode.js');
var PHASE = require('GLOBAL/js/PhaseCode.js');
var ROLEDATA = {};

ROLEDATA[ROLECODE.NONE]={
  step:[],
  code:ROLECODE.NONE,
  name:'None',
  description:'None',
  handler: 'Basic'
};

ROLEDATA[ROLECODE.VILLAGER]={
  step:[PHASE.DAY],
  code:ROLECODE.VILLAGER,
  name:'Villager',
  description:'Villager',
  handler: 'Villager'
};

ROLEDATA[ROLECODE.WEREWOLF]={
  step:[PHASE.DAY, PHASE.WOLF],
  code:ROLECODE.WEREWOLF,
  name:'Werewolf',
  description:'Werewolf',
  handler: 'Werewolf'
};

ROLEDATA[ROLECODE.SEER]={
  step:[PHASE.DAY, PHASE.SEER],
  code:ROLECODE.SEER,
  name:'Seer',
  description:'Seer',
  handler: 'Seer'
};

ROLEDATA[ROLECODE.WITCH]={
  step:[PHASE.DAY, PHASE.WITCH],
  code:ROLECODE.WITCH,
  name:'Witch',
  description:'Witch',
  handler: 'Witch'
};

ROLEDATA[ROLECODE.HUNTER]={
  step:[PHASE.DAY, PHASE.HUNTER],
  code:ROLECODE.HUNTER,
  name:'Hunter',
  description:'Hunter',
  handler: 'Hunter'
};

ROLEDATA[ROLECODE.IDIOT]={
  step:[PHASE.DAY, PHASE.IDIOT],
  code:ROLECODE.IDIOT,
  name:'Idiot',
  description:'Idiot',
  handler: 'Idiot'
};

ROLEDATA[ROLECODE.ELDER]={
  step:[PHASE.DAY, PHASE.ELDER],
  code:ROLECODE.ELDER,
  name:'Elder',
  description:'Elder',
  handler: 'Elder'
};

module.exports = ROLEDATA;
