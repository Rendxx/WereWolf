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

Basic.prototype.reset = function (w, h){
};

Basic.prototype.resize = function (w, h){
    this.width = w || this.width;
    this.height = h || this.height;
};

Basic.prototype.show = function (){
};

Basic.prototype.hide = function (){
};

module.exports = Basic;
