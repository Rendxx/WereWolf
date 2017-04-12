var Util = require('SRC/Util.js');
require('./PanelManager.less');

var HTML = {
    title: '<div class="_panel_title"></div>',
    body: '<div class="_panel_body"></div>',
    inner: '<div class="_panel_inner"></div>',
    item: '<div class="_panel_item"></div>',
    tag: '<div class="_panel_tag"></div>'
};

var CSS = {
    highlight: '_panel_highlight',
    holding: '_holding'
};

var STYLE = {
    titleHeight: 60
};

var StatusPanel = function(container) {
    "use strick";
    // Property -------------------------------------
    let html = {
        title: null,
        body: null,
        inner: null,
        tag: [],
        item: []
    };
    let that = this,
        height = 0,
        width = 0,
        number = 0,
        currentIdx = 0,
        instances = [];

    // Public --------------------------------
    this.setup = function(panelList) {
        reset();
        number = panelList.length;
        for (let i=0;i<number;i++){
            let tag = Util.CreateDom(HTML.tag, html['title'], panelList[i].name);
            html['tag'][i] = tag;

            let item =  Util.CreateDom(HTML.item, html['inner']);
            html['item'][i] = item;
            panelList[i].panel.setup(item);
            instances[i] = panelList[i].panel;
        }
        this.resize();
        goto(0);
    };

    this.resize = function (w, h){
        if (w) width = w;
        if (h) height = h;
        html['title'].style.width = width+'px';
        html['title'].style.height = STYLE.titleHeight+'px';
        html['body'].style.width = width+'px';
        html['body'].style.height = height-STYLE.titleHeight+'px';
        for (let i=0;i<number;i++){
            html['item'][i].style.left = i*width+'px';
            instances[i].resize(width, height);
        }
    };

    this.getPanel = function (idx){
        if (idx<0||idx>=number) return null;
        return html['item'][idx];
    };

    // Private ---------------------------------------
    var setupHtml = function() {
        html['title'] = Util.CreateDom(HTML.title, container);
        html['body'] = Util.CreateDom(HTML.body, container);
        html['inner'] = Util.CreateDom(HTML.inner, html['body']);
    };

    var reset = function() {
        html['title'].innerHTML = '';
        html['inner'].innerHTML = '';
        html['tag'] = [];
        html['item'] = [];
        instances = [];
        number = 0;
    };

    var setupFunc = function (){
        let last = 0,
            left = 0,
            touchId = -1,
            lock = 1,
            startTime = 0;
        let startPan = function (x){
            last = x;
            lock = x;
            left = parseInt(html['inner'].style.left);
            startTime = new Date();
            html['inner'].classList.add(CSS.holding);
        };
        let pan = function (x){
            if (lock>=0){
                if (Math.abs(x-lock)>60 && new Date()-startTime<1000)lock=-1;
                else return;
            }
            let offset = x-last;
            last = x;
            left = Math.min(0, Math.max(-(number-1)*width,left + offset));
            html['inner'].style.left = left + 'px';
            highlight(~~(-left/width+0.5));
        };
        let stopPan = function (x){
            pan(x);
            goto(~~(-left/width+0.5));
            html['inner'].classList.remove(CSS.holding);
        };

        html['inner'].addEventListener('mousedown', function(e){startPan(e.clientX);}, false);
        html['inner'].addEventListener('mousemove', function(e){pan(e.clientX);}, false);
        html['inner'].addEventListener('mouseup', function(e){stopPan(e.clientX);}, false);
        html['inner'].addEventListener('mouseout', function(e){stopPan(e.clientX);}, false);

        html['inner'].addEventListener('touchstart', function(e){
            if (e.touches.length>1) return;
            touchId = e.touches[0].identifier;
            startPan(e.touches[0].clientX);
        }, false);
        html['inner'].addEventListener('touchmove', function(e){
            if (e.changedTouches[0].identifier !== touchId) return;
            pan(e.changedTouches[0].clientX);
        }, false);
        html['inner'].addEventListener('touchend', function(e){
            if (e.changedTouches[0].identifier !== touchId) return;
            stopPan(e.changedTouches[0].clientX);
        }, false);
    };

    var highlight = function (idx){
        if (currentIdx<number) html['tag'][currentIdx].classList.remove(CSS.highlight);
        currentIdx = idx;
        html['tag'][currentIdx].classList.add(CSS.highlight);
    };

    var goto = function (idx){
        highlight(idx);
        html['inner'].style.left = -currentIdx*width+'px';
    };

    var _init = function() {
        setupHtml();
        reset();
        setupFunc();
    };
    _init();
};

module.exports = StatusPanel;
