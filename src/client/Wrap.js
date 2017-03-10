/* TODO:
    Fetch all modules and put them into a global object.
    Then we can use them in Host.html.
*/

var Style = require('./Wrap.less');
var Font = require('GLOBAL/font/optimusprinceps/style.css');
var Font2 = require('GLOBAL/font/d_day_stencil/style.css');

window.GAME = {
  Render:{
    Prepare : require('./content/Render/Prepare/Render.Prepare.js'),
    Main : require('./content/Render/Main/Render.Main.js'),
    End : require('./content/Render/End/Render.End.js')
  }
};
