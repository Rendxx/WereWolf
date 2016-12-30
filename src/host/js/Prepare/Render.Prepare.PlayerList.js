require('HOST/less/Prepare/Prepare.PlayerList.less');

var HTML = {
    wrap: '<div class="_playerList"></div>',
    inner: '<div class="_playerinner"></div>',
    item: '<div class="_playerItem"></div>',
    number: '<div class="_number"></div>',
    name: '<div class="_name"></div>',
};

var CSS={
    hover: '_hover'
};

var PlayerList = function (container){
    var that = this;
    var container = $(container);
    var playerNumber = 0;
    var clientMap = {};
    var playerMap = {};
    var swapItem = null;
    var _html = {
    };

    // callback ----------------------------------
    this.onChange = null;

    // public ------------------------------------
    this.addPlayer = function (id, name){
      if (clientMap.hasOwnProperty(id)) return;
      createItem(id, name);
    };

    this.removePlayer = function (id){
      if (!clientMap.hasOwnProperty(id)) return;
      var n = clientMap[id];
      delete playerMap[n];
      delete clientMap[id];
      for (var i in clientMap){
        if (clientMap[i]>n){
            clientMap[i]--;
            playerMap[clientMap[i]]=i;
        }
      }
      _html['playerSlot'].pop();
    };

    // private -----------------------------------
    var createItem = function (id, name){
        var index = ++playerNumber;
        var pkg = {};
        pkg['wrap']=$(HTML.item).appendTo(_html['inner']);
        pkg['number']=$(HTML.number).appendTo(pkg['wrap']).text(index);
        pkg['name']=$(HTML.name).appendTo(pkg['inner']).text(name);
        _html['playerSlot'][index] = pkg;
        clientMap[id] = index;
        playerMap[index] = id;

        pkg['wrap'].click(function(){
            if (swapItem===null){
                swapItem = index;
                pkg['wrap'].addClass(CSS.hover);
            }
            else if (swapItem===index){
                swapItem = null;
                pkg['wrap'].removeClass(CSS.hover);
            } else {
                swap(swapItem, index);
                _html['playerSlot'][index]['wrap'].removeClass(CSS.hover);
                _html['playerSlot'][swapItem]['wrap'].removeClass(CSS.hover);
                swapItem=null;
            }
        });
        that.onChange && that.onChange(clientMap);
    };

    var swap = function (idx1, idx2){
        var id1 = playerMap[idx1];
        var id2 = playerMap[idx2];
        var name1 = _html['playerSlot'][idx1]['name'].text();
        var name2 = _html['playerSlot'][idx2]['name'].text();
        playerMap[idx1] = id2;
        playerMap[idx2] = id1;
        clientMap[id1] = idx2;
        clientMap[id2] = idx1;
        _html['playerSlot'][idx1]['name'].text(name2);
        _html['playerSlot'][idx2]['name'].text(name1);
        that.onChange && that.onChange(clientMap);
    };

    var setupHtml = function (playerInfo, title){
        _html['wrap']=$(HTML.wrap).appendTo(container);
        _html['inner']=$(HTML.inner).appendTo(_html['wrap']);
        _html['playerSlot'] = [];
    };
    var _init = function() {
        setupHtml();
    }();
};

module.exports = PlayerList;
