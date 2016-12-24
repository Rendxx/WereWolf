/* TODO:
    Prepare-Screen is the screen before game starting.
    You can set game options while waiting for other players.
*/

var RoleSelectPanel = require('HOST/js/Prepare/Render.Prepare.RoleSelectPanel.js');
require('HOST/less/Prepare/Prepare.less');

var HTML = {
    logo: '<div class="_logo"></div>',
    line: '<div class="_line"></div>',
    playerCount: '<div class="_playerCount">0</div>',
    playerList: '<div class="_playerList"></div>',
    item: '<div class="_item"></div>',
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

    var cache_client = null,
        clientNumber = 0;
    var roleSelectPanel=null;
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


        for (var id in html['player']) {
            if(clientData.hasOwnProperty(id))continue;
            html['player'][id].remove();
            delete html.player[id];
        }

        // player
        clientNumber=0;
        for (var id in clientData) {
            clientNumber++;
            if(html['player'].hasOwnProperty(id))continue;
            html['player'][id] = $(HTML.item).appendTo(html['playerList']).text(clientData[id].name);
        }
        html['playerCount'].text(clientNumber);
    };

    // Setup -----------------------------------------
    var _setupHtml = function () {
        html['logo'] = $(HTML.logo).appendTo(html['container']);
        html['line'] = $(HTML.line).appendTo(html['container']);
        // player list
        html['playerCount'] = $(HTML.playerCount).appendTo(html['container']);
        html['playerList'] = $(HTML.playerList).appendTo(html['container']);

        // start btn
        html['startBtn'] = $(HTML.startBtn).appendTo(html['container']);
        html['startBtn'].click(function () {
            roleSelectPanel.show(clientNumber);
        });
        html['player'] = {};
    };

    var _init = function (opts_in) {
        _setupHtml();
        roleSelectPanel = new RoleSelectPanel(container);
        _onStart = opts_in && opts_in.onStart;

        roleSelectPanel.onFinish = function (roleArr, roleList2){
            console.log('FINISH ------------------------');
            console.log(roleArr);
            console.log(roleList2);
            console.log('');
            setupOpt = {
                roleArrange:roleArr,
                roleList:roleList2
            };
            _onStart && _onStart();
        };
    }(opts_in);
};

module.exports = Prepare;
