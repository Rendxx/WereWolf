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
    this._shown = false;
};
Basic.prototype = Object.create(null);
Basic.prototype.constructor = Basic;

/**
 * Setup action panel.
 * @param container container of the action panel
 */
Basic.prototype.setup = function (container){
    this.container = container;
};

/**
 * Reset action panel .
 * @param opts action data will not changed in this round
 */
Basic.prototype.reset = function (opts){
};

/**
 * Update action panel.
 * @param opts data may be changed while action
 */
Basic.prototype.update = function (opts){
};

/**
 * Resize.
 * @param w width
 * @param h height
 */
Basic.prototype.resize = function (w, h){
    this.width = w;
    this.height = h;
};

/**
 * Show the action panel.
 */
Basic.prototype.show = function (){
    this._shown = true;
};

/**
 * Hide the action panel.
 */
Basic.prototype.hide = function (){
    this._shown = false;
};

module.exports = Basic;
