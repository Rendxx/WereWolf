"use strick";

var HTML = {
};

var CSS = {
};

var Basic = function (){
    this.container = null;
    this.html = {};
    this.width = 0;
    this.height = 0;
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
};

Basic.prototype.hide = function (){
};

module.exports = Basic;
