var ROLECODE = require('GLOBAL/js/RoleCode.js');
var STEP = require('GLOBAL/js/StepCode.js');
var ROLEDATA = {};

ROLEDATA[ROLECODE.NONE]={
  step:[],
  code:ROLECODE.NONE,
  name:'None',
  description:'None',
  handler: 'Basic'
};

ROLEDATA[ROLECODE.VILLAGER]={
  step:[STEP.DAY],
  code:ROLECODE.VILLAGER,
  name:'Villager',
  description:'Villager',
  handler: 'Villager'
};

ROLEDATA[ROLECODE.WEREWOLF]={
  step:[STEP.DAY, STEP.WOLF],
  code:ROLECODE.WEREWOLF,
  name:'Werewolf',
  description:'Werewolf',
  handler: 'Werewolf'
};

ROLEDATA[ROLECODE.SEER]={
  step:[STEP.DAY, STEP.SEER],
  code:ROLECODE.SEER,
  name:'Seer',
  description:'Seer',
  handler: 'Seer'
};

ROLEDATA[ROLECODE.WITCH]={
  step:[STEP.DAY, STEP.WITCH],
  code:ROLECODE.WITCH,
  name:'Witch',
  description:'Witch',
  handler: 'Witch'
};

ROLEDATA[ROLECODE.HUNTER]={
  step:[STEP.DAY, STEP.HUNTER],
  code:ROLECODE.HUNTER,
  name:'Hunter',
  description:'Hunter',
  handler: 'Hunter'
};

ROLEDATA[ROLECODE.IDIOT]={
  step:[STEP.DAY, STEP.IDIOT],
  code:ROLECODE.IDIOT,
  name:'Idiot',
  description:'Idiot',
  handler: 'Idiot'
};

ROLEDATA[ROLECODE.ELDER]={
  step:[STEP.DAY, STEP.ELDER],
  code:ROLECODE.ELDER,
  name:'Elder',
  description:'Elder',
  handler: 'Elder'
};

module.exports = ROLEDATA;
