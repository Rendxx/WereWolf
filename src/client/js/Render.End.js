/* TODO:
    End-Screen is the screen after game end.
    Show the game result in this screen.
*/﻿

var MSGCODE = require('GLOBAL/js/MessageCode.js');
require('../less/End.less');

var HTML = {
    villager: '<div class="_villager"><div class="_winner">VILLAGER</div><div class="_line"></div><div class="_win">WIN</div></div>',
    werewolf: '<div class="_werewolf"><div class="_winner">WEREWOLF</div><div class="_line"></div><div class="_win">WIN</div></div>'
};

var CSS = {
};

var End = function (container) {
    "use strick";
    // Property -------------------------------------
    var html = {
            container: $(container)
        };
    var _msg = {};

    // Callback -------------------------------------

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
    this.updateGame = function (gameData) {
        /* TODO: do nothing */
        if (gameData==null) return;
        var msgCode = gameData[0];
        if (!_msg.hasOwnProperty(msgCode)) return;
        _msg[msgCode](gameData);
    };

    // Private ---------------------------------------
    var _setupMsg = function (){
        _msg[MSGCODE.HOST.END] = function (dat){
            var villager = dat[1];
            if (villager){
              html['villager'].show();
              html['werewolf'].hide();
            } else{
              html['villager'].hide();
              html['werewolf'].show();
            }
        };
      };

    // Setup -----------------------------------------
    var _setupHtml = function () {
        html['villager'] = $(HTML.villager).appendTo(html['container']);
        html['werewolf'] = $(HTML.werewolf).appendTo(html['container']);
        html['villager'].hide();
        html['werewolf'].hide();
    };

    var _init = function () {
        _setupHtml();
        _setupMsg();
    }();
};

module.exports = End;
