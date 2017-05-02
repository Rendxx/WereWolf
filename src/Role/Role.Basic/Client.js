"use strict";

var Util = require('SRC/Util.js');
var ROLEDATA = require('./Data.js');
var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
var INFO2 = require('./Info.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
require('./Client.less');

var Basic = function () {
    this.code = ROLEDATA.Code;
    this.name = ROLEDATA.Name;
    this.description = ROLEDATA.Description;
    this.instruction = ROLEDATA.Instruction;
    this.playerIdx = -1;
    this.onActionEnd = null;
    this._html = {};
    this._playerInfo = null;
    this._action = null;
    this.status = {};
    this.alive = true;
    this.actived = false;
};
Basic.prototype = Object.create(null);
Basic.prototype.constructor = Basic;

/**
 * setup basic player data
 * @param playerIdx player index
 */
Basic.prototype.setup = function (playerIdx){
    this.playerIdx = playerIdx;
};

/**
 * Day time. 
 * Be triggered when day come. 
 */
Basic.prototype.dayTime = function (){
    if (this.alive){
        InfoBox.alert2({
            title: 'Day Time',
            content: 'Find out the werewolf and execute it!',
            className: 'info_client_phase_day'
        });
    }
    this.inactive();
};

/**
 * Show and update action panel.
 * Be triggered when this player active at night.
 * @param aliveListArr alive list of all player
 * @param dat action data
 */
Basic.prototype.active = function (aliveListArr, dat){
    this.actived = true;
};

/**
 * Hide action panel.
 */
Basic.prototype.inactive = function (){
    this.actived = false;
    this._action.hide();
    InfoBox.hide();
};

/**
 * Update player status.
 * @param aliveListArr alive list of all player
 * @param dat palyer status
 */
Basic.prototype.update = function (aliveListArr, dat){
    var t = aliveListArr[this.playerIdx]==='1';
    if (t===false && this.alive){
        InfoBox.alert2({
            title: 'You Are Dead',
            content: 'Rest In Peace',
            className: 'info_client_phase_dead'
        });
    }
    this.alive = t;
};

/**
 * Show action result panel.
 * @param dat action result
 */
Basic.prototype.actionResult = function (dat){
};

/**
 * Init information panel.
 * @param container container for information panel
 */
Basic.prototype.initInfoPanel = function (container){
    let wrap = Util.CreateDom('<div class="_roleInfo"></div>', container);
    let icon = Util.CreateDom('<div class="_icon"></div>', wrap);
    let name = Util.CreateDom('<div class="_name">{ '+this.name+' }</div>', wrap);
    let instruction = Util.CreateDom('<div class="_instruction">'+this.instruction+'</div>', wrap);

    this._html['wrap'] = wrap;
    this._html['icon'] = icon;
    this._html['name'] = name;
    this._html['instruction'] = instruction;
};


/**
 * Init action panel.
 * @param actionPanel actionPanel instance
 * @param playerInfo all player information
 */
Basic.prototype.initActionPanel = function (actionPanel, playerInfo){
    this._action = actionPanel;
    this._playerInfo = playerInfo;
};

/**
 * Dispose resource.
 */
Basic.prototype.dispose=function(){
}; 

module.exports = Basic;
