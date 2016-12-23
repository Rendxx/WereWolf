/* TODO:
    Main-Screen is the main screen.
    It renders the game.
*/
var ACTION = require('GLOBAL/js/ActionCode.js');
var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var MSGCODE = require('GLOBAL/js/MessageCode.js');
var INITCODE = require('GLOBAL/js/InitCode.js');
var PHASE = require('GLOBAL/js/PhaseCode.js');
var InfoBox = require('CLIENT/js/InfoBox.js');
var RoleFactory = require('CLIENT/js/Role/RoleFactory.js');
var SettingPanel = require('CLIENT/js/Main/Render.Main.SettingPanel.js');
var StatusPanel = require('CLIENT/js/Main/Render.Main.StatusPanel.js');
var PlayerPanel = require('CLIENT/js/Main/Render.Main.PlayerPanel.js');

require('CLIENT/less/Main/Main.less');
require('CLIENT/less/Main/Main.ActionPanel.less');

var HTML = {
    panel: {
      setting: '<div class="_panel _setting"></div>',
      player: '<div class="_panel _playerList"></div>',
      status: '<div class="_panel _status"></div>',
      action: '<div class="_panel _action"></div>',
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
    };

    var index = -1,
        currentStep = PHASE.NONE,
        roleCode = null;

    var _msg = {};
    var _initFunc = {};
    var _send = {};
    var settingPanel = null,
        statusPanel = null,
        playerPanel = null;
    var roleInstance = null;

    // Callback -------------------------------------
    this.message = {};        /* TODO: this is a package of message hander. this.message.action(dat),  this.message.send(dat) */

    // interface controll --------------------------------
    this.show = function () {
        /* TODO: show Prepare-Screen */
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
        _resetHtml();
        if (roleInstance!=null) {
          roleInstance.dispose();
          roleInstance=null;
        }
        var initCode = setupData[0];
        index = setupData[1];
        if (!_initFunc.hasOwnProperty(initCode)) return;
        _initFunc[initCode](setupData);
    };

    this.updateGame = function (gameData) {
        /* TODO: receive update data from Host */
        if (gameData==null) return;
        var msgCode = gameData[0];
        if (!_msg.hasOwnProperty(msgCode)) return;
        _msg[msgCode](gameData);
    };

    // Private ---------------------------------------

    // Message ---------------------------------------
    var _setupMsg = function (){
        _msg[MSGCODE.HOST.UPDATE] = function (dat){
            var step = dat[1];
            var isActived = dat[2];
            var aliveList = dat[3];
            var playerStatus = dat[4];
            var actionData = dat[5];

            if (currentStep!==step) InfoBox.hide();
            roleInstance && roleInstance.update(aliveList, playerStatus);
            if (currentStep!==step) {
                currentStep=step;
                if (currentStep===PHASE.DAY){
                    roleInstance && roleInstance.dayTime();
                }
            };

            if (isActived){
                roleInstance && roleInstance.active(aliveList, actionData);
            } else{
                roleInstance && roleInstance.inactive();
            }
            playerPanel.updateStatus(aliveList);
            statusPanel.updateAlive(roleInstance.alive);
        };

        _msg[MSGCODE.HOST.RESULT] = function (dat){
            roleInstance && roleInstance.showRst(dat[1]);
        };

        _msg[MSGCODE.HOST.END] = function (dat){
        };
    };

    var _setupSend = function (){
        _send[MSGCODE.CLIENT.SET_INIT] = function (dat){
            that.message.action([
              MSGCODE.CLIENT.SET_INIT,
              dat.number,
              dat.name,
              dat.role
            ]);
        };

        _send[MSGCODE.CLIENT.DECISION] = function (idx){
            that.message.action([
              MSGCODE.CLIENT.DECISION,
              idx
            ]);
        };
    };

    // Setup -----------------------------------------
    var _actionEnd = function(){
        html['panel']['player'].hide();
    };

    var _setupInit = function () {
        _initFunc[INITCODE.SETTING] = function (setupData){
            var playerNumber = setupData[2];
            var roleList = setupData[3];
            settingPanel.reset(playerNumber, roleList);
            settingPanel.show();
            statusPanel.hide();
        };

        _initFunc[INITCODE.DONE] = function (setupData){
            var playerIdx = setupData[1];
            var initData = setupData[4];
            var playerInfo = setupData[5];

            roleInstance = RoleFactory(initData[2]);
            roleInstance.setup(playerIdx);
            roleInstance.onActionEnd = function (idx){
              _send[MSGCODE.CLIENT.DECISION](idx);
            };
            settingPanel.hide();
            statusPanel.show();
            statusPanel.reset(initData[0],initData[1],initData[2],roleInstance);
        };

        _initFunc[INITCODE.ALLDONE] = function (setupData){
            var playerIdx = setupData[1];
            var initData = setupData[4];
            var playerInfo = setupData[5];
            if (roleInstance==null) {
                roleInstance = RoleFactory(initData[2]);
                roleInstance.setup(playerIdx);
                roleInstance.onActionEnd = function (idx){
                  _send[MSGCODE.CLIENT.DECISION](idx);
                };
            }
            roleInstance.initActionPanel(html['panel']['action'], playerInfo);

            settingPanel.hide();
            playerPanel.hide();
            statusPanel.show();
            statusPanel.reset(initData[0],initData[1],initData[2],roleInstance);
            playerPanel.reset(playerInfo);
        };
    };

    var _setupHtml = function (setupData) {
        html['container'].empty();
        html['panel'] = {};
        html['panel']['setting'] = $(HTML.panel.setting).appendTo(html['container']);
        html['panel']['player'] = $(HTML.panel.player).appendTo(html['container']);
        html['panel']['status'] = $(HTML.panel.status).appendTo(html['container']);
        html['panel']['action'] = $(HTML.panel.action).appendTo(html['container']);
    };
    var _resetHtml = function (setupData) {
        html['panel']['setting'].empty().hide();
        html['panel']['player'].empty().hide();
        html['panel']['status'].empty().hide();
        html['panel']['action'].empty().hide();
    };

    var _select = function (id){

    };

    var _init = function () {
        _setupMsg();
        _setupInit();
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

        playerPanel.onSelect = function (idx){
          _send[MSGCODE.CLIENT.DECISION](idx);
        };
    }();
};

module.exports = Main;
