var Util = require('SRC/Util.js');
var Basic= require('./Action.Basic.js');
require('./Action.PlayerList.less');

var HTML = {
    wrap: '<div class="action_playerList"></div>',
    inner: '<div class="_playerList"></div>',
    title: '<div class="_title"><span></span></div>',
    player: {
      wrap: '<div class="_player"></div>',
      inner: '<div class="_playerInner"></div>',
      number: '<div class="_number"></div>',
      bgAfter: '<div class="_bgAfter"></div>',
      bgBefore: '<div class="_bgBefore"></div>',
      marker: '<div class="_marker"></div>',
      name: '<div class="_name"></div>',
      vote: '<div class="_vote"></div>',
      voteMarker: '<div class="_voteMarker"></div>',
    },
};

var CSS = {
    werewolf:'_werewolf',
    alive: '_alive',
    show: '_show',
    selected: '_selected',
    abstain: '_abstain',
    empty:'_empty'
};

var Data = {
    maxSize:120
};

var PlayerList = function (playerIdx, playerInfo, title){
    Basic.call(this, playerIdx);
    this.title = title||'';
    this.playerInfo = playerInfo;
    this._playerAliveArr = null;
    this._voteArr = null;
    this._werewolfArr = null;

    // callback ----------------------------------
    this.onSelect = null;
    this.onAbstain = null;
};
PlayerList.prototype = Object.create(Basic.prototype);
PlayerList.prototype.constructor = PlayerList;

PlayerList.prototype.setup = function (container, width, height){
    Basic.prototype.setup.call(this, container);
    this.resize(width, height);
};

PlayerList.prototype.update = function (playerAliveArr, dat){
    this._playerAliveArr=playerAliveArr;
    this._werewolfArr=dat[0];
    this._voteArr=dat[1];
    this._update();
};

PlayerList.prototype._update = function (){
    if (this._playerAliveArr==null||this._voteArr==null) return;
    for (let i in this.html['player']){
        if (this._playerAliveArr[i]==='1') this.html['player'][i].inner.classList.add(CSS.alive);
        else this.html['player'][i].inner.classList.remove(CSS.alive);
        Util.EmptyDom(this.html['player'][i].vote);
        this.html['player'][i].inner.classList.remove(CSS.selected);
        this.html['player'][i].inner.classList.remove(CSS.werewolf);
    }
    this.html['player']['-1'] && this.html['player']['-1'].inner.classList.add(CSS.alive);
    if (this._voteArr!=null) {
        for (let i in this._voteArr){
            if (!this.html['player'].hasOwnProperty(this._voteArr[i])) continue;
            if (Number(i)===this.playerIdx)this.html['player'][this._voteArr[i]].inner.classList.add(CSS.selected);
            this.html['player'][this._voteArr[i]].vote.appendChild(this.html['voteCache'][i]);
        }
    }
    if (this._werewolfArr!=null) {
        for (let i in this._werewolfArr){
            if (!this.html['player'].hasOwnProperty(this._werewolfArr[i])) continue;
            this.html['player'][this._werewolfArr[i]].inner.classList.add(CSS.werewolf);
        }
    }
};

PlayerList.prototype.resize = function (w, h){
    Basic.prototype.resize.call(this, w, h);
    this._setupHtml();
    this._update();
};

PlayerList.prototype.show = function (){
    Basic.prototype.show.call(this);
    this.html['wrap'].classList.add(CSS.show);
};

PlayerList.prototype.hide = function (){
    Basic.prototype.hide.call(this);
    this.html['wrap'].classList.remove(CSS.show);
};

