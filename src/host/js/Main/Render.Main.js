/* TODO:
    Main-Screen is the main screen.
    It renders the game.
*/

var ACTION = require('GLOBAL/js/ActionCode.js');
var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var PHASE = require('GLOBAL/js/PhaseCode.js');
var PHASESOUND = require('HOST/js/Main/PhaseSound.js');
var InfoBox = require('HOST/js/InfoBox.js');
var PlayerPanel = require('HOST/js/Main/Render.Main.PlayerPanel.js');

require('HOST/less/Main/Main.less');

var HTML = {
    player: '<div class="_player"></div>',
    board: '<div class="_board"></div>'
};

var Main = function (container) {
    "use strick";
    // property -----------------------------------------------
    var that = this;
    var width = 0,
        height = 0;
    var html = {
        container: $(container),
        board : null,
        player:[]
    };
    var gameData = null;
    var playerPanel = null;
    var currentPhase = -1;
    var _timeoutFunc = null;

    // callback ------------------------------------------
    this.handler = {};        /* TODO: this is a package of hander provided by Core. You can use these handler to control the game at Host */

    // interface controll --------------------------------
    this.show = function () {
        /* TODO: show Main-Screen */
        html['container'].fadeIn();
        playerPanel.show();
        _render();
    };

    this.hide = function () {
        /* TODO: hide Main-Screen */
        html['container'].fadeOut();
    };

    // update ---------------------------------------------
    this.reset = function (setupData) {
        /* TODO: initialize the game */
        if (setupData==null) return;
        var initCode = setupData[0];
        var basicData = setupData[1];
        var playerData = setupData[2];
        playerPanel.reset(initCode, basicData, playerData);
        _render();
    };

    this.updateClientList = function (clientData) {
        /* TODO: do nothing */
    };

    this.updateObList = function (obData) {
        /* TODO: deprecated */
    };

    this.updateGame = function (gameData_in) {
        /* TODO: update the game with game data */
        if (gameData_in == null) return;
        gameData = gameData_in;
        _render();
    };

    // game ------------------------------------------------
    this.pause = function () {
        /* TODO: game parse */
    };
    this.continue = function () {
        /* TODO: game continue */
     };

    // private ---------------------------------------------
    var _clear = function (){
        html['board'].empty();
        html['player']=[];
    };
    var _render = function (){
        if (gameData == null) return;
        var phase = gameData[0];
        var aliveList = gameData[1];
        var statusList = gameData[2];
        playerPanel.update(phase, aliveList, statusList);
        if (currentPhase!==phase && PHASESOUND.hasOwnProperty(phase)){
            if (_timeoutFunc!==null){
              clearTimeout(_timeoutFunc);
            }
            _timeoutFunc = setTimeout(function(){
                PHASESOUND[phase].play();
            },2000);
        }
        currentPhase=phase;
    };

    // setup -----------------------------------------------
    var _setupHtml = function () {
        //html['board'] = $(HTML.board).appendTo(html['container']);
    };

    var _init = function () {
        _setupHtml();
        playerPanel = new PlayerPanel(html['container'][0]);
        playerPanel.onSkip = function(){
            that.handler&&that.handler.skip && that.handler.skip();
        };
        playerPanel.onChange = function(idx, alive){
            that.handler&&that.handler.setAlive && that.handler.setAlive(idx, alive);
        };
    }();
};

module.exports = Main;
