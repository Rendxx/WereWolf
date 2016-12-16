var ROLEDATA = require('GLOBAL/js/RoleData.js');
var InfoBox = require('CLIENT/js/InfoBox.js');
var ScrollOption = require('CLIENT/js/ScrollOption.js');

require('CLIENT/less/Main.SettingPanel.less');

var HTML = {
    title: '<div class="_title"><span>Input your data</span></div>',
    inner: '<div class="_inner"></div>',
    ok: '<div class="_ok"></div>',
    tag: '<div class="_tag"></div>',
    space: '<div class="_space"></div>',
    name: '<div class="_nameInput"><input type="text" placeholder="name"></div>',
    number: {
        wrap: '<div class="_numberWrap"></div>',
        item: '<div class="_numberItem">#content#</div>'
    },
    role: {
        wrap: '<div class="_roleWrap"></div>',
        item: '<div class="_roleItem">#content#</div>'
    }
};

var CSS = {};

var SettingPanel = function(container) {
    "use strick";
    // Property -------------------------------------
    var that = this;
    var html = {
        container : $(container)
    };
    var numberSelector = null,
        roleSelector = null;

    // Callback ------------------------------
    this.onConfirm = null;

    // Public --------------------------------
    this.show = function() {
        html['container'].fadeIn();
    };

    this.hide = function() {
        html['container'].fadeOut();
    };

    this.reset = function(playerData, roleList) {
        setupPanel();
        setupTitle();
        setupInner(playerData, roleList);
    };

    // Private ---------------------------------------
    var setupPanel = function() {
        html['container'].empty();
        html['title'] = $(HTML.title).appendTo(html['container']);
        html['inner'] = $(HTML.inner).appendTo(html['container']);
    };

    var setupTitle = function() {
        html['ok'] = $(HTML.ok).appendTo(html['title']);
        html['ok'].click(function() {
            var name = html['name'].children('input').val(),
                number = numberSelector.getSelect(),
                role = roleSelector.getSelect();

            if (name == null || name == '') {
                InfoBox.alert({
                    content: 'Please input a user name.',
                });
                return;
            }

            InfoBox.check({
                content: '<span style="color:#666;">Please confirm the information is correct:</span><br/><br/>' + '<b>[No. ' + number + '] ' + name + '</b><br/><span style="font-size:20px;line-height:36px;">( ' + ROLEDATA[role].name + ' )</span>',
                callbackYes: function() {
                    that.onConfirm && that.onConfirm({
                        name: name,
                        number: number,
                        role: role
                    });
                }
            });
        });
    };

    var setupInner = function(playerData, roleList) {
        html['sapce'] = $(HTML.space).appendTo(html['inner']);

        // name
        html['nameTag'] = $(HTML.tag).appendTo(html['inner']).text("[ input your name ]");
        html['name'] = $(HTML.name).appendTo(html['inner']);

        // number options
        html['numberTag'] = $(HTML.tag).appendTo(html['inner']).text("[ select your number ]");
        html['number'] = $(HTML.number.wrap).appendTo(html['inner']);
        var numberOptions = [];
        for (var i = 1; i <= playerData.length; i++) {
            numberOptions.push({
                key: i,
                content: HTML.number.item.replace(/#content#/g, i)
            });
        }
        numberSelector = new ScrollOption(html['number'][0], numberOptions);

        // role options
        html['roleTag'] = $(HTML.tag).appendTo(html['inner']).text("[ select your role ]");
        html['role'] = $(HTML.role.wrap).appendTo(html['inner']);
        var roleOptions = [];
        for (var i = 0; i < roleList.length; i++) {
            roleOptions.push({
                key: roleList[i],
                content: HTML.role.item.replace(/#content#/g, ROLEDATA[roleList[i]].name)
            });
        }
        roleSelector = new ScrollOption(html['role'][0], roleOptions);
    };

    var _init = function() {}();
};

module.exports = SettingPanel;
