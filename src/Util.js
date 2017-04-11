"use strict";

let Util = {};
let fakeDom = null;
Util.CreateDom = function (htmlStr, container) {
    if (fakeDom==null) fakeDom = document.createElement('DIV');
    fakeDom.innerHTML = htmlStr;
    let dom = fakeDom.childNodes[0];
    fakeDom.innerHTML = '';
    if (container!=null) container.appendChild(dom);
    return dom;
};

module.exports = Util;