require('./Render.Prepare.PlayerList.less');

var HTML = {
  wrap: '<div class="playerList"></div>',
  inner: '<div class="_playerinner"></div>',
  item: '<div class="_playerItem"></div>',
  number: '<div class="_number"></div>',
  name: '<div class="_name"></div>',
};

var CSS = {
  hover: '_hover'
};

var PlayerList = function(container) {
  var that = this;
  var container = $(container);
  this.playerNumber = 0;
  var clientMap = {};
  var clientName = {};
  var playerMap = {};
  var swapItem = null;
  var _html = {};

  // callback ----------------------------------
  this.onChange = null;

  // public ------------------------------------
  this.recoverClientNumber = function(clientNumber) {
    if (clientNumber == null) return;
    let number = 1;
    let clientOrder = [];
    for (let id in clientNumber) {
      clientOrder[clientNumber[id] - 1] = id;
    }

    for (var id in clientMap) {
      clientMap[id] = 0;
    }
    for (let i = 0; i < clientOrder.length; i++) {
      const id = clientOrder[i];
      if (clientMap.hasOwnProperty(id)) {
        clientMap[id] = number++;
      }
    }
    for (var id in clientMap) {
      if (clientMap[id] === 0) {
        clientMap[id] = number++;
      }
    }
    for (var id in clientMap) {
      playerMap[clientMap[id]] = id;
      _html['playerSlot'][clientMap[id]]['name'].text(clientName[id]);
    }
  };

  this.updatePlayer = function(clientData) {
    for (var id in clientMap) {
      if (clientData.hasOwnProperty(id)) continue;
      removeItem(id);
    }
    for (var id in clientData) {
      if (clientMap.hasOwnProperty(id)) continue;
      createItem(id, clientData[id].name);
    }
  };

  this.addPlayer = function(id, name) {
    if (clientMap.hasOwnProperty(id)) return;
    createItem(id, name);
    that.onChange && that.onChange(clientMap);
  };

  this.removePlayer = function(id) {
    if (!clientMap.hasOwnProperty(id)) return;
    removeItem(id);
    that.onChange && that.onChange(clientMap);
  };

  this.getClientNumber = function() {
    var rst = {};
    for (var id in clientMap) {
      rst[id] = clientMap[id];
    }
    return rst;
  };

  // private -----------------------------------
  var removeItem = function(id) {
    var n = clientMap[id];
    for (n; n < that.playerNumber; n++) {
      swap(n, n + 1);
    }
    delete playerMap[that.playerNumber];
    delete clientMap[id];
    delete clientName[id];
    that.playerNumber--;
    var t = _html['playerSlot'].pop();
    t.wrap.remove();
  };

  var createItem = function(id, name) {
    var index = ++that.playerNumber;
    var pkg = {};
    pkg['wrap'] = $(HTML.item).appendTo(_html['inner']);
    pkg['number'] = $(HTML.number).appendTo(pkg['wrap']).text(index);
    pkg['name'] = $(HTML.name).appendTo(pkg['wrap']).text(name);
    _html['playerSlot'][index] = pkg;
    clientMap[id] = index;
    clientName[id] = name;
    playerMap[index] = id;

    pkg['wrap'].click(function() {
      if (swapItem === null) {
        swapItem = index;
        pkg['wrap'].addClass(CSS.hover);
      } else if (swapItem === index) {
        swapItem = null;
        pkg['wrap'].removeClass(CSS.hover);
      } else {
        swap(swapItem, index);
        _html['playerSlot'][index]['wrap'].removeClass(CSS.hover);
        _html['playerSlot'][swapItem]['wrap'].removeClass(CSS.hover);
        swapItem = null;
        that.onChange && that.onChange(clientMap);
      }
    });
  };

  var swap = function(idx1, idx2) {
    var id1 = playerMap[idx1];
    var id2 = playerMap[idx2];
    playerMap[idx1] = id2;
    playerMap[idx2] = id1;
    clientMap[id1] = idx2;
    clientMap[id2] = idx1;
    _html['playerSlot'][idx1]['name'].text(clientName[id2]);
    _html['playerSlot'][idx2]['name'].text(clientName[id1]);
  };

  var setupHtml = function(playerInfo, title) {
    _html['wrap'] = $(HTML.wrap).appendTo(container);
    _html['inner'] = $(HTML.inner).appendTo(_html['wrap']);
    _html['playerSlot'] = [];
  };
  var _init = function() {
    setupHtml();
  }();
};

module.exports = PlayerList;
