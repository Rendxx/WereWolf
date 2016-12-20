var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var INFO = require('CLIENT/js/Info.js');
var InfoBox = require('CLIENT/js/InfoBox.js');
var Basic = require('./Role.Basic.js');
require('CLIENT/less/Role/Role.Seer.less');

var HTML = {
    wrap: '<div class="_playerList"></div>',
    space: '<div class="_space"></div>',

    player: {
      wrap: '<div class="_player"></div>',
      number: '<div class="_number"></div>',
      name: '<div class="_name"></div>'
    },
};

var CSS = {
    alive: '_alive'
};

var Seer = function () {
    Basic.call(this);
    this.code = ROLECODE.SEER;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this.lastRoleInfo = null;
};
Seer.prototype = Object.create(Basic.prototype);
Seer.prototype.constructor = Basic;

Seer.prototype.active = function (aliveList){
    if (!this.alive) return;
    if (!this.actived){
        this.actived = true;
        this._html.action['container'].fadeIn(200);
        InfoBox.alert({
            content: INFO.SEER,
        });
    }
    for (var i=0;i<this._html.action['player'].length;i++){
        if (aliveList[i]==='1') this._html.action['player'][i].wrap.addClass(CSS.alive);
        else this._html.action['player'][i].wrap.removeClass(CSS.alive);
    }
};

Seer.prototype.inactive = function (){
    if (!this.actived) return;
    this.actived = false;
    this._html.action['container'].fadeOut(200);
};

Seer.prototype.update = function (dat){
    this.lastRoleInfo = dat;
    this._html.info['msg'].html('Player [No.'+dat[0]+'] is <b>'+ROLEDATA[dat[1]].name+'</b>');
};

Seer.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html.info['msg'] = $('<div class="_msg">[You haven\'t seen yet]</div>').appendTo(this._html.info['wrap']);
    this._html.info['wrap'].addClass('_role_seer');
};

Seer.prototype.initActionPanel = function (container, playerInfo){
    this._html.action['container']=$(container);
    this._html.action['wrap']=$(HTML.wrap).appendTo(this._html.action['container']);
    this._html.action['player']=[];

    var that = this;
    var selectPlayer = function (idx, number, name){
        if (!that.actived) return;

        InfoBox.check({
            content: INFO.CHECKPLAYER(number, name),
            callbackYes: function() {
                that.onActionEnd && that.onActionEnd(idx);
            }
        });
    };

    var addPlayer = function (idx, number, name){
        var pkg = {};
        pkg['wrap'] = $(HTML.player.wrap).appendTo(that._html.action['wrap']);
        pkg['number'] = $(HTML.player.number).appendTo(pkg['wrap']).text(number);
        pkg['name'] = $(HTML.player.name).appendTo(pkg['wrap']).text(name);
        pkg['wrap'].addClass(CSS.alive);
        that._html.action['player'][idx] = pkg;
        pkg['wrap'].click(function(e){
          if (!pkg['wrap'].hasClass(CSS.alive)) return false;
          selectPlayer(idx, number, name);
         });
        return pkg;
    };
    this._html.action['space'] = $(HTML.space).appendTo(this._html.action['wrap']);
    for (var i=0;i<playerInfo.length;i++){
        addPlayer(i, playerInfo[i][0],playerInfo[i][1]);
    }
    this._html.action['space2'] = $(HTML.space).appendTo(this._html.action['wrap']);
};

module.exports = Seer;
