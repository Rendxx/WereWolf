/* TODO:
    Main-Screen is the main screen.
    It renders the game.
*/
var ACTION = require('GLOBAL/js/ActionCode.js');
var ROLECODE = require('GLOBAL/js/RoleCode.js');
var ROLEDATA = require('GLOBAL/js/RoleData.js');
var MSGCODE = require('GLOBAL/js/MessageCode.js');
var InfoBox = require('CLIENT/js/InfoBox.js');
var ScrollOption = require('CLIENT/js/ScrollOption.js');

require('CLIENT/less/Main.less');
require('CLIENT/less/Main.Setting.less');

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

    // setting
    setting:{
      title: '<div class="_title"><span>Input your data</span></div>',
      inner:'<div class="_inner"></div>',
      ok: '<div class="_ok"></div>',
      tag: '<div class="_tag"></div>',
      space: '<div class="_space"></div>',
      name: '<div class="_nameInput"><input type="text" placeholder="name"></div>',
      number: {
        wrap:'<div class="_numberWrap"></div>',
        item:'<div class="_numberItem">#content#</div>'
      },
      role: {
        wrap:'<div class="_roleWrap"></div>',
        item:'<div class="_roleItem">#content#</div>'
      }
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
        setuped = false;

    var _gameStep = -1;
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
        var gameStep = gameData[0];
        setGameStep(gameStep);
    };

    // Private ---------------------------------------
    var _showMsg = function (msg) {
        html['info'].text(msg);
    };

    var setGameStep = function (gameStep){
        if (gameStep===_gameStep) return;
        _gameStep=gameStep;
        if (gameStep===0){
            html['panel']['setting'].fadeIn();
        } else {
            html['panel']['setting'].fadeOut();
        }
    };

    // Setup -----------------------------------------
    var _actionEnd = function(){
        html['panel']['player'].hide();
        html['panel']['info'].hide();
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

        if (setupData==null) return;
        var id = setupData[0];
        var playerData = setupData[1];
        var roleList = setupData[2];

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
        _setupHtml_setting(playerData, roleList);
    };

    var _setupHtml_setting = function (playerData, roleList){
        var numberSelector = null,
            roleSelector = null;
        // ok
        html['setting']['title'] = $(HTML.setting.title).appendTo(html['panel']['setting']);
        html['setting']['ok'] = $(HTML.setting.ok).appendTo(html['setting']['title']);
        html['setting']['ok'].click(function (){
            var name = html['setting']['name'].children('input').val(),
                number = numberSelector.getSelect(),
                role = roleSelector.getSelect();

            if (name==null||name==''){
                InfoBox.alert({
                  content: 'Please input a user name.',
                });
                return;
            }

            InfoBox.check({
              content: '<span style="color:#666;">Please confirm the information is correct:</span><br/><br/>'+ '<b>[No. '+number+'] ' + name + '</b><br/><span style="font-size:20px;line-height:36px;">( '+ROLEDATA[role].name+' )</span>',
              callbackYes: function (){
                that.message.action([
                  MSGCODE.CLIENT.INIT,
                  name,
                  number,
                  role
                ]);
                html['panel']['setting'].fadeOut();
              }
            });
        });

        // inner
        html['setting']['inner'] = $(HTML.setting.inner).appendTo(html['panel']['setting']);
        html['setting']['sapce'] = $(HTML.setting.space).appendTo(html['setting']['inner']);

        // name
        html['setting']['nameTag'] = $(HTML.setting.tag).appendTo(html['setting']['inner']).text("[ input your name ]");
        html['setting']['name'] = $(HTML.setting.name).appendTo(html['setting']['inner']);

        // number options
        html['setting']['numberTag'] = $(HTML.setting.tag).appendTo(html['setting']['inner']).text("[ select your number ]");
        html['setting']['number'] = $(HTML.setting.number.wrap).appendTo(html['setting']['inner']);
        var numberOptions = [];
        for (var i=1;i<=playerData.length;i++){
          numberOptions.push({key:i,content:HTML.setting.number.item.replace(/#content#/g,i)});
        }
        numberSelector = new ScrollOption(html['setting']['number'][0], numberOptions);

        // role options
        html['setting']['roleTag'] = $(HTML.setting.tag).appendTo(html['setting']['inner']).text("[ select your role ]");
        html['setting']['role'] = $(HTML.setting.role.wrap).appendTo(html['setting']['inner']);
        var roleOptions = [];
        for (var i=0;i<roleList.length;i++){
          roleOptions.push({key:roleList[i],content:HTML.setting.role.item.replace(/#content#/g, ROLEDATA[roleList[i]].name)});
        }
        roleSelector = new ScrollOption(html['setting']['role'][0], roleOptions);

    };

    var _addPlayer = function (id, name, number){
        var ele = $(HTML.playerItem).appendTo(html['panel']['player']);
        ele.click(function(){
            if (!actived) return;
        });
        html['players'][id] = ele;
    };

    var _select = function (id){

    };

    var _init = function () {
    }();
};

module.exports = Main;
