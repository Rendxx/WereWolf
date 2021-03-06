"use strict";

var Basic= require('../Character.Basic/Client.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
var INFO2 = require('./Info.js');

var Hunter = function () {
    Basic.call(this);
    this.canShot = true;
};
Hunter.prototype = Object.create(Basic.prototype);
Hunter.prototype.constructor = Hunter;
Hunter.DATA = require('./Data.js');

Hunter.prototype.update = function (aliveListArr, dat){
    this.canShot = dat[0]===1;
    let t = aliveListArr[this.playerIdx]==='1';
    if (t===false && this.alive){
        if (this.canShot){
            InfoBox.phase({
                title: 'You Are Dead',
                content: 'You may shoot somebody as your last action',
                className: 'info_client_phase_dead info_client_phase_dead_shot'
            });
        }else{
            InfoBox.phase({
                title: 'You Are Dead',
                content: 'Mysterious power stops you from shooting anybody...',
                className: 'info_client_phase_dead info_client_phase_dead_notshot'
            });
        }
    }
    this.alive = t;
};

Hunter.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html['wrap'].classList.add('_roleInfo_hunter');
};

module.exports = Hunter;
