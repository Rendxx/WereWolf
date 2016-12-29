/* TODO:
    Fetch all modules and put them into a global object.
    Then we can use them in Host.html.
*/

var Style = require('./less/Index.less');
var Font = require('GLOBAL/font/optimusprinceps/style.css');
var Font2 = require('GLOBAL/font/d_day_stencil/style.css');

window.GAME = {
  Render:{
    Prepare : require('CLIENT/js/Render.Prepare.js'),
    Main : require('CLIENT/js/Main/Render.Main.js'),
    End : require('CLIENT/js/Render.End.js')
  }
};
