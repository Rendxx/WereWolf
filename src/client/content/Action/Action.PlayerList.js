var Util = require('SRC/Util.js');
var Basic= require('./Action.Basic.js');
require('./Action.PlayerList.less');

var CSS = {
    enterScreen: 'action_playerList_enterScreen',
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
    Basic.call(this);
    this.playerIdx=playerIdx;
    this.playerInfo = playerInfo;
    this.title = title||'';
    this._playerAliveArr = null;
    this._voteArr = null;
    this._werewolfArr = null;

    // callback ----------------------------------
    this.onSelect = null;
    this.onAbstain = null;
    this._onOk = null;
};
PlayerList.prototype = Object.create(Basic.prototype);
PlayerList.prototype.constructor = PlayerList;

PlayerList.prototype.setup = function (container, width, height){
    Basic.prototype.setup.call(this, container);
    this._setupHtml();
    this.resize(width, height);
};

PlayerList.prototype.reset = function (opts){
    this._playerAliveArr=opts.playerAlive;
    let isAvailable = opts.isAvailable,
        className = opts.className,
        content = opts.content;
    this.html['enterScreen']['wrap'].className = CSS.enterScreen+ ' '+CSS.show+' '+className;
    this.html['enterScreen']['content'].innerHTML = content;

    if (isAvailable){
        this._onOk = function(){
            this.html['enterScreen']['wrap'].classList.remove(CSS.show);
        }.bind(this);
    }else{
        this._onOk = function(){
            this.onAbstain && this.onAbstain();
        }.bind(this);
    }
};

PlayerList.prototype.update = function (opts){
    opts=opts||{};
    this._werewolfArr=opts.werewolf;
    this._voteArr=opts.vote;
    this._update();
};

PlayerList.prototype._update = function (){
    if (this._playerAliveArr==null||this._voteArr==null) return;
    let _html = this.html['playerList'];
    for (let i in _html['player']){
        if (this._playerAliveArr[i]==='1') _html['player'][i].inner.classList.add(CSS.alive);
        else _html['player'][i].inner.classList.remove(CSS.alive);
        Util.EmptyDom(_html['player'][i].vote);
        _html['player'][i].inner.classList.remove(CSS.selected);
        _html['player'][i].inner.classList.remove(CSS.werewolf);
    }
    _html['player']['-1'] && _html['player']['-1'].inner.classList.add(CSS.alive);
    if (this._voteArr!=null) {
        for (let i in this._voteArr){
            if (!_html['player'].hasOwnProperty(this._voteArr[i])) continue;
            if (Number(i)===this.playerIdx)_html['player'][this._voteArr[i]].inner.classList.add(CSS.selected);
            _html['player'][this._voteArr[i]].vote.appendChild(_html['voteCache'][i]);
        }
    }
    if (this._werewolfArr!=null) {
        for (let i in this._werewolfArr){
            if (!_html['player'].hasOwnProperty(this._werewolfArr[i])) continue;
            _html['player'][this._werewolfArr[i]].inner.classList.add(CSS.werewolf);
        }
    }
};

PlayerList.prototype.resize = function (w, h){
    Basic.prototype.resize.call(this, w, h);
    this._setupPlayerList(this.html['wrap']);
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
    if (this.html['wrap']) this.container.removeChild(this.html['wrap']);
    this.html['wrap'] = Util.CreateDom('<div class="action_playerList"></div>', this.container);
    this._setupEnterScreen(this.html['wrap']);
    this._setupPlayerList(this.html['wrap']);
};

PlayerList.prototype._setupEnterScreen = function (container){
    if (this.html['enterScreen']) container.removeChild(this.html['enterScreen']['wrap']);
    let _html = {};
    let wrap = document.createElement("DIV");
    wrap.className = CSS.enterScreen;
    wrap.innerHTML =  [
        '<div class="_inner">',
            '<div class="_icon"></div>',
            '<div class="_content"></div>',
            '<div class="_btn_ok">O K</div>',
        '</div>'
    ].join('');
    container.appendChild(wrap);

    _html['wrap'] = wrap;
    _html['content'] = wrap.querySelector('._content');
    _html['ok'] = wrap.querySelector('._btn_ok');
    Util.BindClick(_html['ok'], function (){
        this._onOk && this._onOk ();
    }.bind(this));
    this.html['enterScreen'] = _html;
};

