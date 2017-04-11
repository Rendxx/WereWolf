/* TODO:
    Main-Screen is the main screen.
    It renders the game.
*/
var Util = require('SRC/Util.js');
var ACTION = require('GLOBAL/content/ActionCode.js');
var ROLECODE = require('GLOBAL/content/RoleCode.js');
var ROLEDATA = require('GLOBAL/content/RoleData.js');
var MSGCODE = require('GLOBAL/content/MessageCode.js');
var ACTIVECODE = require('GLOBAL/content/ActiveCode.js');
var PHASE = require('GLOBAL/content/PhaseCode.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
var RoleFactory = require('CLIENT/content/Role/RoleFactory.js');
var StatusPanel = require('./Render.Main.StatusPanel.js');
var PlayerPanel = require('./Render.Main.PlayerPanel.js');

require('./Render.Main.less');
require('./Render.Main.ActionPanel.less');

var HTML = {
    panel: {
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
        container: container,
        panel:{},
    };

    var currentPhase = PHASE.NONE,
        roleCode = null;

    var _msg = {};
    var _send = {};
    var statusPanel = null,
        playerPanel = null,
        actionPanel = null;
    var roleInstance = null;

    // Callback -------------------------------------
    this.message = {};        /* TODO: this is a package of message hander. this.message.action(dat),  this.message.send(dat) */

    // interface controll --------------------------------
    this.show = function () {
        html['container'].classList.add('show');
    };

    this.hide = function () {
        html['container'].classList.remove('show');
    };

    // Update ---------------------------------------
    this.reset = function (setupData) {
        /* TODO: initialize the game */
        if (setupData==null) return;
        _resetHtml();
        var playerIdx = setupData[0];
        var initData = setupData[1];
        var playerInfo = setupData[2];

        if (roleInstance!=null) roleInstance.dispose();
        roleInstance = RoleFactory(initData[2]);
        roleInstance.setup(playerIdx);
        roleInstance.onActionEnd = function (idx){
          _send[MSGCODE.CLIENT.DECISION](idx);
        };

        roleInstance.initActionPanel(html['panel']['action'], playerInfo);

        playerPanel.hide();
        statusPanel.show();
        statusPanel.reset(initData[0],initData[1],initData[2],roleInstance);
        playerPanel.reset(playerInfo);
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
            var phase = dat[1];
            var isActived = dat[2];
            var aliveList = dat[3];
            var playerStatus = dat[4];
            var actionData = dat[5];
            var resultData = dat[6];

            if (currentPhase!==phase) InfoBox.hide();
            roleInstance && roleInstance.update(aliveList, playerStatus);

            if (currentPhase!==phase) {
                currentPhase=phase;
                if (currentPhase===PHASE.PREDAY){
                    roleInstance && roleInstance.dayTime();
                }
            };

            if (isActived===ACTIVECODE.RESULT){
                roleInstance && roleInstance.showRst(resultData);
            } else if (isActived===ACTIVECODE.YES){
                roleInstance && roleInstance.active(aliveList, actionData);
            } else{
                roleInstance && roleInstance.inactive();
            }
            playerPanel.updateStatus(aliveList);
            statusPanel.updateAlive(roleInstance.alive);
        };

        _msg[MSGCODE.HOST.END] = function (dat){
        };
    };

    var _setupSend = function (){
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

    var _setupHtml = function (setupData) {
        html['container'].innerHTML = '';
        html['panel'] = {};
        html['panel']['player'] = Util.CreateDom(HTML.panel.player, html['container']);
        html['panel']['status'] = Util.CreateDom(HTML.panel.status, html['container']);
        html['panel']['action'] = Util.CreateDom(HTML.panel.action, html['container']);
    };
    var _resetHtml = function (setupData) {
        statusPanel.reset();
        playerPanel.reset();
        actionPanel.reset();
    };

    var _select = function (id){

    };

    var _init = function () {
        _setupMsg();
        _setupSend();
        _setupHtml();
        statusPanel = new StatusPanel(html['panel']['status']);
        playerPanel = new PlayerPanel(html['panel']['player']);
        actionPanel = new StatusPanel(html['panel']['action']);
    }();
};

module.exports = Main;
