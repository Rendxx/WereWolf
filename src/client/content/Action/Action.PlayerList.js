var Util = require('SRC/Util.js');
var Basic= require('./Action.Basic.js');
require('./Action.PlayerList.less');

var HTML = {
    wrap: '<div class="action_playerList"></div>',
    title: '<div class="_title"><span></span></div>',
    player: {
      wrap: '<div class="_player"></div>',
      number: '<div class="_number"></div>',
      name: '<div class="_name"></div>',
      vote: '<div class="_vote"></div>',
      voteMarker: '<div class="_voteMarker"></div>',
    },
};

var CSS = {
    alive: '_alive',
    show: '_show',
    selected: '_selected',
    abstain:'_abstain',
    empty:'_empty'
};

var PlayerList = function (playerInfo, title){
    Basic.call(this);
    this.title = title||'';
    this.playerInfo = playerInfo;

    // callback ----------------------------------
    this.onSelect = null;
    this.onAbstain = null;
};
PlayerList.prototype = Object.create(Basic.prototype);
PlayerList.prototype.constructor = PlayerList;

PlayerList.prototype.setup = function (container){
    Basic.prototype.setup.call(this, container);
    this._setupHtml();
};

PlayerList.prototype.update = function (playerAliveArr, voteArr){
    for (let i in this.html['player']){
        if (playerAliveArr[i]==='1') this.html['player'][i].wrap.classList.add(CSS.alive);
        else this.html['player'][i].wrap.classList.remove(CSS.alive);
        Util.EmptyDom(this.html['player'][i].vote);
        this.html['player'][i].wrap.classList.remove(CSS.selected);
    }
    this.html['player']['-1'] && this.html['player']['-1'].wrap.classList.add(CSS.alive);
    if (voteArr==null) return;
    for (let i in voteArr){
        if (!this.html['player'].hasOwnProperty(voteArr[i])) continue;
        if (Number(i)===this.playerIdx)this.html['player'][voteArr[i]].wrap.classList.add(CSS.selected);
        this.html['player'][voteArr[i]].vote.appendChild(this.html['voteCache'][i]);
    }
};

PlayerList.prototype.resize = function (w, h){
    Basic.prototype.resize.call(this, w, h);
};

PlayerList.prototype.show = function (){
    this.html['wrap'].classList.add(CSS.show);
};

PlayerList.prototype.hide = function (){
    this.html['wrap'].classList.remove(CSS.show);
};

PlayerList.prototype._setupHtml = function (){
    Util.EmptyDom(this.container);
    // create slot
    let size = ~~(this.height+this.width)*2/(6+this.playerInfo.length);
    let w = ~~(this.width/size)-2,
        h = ~~(this.height/size),
        n = (w+h)*2,
        slotIdx = 0,
        top = ~~((this.height-h*size)/2),
        left = ~~((this.width-w*size)/2);

    this.html['wrap'] = Util.CreateDom(HTML.wrap, this.container);
    this.html['slot']=[];
    for (let i=0;i<h;i++){
        this.html['slot'][idx++] = _addSlot(this.html['wrap'],{
            left: '10px',
            right: 'auto',
            top: top+i*size+'px',
            bottom: 'auto'
        });
    }
    for (let i=0;i<w;i++){
        this.html['slot'][idx++] = _addSlot(this.html['wrap'],{
            left: left+i*size+'px',
            right: 'auto',
            top: 'auto',
            bottom: '10px'
        });
    }
    for (let i=h-1;i>=0;i--){
        this.html['slot'][idx++] = _addSlot(this.html['wrap'],{
            left: 'auto',
            right: '10px',
            top: top+i*size+'px',
            bottom: 'auto'
        });
    }
    for (let i=w-1;i>=0;i--){
        this.html['slot'][idx++] = _addSlot(this.html['wrap'],{
            left: left+i*size+'px',
            right: 'auto',
            top: '10px',
            bottom: 'auto'
        });
    }

    this.html['_title'] = Util.CreateDom(HTML.title, this.html['wrap'], this.title);
    
    this.html['player']={};
    let number = [];
    for (let i=0;i<this.playerInfo.length;i++) number[i]=i;
    let that = this;
    number.sort(function(a, b){
        return that.playerInfo[a][0] - that.playerInfo[b][0];
    });

    let slotIdx = h+~~(w/2)-this.playerInfo[this.playerIdx][0]-1;
    for (let i=0;i<this.playerInfo.length;i++){
        let k = number[i];
        this.html['player'][k] = this._addPlayer(k, this.playerInfo[k][0],this.playerInfo[k][1], this.html['slot'][(slotIdx++)%n], this.onSelect);
    }
    this.html['player']['-1'] = this._addAbstain(this.html['wrap'], this.onAbstain);

    this.html['voteCache'] = [];
    for (let i=0;i<this.playerInfo.length;i++){
        this.html['voteCache'].push(Util.CreateDom(HTML.player.voteMarker, null, this.playerInfo[i][0]));
    }
};

PlayerList.prototype._addSlot = function (container, css){
    let pkg = {};    
    pkg['wrap'] = Util.CreateDom(HTML.player.wrap, container);
    pkg['number'] = Util.CreateDom(HTML.player.number, pkg['wrap']);
    pkg['name'] = Util.CreateDom(HTML.player.name, pkg['wrap']);
    pkg['vote'] = Util.CreateDom(HTML.player.vote, pkg['wrap']);
    pkg['wrap'].classList.add(CSS.empty);
    for(let i in css){
        pkg['wrap'].style[i]=css[i];
    }
    return pkg;
};

PlayerList.prototype._addPlayer = function (idx, number, name, pkg, onSelect){
    pkg['wrap'] = Util.CreateDom(HTML.player.wrap, container);
    pkg['number'].innerHTML = number;
    pkg['name'].innerHTML = name;
    pkg['wrap'].classList.add(CSS.alive);
    pkg['wrap'].classList.remove(CSS.empty);

    Util.BindClick(pkg['wrap'], function (){
        if (!pkg['wrap'].classList.contains(CSS.alive)) return false;
        onSelect && onSelect (idx, number, name);
    });
    return pkg;
};

PlayerList.prototype._addAbstain = function (container, onSelect){
    var pkg = {};
    pkg['wrap'] = Util.CreateDom(HTML.player.wrap, container);
    pkg['number'] = Util.CreateDom(HTML.player.number, pkg['wrap']);
    pkg['name'] = Util.CreateDom(HTML.player.name, pkg['wrap'], 'Abstain');
    pkg['vote'] = Util.CreateDom(HTML.player.vote, pkg['wrap']);
    pkg['wrap'].classList.add(CSS.abstain);
    pkg['wrap'].classList.add(CSS.alive);

    Util.BindClick(pkg['wrap'], function (){
        onSelect && onSelect ();
    });
    return pkg;
};

module.exports = PlayerList;