PlayerList.prototype._setupHtml = function (){
    Util.EmptyDom(this.container);
    // create slot
    let titleHeight = 50,
        size = ~~((this.height-titleHeight+this.width)*2/(8+this.playerInfo.length));
    if (size*3>this.width) size = ~~(this.width/3);

    let w = ~~(this.width/size)-2,
        h = (this.playerInfo.length-w*2+1)>>1,
        n = (w+h)*2,
        idx = 0;

    this.html['wrap'] = Util.CreateDom(HTML.wrap, this.container);
    this.html['title'] = Util.CreateDom(HTML.title, this.html['wrap'], this.title);
    this.html['inner'] = Util.CreateDom(HTML.inner, this.html['wrap']);
    this.html['inner'].style.width = (w+2)*size+'px';
    this.html['inner'].style.height = (h+1)*size+'px';
    this.html['inner'].style.marginLeft = (-((w+2)*size)>>1)+'px';
    this.html['inner'].style.marginTop = (-((h+1)*size-titleHeight)>>1)+'px';

    this.html['slot']=[];
    for (let i=0;i<h;i++){
        this.html['slot'][idx++] = this._addSlot(this.html['inner'], size, {
            left: '0',
            right: 'auto',
            top: ~~((0.5+i)*size)+'px',
            bottom: 'auto'
        });
    }
    for (let i=0;i<w;i++){
        this.html['slot'][idx++] = this._addSlot(this.html['inner'], size, {
            left: (i+1)*size+'px',
            right: 'auto',
            top: 'auto',
            bottom: '0'
        });
    }
    for (let i=h-1;i>=0;i--){
        this.html['slot'][idx++] = this._addSlot(this.html['inner'], size, {
            left: 'auto',
            right: '0',
            top: ~~((0.5+i)*size)+'px',
            bottom: 'auto'
        });
    }
    for (let i=w-1;i>=0;i--){
        this.html['slot'][idx++] = this._addSlot(this.html['inner'], size, {
            left: (i+1)*size+'px',
            right: 'auto',
            top: '0',
            bottom: 'auto'
        });
    }
    this.html['slot']['-1'] = this._addSlot(this.html['inner'], size, {
        left: ~~((1+(w-1)/2)*size)+'px',
        right: 'auto',
        top: ~~(((h)/2)*size)+'px',
        bottom:  'auto'
    });
    
    this.html['player']={};
    let number = [];
    for (let i=0;i<this.playerInfo.length;i++) number[i]=i;
    let that = this;
    number.sort(function(a, b){
        return that.playerInfo[a][0] - that.playerInfo[b][0];
    });

    for (let i=0;i<this.playerInfo.length;i++){
        let k = number[i];
        this.html['player'][k] = this._addPlayer(k, this.playerInfo[k][0],this.playerInfo[k][1], this.html['slot'][i], this.onSelect);
    }
    this.html['player']['-1'] = this._addAbstain(this.html['slot'][-1], this.onAbstain);

    this.html['voteCache'] = [];
    for (let i=0;i<this.playerInfo.length;i++){
        //this.html['voteCache'].push(Util.CreateDom(HTML.player.voteMarker, null, this.playerInfo[i][0]));
        this.html['voteCache'].push(Util.CreateDom(HTML.player.voteMarker, null));
    }
    if (this._shown) this.show();
};

PlayerList.prototype._addSlot = function (container, size, css){
    let pkg = {};    
    pkg['wrap'] = Util.CreateDom(HTML.player.wrap, container);
    pkg['inner'] = Util.CreateDom(HTML.player.inner, pkg['wrap']);
    pkg['number'] = Util.CreateDom(HTML.player.number, pkg['inner']);
    pkg['before'] = Util.CreateDom(HTML.player.bgBefore, pkg['inner']);
    pkg['after'] = Util.CreateDom(HTML.player.bgAfter, pkg['inner']);
    pkg['marker'] = Util.CreateDom(HTML.player.marker, pkg['inner']);
    pkg['name'] = Util.CreateDom(HTML.player.name, pkg['inner']);
    pkg['vote'] = Util.CreateDom(HTML.player.vote, pkg['inner']);
    pkg['inner'].classList.add(CSS.empty);

    for(let i in css){
        pkg['wrap'].style[i]=css[i];
    }
    pkg['wrap'].style['width'] = size+'px';
    pkg['wrap'].style['height'] = size+'px';
    
    if (size>Data.maxSize) {
        pkg['inner'].style['top']= ((size-Data.maxSize)>>1)+'px';
        pkg['inner'].style['left']= ((size-Data.maxSize)>>1)+'px';
        size = Data.maxSize;  
        pkg['inner'].style['width']= size+'px';
        pkg['inner'].style['height']= size+'px';        
    }

    let s = size-40;
    let css2 = {
        'width':s+'px',
        'height':s+'px',
        'margin-left':-((s+1)>>1)+'px',
        'margin-top': -((s+1)>>1)-15+'px',
        'line-height':s+'px',
        'font-size':s/2+'px'
    }
    for(let i in css2){
        pkg['number'].style[i]=css2[i];
        pkg['before'].style[i]=css2[i];
        pkg['after'].style[i]=css2[i];
    }
    pkg['marker'].style['top']=~~(s*0.4+s*0.5)+'px';
    pkg['marker'].style['left']=~~(s*0.4+size*0.5)+'px';
    return pkg;
};

PlayerList.prototype._addPlayer = function (idx, number, name, pkg, onSelect){
    pkg['number'].innerHTML = number;
    pkg['name'].innerHTML = name;
    pkg['inner'].classList.add(CSS.alive);
    pkg['inner'].classList.remove(CSS.empty);

    Util.BindClick(pkg['inner'], function (){
        if (!pkg['inner'].classList.contains(CSS.alive)) return false;
        onSelect && onSelect (idx, number, name);
    });
    return pkg;
};

PlayerList.prototype._addAbstain = function (pkg, onSelect){
    pkg['name'].innerHTML = 'GIVE UP';
    pkg['inner'].classList.add(CSS.alive);
    pkg['inner'].classList.add(CSS.abstain);
    pkg['inner'].classList.remove(CSS.empty);

    Util.BindClick(pkg['inner'], function (){
        onSelect && onSelect ();
    });
    return pkg;
};

module.exports = PlayerList;
