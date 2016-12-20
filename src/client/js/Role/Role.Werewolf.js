var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var INFO = require('CLIENT/js/Info.js');
var InfoBox = require('CLIENT/js/InfoBox.js');
var Basic = require('./Role.Basic.js');
require('CLIENT/less/Role/Role.Werewolf.less');

var HTML = {
    wrap: '<div class="_playerList"></div>',
    space: '<div class="_space"></div>',

    player: {
      wrap: '<div class="_player"></div>',
      number: '<div class="_number"></div>',
      name: '<div class="_name"></div>',
      vote: '<div class="_vote"></div>',
      voteMarker: '<div class="_voteMarker"></div>',
    },
};

var CSS = {
    alive: '_alive'
};

var WereWolf = function () {
    Basic.call(this);
    this.code = ROLECODE.WEREWOLF;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
};
WereWolf.prototype = Object.create(Basic.prototype);
WereWolf.prototype.constructor = Basic;

WereWolf.prototype.active = function (aliveList, voteArr){
    if (!this.alive) return;
    if (!this.actived){
        this.actived = true;
        this._html.action['container'].fadeIn(200);
        InfoBox.alert({
            content: INFO.WEREWOLF,
        });
    }
    for (var i=0;i<this._html.action['player'].length;i++){
        if (aliveList[i]==='1') this._html.action['player'][i].wrap.addClass(CSS.alive);
        else this._html.action['player'][i].wrap.removeClass(CSS.alive);
        this._html.action['player'][i].vote.empty();
    }
    if (voteArr==null) return;
    for (var i=0;i<voteArr.length;i++){
        if (voteArr[i]===-1) continue;
        this._html.action['player'][voteArr[i]].vote.append(this._html.action['voteCache'][i]);
    }
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
        pkg['vote'] = $(HTML.player.vote).appendTo(pkg['wrap']);
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


    this._html.action['voteCache'] = [];
    for (var i=0;i<playerInfo.length;i++){
        this._html.action['voteCache'].push($(HTML.player.voteMarker).text(playerInfo[i][0]));
    }
};

module.exports = WereWolf;
