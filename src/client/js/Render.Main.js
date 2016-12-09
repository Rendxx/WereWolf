/* TODO:
    Main-Screen is the main screen.
    It renders the game.
*/
var ACTION = require('../../global/js/ActionCode.js');
var InfoBox = require('./js/InfoBox.js');
var ScrollOption = require('./js/ScrollOption.js');
﻿var Style = require('../less/Main.less');

var HTML = {
    panel: {
      setting: '<div class="_panel _setting"></div>',
      player: '<div class="_panel _player"></div>',
      status: '<div class="_panel _status"></div>',
      info: '<div class="_panel _info"></div>',
    },
    playerItem: '<div class="_playerItem"></div>',
    info: '<div class="_info"></div>',
    name: '<div class="_name"></div>',
    number: '<div class="_number"></div>',
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
            players: {}
        },

    var alive = true,
        actived = false,
        infoBox = null,
        numberSelector = null,
        roleSelector = null;

    var cache_setupData = null;

    // Callback -------------------------------------
    this.message = {};        /* TODO: this is a package of message hander. this.message.action(dat),  this.message.send(dat) */

    // interface controll --------------------------------
    this.show = function () {
        /* TODO: show Prepare-Screen */
        _setupHtml(cache_setupData);
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
        _setupHtml(cache_setupData);
    };

    this.updateGame = function (gameData) {
        /* TODO: receive update data from Host */
        if (gameData==null) return;
        _showMsg('current: '+gameData.current);
    };

    // Private ---------------------------------------
    var _showMsg = function (msg) {
        html['info'].text(msg);
    };

    // Setup -----------------------------------------
    var _actionEnd = function(){
        html['panel']['player'].hide();
        html['panel']['info'].hide();
    };

    var _setupHtml = function (setupData) {
        html['container'].empty();
        html['panel'] = {};
        html['panel']['setting'] = $(HTML.panel.setting).appendTo(html['container']);
        html['panel']['player'] = $(HTML.panel.player).appendTo(html['container']);
        html['panel']['status'] = $(HTML.panel.status).appendTo(html['container']);
        html['panel']['info'] = $(HTML.panel.info).appendTo(html['container']);
        infoBox = new InfoBox(html['panel']['info'][0]);
        html['info'] = $(HTML.info).appendTo(html['container']);

        if (setupData==null) return;
        var playerData = setupData[0];
        var roleList = setupData[1];

        // status
        html['name'] = $(HTML.name).appendTo(html['panel']['status']);
        html['number'] = $(HTML.number).appendTo(html['panel']['status']);

        // player
        html['players'] = {};
        for (var i=0;i<playerData.length;i++){
          var p = playerData[i];
          _addPlayer(p.id,p.name,p.number);
        }

        // setting
        html['inputName'] = $(HTML.inputName).appendTo(html['panel']['setting']);
        html['inputNumber'] = $(HTML.inputNumber).appendTo(html['panel']['setting']);
        html['inputRole'] = $(HTML.inputRole).appendTo(html['panel']['setting']);

        var numberOptions = [];
        for (var i=0;i<playerData.length;i++){
          numberOptions.push({key:i,content:i});
        }

        numberSelector = new ScrollOption(html['inputNumber'][0], numberOptions);
    };

    var _addPlayer = function (id, name, number){
        var ele = $(HTML.playerItem).appendTo(html['panel']['player']);
        ele.click(function(){
            if (!actived) return;
            infoBox.checkSelection(number, name, action, function (){ _select(id);});
        });
        html['players'][id] = ele;
    };

    var _select = function (id){

    };

    var _init = function () {
    }();
};

module.exports = Main;
