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

module.exports = Util;