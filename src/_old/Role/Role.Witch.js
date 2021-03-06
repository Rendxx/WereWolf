var ROLECODE = require('GLOBAL/content/RoleCode.js');
var ROLEDATA = require('GLOBAL/content/RoleData.js');
var INFO = require('CLIENT/content/InfoBox/Info.Content.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
var Basic = require('./Role.Basic.js');
var Action = {
    Choice : require('CLIENT/content/Action/Action.Choice.js'),
    PlayerList : require('CLIENT/content/Action/Action.PlayerList.js')
};
require('./Role.Witch.less');

var Witch = function () {
    Basic.call(this);
    this.code = ROLECODE.WITCH;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this.potion = [0, 0];
    this._playerInfo = null;
    this._action = {
        choice: new Action.Choice(),
        playerList :new Action.PlayerList()
    };
};
Witch.prototype = Object.create(Basic.prototype);
Witch.prototype.constructor = Basic;

Witch.prototype.active = function (aliveListArr, killedArr){
    if (!this.alive) return;
    if (!this.actived){
        this.actived = true;
        this._html.action['container'].fadeIn(200);
        InfoBox.alert({
            content: INFO.WITCH,
        });

        if (this.potion[0]===0 && this.potion[1]===0){
            var that = this;
            InfoBox.alert({
                content: 'You have no potion.',
                callback:function(){
                    that.onActionEnd && that.onActionEnd([-1, -1]);
                }
            });
            this._action.choice.hide();
            this._action.playerList.hide();
        }else{
            this._action.choice.show();
            this._action.playerList.hide();

            if (this.potion[0]>0 && killedArr[0]==-1){
                this._action.choice.update(-1, null, null, 'Nobody was murdered this night.', false);
            } else if (this.potion[0]===0 || killedArr[0]===-1){
                this._action.choice.update(-1, null, null, 'You have no healing potion.', false);
            } else if (this.potion[0]>0 && killedArr[0]===this.playerIdx){
                this._action.choice.update(-1, null, null, 'You are murdered.<br/>You cannot heal yourself.', false);
            } else {
                var playerInfo = this._playerInfo[killedArr[0]];
                this._action.choice.update(killedArr[0], playerInfo[0], playerInfo[1], 'This player is murdered this night<br/>Do you want to heal he/she?', true);
            }
        }

        this._action.playerList.update(aliveListArr);
    }
};

Witch.prototype.inactive = function (){
    this._html.action['container'].fadeOut(200);
    if (!this.actived) return;
    this.actived = false;
};

Witch.prototype.update = function (aliveListArr, dat){
  Basic.prototype.update.call(this,aliveListArr, dat);
    if (dat==null) return;
    this.potion = dat;
    this._html.info['healer'].text(this.potion[0]===1?'Yes':'No');
    this._html.info['poison'].text(this.potion[1]===1?'Yes':'No');
};

Witch.prototype.showRst = function (dat){
    if (dat==null||dat.length==0) {
      this._html.action['container'].fadeOut(200);
      return;
    }
    if (dat[0]==-1 && dat[1]==-1) {
      InfoBox.alert({
          content: 'Nothing happened.',
          callback: function() {
              this._html.action['container'].fadeOut(200);
          }.bind(this)
      });
      return;
    }
    var idx = dat[0]==-1?dat[1]:dat[0];
    var isHealed = dat[0]!=-1;
    var p = this._playerInfo[idx];
    InfoBox.alert({
        content: INFO.WITCH_RESULT(p[0], p[1],isHealed),
        callback: function() {
            this._html.action['container'].fadeOut(200);
        }.bind(this)
    });
};

Witch.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html.info['healer'] = $('<div class="_potion _healer">?</div>').appendTo(this._html.info['wrap']);
    this._html.info['poison'] = $('<div class="_potion _poison">?</div>').appendTo(this._html.info['wrap']);
    this._html.info['wrap'].addClass('_role_witch');
};

Witch.prototype.initActionPanel = function (container, playerInfo){
    var that = this;
    this._playerInfo=playerInfo;
    this._html.action['container']=$(container);

    // choice
    this._action.choice.setup(this.playerIdx, container, 'Healer');
    this._action.choice.onYes = function (idx){
        if (!that.actived) return; 
        that.onActionEnd && that.onActionEnd([idx,-1]);
        that._action.choice.hide();
    };

    this._action.choice.onNo = function (){
        if (!that.actived) return;
        if (that.potion[0]>0){
            that._action.choice.hide();
            that._action.playerList.show();
            setTimeout(function(){
              InfoBox.alert({
                  content: INFO.WITCH_POISON,
              });
            },1);
        } else if (that.potion[1]>0){
            that._action.choice.hide();
            that._action.playerList.show();
            InfoBox.alert({
                content: INFO.WITCH_POISON,
            });
        } else {
            that._action.choice.hide();
            that._action.playerList.hide();
            InfoBox.alert({
                content: INFO.WITCH_NO_POISON,
                callback: function(){
                      that.onActionEnd && that.onActionEnd([-1, -1]);
                }
            });
        }
    };
    this._action.choice.onOk = function (){
        if (that.potion[1]>0){
            that._action.choice.hide();
            that._action.playerList.show();
            InfoBox.alert({
                content: INFO.WITCH_POISON,
            });
        } else {
            that._action.choice.hide();
            that._action.playerList.hide();
            InfoBox.alert({
                content: INFO.WITCH_NO_POISON,
                callback: function(){
                      that.onActionEnd && that.onActionEnd([-1, -1]);
                }
            });
        }
    };

    // player list
    this._action.playerList.setup(this.playerIdx, container, playerInfo, 'Poison');
    this._action.playerList.onSelect = function (idx, number, name){
        if (!that.actived) return;

        if (that.potion[1]>0){
          InfoBox.check({
              content: INFO.SHOWPLAYER(number, name, 'Make sure you want to poison this player?'),
              callbackYes: function() {
                  that.onActionEnd && that.onActionEnd([-1, idx]);
                  that._action.playerList.hide();
              }
          });
        }else{
            that.onActionEnd && that.onActionEnd([-1, -1]);
            that._action.playerList.hide();
        }
    };
    this._action.playerList.onAbstain = function (){
        if (!that.actived) return;

        InfoBox.check({
            content: 'Are you sure you don\'t want to poison anyone?',
            callbackYes: function() {
                that.onActionEnd && that.onActionEnd([-1, -1]);
                that._action.playerList.hide();
            }
        });
    };
    that._action.choice.hide();
    this._action.playerList.hide();
};
module.exports = Witch;
