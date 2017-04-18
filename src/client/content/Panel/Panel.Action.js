var Util = require('SRC/Util.js');
var Basic= require('./Panel.Basic.js');
require('./Panel.Action.less');

"use strick";
var HTML = {
    wrap: '<div class="panel_action"></div>'
};

var CSS = {
    show: '_show'
};

var ActionPanel = function (){
    Basic.call(this);
    this.components = {};
};
ActionPanel.prototype = Object.create(Basic.prototype);
ActionPanel.prototype.constructor = ActionPanel;

ActionPanel.prototype.reset = function (components){
    this._setupHtml();
    this.components = components||{};
    for (let i in this.components){
        this.components[i].setup(this.html['wrap']);
    }
};

ActionPanel.prototype.resize = function (w, h){
    Basic.prototype.resize.call(this, w, h);
    if (this.html['wrap']){
        this.html['wrap'].style.width = w+'px';
        this.html['wrap'].style.height = h+'px';
    }
    for (let i in this.components){
        this.components[i].resize(w, h);
    }
};

ActionPanel.prototype._setupHtml = function() {
    this.container.innerHTML = '';
    this.html['wrap'] = Util.CreateDom(HTML.wrap, this.container);
};

ActionPanel.prototype.show = function (){
    this.html['wrap'].classList.add(CSS.show);
};

ActionPanel.prototype.hide = function (){
    this.html['wrap'].classList.remove(CSS.show);
    for (let i in this.components){
        this.components[i].hide();
    }
};

module.exports = ActionPanel;