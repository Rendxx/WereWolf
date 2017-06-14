"use strict";
var PHASECODE = require('./PhaseCode.js');
var Phase = require('./Phase.Host.js');

var PhaseManager = function (){
    this.list = [];
};
PhaseManager.prototype = Object.create(null);
PhaseManager.prototype.constructor = PhaseManager;

PhaseManager.prototype.add = function (phaseId){

};

PhaseManager.prototype.remove = function (idx){

};

PhaseManager.prototype.setup = function (){

};

module.exports = PhaseManager;
