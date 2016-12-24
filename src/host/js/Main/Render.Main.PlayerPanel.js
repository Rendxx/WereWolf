var ROLEDATA = require('GLOBAL/js/RoleData.js');
var INFO = require('HOST/js/Info.js');
var INITCODE = require('GLOBAL/js/InitCode.js');
var PHASEMESSAGE = require('HOST/js/Main/PhaseMessage.js');
var PHASECODE = require('GLOBAL/js/PhaseCode.js');
var InfoBox = require('HOST/js/InfoBox.js');

require('HOST/less/Main/Main.PlayerPanel.less');

var HTML = {
    wrap: '<div class="_playerList"></div>',
    title: '<div class="_title"></div>',
    inner: '<div class="_inner"></div>',
    hide: '<div class="_hide"></div>',
    space: '<div class="_space"></div>',
    start: '<div class="_playerList_start">START</div>',
    skip: '<div class="_title_btn _skip">Skip</div>',
    status: '<div class="_title_btn _status">Status</div>',
    roleVisible: '<div class="_title_btn _roleVisible">RoleList</div>',
    message: '<div class="_message"></div>',

    player: {
      wrap: '<div class="_player"></div>',
      number: '<div class="_number"></div>',
      name: '<div class="_name"></div>',
      role: '<div class="_role"></div>'
    },
};

var CSS = {
    alive: '_alive',
    actived: '_actived',
    role: '_roleVisible'
};

