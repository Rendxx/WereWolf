/* TODO:
    Prepare-Screen is the screen before game starting.
    You can set game options while waiting for other players.
*/

var RoleSelectPanel = require('HOST/js/Prepare/Render.Prepare.RoleSelectPanel.js');
var PlayerList = require('HOST/js/Prepare/Render.Prepare.PlayerList.js');
require('HOST/less/Prepare/Prepare.less');

var HTML = {
    logo: '<div class="_logo"></div>',
    line: '<div class="_line"></div>',
    playerCount: '<div class="_playerCount">0</div>',
    startBtn: '<div class="_start">Game Start</div>'
};

var CSS={
  'animationEnd': '_animationEnd'
}

var Prepare = function (container, opts_in) {
    "use strick";
    // Property -------------------------------------
    var html = {
        container: $(container)
    };

    var cache_client = null;
    var roleSelectPanel=null,
        playerList=null;
    var setupOpt = {
        roleArrange:[],
        roleList:[]
    };

    // Callback -------------------------------------
    var _onStart = null;

    // interface controll --------------------------------
    this.show = function () {
        /* TODO: show Prepare-Screen */
        _renderClient(cache_client);
        html['container'].fadeIn();
        html['logo'].addClass(CSS.animationEnd);
    };

    this.hide = function () {
        /* TODO: hide Prepare-Screen */
        html['container'].fadeOut();
    };

    // Update ---------------------------------------
    this.updateClientList = function (clientData) {
        /* TODO: update client list shown on the screen */
        cache_client = clientData;
        _renderClient(clientData);
    };

    this.updateObList = function (obData) {
        /* TODO: deprecated */
    };

    this.updateGame = function (gameData) {
        /* TODO: do nothing */
    };

    // api -------------------------------------------
    this.getSetupPara = function () {
        /* TODO: return game options */
        return setupOpt;
    };

    // Private ---------------------------------------
    var _renderClient = function (clientData) {
        if (clientData == null) return;
        playerList.updatePlayer(clientData)
        html['playerCount'].text(playerList.playerNumber);
    };

    // Setup -----------------------------------------
    var _setupHtml = function () {
        html['logo'] = $(HTML.logo).appendTo(html['container']);
        html['line'] = $(HTML.line).appendTo(html['container']);
        // player list
        html['playerCount'] = $(HTML.playerCount).appendTo(html['container']);

        // start btn
        html['startBtn'] = $(HTML.startBtn).appendTo(html['container']);
        html['startBtn'].click(function () {
            roleSelectPanel.show(playerList.playerNumber);
        });
    };

    var _init = function (opts_in) {
        _setupHtml();
        roleSelectPanel = new RoleSelectPanel(container);
        playerList= new PlayerList(container);
        _onStart = opts_in && opts_in.onStart;

        roleSelectPanel.onFinish = function (roleList){
            console.log('FINISH ------------------------');
            console.log(roleList);
            console.log('');
            setupOpt = {
                roleList:roleList,
                clientNumber: playerList.getClientNumber()
            };
            _onStart && _onStart();
        };
    }(opts_in);
};

module.exports = Prepare;