PlayerList.prototype._setupPlayerList = function (container){
    if (this.html['playerList']) container.removeChild(this.html['playerList']['wrap']);
    let _html = {};
    let wrap = document.createElement("DIV");
    wrap.className = 'action_playerList_player';
    wrap.innerHTML =  [
        '<div class="_title"><span>'+this.title+'</span></div>',
        '<div class="_inner"></div>'
    ].join('');
    container.appendChild(wrap);

    // create slot
    let titleHeight = 50,
        size = ~~((this.height-titleHeight+this.width)*2/(8+this.playerInfo.length));
    if (size*3>this.width) size = ~~(this.width/3);

    let w = ~~(this.width/size)-2,
        h = (this.playerInfo.length-w*2+1)>>1,
        n = (w+h)*2,
        idx = 0;

    _html['wrap'] = wrap;
    _html['inner'] = wrap.querySelector('._inner');
    _html['inner'].style.width = (w+2)*size+'px';
    _html['inner'].style.height = (h+1)*size+'px';
    _html['inner'].style.marginLeft = (-((w+2)*size)>>1)+'px';
    _html['inner'].style.marginTop = (-((h+1)*size-titleHeight)>>1)+'px';

    _html['slot']=[];
    for (let i=0;i<h;i++){
        _html['slot'][idx++] = this._addSlot(_html['inner'], size, {
            left: '0',
            right: 'auto',
            top: ~~((0.5+i)*size)+'px',
            bottom: 'auto'
        });
    }
    for (let i=0;i<w;i++){
        _html['slot'][idx++] = this._addSlot(_html['inner'], size, {
            left: (i+1)*size+'px',
            right: 'auto',
            top: 'auto',
            bottom: '0'
        });
    }
    for (let i=h-1;i>=0;i--){
        _html['slot'][idx++] = this._addSlot(_html['inner'], size, {
            left: 'auto',
            right: '0',
            top: ~~((0.5+i)*size)+'px',
            bottom: 'auto'
        });
    }
    for (let i=w-1;i>=0;i--){
        _html['slot'][idx++] = this._addSlot(_html['inner'], size, {
            left: (i+1)*size+'px',
            right: 'auto',
            top: '0',
            bottom: 'auto'
        });
    }
    _html['slot']['-1'] = this._addSlot(_html['inner'], size, {
        left: ~~((1+(w-1)/2)*size)+'px',
        right: 'auto',
        top: ~~(((h)/2)*size)+'px',
        bottom:  'auto'
    });
    
    _html['player']={};
    let number = [];
    for (let i=0;i<this.playerInfo.length;i++) number[i]=i;
    let that = this;
    number.sort(function(a, b){
        return that.playerInfo[a][0] - that.playerInfo[b][0];
    });

    for (let i=0;i<this.playerInfo.length;i++){
        let k = number[i];
        _html['player'][k] = this._addPlayer(k, this.playerInfo[k][0],this.playerInfo[k][1], _html['slot'][i], this.onSelect);
    }
    _html['player']['-1'] = this._addAbstain(_html['slot'][-1], this.onAbstain);

    _html['voteCache'] = [];
    for (let i=0;i<this.playerInfo.length;i++){
        //_html['voteCache'].push(Util.CreateDom(HTML.player.voteMarker, null, this.playerInfo[i][0]));
        _html['voteCache'].push(Util.CreateDom('<div class="_voteMarker"></div>', null));
    }
    this.html['playerList'] = _html;
};

PlayerList.prototype._addSlot = function (container, size, css){
    let pkg = {};    
    pkg['wrap'] = Util.CreateDom('<div class="_player"></div>', container);
    pkg['inner'] = Util.CreateDom('<div class="_playerInner"></div>', pkg['wrap']);
    pkg['number'] = Util.CreateDom('<div class="_number"></div>', pkg['inner']);
    pkg['before'] = Util.CreateDom('<div class="_bgBefore"></div>', pkg['inner']);
    pkg['after'] = Util.CreateDom('<div class="_bgAfter"></div>', pkg['inner']);
    pkg['marker'] = Util.CreateDom('<div class="_marker"></div>', pkg['inner']);
    pkg['name'] = Util.CreateDom('<div class="_name"></div>', pkg['inner']);
    pkg['vote'] = Util.CreateDom('<div class="_vote"></div>', pkg['inner']);
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
