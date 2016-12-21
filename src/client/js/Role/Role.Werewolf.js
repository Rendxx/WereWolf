var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var INFO = require('CLIENT/js/Info.js');
var InfoBox = require('CLIENT/js/InfoBox.js');
var Basic = require('./Role.Basic.js');
var Action = {
    PlayerList : require('CLIENT/js/Action/Action.PlayerList.js')
};
require('CLIENT/less/Role/Role.Werewolf.less');

var WereWolf = function () {
    Basic.call(this);
    this.code = ROLECODE.WEREWOLF;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this._action = {
        playerList :new Action.PlayerList()
    };
};
WereWolf.prototype = Object.create(Basic.prototype);
WereWolf.prototype.constructor = Basic;

WereWolf.prototype.active = function (aliveListArr, voteArr){
    if (!this.alive) return;
    if (!this.actived){
        this.actived = true;
        this._html.action['container'].fadeIn(200);
        InfoBox.alert({
            content: INFO.WEREWOLF,
        });
    }
    this._action.playerList.update(aliveListArr, voteArr);
};

WereWolf.prototype.inactive = function (){
    if (!this.actived) return;
    this.actived = false;
    this._html.action['container'].fadeOut(200);
};

WereWolf.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html.info['wrap'].addClass('_role_werewolf');
};

WereWolf.prototype.initActionPanel = function (container, playerInfo){
    var that = this;
    this._html.action['container']=$(container);
    this._action.playerList.setup(container, playerInfo);
    this._action.playerList.onSelect = function (idx, number, name){
        if (!that.actived) return;

        InfoBox.check({
            content: INFO.CHECKPLAYER(number, name),
            callbackYes: function() {
                that.onActionEnd && that.onActionEnd(idx);
            }
        });
    };
    this._action.playerList.show();
};

module.exports = WereWolf;
