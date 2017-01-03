var ROLEDATA = require('GLOBAL/js/RoleData.js');
var InfoBox = require('CLIENT/js/InfoBox.js');

require('CLIENT/less/Main/Main.PlayerPanel.less');

var HTML = {
    title: '<div class="_title"><span>Player List</span></div>',
    inner: '<div class="_inner"></div>',
    hide: '<div class="_hide"></div>',
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

var PlayerPanel = function(container) {
    "use strick";
    // Property -------------------------------------
    var that = this;
    var html = {
        container : $(container)
    };
    var isEnabled = false;
    var playerNum = 0;
    var playerAlive = [];
    var _playerInfo = null;

    // Callback ------------------------------
    this.onHide = null;
    this.onSelect = null;

    // Public --------------------------------
    this.show = function() {
        html['container'].fadeIn(200);
        resize();
    };

    this.hide = function() {
        html['container'].fadeOut(200);
    };

    this.reset = function(playerInfo) {
        _playerInfo = playerInfo;
        setupHtml();
        if (playerInfo==null) return;
        playerNum = playerInfo.length;
        setupPlayer(playerInfo);
    };

    this.enable = function (isEnable){
        isEnabled = isEnable;
    };

    this.updateStatus = function(alive) {
        for (var i=0;i<playerNum;i++){
            playerAlive[i] = alive[i]==='1';
            if (playerAlive[i]) html['player'][i].wrap.addClass(CSS.alive);
            else html['player'][i].wrap.removeClass(CSS.alive);
        }
    };

    // Private ---------------------------------------

    var setupHtml = function() {
        html['container'].empty();
        html['title'] = $(HTML.title).appendTo(html['container']);
        html['inner'] = $(HTML.inner).appendTo(html['container']);
        html['space'] = $(HTML.space).appendTo(html['inner']);
        html['hide'] = $(HTML.hide).appendTo(html['title']);
        html['hide'].click(function() {
          that.hide();
          that.onHide && that.onHide();
        });
    };

    var setupPlayer = function(playerInfo) {
        var number = [];
        for (var i=0;i<playerNum;i++) number[i]=i;
        number.sort(function(a, b){
            return playerInfo[a][0] - playerInfo[b][0];
        });

        html['player'] = [];
        for (var i=0;i<playerNum;i++){
            var k = number[i];
            addPlayer(k, playerInfo[k][0],playerInfo[k][1]);
        }
        html['space2'] = $(HTML.space).appendTo(html['inner']);
    };

    var addPlayer = function (idx, number, name){
        var pkg = {};
        pkg['wrap'] = $(HTML.player.wrap).appendTo(html['inner']);
        pkg['number'] = $(HTML.player.number).appendTo(pkg['wrap']).text(number);
        pkg['name'] = $(HTML.player.name).appendTo(pkg['wrap']).text(name);
        html['player'][idx] = pkg;
        return pkg;
    };

    var resize = function (){

            if (html['inner']){
              var w =~~(html['container'].width()/120)*120;
              if (w===0) w = ~~($(window.document).width()/120)*120;
               html['inner'].width(w);
             }
    };

    var _init = function() {
        setupHtml();
        $( window ).resize(resize);
        resize();
    }();
};

module.exports = PlayerPanel;
