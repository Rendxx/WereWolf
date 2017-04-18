"use strict";

let Util = {};
let fakeDom = null;
Util.CreateDom = function (htmlStr, container, content) {
    if (fakeDom==null) fakeDom = document.createElement('DIV');
    fakeDom.innerHTML = htmlStr;
    let dom = fakeDom.childNodes[0];
    fakeDom.innerHTML = '';
    if (container!=null) container.appendChild(dom);
    if (content!=null) dom.innerHTML = content;
    return dom;
};

Util.EmptyDom = function (dom) {
    while (dom.lastChild) {
        dom.removeChild(dom.lastChild);
    }
};

Util.BindClick = function (node, onClick) {
    let startPos = null,
        touchId = -1,
        mouseDownTime = null,
        clickCancelFunc = null;

    let getMousePos = function (e) {
        if (e.changedTouches != undefined) {
            return [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
        } else if (e.pageX == undefined) {
            return [e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY];
        } else {
            return [e.pageX, e.pageY];
        }
    };
    let onMouseDown = function (pos){
        if (clickCancelFunc!==null) {
            clearTimeout(clickCancelFunc);
            clickCancelFunc = null;
        }
        startPos = pos;
        mouseDownTime = new Date();
        clickCancelFunc = setTimeout(function(){
            startPos = null;
            clickCancelFunc = null;
        },300)
    };
    let onMouseUp = function (pos){
        if (clickCancelFunc!==null) {
            clearTimeout(clickCancelFunc);
            clickCancelFunc = null;
        }
        if (startPos === null || mouseDownTime === null) return;
        if ((new Date() - mouseDownTime > 200) || Math.pow(pos[0]-startPos[0],2)+Math.pow(pos[1]-startPos[1],2)>400) return;
        startPos = null;
        onClick && onClick();
    };

    node.addEventListener('mousedown', function(e){
        touchId = -1;
        onMouseDown(getMousePos(e));
    }, false);
    node.addEventListener('mouseup', function(e){
        touchId = -1;
        onMouseUp(getMousePos(e));
    }, false);
    node.addEventListener('touchstart', function(e){
        if (e.touches.length>1) return;
        touchId = e.touches[0].identifier;
        onMouseDown(getMousePos(e));
    }, false);
    node.addEventListener('touchend', function(e){
        if (e.changedTouches[0].identifier !== touchId) return;
        touchId = -1;
        onMouseUp(getMousePos(e));
    }, false);
};
module.exports = Util;