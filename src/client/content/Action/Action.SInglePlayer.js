var Util = require('SRC/Util.js');
var Basic= require('./Action.Basic.js');
require('./Action.SinglePlayer.less');

var CSS = {
    show: '_show',
    wrap: 'action_singlePlayer'
};

var SinglePlayer = function (){
    Basic.call(this);

    // callback ----------------------------------
    this._onYes = null;
    this._onNo = null;
    this._onOk = null;
};
SinglePlayer.prototype = Object.create(Basic.prototype);
SinglePlayer.prototype.constructor = SinglePlayer;

SinglePlayer.prototype.setup = function (container, width, height){
    Basic.prototype.setup.call(this, container);
    this._setupHtml();
    this.resize(width, height);
};

SinglePlayer.prototype.update = function (opts){
    let className = opts.className,
        number = opts.number||'',
        name = opts.name||'',
        content = opts.content,
        isAvailable = opts.isAvailable;
    this._onYes = opts.onYes;
    this._onNo = opts.onNo;
    this._onOk = opts.onOk;
    if (isAvailable===true){
        this.html['yes'].style.display = 'block';
        this.html['no'].style.display = 'block';
        this.html['ok'].style.display = 'none';
    }else{
        this.html['yes'].style.display = 'none';
        this.html['no'].style.display = 'none';
        this.html['ok'].style.display = 'block';
    }
    this.html['number'].innerHTML = number;
    this.html['name'].innerHTML = name;
    this.html['content'].innerHTML = content;
    this.html['wrap'].className =  CSS.wrap+' '+className;
};

SinglePlayer.prototype.show = function (){
    Basic.prototype.show.call(this);
    this.html['wrap'].classList.add(CSS.show);
};

SinglePlayer.prototype.hide = function (){
    Basic.prototype.hide.call(this);
    this.html['wrap'].classList.remove(CSS.show);
};

SinglePlayer.prototype._setupHtml = function (){
    Util.EmptyDom(this.container);
    let wrap = document.createElement("DIV");
    wrap.className = CSS.wrap;
    wrap.innerHTML =  [
        '<div class="_inner">',
            '<div class="_numberWrap">',
                '<div class="_effort"></div>',
                '<div class="_number"></div>',
                '<div class="_bg"></div>',
            '</div>',
            '<div class="_name"></div>',
            '<div class="_content"></div>',
            '<div class="_btns">',
                '<div class="_btn _btn_yes">YES</div>',
                '<div class="_btn _btn_no">NO</div>',
                '<div class="_btn _btn_ok">OK</div>',
            '</div>',
        '</div>'
    ].join('');
    this.container.appendChild(wrap);

    this.html['wrap'] = wrap;
    this.html['numberWrap'] = wrap.querySelector('._numberWrap');
    this.html['number'] = this.html['numberWrap'].querySelector('._number');
    this.html['name'] = wrap.querySelector('._name');
    this.html['content'] = wrap.querySelector('._content');
    this.html['yes'] = wrap.querySelector('._btn._btn_yes');
    this.html['no'] = wrap.querySelector('._btn._btn_no');
    this.html['ok'] = wrap.querySelector('._btn._btn_ok');
    Util.BindClick(this.html['yes'], function (){
        if (!this.html['yes'].classList.contains(CSS.show)) return false;
        this._onYes && this._onYes ();
    }.bind(this));
    Util.BindClick(this.html['no'], function (){
        if (!this.html['no'].classList.contains(CSS.show)) return false;
        this._onNo && this._onNo ();
    }.bind(this));
    Util.BindClick(this.html['ok'], function (){
        if (!this.html['ok'].classList.contains(CSS.show)) return false;
        this._onOk && this._onOk ();
    }.bind(this));
    if (this._shown) this.show();
};

module.exports = SinglePlayer;