var PlayerPanel = function(container) {
    "use strick";
    // Property -------------------------------------
    var that = this;
    var html = {
        container : $(container)
    };
    var playerNum = 0;
    var playerAlive = [];
    var _playerInfo = null;
    var _basicData = null;
    var _phase = PHASECODE.NONE;
    var isRoleVisible = false;

    // Callback ------------------------------
    this.onChange = null;
    this.onSkip = null;

    // Public --------------------------------
    this.reset = function(initCode, basicData, playerInfo) {
        _basicData = basicData;
        _playerInfo = playerInfo;
        playerNum = _basicData.length;
        setupHtml();
        setupPlayer(_basicData, _playerInfo);
        if (_phase === PHASECODE.NONE && initCode===INITCODE.ALLDONE)
          html['start'].fadeIn(200);
        resize();
    };

    this.update = function(phase, aliveList, statusList) {
        _phase = phase;
        for (var i=0;i<playerNum;i++){
            playerAlive[i] = aliveList[i]==='1';
            if (_phase!==PHASECODE.DAY&&_phase!==PHASECODE.NONE) continue;
            if (playerAlive[i]) html['player'][i].wrap.addClass(CSS.alive);
            else html['player'][i].wrap.removeClass(CSS.alive);
        }

        if (!PHASEMESSAGE.hasOwnProperty(phase)) {
            html['message'].empty();
        } else {
            html['message'].html(PHASEMESSAGE[phase]);
        }
    };

    this.show = function (){
        resize();
    };

    this.showRole = function (isOn){
        isRoleVisible= isOn;
        if (isOn){
          html['wrap'].addClass(CSS.role);
          html['roleVisible'].addClass(CSS.actived);
        } else {
           html['wrap'].removeClass(CSS.role);
           html['roleVisible'].removeClass(CSS.actived);
        }
    };

    // Private ---------------------------------------

    var setupHtml = function() {
        html['container'].empty();
        html['wrap'] = $(HTML.wrap).appendTo(html['container']);
        html['title'] = $(HTML.title).appendTo(html['wrap']);
        html['inner'] = $(HTML.inner).appendTo(html['wrap']);
        html['message'] = $(HTML.message).appendTo(html['inner']);
        html['start'] = $(HTML.start).appendTo(html['inner']);
        html['skip'] = $(HTML.skip).appendTo(html['title']);
        html['status'] = $(HTML.status).appendTo(html['title']);
        html['roleVisible'] = $(HTML.roleVisible).appendTo(html['title']);

        html['skip'].click(function(){
            InfoBox.check({
                content: 'Do you want to SKIP this phase',
                callbackYes: function() {
                    that.onSkip&&that.onSkip();
                }
            });
        });

        html['start'].click(function(){
            that.onSkip&&that.onSkip();
            html['start'].fadeOut(200);
        });

        html['roleVisible'].click(function(){
            that.showRole(!isRoleVisible);
        });
    };

    var setupPlayer = function(basicData, playerInfo) {
        html['player'] = [];
        for (var i=0;i<playerNum;i++){
            addPlayer(i,basicData[i][1]);
        }
        if (playerInfo!=null){
            for (var i=0;i<playerNum;i++){
                html['player'][i]['wrap'].unbind('click');
                if (playerInfo[i]==null) continue;
                setPlayerInfo(i, playerInfo[i][0],playerInfo[i][1],playerInfo[i][2]);
            }
        }
        resize();
    };

    var setPlayerInfo = function (idx, number, name, role){
        html['player'][idx]['number'].text(number);
        html['player'][idx]['name'].text(name);
        html['player'][idx]['role'].addClass(ROLEDATA[role].name);

        html['player'][idx]['wrap'].click(function(){
            var alive = playerAlive[idx]!==true;
            var text = 'Do you want to <b>'+ (alive?'HEAL':'KILL') + '</b> this player?<br/>(Player status will not refresh at night)';
            InfoBox.check({
                content: INFO.SHOWPLAYER(number, name, text),
                callbackYes: function() {
                    that.onChange&&that.onChange(idx, alive);
                }
            });
        });
    };

    var addPlayer = function (idx, name){
        var pkg = {};
        pkg['wrap'] = $(HTML.player.wrap).appendTo(html['inner']);
        pkg['number'] = $(HTML.player.number).appendTo(pkg['wrap']).text('?');
        pkg['name'] = $(HTML.player.name).appendTo(pkg['wrap']).text('<'+name+'>');
        pkg['role'] = $(HTML.player.role).appendTo(pkg['wrap']);
        html['player'][idx] = pkg;

        pkg['wrap'].click(function(){
            var alive = playerAlive[idx]!==true;
            var text = 'Do you want to '+ (alive?'heal':'kill') + ' this player?';
            InfoBox.check({
                content: INFO.SHOWPLAYER(number, name, text),
                callbackYes: function() {
                    that.onChange&&that.onChange(idx, alive);
                }
            });
        });
        return pkg;
    };

    var resize = function (){
        html['inner'].width(~~(html['wrap'].width()/120)*120);

        var w = html['container'].width();
        var h = html['container'].height();
        var r = Math.min(w,h)>>1;
        html['inner'].width(r<<1);
        html['inner'].height(r<<1);

        if (html['player']==null || html['player'].length<=0) return;

        var ratio=1;
        if (r<600) ratio = Math.max(0.5,r/600);
        var playerSize = ~~(200*ratio);
        var fontSize = ~~(70*ratio);
        r-=(playerSize/2+60);
        var angle = Math.PI*2/html['player'].length;

        var orderList = [];
        for (var i=0; i<html['player'].length; i++){
            orderList.push(i);
        }
        if (_playerInfo!=null && _playerInfo.length>0){
          orderList.sort(function(a, b){
              var number_a = _playerInfo[a][0]||0;
              var number_b = _playerInfo[b][0]||0;
              return number_a-number_b;
          });
        }

        for (var i=0; i<html['player'].length; i++){
            var idx = orderList[i];
            html['player'][idx].wrap.css({
              'width': playerSize + 'px',
              'height': playerSize + 'px',
              'margin-top': (-r*Math.cos(angle*i))+'px',
              'margin-left': (r*Math.sin(angle*i))+'px',
            });
            html['player'][idx].number.css({
              'font-size': fontSize + 'px'
            });
        }
    };

    var _init = function() {
        setupHtml();
        $( window ).resize(resize);
        resize();
        window.r = resize;
    }();
};

module.exports = PlayerPanel;
