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
    highlight: '_panel_highlight'
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
        currentIdx = 0;

    // Public --------------------------------
    this.setup = function(panelList) {
        reset();
        number = panelList.length;
        for (let i=0;i<number;i++){
            let tag = Util.CreateDom(HTML.tag, html['title']);
            tag.innerHTML = panelList[i];
            html['tag'][i] = tag;

            let item =  Util.CreateDom(HTML.item, html['inner']);
            html['item'][i] = item;
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
        number = 0;
    };

    var setupFunc = function (){
        let last = 0,
            left = 0,
            touchId = -1;
        let startPan = function (x){
            last = x;
            left = parseInt(html['inner'].style.left);
        };
        let pan = function (x){
            let offset = x-last;
            last = x;
            left = Math.min((number-1)*width, Math.max(0,left + offset));
            html['inner'].style.left = left + 'px';
        };
        let stopPan = function (x){
            pan(x);
            goto(~~(left/width+0.5));
        };

        html['inner'].addEventListener('mousedown', function(e){startPan(e.clientX);}, false);
        html['inner'].addEventListener('mousemove', function(e){pan(e.clientX);}, false);
        html['inner'].addEventListener('mouseup', function(e){stopPan(e.clientX);}, false);
        html['inner'].addEventListener('mouseout', function(e){stopPan(e.clientX);}, false);

        html['inner'].addEventListener('touchstart', function(e){
            if (e.touches.length>0) return;
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

    var goto = function (idx){
        if (currentIdx<number) html['tag'][currentIdx].classList.remove(CSS.highlight);
        currentIdx = idx;
        html['inner'].style.left = currentIdx*width+'px';
        html['tag'][currentIdx].classList.add(CSS.highlight);
    };

    var _init = function() {
        setupHtml();
        reset();
        setupFunc();
    };
    _init();
};

module.exports = StatusPanel;
