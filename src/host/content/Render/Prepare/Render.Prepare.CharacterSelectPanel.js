var Character = require('CHARACTER/Character.Host.js');
var CHARACTER_CODE = Character.CODE;

require('./Render.Prepare.CharacterSelectPanel.less');

var HTML = {
  wrap: '<div class="characterSelectPanel"></div>',
  inner: '<div class="_inner"></div>',
  title: '<div class="_title"></div>',
  remainder: '<div class="_remainder"></div>',
  cancel: '<div class="_cancel">cancel</div>',
  ok: '<div class="_ok">O K</div>',
  characterList: '<div class="_characterList"></div>',
  selection: '<div class="_selection"></div>',
  selectionInner: '<div class="_selectionInner"></div>',
  characterItem: '<div class="_characterItem"><div class="_portrait"></div><span></span></div>',
};

var CSS = {
  show: '_show',
  available: '_available'
};

var CharacterSelection = function(container) {
  var that = this;
  var container = $(container);
  var characterCache = [];
  var playerNumber = 0;
  var _html = {};

  // callback ----------------------------------
  this.onFinish = null;
  this.onCancel = null;

  // public ------------------------------------
  this.show = function(playerNumber_in) {
    _html['wrap'].addClass(CSS.show);
    playerNumber = playerNumber_in;
    if (characterCache.length > playerNumber) characterCache.length = playerNumber;
    render();
  };

  this.hide = function() {
    _html['wrap'].removeClass(CSS.show);
    this.onCancel && this.onCancel();
  };

  this.addCharacter = function(characterData) {
    if (characterCache.length >= playerNumber) return;
    characterCache.push(characterData);
    characterCache.sort((a, b) => {
      return a.Code - b.Code
    });
    render();
  };

  this.removeCharacter = function(characterData) {
    if (characterCache.length === 0) return;
    var idx = characterCache.indexOf(characterData);
    characterCache.splice(idx, 1);
    render();
  };

  // private -----------------------------------
  var render = function() {
    // remained
    var remainedNumber = playerNumber - characterCache.length;
    _html['remainder'].text(remainedNumber);

    // ok
    if (remainedNumber === 0 && playerNumber > 0) _html['ok'].addClass(CSS.available);
    else _html['ok'].removeClass(CSS.available);

    _html['characterList'].empty();
    for (var i = 0; i < characterCache.length; i++) {
      addCharacterItem(characterCache[i]);
    }
  };

  var addCharacterItem = function(characterData) {
    var ele = $(HTML.characterItem).appendTo(_html['characterList']);
    ele.children('span').text(characterData.Name);
    ele.children('._portrait').css('background-image', 'url(' + characterData.Portrait + ')');
    ele.click(function(e) {
      that.removeCharacter(characterData);
      return false;
    });
  };

  var setupHtml = function(playerInfo, title) {
    _html['wrap'] = $(HTML.wrap).appendTo(container);
    _html['inner'] = $(HTML.inner).appendTo(_html['wrap']);
    _html['title'] = $(HTML.title).appendTo(_html['inner']);
    _html['cancel'] = $(HTML.cancel).appendTo(_html['title']);
    _html['cancel'].click(function() {
      that.hide();
    });
    _html['ok'] = $(HTML.ok).appendTo(_html['title']);
    _html['ok'].click(function() {
      // if cache not contain all player info, return
      // if (playerNumber - characterCache.length > 0 || playerNumber === 0) return false;
      // use the previous one if thief exist
      if (playerNumber !== characterCache.length || playerNumber === 0) return false;

      // ================= move to core ==================
      // var characterMap = {};
      // var output = [];
      // for (var i=playerNumber;i>0;i--){
      //     var k = ~~(Math.random()*i);
      //     output.push(copy[k]);
      //     characterMap[copy[k]]=1;
      //     copy[k] = copy[i-1];
      // }
      // var characterList2 = [];
      // for (var i in characterMap){
      //   characterList2.push(Number(i));
      // }
      // characterList2.sort();

      // =================================================

      console.log("prepare");
      console.log(characterCache);
      // console.log(output);

      that.hide();
      that.onFinish && that.onFinish(characterCache.map(d => {
        return d.Code;
      }));
    });

    _html['remainder'] = $(HTML.remainder).appendTo(_html['title']);
    _html['characterList'] = $(HTML.characterList).appendTo(_html['inner']);
    _html['selection'] = $(HTML.selection).appendTo(_html['inner']);
    _html['selectionInner'] = $(HTML.selectionInner).appendTo(_html['selection']);
    _html['selectionCharacter'] = [];
    for (var characterKey in CHARACTER_CODE) {
      addSelection(Character(CHARACTER_CODE[characterKey]).DATA);
    }
  };

  var addSelection = function(characterData) {
    var ele = $(HTML.characterItem).appendTo(_html['selectionInner']);
    ele.children('span').text(characterData.Name);
    ele.children('._portrait').css('background-image', 'url(' + characterData.Portrait + ')');
    ele.click(function(e) {
      that.addCharacter(characterData);
      return false;
    });
    _html['selectionCharacter'][characterData.Code] = ele;
  };

  var _init = function() {
    setupHtml();
  }();
};

module.exports = CharacterSelection;
