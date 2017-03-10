/* TODO:
    End-Screen is the screen after game end.
    Show the game result in this screen.
*/

var Style = require('./Render.End.less');

var HTML = {
    villager: '<div class="_villager"><div class="_icon"></div><div class="_text"></div></div>',
    werewolf: '<div class="_werewolf"><div class="_icon"></div><div class="_text"></div></div>',
    renewBtn: '<div class="_renew">RENEW</div>'
};

var CSS = {
};

var End = function (container, opts) {
    "use strick";
    // property -----------------------------------------------
    var html = {
        container: $(container)
    };

    var _onRenew = null;

    // interface controll --------------------------------
    this.show = function () {
        /* TODO: show End-Screen */
        html['container'].fadeIn();
    };

    this.hide = function () {
        /* TODO: hide End-Screen */
        html['container'].fadeOut();
    };

    // Update ---------------------------------------
    this.updateClientList = function (clientData) {
        /* TODO: do nothing */
    };

    this.updateObList = function (obData) {
        /* TODO: deprecated */
    };

    this.updateGame = function (gameData) {
        /* TODO: do nothing */
        if (gameData==null) return;
        var villager = gameData[3];
        if (villager){
          html['villager'].show();
          html['werewolf'].hide();
        } else{
          html['villager'].hide();
          html['werewolf'].show();
        }
    };

    // Private ---------------------------------------

    // setup -----------------------------------------------
    var _setupHtml = function () {
        html['villager'] = $(HTML.villager).appendTo(html['container']);
        html['werewolf'] = $(HTML.werewolf).appendTo(html['container']);
        html['villager'].hide();
        html['werewolf'].hide();
        html['renew'] = $(HTML.renewBtn).appendTo(html['container']);
        html['renew'].click(function () {
          _onRenew && _onRenew();
        });
    };

    var _init = function (opts) {
        _onRenew = opts&&opts.onRenew;
        _setupHtml();
    }(opts);
};

module.exports = End;
