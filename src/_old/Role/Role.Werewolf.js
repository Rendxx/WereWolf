var ROLECODE = require('GLOBAL/content/RoleCode.js');
var ROLEDATA = require('GLOBAL/content/RoleData.js');
var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
var Basic = require('./Role.Basic.js');
var Action = {
    PlayerList : require('CLIENT/content/Action/Action.PlayerList.js')
};
require('./Role.Werewolf.less');

var WereWolf = function () {
    Basic.call(this);
    this.code = ROLECODE.WEREWOLF;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this._playerInfo = null;
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
        this._action.playerList.show();
    }
    this._action.playerList.update(aliveListArr, voteArr);
};

WereWolf.prototype.inactive = function (){
    this._html.action['container'].fadeOut(200);
    if (!this.actived) return;
    this.actived = false;
};

WereWolf.prototype.showRst = function (dat){
    this._action.playerList.hide();
    if (dat==null||dat.length==0) {
      this._html.action['container'].fadeOut(200);
      return;
    }
    if (!this._playerInfo.hasOwnProperty(dat[0])){
        InfoBox.alert({
            content: 'You did not murder anyone this night',
            callback: function() {
              this._html.action['container'].fadeOut(200);
            }.bind(this)
        });
    } else {
        var p = this._playerInfo[dat[0]];
        InfoBox.alert({
            content: INFO.SHOWPLAYER(p[0], p[1],'This player has been murdered'),
            callback: function() {
              this._html.action['container'].fadeOut(200);
            }.bind(this)
        });
    }
};

WereWolf.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html.info['wrap'].addClass('_role_werewolf');
};

WereWolf.prototype.initActionPanel = function (container, playerInfo){
    var that = this;
    this._playerInfo=playerInfo;
    this._html.action['container']=$(container);
    this._action.playerList.setup(this.playerIdx, container, playerInfo, 'Choose your target');
    this._action.playerList.onSelect = function (idx, number, name){
        if (!that.actived) return;

        InfoBox.check({
            content: INFO.SHOWPLAYER(number, name),
            callbackYes: function() {
                that.onActionEnd && that.onActionEnd([idx]);
            }
        });
    };
    this._action.playerList.onAbstain = function (){
        if (!that.actived) return;

        InfoBox.check({
            content: 'Are you sure you want to abstain?<br/>Noobdy will be murdered if all werewolvies abstain.',
            callbackYes: function() {
                that.onActionEnd && that.onActionEnd([-1]);
            }
        });
    };
    this._action.playerList.hide();
};

module.exports = WereWolf;
