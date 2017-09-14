var Role = require('ROLE/Role.Host.js');
var ROLECODE = Role.CODE;

require('./Render.Prepare.RoleSelectPanel.less');

var HTML = {
  wrap: '<div class="roleSelectPanel"></div>',
  inner: '<div class="_inner"></div>',
  title: '<div class="_title"><span>ROLE SETTING</span></div>',
  remainder: '<div class="_remainder"></div>',
  cancel: '<div class="_cancel">cancel</div>',
  ok: '<div class="_ok">O K</div>',
  roleList: '<div class="_roleList"></div>',
  selection: '<div class="_selection"></div>',
  selectionInner: '<div class="_selectionInner"></div>',
  roleItem: '<div class="_roleItem"><div class="_portrait"></div><span></span></div>',
};

var CSS = {
  show: '_show',
  available: '_available'
};

var RoleSelection = function(container) {
  var that = this;
  var container = $(container);
  var roleCache = [];
  var playerNumber = 0;
  var _html = {};

  // callback ----------------------------------
  this.onFinish = null;
  this.onCancel = null;

  // public ------------------------------------
  this.show = function(playerNumber_in) {
    _html['wrap'].addClass(CSS.show);
    playerNumber = playerNumber_in;
    if (roleCache.length > playerNumber) roleCache.length = playerNumber;
    render();
  };

  this.hide = function() {
    _html['wrap'].removeClass(CSS.show);
    this.onCancel && this.onCancel();
  };

  this.addRole = function(roleData) {
    if (roleCache.length >= playerNumber) return;
    roleCache.push(roleData);
    roleCache.sort((a, b) => {
      return a.Code - b.Code
    });
    render();
  };

  this.removeRole = function(roleData) {
    if (roleCache.length === 0) return;
    var idx = roleCache.indexOf(roleData);
    roleCache.splice(idx, 1);
    render();
  };

  // private -----------------------------------
  var render = function() {
    // remained
    var remainedNumber = playerNumber - roleCache.length;
    _html['remainder'].text(remainedNumber);

    // ok
    if (remainedNumber === 0 && playerNumber > 0) _html['ok'].addClass(CSS.available);
    else _html['ok'].removeClass(CSS.available);

    _html['roleList'].empty();
    for (var i = 0; i < roleCache.length; i++) {
      addRoleItem(roleCache[i]);
    }
  };

  var addRoleItem = function(roleData) {
    var ele = $(HTML.roleItem).appendTo(_html['roleList']);
    ele.children('span').text(roleData.Name);
    ele.children('._portrait').css('background-image', 'url(' + roleData.Portrait + ')');
    ele.click(function(e) {
      that.removeRole(roleData);
      return false;
    });
  };

  var setupHtml = function(playerInfo, title) {
    _html['wrap'] = $(HTML.wrap).appendTo(container);
    _html['inner'] = $(HTML.inner).appendTo(_html['wrap']);
    _html['title'] = $(HTML.title).appendTo(_html['inner']);
    _html['remainder'] = $(HTML.remainder).appendTo(_html['title']);
    _html['cancel'] = $(HTML.cancel).appendTo(_html['title']);
    _html['cancel'].click(function() {
      that.hide();
    });
    _html['ok'] = $(HTML.ok).appendTo(_html['title']);
    _html['ok'].click(function() {
      // if cache not contain all player info, return
      if (playerNumber - roleCache.length > 0 || playerNumber === 0) return false;

      // ================= move to core ==================
      // var roleMap = {};
      // var output = [];
      // for (var i=playerNumber;i>0;i--){
      //     var k = ~~(Math.random()*i);
      //     output.push(copy[k]);
      //     roleMap[copy[k]]=1;
      //     copy[k] = copy[i-1];
      // }
      // var roleList2 = [];
      // for (var i in roleMap){
      //   roleList2.push(Number(i));
      // }
      // roleList2.sort();

      // =================================================

      console.log("prepare");
      console.log(roleCache);
      // console.log(output);

      that.onFinish && that.onFinish(roleCache.map(d => {
        return d.Code;
      }));
    });

    _html['roleList'] = $(HTML.roleList).appendTo(_html['inner']);
    _html['selection'] = $(HTML.selection).appendTo(_html['inner']);
    _html['selectionInner'] = $(HTML.selectionInner).appendTo(_html['selection']);
    _html['selectionRole'] = [];
    for (var roleKey in ROLECODE) {
      addSelection(Role(ROLECODE[roleKey]).DATA);
    }
  };

  var addSelection = function(roleData) {
    var ele = $(HTML.roleItem).appendTo(_html['selectionInner']);
    ele.children('span').text(roleData.Name);
    ele.children('._portrait').css('background-image', 'url(' + roleData.Portrait + ')');
    ele.click(function(e) {
      that.addRole(roleData);
      return false;
    });
    _html['selectionRole'][roleData.Code] = ele;
  };

  var _init = function() {
    setupHtml();
  }();
};

module.exports = RoleSelection;
