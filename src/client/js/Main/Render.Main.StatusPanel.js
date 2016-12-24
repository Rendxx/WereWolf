var ROLEDATA = require('GLOBAL/js/RoleData.js');
var InfoBox = require('CLIENT/js/InfoBox.js');

require('CLIENT/less/Main/Main.StatusPanel.less');

var HTML = {
    bg: '<div class="_bg"></div>',
    line: '<div class="_line"></div>',
    name: '<div class="_playerName"></div>',
    number: '<div class="_number"></div>',
    role: '<div class="_role"></div>',
    roleBtn: '<div class="_roleBtn">Tap to show ROLE</div>',
    listBtn: '<div class="_listBtn"></div>',
};

var CSS = {
    dead: '_dead',
    show: '_show'
};

var StatusPanel = function(container) {
    "use strick";
    // Property -------------------------------------
    var that = this;
    var html = {
        container: $(container)
    };

    // Callback ------------------------------
    this.onToggle = null;

    // Public --------------------------------
    this.show = function() {
        html['container'].fadeIn(200);
    };

    this.hide = function() {
        html['container'].fadeOut(200);
    };

    this.reset = function(number, name, role, roleInstance) {
        setupHtml(number, name, role);
        if(roleInstance!=null) roleInstance.initInfoPanel(html['role'][0]);
    };

    this.updateAlive = function(isAlive) {
        if (isAlive) html['container'].removeClass(CSS.dead);
        else html['container'].addClass(CSS.dead);
    };

    // Private ---------------------------------------
    var setupHtml = function(number, name, role) {
        html['container'].empty();
        html['number'] = $(HTML.number).appendTo(html['container']).text(number);
        html['line'] = $(HTML.line).appendTo(html['container']);
        html['name'] = $(HTML.name).appendTo(html['container']).text(name);
        html['bg'] = $(HTML.bg).appendTo(html['container']);
        html['role'] = $(HTML.role).appendTo(html['container']);
        html['roleBtn'] = $(HTML.roleBtn).appendTo(html['container']);
        html['listBtn'] = $(HTML.listBtn).appendTo(html['container']);
        html['listBtn'].click(function() {
            that.onToggle && that.onToggle();
        });
        var showRole = function() {
            html['role'].addClass(CSS.show);
        };
        var hideRole = function() {
            html['role'].removeClass(CSS.show);
        };
        html['roleBtn'][0].addEventListener('mousedown', showRole, false);
        html['roleBtn'][0].addEventListener('touchstart', showRole, false);
        html['roleBtn'][0].addEventListener('mouseup', hideRole, false);
        html['roleBtn'][0].addEventListener('touchend', hideRole, false);
        html['roleBtn'][0].addEventListener('mouseout', hideRole, false);
    };

    var _init = function() {}();
};

module.exports = StatusPanel;
