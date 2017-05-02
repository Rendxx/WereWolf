var Util = require('SRC/Util.js');
var Basic= require('./Action.Basic.js');
require('./Action.SinglePlayer.less');

var CSS = {
    show: '_show'
};

var SinglePlayer = function (playerIdx){
    Basic.call(this, playerIdx);

    // callback ----------------------------------
    this.onYes = null;
    this.onNo = null;
};
SinglePlayer.prototype = Object.create(Basic.prototype);
SinglePlayer.prototype.constructor = SinglePlayer;

SinglePlayer.prototype.setup = function (container, width, height){
    Basic.prototype.setup.call(this, container);
    this.resize(width, height);
};

SinglePlayer.prototype.update = function (className, content, isAvailable){
    if (isAvailable===true){
        this.html['yes'].style.display = 'block';
        this.html['no'].style.display = 'block';
        this.html['ok'].style.display = 'none';
    }else{
        this.html['yes'].style.display = 'none';
        this.html['no'].style.display = 'none';
        this.html['ok'].style.display = 'block';
    }
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
    wrap.className = 'action_singlePlayer';
    wrap.innerHTML =  [
        '<div class="_numberWrap">',
            '<div class="_effort"></div>',
            '<div class="_number"></div>',
        '</div>',
        '<div class="_word">',
            '<div class="_title">'+title+'</div>',
            '<div class="_content">'+content+'</div>',
            '<div class="_bracket_left">',
                '<div class="_bracket_top"></div>',
                '<div class="_bracket_mid"></div>',
                '<div class="_bracket_btm"></div>',
            '</div>',
            '<div class="_bracket_right">',
                '<div class="_bracket_top"></div>',
                '<div class="_bracket_mid"></div>',
                '<div class="_bracket_btm"></div>',
            '</div>',
            '<div class="_tapGuide">Tap to continue</div>',
        '</div>'
    ].join('');

    this.html['wrap'] = Util.CreateDom('<div class="action_singlePlayer"></div>', this.container);
    this.html['title'] = Util.CreateDom(HTML.title, this.html['wrap'], this.title);
    if (this._shown) this.show();
};

module.exports = SinglePlayer;
