"use strick";

var HTML = {
};

var CSS = {
};

var Basic = function (playerIdx){
    this.container = null;
    this.html = {};
    this.width = 0;
    this.height = 0;
    this.playerIdx=playerIdx;
    this._shown = false;
};
Basic.prototype = Object.create(null);
Basic.prototype.constructor = Basic;

Basic.prototype.setup = function (container){
    this.container = container;
};

Basic.prototype.update = function (){
};

Basic.prototype.resize = function (w, h){
    this.width = w;
    this.height = h;
};

Basic.prototype.show = function (){
    this._shown = true;
};

Basic.prototype.hide = function (){
    this._shown = false;
};

module.exports = Basic;
