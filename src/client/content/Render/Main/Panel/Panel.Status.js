var Util = require('SRC/Util.js');
var Basic= require('./Panel.Basic.js');
require('./Panel.Status.less');

"use strick";
var HTML = {
    wrap: '<div class="panel_status"></div>',
    bg: '<div class="_bg"></div>',
    line: '<div class="_line"></div>',
    name: '<div class="_playerName"></div>',
    number: '<div class="_number"></div>',
    role: '<div class="_role"></div>',
    roleBtn: '<div class="_roleBtn">Hold to show ROLE</div>'
};

var CSS = {
    dead: '_dead',
    show: '_show'
};

var StatusPanel = function (){
    Basic.call(this);
};
StatusPanel.prototype = Object.create(Basic.prototype);
StatusPanel.prototype.constructor = StatusPanel;

StatusPanel.prototype.reset = function (number, name, role, roleInstance){
    this._setupHtml(number, name, role);
    if(roleInstance!=null) roleInstance.initInfoPanel(this.html['role']);
};

StatusPanel.prototype.updateAlive = function(isAlive) {
    if (isAlive) 
        this.html['wrap'].classList.remove(CSS.dead);
    else 
        this.html['wrap'].classList.add(CSS.dead);
};

StatusPanel.prototype._setupHtml = function(number, name, role) {
    var that = this;
    this.container.innerHTML = '';
    this.html['wrap'] = Util.CreateDom(HTML.wrap, this.container);
    this.html['number'] = Util.CreateDom(HTML.number, this.html['wrap'], number);
    this.html['line'] = Util.CreateDom(HTML.line, this.html['wrap']);
    this.html['name'] = Util.CreateDom(HTML.name, this.html['wrap'], name);
    this.html['bg'] = Util.CreateDom(HTML.bg, this.html['wrap']);
    this.html['role'] = Util.CreateDom(HTML.role, this.html['wrap']);
    this.html['roleBtn'] = Util.CreateDom(HTML.roleBtn, this.html['wrap']);

    var showRole = function() {
        that.html['role'].classList.add(CSS.show);
    };
    var hideRole = function() {
        that.html['role'].classList.remove(CSS.show);
    };
    this.html['roleBtn'].addEventListener('mousedown', showRole, false);
    this.html['roleBtn'].addEventListener('touchstart', showRole, false);
    this.html['roleBtn'].addEventListener('mouseup', hideRole, false);
    this.html['roleBtn'].addEventListener('touchend', hideRole, false);
    this.html['roleBtn'].addEventListener('mouseout', hideRole, false);
};

module.exports = StatusPanel;