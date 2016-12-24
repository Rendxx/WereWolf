var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var INFO = require('CLIENT/js/Info.js');
var InfoBox = require('CLIENT/js/InfoBox.js');
var Basic = require('./Role.Basic.js');
var Action = {
    PlayerList : require('CLIENT/js/Action/Action.PlayerList.js')
};
require('CLIENT/less/Role/Role.Seer.less');

var Seer = function () {
    Basic.call(this);
    this.code = ROLECODE.SEER;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this.lastRoleInfo = null;
    this._playerInfo = null;
    this._action = {
        playerList :new Action.PlayerList()
    };
};
Seer.prototype = Object.create(Basic.prototype);
Seer.prototype.constructor = Basic;

Seer.prototype.active = function (aliveListArr){
    if (!this.alive) return;
    if (!this.actived){
        this.actived = true;
        this._html.action['container'].fadeIn(200);
        InfoBox.alert({
            content: INFO.SEER,
        });
        this._action.playerList.show();
        this._action.playerList.update(aliveListArr);
    }
};

Seer.prototype.inactive = function (){
    this._html.action['container'].fadeOut(200);
    if (!this.actived) return;
    this.actived = false;
};

Seer.prototype.update = function (aliveListArr, dat){
    Basic.prototype.update.call(this,aliveListArr, dat);
    if (dat==null) return;
    this.lastRoleInfo = dat;
    if (!this._playerInfo.hasOwnProperty(dat[0])){
    } else {
        this._html.info['msg'].html('Player [No.'+dat[0]+'] is <b>'+ROLEDATA[dat[1]].name+'</b>');
    }
};

Seer.prototype.showRst = function (dat){
    if (dat==null||dat.length==0) {
      this._html.action['container'].fadeOut(200);
      return;
    }

    if (!this._playerInfo.hasOwnProperty(dat[0])){
        InfoBox.alert({
            content: 'You did not see anyone this night',
            callback: function() {
              this._html.action['container'].fadeOut(200);
            }.bind(this)
        });
        return;
    }

    var p = this._playerInfo[dat[0]];
    var isGood = dat[1]===0;
    InfoBox.alert({
        content: INFO.SEER_RESULT(p[0], p[1], isGood),
        callback: function() {
          this._html.action['container'].fadeOut(200);
        }.bind(this)
    });
};

Seer.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html.info['msg'] = $('<div class="_msg">[You haven\'t seen yet]</div>').appendTo(this._html.info['wrap']);
    this._html.info['wrap'].addClass('_role_seer');
};

Seer.prototype.initActionPanel = function (container, playerInfo){
    var that = this;
    this._playerInfo = playerInfo;
    this._html.action['container']=$(container);
    this._action.playerList.setup(container, playerInfo, 'Choose your target');
    this._action.playerList.onSelect = function (idx, number, name){
        if (!that.actived) return;

        InfoBox.check({
            content: INFO.SHOWPLAYER(number, name),
            callbackYes: function() {
                that.onActionEnd && that.onActionEnd([idx]);
                that._action.playerList.hide();
            }
        });
    };
    this._action.playerList.onAbstain = function (){
        if (!that.actived) return;

        InfoBox.check({
            content: 'Are you sure you want give up this opportunity?',
            callbackYes: function() {
                that.onActionEnd && that.onActionEnd([-1]);
                that._action.playerList.hide();
            }
        });
    };
    this._action.playerList.show();
};

module.exports = Seer;
