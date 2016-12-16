var ROLEDATA = require('GLOBAL/js/RoleData.js');
var InfoBox = require('CLIENT/js/InfoBox.js');
var ScrollOption = require('CLIENT/js/ScrollOption.js');

require('CLIENT/less/Main.StatusPanel.less');

var HTML = {
    bg: '<div class="_bg"></div>',
    name: '<div class="_name"></div>',
    number: '<div class="_number"></div>',
    role: '<div class="_role"></div>',
    roleBtn: '<div class="_roleBtn"></div>',
    listBtn: '<div class="_listBtn"></div>',
};

var CSS = {
    dead: '_dead'
};

var StatusPanel = function(container) {
    "use strick";
    // Property -------------------------------------
    var that = this;
    var html = {
        container : $(container)
    };

    // Callback ------------------------------
    this.onToggle = null;

    // Public --------------------------------
    this.show = function() {
        html['container'].fadeIn();
    };

    this.hide = function() {
        html['container'].fadeOut();
    };

    this.reset = function(number, name, role) {
        setupHtml(number, name, role);
    };

    // Private ---------------------------------------
    var setupHtml = function(number, name, role) {
        html['container'].empty();
        html['number'] = $(HTML.number).appendTo(html['container']).text(number);
        html['name'] = $(HTML.name).appendTo(html['container']).text(name);
        html['bg'] = $(HTML.bg).appendTo(html['container']);
        html['role'] = $(HTML.role).appendTo(html['container']).text(ROLEDATA[role].name);
        html['roleBtn'] = $(HTML.roleBtn).appendTo(html['container']);
        html['listBtn'] = $(HTML.listBtn).appendTo(html['container']);
        html['listBtn'].click(function(){
            that.onToggle && that.onToggle();
        });
        var showRole = function (){
          html['role'].show();
        };
        var hideRole = function (){
          html['role'].hide();
        };
        html['roleBtn'][0].addEventListener('mousedown', showRole, false);
        html['roleBtn'][0].addEventListener('touchstart', showRole, false);
        html['roleBtn'][0].addEventListener('mouseup', hideRole, false);
        html['roleBtn'][0].addEventListener('touchend', hideRole, false);
        html['roleBtn'][0].addEventListener('mouseout', hideRole, false);
    };

    var _init = function() {
    }();
};

module.exports = StatusPanel;
