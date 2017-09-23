/* TODO:
    Main-Screen is the main screen.
    It renders the game.
*/
var Util = require('SRC/Util.js');
var MSGCODE = require('GLOBAL/content/MessageCode.js');
var ACTIVECODE = require('GLOBAL/content/ActiveCode.js');
var PHASE = require('GLOBAL/content/PhaseCode.js');
var InfoBox = require('CLIENT/content/InfoBox/InfoBox.js');
var Character = require('CHARACTER/Character.Client.js');
var PanelManager = require('CLIENT/content/Panel/PanelManager.js');
var Panel = {
    Status: require('CLIENT/content/Panel/Panel.Status.js'),
    Player: require('CLIENT/content/Panel/Panel.Player.js'),
    Action: require('CLIENT/content/Panel/Panel.Action.js')
};

require('./Render.Main.less');

var HTML = {
    panel: '<div class="panelList"></div>',
    action: '<div class="actions"></div>',
    refreshBtn: '<div class="refreshBtn"></div>'
};

var CSS = {
    show: '_show'
};

var Main = function (container) {
    "use strick";
    // Property -------------------------------------
    var that = this;
    var html = {};

    var currentPhase = PHASE.NONE,
        roleCode = null;

    var _msg = {};
    var _send = {};
    var statusPanel = null,
        playerPanel = null,
        actionPanel = null,
        panelManager = null,
        roleInstance = null;

    // Callback -------------------------------------
    this.message = {};        /* TODO: this is a package of message hander. this.message.action(dat),  this.message.send(dat) */

    // interface controll --------------------------------
    this.show = function () {
        container.classList.add(CSS.show);
        resize();
    };

    this.hide = function () {
        container.classList.remove(CSS.show);
    };

    // Update ---------------------------------------
    this.reset = function (setupData) {
        /* TODO: initialize the game */
        if (setupData==null) return;
        var playerIdx = setupData[0];
        var initData = setupData[1];
        var playerInfo = setupData[2];

        if (roleInstance!=null) roleInstance.dispose();
        roleInstance = Character(initData[2]);
        roleInstance.setup(playerIdx);
        roleInstance.onActionEnd = function (idx){
          _send[MSGCODE.CLIENT.DECISION](idx);
        };

        statusPanel.reset(initData[0],initData[1]);
        playerPanel.reset(playerInfo);
        roleInstance.initActionPanel(actionPanel, playerInfo);
        roleInstance.initInfoPanel(statusPanel.html['role']);
        resize();
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
                roleInstance && roleInstance.actionResult(resultData);
            } else if (isActived===ACTIVECODE.YES){
                roleInstance && roleInstance.active(aliveList, actionData);
            } else{
                roleInstance && roleInstance.inactive();
            }
            playerPanel.updateAlive(aliveList);
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
        container.innerHTML = '';
        html['panel'] = Util.CreateDom(HTML.panel, container);
        html['action'] = Util.CreateDom(HTML.action, container);
        html['refreshBtn'] = Util.CreateDom(HTML.refreshBtn, container);
        html['refreshBtn'].addEventListener('click', function(e){
            InfoBox.check({
                content: 'Do you want to refresh your page?',
                callbackYes: function (){
                    window.location.reload();
                }
            });
        },false);
    };

    var resize = function (){
        let w = window.innerWidth,
            h = window.innerHeight;
        panelManager.resize(w, h);
        actionPanel.resize(w, h);
    };

    var _init = function () {
        _setupMsg();
        _setupSend();
        _setupHtml();
        statusPanel = new Panel.Status();
        playerPanel = new Panel.Player();
        panelManager = new PanelManager(html['panel']);
        panelManager.setup([
            { name: 'Status',panel: statusPanel },
            { name: 'Players',panel: playerPanel },
        ]);

        actionPanel = new Panel.Action();
        actionPanel.setup(html['action']);
        resize();
        window.addEventListener("resize", function(e){
            resize();
        });
    };
    _init();
};

module.exports = Main;
