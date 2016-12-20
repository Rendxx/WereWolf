var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var INFO = require('CLIENT/js/Info.js');
var InfoBox = require('CLIENT/js/InfoBox.js');
var Basic = require('./Role.Basic.js');
require('CLIENT/less/Role/Role.Witch.less');

var HTML = {
    healPanel: '<div class="_playerList _healPanel"></div>',
    poisonPanel: '<div class="_playerList _poisonPanel"></div>',
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

var Witch = function () {
    Basic.call(this);
    this.code = ROLECODE.WITCH;
    this.name = ROLEDATA[this.code].name;
    this.description = ROLEDATA[this.code].description;
    this.potion = [0, 0];
};
Witch.prototype = Object.create(Basic.prototype);
Witch.prototype.constructor = Basic;

Witch.prototype.active = function (dat){

};

Witch.prototype.update = function (dat){
    this.potion = dat;
};

Witch.prototype.initInfoPanel = function (container){
    Basic.prototype.initInfoPanel.call(this,container);
    this._html.info['healer'] = $('<div class="_potion _healer">?</div>').appendTo(this._html.info['wrap']);
    this._html.info['poison'] = $('<div class="_potion _poison">?</div>').appendTo(this._html.info['wrap']);
    this._html.info['wrap'].addClass('_role_witch');
};

Witch.prototype.initActionPanel = function (container, playerInfo){
    this._html.action['container']=$(container);
    this._html.action['healPanel']=$(HTML.healPanel).appendTo(this._html.action['container']);
    this._html.action['poisonPanel']=$(HTML.poisonPanel).appendTo(this._html.action['container']);
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
        pkg['wrap'] = $(HTML.player.wrap).appendTo(that._html.action['poisonPanel']);
        pkg['number'] = $(HTML.player.number).appendTo(pkg['wrap']).text(number>=0?number:'');
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
    addPlayer(playerInfo.length, -1, 'Nobody');
    for (var i=0;i<playerInfo.length;i++){
        addPlayer(i, playerInfo[i][0],playerInfo[i][1]);
    }
    this._html.action['space'] = $(HTML.space).appendTo(this._html.action['wrap']);
};
module.exports = Witch;
