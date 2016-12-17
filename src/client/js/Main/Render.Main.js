/* TODO:
    Main-Screen is the main screen.
    It renders the game.
*/
var ACTION = require('GLOBAL/js/ActionCode.js');
var ROLECODE = require('GLOBAL/js/RoleCode.js');
var MSGCODE = require('GLOBAL/js/MessageCode.js');
var SettingPanel = require('CLIENT/js/Main/Render.Main.SettingPanel.js');
var StatusPanel = require('CLIENT/js/Main/Render.Main.StatusPanel.js');
var PlayerPanel = require('CLIENT/js/Main/Render.Main.PlayerPanel.js');

require('CLIENT/less/Main/Main.less');

var HTML = {
    panel: {
      setting: '<div class="_panel _setting"></div>',
      player: '<div class="_panel _playerList"></div>',
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
        inited = null;

    var _msg = {};
    var _send = {};
    var _gameStep = -1;
    var cache_setupData = null;
    var settingPanel = null,
        statusPanel = null,
        playerPanel = null;

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
            var isInited = dat[1]===1;
            var meta = dat[2];
            var playerInfo = dat[3];
            var playerStatus = dat[4];

            if (inited!==isInited) {
                inited=isInited;
                if (!inited){
                    settingPanel.show();
                    statusPanel.hide();
                } else {
                    settingPanel.hide();
                    statusPanel.show();
                    statusPanel.reset(meta[0],meta[1],meta[2]);
                    playerPanel.reset(playerInfo);
                }
            };


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
          var playerNumber = setupData[1];
          var roleList = setupData[2];

          // status
          html['name'] = $(HTML.name).appendTo(html['panel']['status']);
          html['number'] = $(HTML.number).appendTo(html['panel']['status']);

          // player
          settingPanel.reset(playerNumber, roleList);
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

    var _select = function (id){

    };

    var _init = function () {
        _setupMsg();
        _setupSend();
        _setupHtml();
        settingPanel = new SettingPanel(html['panel']['setting'][0]);
        statusPanel = new StatusPanel(html['panel']['status'][0]);
        playerPanel = new PlayerPanel(html['panel']['player'][0]);

        settingPanel.onConfirm = function (data){
          _send[MSGCODE.CLIENT.SET_INIT](data);
          settingPanel.hide();
          statusPanel.reset(data.number, data.name, data.role);
          statusPanel.show();
        };

        statusPanel.onToggle = function (data){
          playerPanel.show();
          statusPanel.hide();
        };

        playerPanel.onHide = function (data){
          statusPanel.show();
        };
    }();
};

module.exports = Main;
