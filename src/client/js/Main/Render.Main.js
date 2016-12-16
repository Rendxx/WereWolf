/* TODO:
    Main-Screen is the main screen.
    It renders the game.
*/
var ACTION = require('GLOBAL/js/ActionCode.js');
var ROLECODE = require('GLOBAL/js/RoleCode.js');
var MSGCODE = require('GLOBAL/js/MessageCode.js');
var SettingPanel = require('CLIENT/js/Main/Render.Main.SettingPanel.js');
var StatusPanel = require('CLIENT/js/Main/Render.Main.StatusPanel.js');

require('CLIENT/less/Main.less');

var HTML = {
    panel: {
      setting: '<div class="_panel _setting"></div>',
      player: '<div class="_panel _player"></div>',
      status: '<div class="_panel _status"></div>',
      info: '<div class="_panel _info"></div>',
    }
};

var CSS = {
    dead: '_dead'
};

var Main = function (container) {
    "use strick";
    // Property -------------------------------------
    var that = this;
    var html = {
            container: $(container),
            panel:{},
            info: null,
            name: null,
            number: null,
            players: {},

            setting:{}
        };

    var alive = true,
        actived = false,
        setuped = false,
        inited = false;

    var _msg = {};
    var _send = {};
    var _gameStep = -1;
    var cache_setupData = null;
    var settingPanel = null,
        statusPanel = null;

    // Callback -------------------------------------
    this.message = {};        /* TODO: this is a package of message hander. this.message.action(dat),  this.message.send(dat) */

    // interface controll --------------------------------
    this.show = function () {
        /* TODO: show Prepare-Screen */
        //_resetHtml(cache_setupData);
        html['container'].fadeIn();
    };

    this.hide = function () {
        /* TODO: hide Prepare-Screen */
        html['container'].fadeOut();
    };

    // Update ---------------------------------------
    this.reset = function (setupData) {
        /* TODO: initialize the game */
        if (setupData==null) return;
        cache_setupData = setupData;
        _resetHtml(cache_setupData);

        _send[MSGCODE.CLIENT.GET_INIT]();
    };

    this.updateGame = function (gameData) {
        /* TODO: receive update data from Host */
        if (gameData==null) return;
        var msgCode = gameData[0];
        if (!_msg.hasOwnProperty(msgCode)) return;
        _msg[msgCode](gameData);
    };

    // Private ---------------------------------------
    var _showMsg = function (msg) {
        html['info'].text(msg);
    };

    // Message ---------------------------------------
    var _setupMsg = function (){
        _msg[MSGCODE.HOST.UPDATE] = function (dat){
        };

        _msg[MSGCODE.HOST.INIT_DATA] = function (dat){
            var gameStep = dat[1];
            if (gameStep!==_gameStep) {
                if (gameStep===0){
                    settingPanel.show();
                    statusPanel.hide();
                } else {
                    settingPanel.hide();
                    statusPanel.show();
                }
            };

            if (gameStep===1){
                var number = dat[2];
                var name = dat[3];
                var role = dat[4];
                statusPanel.reset(number,name,role);
            }
        };
    };

    var _setupSend = function (){
        _send[MSGCODE.CLIENT.SET_INIT] = function (dat){
            that.message.action([
              MSGCODE.CLIENT.SET_INIT,
              dat.name,
              dat.number,
              dat.role
            ]);
        };

        _send[MSGCODE.CLIENT.GET_INIT] = function (dat){
            that.message.action([
              MSGCODE.CLIENT.GET_INIT
            ]);
        };
    };

    // Setup -----------------------------------------
    var _actionEnd = function(){
        html['panel']['player'].hide();
        html['panel']['info'].hide();
    };

    var _resetHtml = function (setupData){
          if (setupData==null) return;
          var id = setupData[0];
          var playerData = setupData[1];
          var roleList = setupData[2];

          // status
          html['name'] = $(HTML.name).appendTo(html['panel']['status']);
          html['number'] = $(HTML.number).appendTo(html['panel']['status']);

          // player
          html['players'] = {};
          for (var i=0;i<playerData.length;i++){
            var p = playerData[i];
            _addPlayer(p.id,p.name,p.number);
          }
          settingPanel.reset(playerData, roleList);
    };

    var _setupHtml = function (setupData) {
        if (setuped) return;
        setuped=true;
        html['container'].empty();
        html['panel'] = {};
        html['panel']['setting'] = $(HTML.panel.setting).appendTo(html['container']);
        html['panel']['player'] = $(HTML.panel.player).appendTo(html['container']);
        html['panel']['status'] = $(HTML.panel.status).appendTo(html['container']);
        html['panel']['info'] = $(HTML.panel.info).appendTo(html['container']);
        html['info'] = $(HTML.info).appendTo(html['container']);
    };

    var _addPlayer = function (id, name, number){
        var ele = $(HTML.playerItem).appendTo(html['panel']['player']);
        ele.click(function(){
            if (!actived) return;
        });
        html['players'][id] = ele;
    };

    var _select = function (id){

    };

    var _init = function () {
        _setupMsg();
        _setupSend();
        _setupHtml();
        settingPanel = new SettingPanel(html['panel']['setting'][0]);
        settingPanel.onConfirm = function (data){
          _send[MSGCODE.CLIENT.SET_INIT](data);
          settingPanel.hide();
          statusPanel.reset(data.number, data.name, data.role);
          statusPanel.show();
        };

        statusPanel = new StatusPanel(html['panel']['status'][0]);
    }();
};

module.exports = Main;
