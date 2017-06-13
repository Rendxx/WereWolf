"use strict";

var Basic= require('../Role.Basic/Host.js');
var ATTR = require('./Attr.js');
var ROLEDATA = require('./Data.js');

var Witch = function () {
    Basic.call(this);
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
    this.portrait = ROLEDATA.Portrait;
    this.isGood = ROLEDATA.IsGood;

    this.status = [1,1,0,0];  // [good potion #, bad potion #, can self-healing, can self-healing 1st night]
};
Witch.prototype = Object.create(Basic);
Witch.prototype.constructor = Witch;

Witch.prototype.setAttr = function (attr){
    this.status[2] = ((attr&ATTR.SELF_HEAL)>0)?1:0;
    this.status[3] = ((attr&ATTR.SELF_HEAL_NIGHT_ONE)>0)?1:0;
};

/**
 * Update player status. 
 * @param {object} opts {good: good potion #, bad: bad potion #}
 */
Witch.prototype.updateStatus = function (opts){
    if (opts.hasOwnProperty('good')) this.status[0] = opts['good'];
    if (opts.hasOwnProperty('bad')) this.status[1] = opts['bad'];
};

Witch.prototype.goodPotionNumber = function (){
    this.status[2] = ((attr&ATTR.SELF_HEAL)>0)?1:0;
    this.status[3] = ((attr&ATTR.SELF_HEAL_NIGHT_ONE)>0)?1:0;
};

module.exports = Witch;
