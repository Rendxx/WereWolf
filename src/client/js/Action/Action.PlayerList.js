require('CLIENT/less/Action/Action.PlayerList.less');

var HTML = {
    wrap: '<div class="action_playerList"></div>',
    title: '<div class="_title"><span></span></div>',
    list: '<div class="_playerList"></div>',
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
    alive: '_alive',
    show: '_show',
    selected: '_selected',
    abstain:'_abstain'
};

var PlayerList = function (){
    var that = this;
    var container = null;
    var playerIdx = -1;
    var _html = {
    };

    // callback ----------------------------------
    this.onSelect = null;
    this.onAbstain = null;

    // public ------------------------------------
    this.setup = function (playerIdx_in, container_in, playerInfo, title){
        playerIdx = playerIdx_in;
        container = $(container_in);
        setupHtml(playerInfo, title);
    };

    this.update = function (playerAliveArr, voteArr){
        for (var i in _html['player']){
            if (playerAliveArr[i]==='1') _html['player'][i].wrap.addClass(CSS.alive);
            else _html['player'][i].wrap.removeClass(CSS.alive);
            _html['player'][i].vote.empty();
            _html['player'][i].wrap.removeClass(CSS.selected);
        }
        _html['player']['-1'] && _html['player']['-1'].wrap.addClass(CSS.alive);
        if (voteArr==null) return;
        for (var i in voteArr){
            if (!_html['player'].hasOwnProperty(voteArr[i])) continue;
            if (Number(i)===playerIdx)_html['player'][voteArr[i]].wrap.addClass(CSS.selected);
            _html['player'][voteArr[i]].vote.append(_html['voteCache'][i]);
        }
    };

    this.show = function (){
        _html['wrap'].addClass(CSS.show);
        resize();
    };

    this.hide = function (){
        _html['wrap'].removeClass(CSS.show);
    };

    // private -----------------------------------
    var setupHtml = function (playerInfo, title){
        _html['wrap']=$(HTML.wrap).appendTo(container);
        _html['_title']=$(HTML.title).appendTo(_html['wrap']).html(title||'');
        _html['list']=$(HTML.list).appendTo(_html['wrap']);
        _html['player']={};
        _html['space'] = $(HTML.space).appendTo(_html['list']);
        var number = [];
        for (var i=0;i<playerInfo.length;i++) number[i]=i;
        number.sort(function(a, b){
            return playerInfo[a][0] - playerInfo[b][0];
        });

        for (var i=0;i<playerInfo.length;i++){
            var k = number[i];
            addPlayer(k, playerInfo[k][0],playerInfo[k][1]);
        }
        addAbstain();
        _html['space2'] = $(HTML.space).appendTo(_html['list']);

        _html['voteCache'] = [];
        for (var i=0;i<playerInfo.length;i++){
            _html['voteCache'].push($(HTML.player.voteMarker).text(playerInfo[i][0]));
        }
    };

    var addPlayer = function (idx, number, name){
        var pkg = {};
        pkg['wrap'] = $(HTML.player.wrap).appendTo(_html['list']);
        pkg['number'] = $(HTML.player.number).appendTo(pkg['wrap']).text(number);
        pkg['name'] = $(HTML.player.name).appendTo(pkg['wrap']).text(name);
        pkg['vote'] = $(HTML.player.vote).appendTo(pkg['wrap']);
        pkg['wrap'].addClass(CSS.alive);
        pkg['wrap'].click(function(e){
            if (!pkg['wrap'].hasClass(CSS.alive)) return false;
            that.onSelect && that.onSelect (idx, number, name);
        });
        _html['player'][idx] = pkg;
    };

    var addAbstain = function (){
        var pkg = {};
        pkg['wrap'] = $(HTML.player.wrap).appendTo(_html['list']).addClass(CSS.abstain);
        pkg['number'] = $(HTML.player.number).appendTo(pkg['wrap']);
        pkg['name'] = $(HTML.player.name).appendTo(pkg['wrap']).text('Abstain');
        pkg['vote'] = $(HTML.player.vote).appendTo(pkg['wrap']);
        pkg['wrap'].addClass(CSS.alive);
        pkg['wrap'].click(function(e){
            if (!pkg['wrap'].hasClass(CSS.alive)) return false;
            that.onAbstain && that.onAbstain ();
        });
        _html['player']['-1'] = pkg;
    };

    var resize = function (){
        if (_html['list']){
          var w =~~(_html['wrap'].width()/120)*120;
          if (w===0) w = ~~($(window.document).width()/120)*120;
           _html['list'].width(w);
         }
    };

    var _init = function() {
        $( window ).resize(resize);
    }();
};

module.exports = PlayerList;
