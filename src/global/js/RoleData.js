var ROLECODE = require('GLOBAL/js/RoleCode.js');
var STEP = require('GLOBAL/js/StepCode.js');
var ROLEDATA = {};

ROLEDATA[ROLECODE.VILLAGER]={
  step:[STEP.DAY],
  code:ROLECODE.VILLAGER,
  name:'Villager',
  description:'Villager'
};

ROLEDATA[ROLECODE.WEREWOLF]={
  step:[STEP.DAY, STEP.WOLF],
  code:ROLECODE.WEREWOLF,
  name:'Were Wolf',
  description:'Were Wolf'
};

ROLEDATA[ROLECODE.SEER]={
  step:[STEP.DAY, STEP.SEER],
  code:ROLECODE.SEER,
  name:'Seer',
  description:'Seer'
};

ROLEDATA[ROLECODE.WITCH]={
  step:[STEP.DAY, STEP.WITCH],
  code:ROLECODE.WITCH,
  name:'Witch',
  description:'Witch'
};

ROLEDATA[ROLECODE.HUNTER]={
  step:[STEP.DAY, STEP.HUNTER],
  code:ROLECODE.HUNTER,
  name:'Hunter',
  description:'Hunter'
};

ROLEDATA[ROLECODE.IDIOT]={
  step:[STEP.DAY, STEP.IDIOT],
  code:ROLECODE.IDIOT,
  name:'Idiot',
  description:'Idiot'
};

ROLEDATA[ROLECODE.ELDER]={
  step:[STEP.DAY, STEP.ELDER],
  code:ROLECODE.ELDER,
  name:'Elder',
  description:'Elder'
};

module.exports = ROLEDATA;
