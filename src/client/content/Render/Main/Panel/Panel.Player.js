var Util = require('SRC/Util.js');
var Basic= require('./Panel.Basic.js');
require('./Panel.Player.less');

"use strick";
var HTML = {
    wrap: '<div class="panel_player"></div>',
    space: '<div class="_space"></div>',

    player: {
      wrap: '<div class="_player"></div>',
      number: '<div class="_number"></div>',
      name: '<div class="_name"></div>'
    }
};

var CSS = {
    alive: '_alive',
    end: '_end'
};

var PlayerPanel = function (){
    Basic.call(this);
    this.playerInfo = null;
    this.playerAlive = [];
};
PlayerPanel.prototype = Object.create(Basic.prototype);
PlayerPanel.prototype.constructor = PlayerPanel;

PlayerPanel.prototype.reset = function (playerInfo){
    this.playerInfo = playerInfo;
    this._setupHtml();
    if (this.playerInfo==null) return;
    this._setupPlayer(this.playerInfo);
};

PlayerPanel.prototype.updateAlive = function(aliveList) {
    for (var i=0; i<this.playerInfo.length; i++){
        this.playerAlive[i] = aliveList[i]==='1';
        if (this.playerAlive[i]) this.html['player'][i].wrap.classList.add(CSS.alive);
        else this.html['player'][i].wrap.classList.remove(CSS.alive);
    }
};

PlayerPanel.prototype._setupHtml = function() {
    this.container.innerHTML = '';
    this.html['wrap'] = Util.CreateDom(HTML.wrap, this.container);
    this.html['space'] = Util.CreateDom(HTML.space, this.html['wrap']);
};

PlayerPanel.prototype._setupPlayer = function(playerInfo) {
    var number = [];
    for (var i=0;i<playerInfo.length;i++) number[i]=i;
    number.sort((a,b)=>{return playerInfo[a][0] - playerInfo[b][0];});

    var that = this;
    var addPlayer = function (idx, number, name){
        var pkg = {};
        pkg['wrap'] = Util.CreateDom(HTML.player.wrap, that.html['wrap']);
        pkg['number'] = Util.CreateDom(HTML.player.number, pkg['wrap'], number);
        pkg['name'] = Util.CreateDom(HTML.player.name, pkg['wrap'], name);
        return pkg;
    };
    this.html['player'] = [];
    for (var i=0;i<playerInfo.length;i++){
        var k = number[i];
        this.html['player'][k] = addPlayer(k, playerInfo[k][0],playerInfo[k][1]);
    }
    this.html['space2'] = Util.CreateDom(HTML.space, this.html['wrap']);
    this.html['space2'].classList.add(CSS.end);
};

module.exports = PlayerPanel;

