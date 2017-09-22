var Character = require('CHARACTER/Character.Host.js');
var ACTIVECODE = require('GLOBAL/content/ActiveCode.js');
var INFO = require('HOST/content/InfoBox/Info.Content.js');
var PHASE_DATA = require('PHASE/PHASE_DATA.js');
var InfoBox = require('HOST/content/InfoBox/InfoBox.js');

require('./Render.Main.PlayerPanel.less');
require('./PhaseMessage.less');

var HTML = {
    wrap: '<div class="_playerList"></div>',
    title: '<div class="_title"></div>',
    inner: '<div class="_inner"></div>',
    hide: '<div class="_hide"></div>',
    space: '<div class="_space"></div>',
    start: '<div class="_playerList_start">START</div>',
    skip: '<div class="_title_btn _skip">Next Phase</div>',
    status: '<div class="_title_btn _status">Status</div>',
    end: '<div class="_title_btn _end">End</div>',
    roleVisible: '<div class="_title_btn _roleVisible">RoleList</div>',
    message: '<div class="_message">'+
               '<div class="phase_message">'+
                 '<div class="_phase_message_icon"></div>'+
                 '<div class="_phase_message_text"></div>'+
               '</div>'+
              '</div>',
    statusPanel:'<div class="_statusPanel">'+
                  '<div class="_innerWrap">'+
                    '<div class="_block _witch">'+
                      '<div class="_status_btn _potion_heal">Yes</div>'+
                      '<div class="_status_btn _potion_poison">Yes</div>'+
                    '</div>'+
                '</div></div>',
    endPanel:'<div class="_endPanel">'+
                  '<div class="_innerWrap">'+
                    '<div class="_end_btn _villager">Villager Win</div>'+
                    '<div class="_end_btn _werewolf">Werewolf Win</div>'+
                '</div></div>',
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
    var isRoleVisible = false;
    var status = {};

    // Callback ------------------------------
    this.onChange = null;
    this.onNextPhase = null;
    this.onSetStatus = null;
    this.onEnd = null;

    // Public --------------------------------
    this.reset = function(playerInfo, roleInfo) {
        _playerInfo = playerInfo;
        playerNum = playerInfo.length;
        setupHtml();
        setupPlayer(playerInfo, roleInfo);
        resize();
    };

    this.update = function(phaseCode, aliveList) {
        for (var i=0;i<playerNum;i++){
            playerAlive[i] = aliveList[i];
            if (playerAlive[i]) html['player'][i].wrap.addClass(CSS.alive);
            else html['player'][i].wrap.removeClass(CSS.alive);
        }

        html['message-icon'].css('background-image', 'url(' + PHASE_DATA[phaseCode].Icon + ')');
        html['message-text'].text(PHASE_DATA[phaseCode].Name);
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
        html['message-icon'] = html['message'].find('._phase_message_icon');
        html['message-text'] = html['message'].find('._phase_message_text');
        //html['start'] = $(HTML.start).appendTo(html['inner']);
        html['skip'] = $(HTML.skip).appendTo(html['title']);
        html['status'] = $(HTML.status).appendTo(html['title']);
        html['end'] = $(HTML.end).appendTo(html['title']);
        html['roleVisible'] = $(HTML.roleVisible).appendTo(html['title']);
        setupPanel();

        html['skip'].click(function(){
            InfoBox.check({
                content: 'Do you want to SKIP this phase',
                callbackYes: function() {
                    that.onNextPhase&&that.onNextPhase();
                }
            });
        });

        html['roleVisible'].click(function(){
            if (isRoleVisible) that.showRole(!isRoleVisible);
            else {
              InfoBox.check({
                  content: 'Want to show all role?',
                  callbackYes: function() {
                      that.showRole(!isRoleVisible);
                  }
              });
          }
        });

        html['status'].click(function(){
        });

        html['end'].click(function(){
            html['endPanel'].fadeIn(200);
        });
    };

    var setupPlayer = function(playerInfo, roleInfo) {
        html['player'] = [];
        for (var i=0;i<playerNum;i++){
            addPlayer(i,playerInfo[i][2]);
        }
        if (playerInfo!=null){
            for (var i=0;i<playerNum;i++){
                html['player'][i]['wrap'].unbind('click');
                if (playerInfo[i]==null) continue;
                setPlayerInfo(i, playerInfo[i][1],playerInfo[i][2],roleInfo[i]);
            }
        }
        resize();
    };

    var setPlayerInfo = function (idx, number, name, role){
        html['player'][idx]['number'].text(number);
        html['player'][idx]['name'].text(name);
        html['player'][idx]['role'].css('background-image', 'url(' + Character(role).DATA.Portrait + ')');

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

    var setupPanel = function (){
        html['endPanel'] = $(HTML.endPanel).appendTo(html['wrap']);

        html['endPanel'].find('._end_btn._villager').click(function(e){
            e.stopPropagation();
            InfoBox.check({
                content: 'Village Win?',
                callbackYes: function() {
                    that.onEnd&&that.onEnd(true);
                }
            });
            return false;
        });
        html['endPanel'].find('._end_btn._werewolf').click(function(e){
            e.stopPropagation();
            InfoBox.check({
                content: 'Werewolf Win?',
                callbackYes: function() {
                    that.onEnd&&that.onEnd(false);
                }
            });
            return false;
        });
        html['endPanel'].click(function(e){
            html['endPanel'].fadeOut(200);
            return false;
        });
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
              var number_a = _playerInfo[a][1]||0;
              var number_b = _playerInfo[b][1]||0;
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
